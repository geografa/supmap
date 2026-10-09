import { useEffect } from "react";
import { useMapStore } from "../store/useMapStore";

const SPOT_RE = /^#\/spot\/([^/?#]+)/;

export function parseSpotHash(hash = window.location.hash): string | null {
  const m = hash.match(SPOT_RE);
  return m ? decodeURIComponent(m[1]) : null;
}

export function setSpotHash(id: string | null) {
  const next = id ? `#/spot/${encodeURIComponent(id)}` : "#/";
  if (window.location.hash === next) return;
  if (id) {
    history.pushState({ spot: id }, "", next);
  } else {
    history.pushState({ spot: null }, "", next);
  }
}

/** Two-way sync between selectedId and URL hash. */
export function useHashRoute() {
  const selectSpot = useMapStore((s) => s.selectSpot);
  const selectedId = useMapStore((s) => s.selectedId);
  const spots = useMapStore((s) => s.spots);
  const showToast = useMapStore((s) => s.showToast);
  const loading = useMapStore((s) => s.loading);

  // Apply hash once spots are loaded
  useEffect(() => {
    if (loading || spots.length === 0) return;
    const id = parseSpotHash();
    if (!id) return;
    const exists = spots.some((s) => s.id === id);
    if (!exists) {
      showToast("That spot isn't on the map anymore");
      setSpotHash(null);
      return;
    }
    if (useMapStore.getState().selectedId !== id) {
      selectSpot(id, { snap: "half" });
    }
  }, [loading, spots, selectSpot, showToast]);

  // Push hash when selection changes (skip during initial apply)
  useEffect(() => {
    if (loading) return;
    const current = parseSpotHash();
    if (selectedId === current) return;
    if (selectedId === null && (current === null || window.location.hash === "" || window.location.hash === "#/")) {
      return;
    }
    setSpotHash(selectedId);
  }, [selectedId, loading]);

  // Back/forward
  useEffect(() => {
    const onPop = () => {
      const id = parseSpotHash();
      const { spots: list, selectSpot: sel, showToast: toast } =
        useMapStore.getState();
      if (!id) {
        sel(null);
        return;
      }
      if (!list.some((s) => s.id === id)) {
        toast("That spot isn't on the map anymore");
        sel(null);
        return;
      }
      sel(id, { snap: "half" });
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("hashchange", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("hashchange", onPop);
    };
  }, []);
}
