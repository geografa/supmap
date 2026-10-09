import { Drawer } from "vaul";
import { useMapStore } from "../../store/useMapStore";
import { FilterChips } from "../FilterChips";
import { SpotDetail } from "./SpotDetail";
import { SpotList } from "./SpotList";
import styles from "./BottomDrawer.module.css";

const SNAP_POINTS = [0.12, 0.5, 0.92] as const;

function snapToIndex(snap: string): number {
  if (snap === "full") return 2;
  if (snap === "half") return 1;
  return 0;
}

function indexToSnap(i: number): "peek" | "half" | "full" {
  if (i >= 2) return "full";
  if (i === 1) return "half";
  return "peek";
}

export function BottomDrawer() {
  const selectedSpot = useMapStore((s) => s.selectedSpot);
  const panelSnap = useMapStore((s) => s.panelSnap);
  const setPanelSnap = useMapStore((s) => s.setPanelSnap);
  const selectSpot = useMapStore((s) => s.selectSpot);
  const filteredSpots = useMapStore((s) => s.filteredSpots);
  const spot = selectedSpot();
  const count = filteredSpots().length;

  const activeSnap = SNAP_POINTS[snapToIndex(panelSnap)];

  return (
    <Drawer.Root
      open
      modal={false}
      dismissible={false}
      snapPoints={[...SNAP_POINTS]}
      activeSnapPoint={activeSnap}
      setActiveSnapPoint={(snap) => {
        if (typeof snap !== "number") return;
        const idx = SNAP_POINTS.findIndex((p) => Math.abs(p - snap) < 0.02);
        setPanelSnap(indexToSnap(idx < 0 ? 0 : idx));
      }}
    >
      <Drawer.Portal>
        <Drawer.Content className={styles.content} aria-label="Spot details">
          <div className={styles.handle} />
          <div className={styles.peekBar}>
            {spot ? (
              <>
                <span className={styles.peekTitle}>{spot.title}</span>
                <button
                  type="button"
                  className={styles.clear}
                  onClick={() => selectSpot(null)}
                  aria-label="Clear selection"
                >
                  ×
                </button>
              </>
            ) : (
              <span className={styles.peekTitle}>{count} spots</span>
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
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
