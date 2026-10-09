import { useEffect } from "react";
import { useMapStore } from "../../store/useMapStore";
import { FilterChips } from "../FilterChips";
import { SpotDetail } from "./SpotDetail";
import { SpotList } from "./SpotList";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const panelOpen = useMapStore((s) => s.panelOpen);
  const setPanelOpen = useMapStore((s) => s.setPanelOpen);
  const selectedSpot = useMapStore((s) => s.selectedSpot);
  const selectSpot = useMapStore((s) => s.selectSpot);
  const filteredSpots = useMapStore((s) => s.filteredSpots);
  const spot = selectedSpot();
  const count = filteredSpots().length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (spot) selectSpot(null);
        else setPanelOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [spot, selectSpot, setPanelOpen]);

  return (
    <>
      <aside
        className={`${styles.sidebar} ${panelOpen ? styles.open : styles.closed}`}
        aria-label="Spot details"
      >
        <div className={styles.header}>
          <span className={styles.count}>
            {spot ? spot.title : `${count} spots`}
          </span>
          {spot ? (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => selectSpot(null)}
              aria-label="Back to list"
            >
              ←
            </button>
          ) : (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setPanelOpen(false)}
              aria-label="Collapse panel"
            >
              ×
            </button>
          )}
        </div>
        <div className={styles.scroll}>
          {spot ? <SpotDetail spot={spot} /> : <SpotList />}
        </div>
        {!spot && (
          <div className={styles.filters}>
            <FilterChips />
          </div>
        )}
      </aside>
      <button
        type="button"
        className={`${styles.tab} ${panelOpen ? styles.tabOpen : ""}`}
        onClick={() => setPanelOpen(!panelOpen)}
        aria-label={panelOpen ? "Collapse panel" : "Expand panel"}
      >
        {panelOpen ? "‹" : "›"}
      </button>
    </>
  );
}
