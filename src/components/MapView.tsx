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
const FEATURED = "spot-featured";
const SELECTED = "spot-selected";
const OSMW_SOURCE = "osmw-launches";
const OSMW_LAYER = "osmw-launches-dots";

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
      style:
        import.meta.env.VITE_MAPBOX_STYLE ||
        "mapbox://styles/grafa/ckdhx8rpo01b61ip8o9e8fth3",
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
          '<a href="https://www.oregon.gov/OSMB/Pages/index.aspx">OSMB</a>',
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
      map.loadImage("./images/sup-icon.png", (err, image) => {
        if (!err && image && !map.hasImage("sup-icon")) {
          map.addImage("sup-icon", image, { sdf: false });
        }
        addLayers(map);
        setMapReady(true);
      });

      // OSMW reference layer
      if (!map.getSource(OSMW_SOURCE)) {
        map.addSource(OSMW_SOURCE, {
          type: "vector",
          url: "mapbox://grafa.osmw-launches",
        });
        map.addLayer({
          id: OSMW_LAYER,
          type: "circle",
          source: OSMW_SOURCE,
          "source-layer": "osmw-launches",
          paint: {
            "circle-radius": 3,
            "circle-color": "#204E79",
            "circle-opacity": 0.55,
            "circle-stroke-width": 0.5,
            "circle-stroke-color": "#fff",
          },
        });
      }

      popupRef.current = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        maxWidth: "240px",
        offset: 8,
      });

      map.on("click", OSMW_LAYER, (e) => {
        const f = e.features?.[0];
        if (!f || !popupRef.current) return;
        const name =
          (f.properties?.FACILNM as string) ||
          (f.properties?.name as string) ||
          "Boat launch";
        popupRef.current
          .setLngLat(e.lngLat)
          .setHTML(`<div class="${styles.osmwPopup}">${name}</div>`)
          .addTo(map);
      });

      map.on("mouseenter", OSMW_LAYER, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", OSMW_LAYER, () => {
        map.getCanvas().style.cursor = "";
      });
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
      filter: [
        "all",
        ["!", ["has", "point_count"]],
        ["!=", ["get", "featured"], true],
      ],
      paint: {
        "circle-radius": 7,
        "circle-color": "#204E79",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });

    // Featured spots: larger teal circle + optional paddler icon
    map.addLayer({
      id: `${FEATURED}-circle`,
      type: "circle",
      source: SOURCE_ID,
      filter: [
        "all",
        ["!", ["has", "point_count"]],
        ["==", ["get", "featured"], true],
      ],
      paint: {
        "circle-radius": 10,
        "circle-color": "#23646a",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });

    if (map.hasImage("sup-icon")) {
      map.addLayer({
        id: FEATURED,
        type: "symbol",
        source: SOURCE_ID,
        filter: [
          "all",
          ["!", ["has", "point_count"]],
          ["==", ["get", "featured"], true],
        ],
        layout: {
          "icon-image": "sup-icon",
          "icon-size": 0.4,
          "icon-allow-overlap": true,
        },
      });
    }

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

    const spotLayers = [
      UNCLUSTERED,
      `${FEATURED}-circle`,
      SELECTED,
      ...(map.getLayer(FEATURED) ? [FEATURED] : []),
    ];

    for (const layer of spotLayers) {
      map.on("click", layer, clickSpot);
    }

    map.on("click", (e) => {
      const layers = [...spotLayers, CLUSTER_LAYER, OSMW_LAYER].filter((id) =>
        map.getLayer(id),
      );
      const hits = map.queryRenderedFeatures(e.point, { layers });
      if (!hits.length) {
        selectSpot(null);
      }
    });

    for (const layer of [
      UNCLUSTERED,
      `${FEATURED}-circle`,
      CLUSTER_LAYER,
      FEATURED,
    ]) {
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
