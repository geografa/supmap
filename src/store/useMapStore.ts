import { create } from "zustand";
import type { Spot } from "../data/schema";

export type WaterType = "coastal" | "river" | "lake";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type PanelSnap = "peek" | "half" | "full" | "closed";

export type Filters = {
  waterTypes: WaterType[];
  difficulties: Difficulty[];
  minRating: number | null;
};

type Toast = { id: number; message: string } | null;

type MapStore = {
  spots: Spot[];
  loading: boolean;
  error: string | null;
  filters: Filters;
  selectedId: string | null;
  panelSnap: PanelSnap;
  panelOpen: boolean;
  toast: Toast;
  bannerDismissed: boolean;
  isEmbed: boolean;
  mapReady: boolean;
  setSpots: (spots: Spot[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<Filters>) => void;
  clearFilters: () => void;
  selectSpot: (id: string | null, opts?: { snap?: PanelSnap }) => void;
  setPanelSnap: (snap: PanelSnap) => void;
  setPanelOpen: (open: boolean) => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  dismissBanner: () => void;
  setEmbed: (embed: boolean) => void;
  setMapReady: (ready: boolean) => void;
  filteredSpots: () => Spot[];
  selectedSpot: () => Spot | null;
  spotById: (id: string) => Spot | undefined;
};

const defaultFilters: Filters = {
  waterTypes: [],
  difficulties: [],
  minRating: null,
};

function applyFilters(spots: Spot[], filters: Filters): Spot[] {
  return spots.filter((s) => {
    if (
      filters.waterTypes.length &&
      (!s.waterType || !filters.waterTypes.includes(s.waterType))
    ) {
      return false;
    }
    if (
      filters.difficulties.length &&
      (!s.difficulty || !filters.difficulties.includes(s.difficulty))
    ) {
      return false;
    }
    if (filters.minRating != null) {
      if (s.rating == null || s.rating < filters.minRating) return false;
    }
    return true;
  });
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useMapStore = create<MapStore>((set, get) => ({
  spots: [],
  loading: true,
  error: null,
  filters: { ...defaultFilters },
  selectedId: null,
  panelSnap: "peek",
  panelOpen: true,
  toast: null,
  bannerDismissed: false,
  isEmbed: false,
  mapReady: false,

  setSpots: (spots) => set({ spots, loading: false }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),

  setFilters: (partial) =>
    set((s) => ({ filters: { ...s.filters, ...partial } })),

  clearFilters: () => set({ filters: { ...defaultFilters } }),

  selectSpot: (id, opts) => {
    if (id == null) {
      set({
        selectedId: null,
        panelSnap: opts?.snap ?? "peek",
      });
      return;
    }
    set({
      selectedId: id,
      panelOpen: true,
      panelSnap: opts?.snap ?? "half",
    });
  },

  setPanelSnap: (panelSnap) => set({ panelSnap }),
  setPanelOpen: (panelOpen) => set({ panelOpen }),

  showToast: (message) => {
    if (toastTimer) clearTimeout(toastTimer);
    const id = Date.now();
    set({ toast: { id, message } });
    toastTimer = setTimeout(() => {
      const cur = get().toast;
      if (cur?.id === id) set({ toast: null });
    }, 3200);
  },

  clearToast: () => set({ toast: null }),
  dismissBanner: () => set({ bannerDismissed: true }),
  setEmbed: (isEmbed) => set({ isEmbed }),
  setMapReady: (mapReady) => set({ mapReady }),

  filteredSpots: () => applyFilters(get().spots, get().filters),
  selectedSpot: () => {
    const { selectedId, spots } = get();
    return spots.find((s) => s.id === selectedId) ?? null;
  },
  spotById: (id) => get().spots.find((s) => s.id === id),
}));

export function getFilteredSpots(): Spot[] {
  const { spots, filters } = useMapStore.getState();
  return applyFilters(spots, filters);
}
