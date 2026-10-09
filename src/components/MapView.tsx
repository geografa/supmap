import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { spotsToGeoJSON } from "../data/schema";
import { canGeolocate, detectEmbed } from "../lib/embed";
import { getFilteredSpots, useMapStore } from "../store/useMapStore";
import { useIsDesktop } from "../hooks/useMediaQuery";
import styles from "./MapView.module.css";

const SOURCE_ID = "sup-spots";
const CLUSTER_LAYER = "spot-clusters";
const CLUSTER_COUNT = "spot-cluster-count";
const UNCLUSTERED = "spot-unclustered";
const SELECTED = "spot-selected";
const OSMW_SOURCE = "osmw-launches";
const OSMW_LAYER = "osmw-launches-dots";
const WDFW_SOURCE = "wdfw-access";
const WDFW_LAYER = "wdfw-access-dots";
const MAP_STYLE = "mapbox://styles/grafa/cmv19mkj0002q01sm846ocirm";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const hasFittedRef = useRef(false);
  const prevSelectedRef = useRef<string | null>(null);
  const isDesktop = useIsDesktop();

  const spots = useMapStore((s) => s.spots);
  const filters = useMapStore((s) => s.filters);
  const selectedId = useMapStore((s) => s.selectedId);
  const panelOpen = useMapStore((s) => s.panelOpen);
  const panelSnap = useMapStore((s) => s.panelSnap);
  const selectSpot = useMapStore((s) => s.selectSpot);
  const setMapReady = useMapStore((s) => s.setMapReady);
  const mapReady = useMapStore((s) => s.mapReady);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const embed = detectEmbed();
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: import.meta.env.VITE_MAPBOX_STYLE || MAP_STYLE,
      center: [-122.33, 45.08],
      zoom: 6.5,
      minZoom: 5,
      maxZoom: 17,
      attributionControl: false,
      cooperativeGestures: embed,
    });

    map.addControl(
      new mapboxgl.AttributionControl({
        customAttribution:
          '<a href="https://www.oregon.gov/OSMB/Pages/index.aspx">OSMB</a> | <a href="https://data-wdfw.opendata.arcgis.com/maps/wdfw::water-access-sites-2/about">WDFW</a>',
      }),
    );

    if (window.matchMedia("(min-width: 768px)").matches) {
      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        "top-right",
      );
    }

    canGeolocate().then((ok) => {
      if (!ok || !mapRef.current) return;
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: false,
        }),
        "top-right",
      );
    });

    map.on("load", () => {
      addLayers(map);
      setMapReady(true);

      // OSMW reference layer
      if (!map.getSource(OSMW_SOURCE)) {
        map.addSource(OSMW_SOURCE, {
          type: "vector",
          url: "mapbox://grafa.osmw-launches",
          maxzoom: 16,
        });
        map.addLayer({
          id: OSMW_LAYER,
          type: "circle",
          source: OSMW_SOURCE,
          "source-layer": "osmw-launches",
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 3, 14, 7],
            "circle-color": "#204E79",
            "circle-opacity": 0.55,
            "circle-stroke-width": 0.5,
            "circle-stroke-color": "#fff",
          },
        });
      }

      if (!map.getSource(WDFW_SOURCE)) {
        // This tileset's .vector.pbf tiles 404; the .mvt endpoint serves the same data.
        map.addSource(WDFW_SOURCE, {
          type: "vector",
          tiles: [
            `https://api.mapbox.com/v4/grafa.vp7o2ag14hn9/{z}/{x}/{y}.mvt?access_token=${mapboxgl.accessToken}`,
          ],
          maxzoom: 12,
        });
        map.addLayer({
          id: WDFW_LAYER,
          type: "circle",
          source: WDFW_SOURCE,
          "source-layer": "ptrkizhhq65hkobp89i8",
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 3, 14, 7],
            "circle-color": "#c47a3a",
            "circle-opacity": 0.7,
            "circle-stroke-width": 0.5,
            "circle-stroke-color": "#fff",
          },
        });
      }

      popupRef.current = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        focusAfterOpen: false,
        maxWidth: "240px",
        offset: 8,
      });

      const showDetailPopup = (
        e: mapboxgl.MapLayerMouseEvent,
        toHtml: (props: FeatureProps, popupClass: string) => string,
      ) => {
        const f = e.features?.[0];
        const popup = popupRef.current;
        if (!f || !popup) return;
        const spaceBelow = map.getContainer().clientHeight - e.point.y;
        popup.options.anchor = spaceBelow < 300 ? "bottom" : "top";
        popup
          .setMaxWidth("280px")
          .setLngLat(e.lngLat)
          .setHTML(toHtml(f.properties, styles.osmwPopup))
          .addTo(map);
      };

      map.on("click", OSMW_LAYER, (e) =>
        showDetailPopup(e, osmwLaunchPopupHtml),
      );
      map.on("click", WDFW_LAYER, (e) =>
        showDetailPopup(e, wdfwAccessPopupHtml),
      );

      for (const layer of [OSMW_LAYER, WDFW_LAYER]) {
        map.on("mouseenter", layer, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layer, () => {
          map.getCanvas().style.cursor = "";
        });
      }

      // Spots, selected spot, then clusters, paint above launches and WDFW access sites.
      if (map.getLayer(UNCLUSTERED)) map.moveLayer(UNCLUSTERED);
      if (map.getLayer(SELECTED)) map.moveLayer(SELECTED);
      if (map.getLayer(CLUSTER_LAYER)) map.moveLayer(CLUSTER_LAYER);
      if (map.getLayer(CLUSTER_COUNT)) map.moveLayer(CLUSTER_COUNT);
    });

    const onFly = (ev: Event) => {
      const detail = (
        ev as CustomEvent<{ center: [number, number]; zoom?: number }>
      ).detail;
      if (!detail?.center) return;
      map.flyTo({
        center: detail.center,
        zoom: detail.zoom ?? 11,
        essential: true,
      });
    };
    window.addEventListener("supmap:fly", onFly);

    mapRef.current = map;
    return () => {
      window.removeEventListener("supmap:fly", onFly);
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addLayers(map: mapboxgl.Map) {
    if (map.getSource(SOURCE_ID)) return;

    // Seed with current spots so clusters render on first paint
    const initial = spotsToGeoJSON(getFilteredSpots());

    map.addSource(SOURCE_ID, {
      type: "geojson",
      data: initial,
      cluster: true,
      clusterMaxZoom: 12,
      clusterRadius: 60,
    });

    map.addLayer({
      id: CLUSTER_LAYER,
      type: "circle",
      source: SOURCE_ID,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "#ec6157",
        "circle-radius": ["step", ["get", "point_count"], 16, 5, 20, 15, 26],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });

    map.addLayer({
      id: CLUSTER_COUNT,
      type: "symbol",
      source: SOURCE_ID,
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-size": 12,
        "text-font": ["DIN Pro Medium", "Arial Unicode MS Bold"],
      },
      paint: { "text-color": "#ffffff" },
    });

    map.addLayer({
      id: UNCLUSTERED,
      type: "circle",
      source: SOURCE_ID,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-radius": 7,
        "circle-color": "#ec6157",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });

    map.addLayer({
      id: SELECTED,
      type: "circle",
      source: SOURCE_ID,
      filter: ["==", ["get", "id"], ""],
      paint: {
        "circle-radius": 12,
        "circle-color": "#ec6157",
        "circle-stroke-width": 3,
        "circle-stroke-color": "#fff",
        "circle-opacity": 0.95,
      },
    });

    map.on("click", CLUSTER_LAYER, (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [CLUSTER_LAYER],
      });
      const clusterId = features[0]?.properties?.cluster_id;
      const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource;
      if (clusterId == null) return;
      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || zoom == null) return;
        const geometry = features[0].geometry;
        if (geometry.type !== "Point") return;
        map.easeTo({
          center: geometry.coordinates as [number, number],
          zoom,
        });
      });
    });

    const clickSpot = (e: mapboxgl.MapMouseEvent) => {
      const f = e.features?.[0];
      const id = f?.properties?.id as string | undefined;
      if (!id) return;
      e.originalEvent.stopPropagation();
      selectSpot(id, { snap: "half" });
    };

    const spotLayers = [UNCLUSTERED, SELECTED];

    for (const layer of spotLayers) {
      map.on("click", layer, clickSpot);
    }

    map.on("click", (e) => {
      const layers = [
        ...spotLayers,
        CLUSTER_LAYER,
        OSMW_LAYER,
        WDFW_LAYER,
      ].filter((id) => map.getLayer(id));
      const hits = map.queryRenderedFeatures(e.point, { layers });
      if (!hits.length) {
        selectSpot(null);
      }
    });

    for (const layer of [UNCLUSTERED, CLUSTER_LAYER]) {
      if (!map.getLayer(layer)) continue;
      map.on("mouseenter", layer, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", layer, () => {
        map.getCanvas().style.cursor = "";
      });
    }
  }

  // Update GeoJSON when spots / filters change
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map || !map.isStyleLoaded()) return;
    const source = map.getSource(SOURCE_ID) as
      | mapboxgl.GeoJSONSource
      | undefined;
    if (!source) return;

    const filtered = getFilteredSpots();
    source.setData(spotsToGeoJSON(filtered));

    // Fit once on first data load so the overview stays clustered
    if (
      !hasFittedRef.current &&
      filtered.length &&
      !useMapStore.getState().selectedId
    ) {
      hasFittedRef.current = true;
      const bounds = new mapboxgl.LngLatBounds();
      filtered.forEach((s) => bounds.extend([s.lng, s.lat]));
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 80, maxZoom: 7.5, duration: 0 });
      }
    }
  }, [spots, filters, mapReady]);

  // Layer filters for rating etc. — data already filtered via setData;
  // keep selected halo in sync
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer(SELECTED)) return;
    map.setFilter(SELECTED, [
      "all",
      ["!", ["has", "point_count"]],
      ["==", ["get", "id"], selectedId ?? ""],
    ]);
  }, [selectedId, spots, filters]);

  // Fly on selection; only adjust padding when the panel changes afterward
  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      prevSelectedRef.current = selectedId;
      return;
    }

    if (!selectedId) {
      prevSelectedRef.current = null;
      return;
    }

    const spot = useMapStore.getState().spotById(selectedId);
    if (!spot) return;

    const padding = cameraPadding(isDesktop, panelOpen, panelSnap);
    const selectionChanged = prevSelectedRef.current !== selectedId;
    prevSelectedRef.current = selectedId;

    if (selectionChanged) {
      map.flyTo({
        center: [spot.lng, spot.lat],
        zoom: Math.max(map.getZoom(), 11),
        padding,
        essential: true,
        duration: 900,
      });
    } else {
      map.easeTo({ padding, duration: 250 });
    }
  }, [selectedId, isDesktop, panelOpen, panelSnap]);

  return (
    <div
      ref={containerRef}
      className={styles.map}
      role="application"
      aria-label="SUP spots map"
    />
  );
}

type FeatureProps = mapboxgl.MapboxGeoJSONFeature["properties"];

function propText(props: FeatureProps, key: string): string {
  const value = props?.[key];
  if (value == null) return "";
  const text = String(value).trim();
  if (!text || text.toLowerCase() === "null" || text.toLowerCase() === "n/a") {
    return "";
  }
  return text;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeHttpUrl(raw: string): string {
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    if (url.protocol === "http:" && url.hostname.endsWith("oregon.gov")) {
      url.protocol = "https:";
    }
    return url.href;
  } catch {
    return "";
  }
}

function sameLabel(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Positive integer count from a field, or 0 when missing or not a number. */
function propCount(props: FeatureProps, key: string): number {
  const n = Number(propText(props, key));
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

type DetailPopup = {
  name: string;
  subtitles?: string[];
  facts?: [label: string, value: string][];
  note?: string;
  photo?: string;
  phone?: string;
  website?: string;
};

function detailPopupHtml(popup: DetailPopup, popupClass: string): string {
  const { name, note, photo, phone, website } = popup;

  const subtitles = (popup.subtitles ?? [])
    .filter((value) => value && !sameLabel(value, name))
    .filter(
      (value, index, all) =>
        all.findIndex((item) => sameLabel(item, value)) === index,
    );

  const factHtml = (popup.facts ?? [])
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<div class="osmw-row"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`,
    )
    .join("");

  const links = [
    phone
      ? `<a href="tel:${escapeHtml(phone.replace(/[^\d+]/g, ""))}">${escapeHtml(phone)}</a>`
      : "",
    website
      ? `<a href="${escapeHtml(website)}" target="_blank" rel="noopener noreferrer">Website</a>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  return `<div class="${popupClass} osmw-detail">
    ${
      photo
        ? `<img class="osmw-photo" src="${escapeHtml(photo)}" alt="" onerror="this.remove()" />`
        : ""
    }
    <div class="osmw-body">
      <div class="osmw-name">${escapeHtml(name)}</div>
      ${subtitles.map((value) => `<div class="osmw-sub">${escapeHtml(value)}</div>`).join("")}
      ${factHtml ? `<div class="osmw-rows">${factHtml}</div>` : ""}
      ${note ? `<p class="osmw-note">${escapeHtml(note)}</p>` : ""}
      ${links ? `<div class="osmw-links">${links}</div>` : ""}
    </div>
  </div>`;
}

function osmwLaunchPopupHtml(props: FeatureProps, popupClass: string): string {
  return detailPopupHtml(
    {
      name: propText(props, "FACILNM") || "Boat launch",
      subtitles: [
        propText(props, "FACILALIAS"),
        propText(props, "WATERBODYNM"),
      ],
      facts: [
        ["Type", propText(props, "FACILTYPE")],
        ["Ramp", propText(props, "RAMPTYPE")],
        ["Use fee", propText(props, "USEFEE")],
        ["Managed by", propText(props, "FACILMGR")],
      ],
      note: propText(props, "FACILCOMM"),
      photo: safeHttpUrl(propText(props, "PHOTOURL")),
      phone: propText(props, "TELEPHONE"),
      website: safeHttpUrl(propText(props, "FACILURL")),
    },
    popupClass,
  );
}

function wdfwAccessPopupHtml(props: FeatureProps, popupClass: string): string {
  const county = propText(props, "County");
  const closure = propText(props, "ClosureType");
  const ramps = propCount(props, "BoatRamps");
  const rampSurface = propText(props, "BoatRampSurfaceTypes");
  const handLaunches = propCount(props, "HandLaunches");
  const parkingLots = propCount(props, "ParkingLots");
  const restrooms = propCount(props, "Restrooms");

  const rampText = ramps
    ? [String(ramps), rampSurface].filter(Boolean).join(" · ")
    : "";

  return detailPopupHtml(
    {
      name: propText(props, "WaterAccessSiteName") || "Water access site",
      subtitles: [county ? `${county} County` : ""],
      facts: [
        ["Managed by", propText(props, "ManagingEntity")],
        ["Open", propText(props, "OpenDates")],
        ["Closure", sameLabel(closure, "No closure") ? "" : closure],
        ["Boat ramps", rampText],
        [
          "Boarding float",
          ramps ? propText(props, "BoatRampHasBoardingFloat") : "",
        ],
        ["Hand launches", handLaunches ? String(handLaunches) : ""],
        ["Parking lots", parkingLots ? String(parkingLots) : ""],
        ["Restrooms", restrooms ? String(restrooms) : ""],
        ["Camping", propText(props, "CampingAllowed")],
      ],
      note: propText(props, "Notes"),
    },
    popupClass,
  );
}

function cameraPadding(
  isDesktop: boolean,
  panelOpen: boolean,
  panelSnap: string,
): mapboxgl.PaddingOptions {
  if (!panelOpen) return { top: 80, bottom: 40, left: 40, right: 40 };
  if (isDesktop) {
    return { top: 80, bottom: 40, left: 420, right: 40 };
  }
  const bottom =
    panelSnap === "full"
      ? Math.round(window.innerHeight * 0.55)
      : panelSnap === "half"
        ? Math.round(window.innerHeight * 0.35)
        : 110;
  return { top: 80, bottom, left: 24, right: 24 };
}
