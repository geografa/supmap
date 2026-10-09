import {
  useMapStore,
  type Difficulty,
  type WaterType,
} from "../store/useMapStore";
import styles from "./FilterChips.module.css";

const WATER: { id: WaterType; label: string }[] = [
  { id: "lake", label: "Lake" },
  { id: "river", label: "River" },
  { id: "coastal", label: "Coastal" },
];

const DIFF: { id: Difficulty; label: string }[] = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const RATINGS = [3, 4, 4.5];

export function FilterChips() {
  const filters = useMapStore((s) => s.filters);
  const setFilters = useMapStore((s) => s.setFilters);
  const clearFilters = useMapStore((s) => s.clearFilters);
  const filteredSpots = useMapStore((s) => s.filteredSpots);

  const active =
    filters.waterTypes.length > 0 ||
    filters.difficulties.length > 0 ||
    filters.minRating != null;

  const toggleWater = (id: WaterType) => {
    const has = filters.waterTypes.includes(id);
    setFilters({
      waterTypes: has
        ? filters.waterTypes.filter((w) => w !== id)
        : [...filters.waterTypes, id],
    });
  };

  const toggleDiff = (id: Difficulty) => {
    const has = filters.difficulties.includes(id);
    setFilters({
      difficulties: has
        ? filters.difficulties.filter((d) => d !== id)
        : [...filters.difficulties, id],
    });
  };

  const count = filteredSpots().length;

  return (
    <div className={styles.wrap}>
      <div className={styles.row} role="group" aria-label="Water type">
        {WATER.map((w) => (
          <button
            key={w.id}
            type="button"
            className={`${styles.chip} ${filters.waterTypes.includes(w.id) ? styles.active : ""}`}
            aria-pressed={filters.waterTypes.includes(w.id)}
            onClick={() => toggleWater(w.id)}
          >
            {w.label}
          </button>
        ))}
      </div>
      <div className={styles.row} role="group" aria-label="Difficulty">
        {DIFF.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`${styles.chip} ${filters.difficulties.includes(d.id) ? styles.active : ""}`}
            aria-pressed={filters.difficulties.includes(d.id)}
            onClick={() => toggleDiff(d.id)}
          >
            {d.label}
          </button>
        ))}
      </div>
      <div className={styles.row} role="group" aria-label="Minimum rating">
        {RATINGS.map((r) => (
          <button
            key={r}
            type="button"
            className={`${styles.chip} ${filters.minRating === r ? styles.active : ""}`}
            aria-pressed={filters.minRating === r}
            onClick={() =>
              setFilters({ minRating: filters.minRating === r ? null : r })
            }
          >
            {r}+ ★
          </button>
        ))}
        {active && (
          <button type="button" className={styles.clear} onClick={clearFilters}>
            Clear
          </button>
        )}
      </div>
      <p className={styles.count} aria-live="polite">
        {count} spot{count === 1 ? "" : "s"}
      </p>
    </div>
  );
}
