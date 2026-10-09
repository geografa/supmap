import { useMapStore } from "../../store/useMapStore";
import styles from "./NearbyChips.module.css";

export function NearbyChips({ ids }: { ids: string[] }) {
  const spotById = useMapStore((s) => s.spotById);
  const selectSpot = useMapStore((s) => s.selectSpot);

  const nearby = ids
    .map((id) => spotById(id))
    .filter((s): s is NonNullable<typeof s> => !!s);

  if (!nearby.length) return null;

  return (
    <div className={styles.section}>
      <h4 className={styles.label}>Nearby</h4>
      <div className={styles.row}>
        {nearby.map((s) => (
          <button
            key={s.id}
            type="button"
            className={styles.chip}
            onClick={() => selectSpot(s.id, { snap: "half" })}
          >
            {s.title}
          </button>
        ))}
      </div>
    </div>
  );
}
