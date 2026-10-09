import { useMapStore } from "../../store/useMapStore";
import { Rating } from "./Rating";
import { Badges } from "./Badges";
import styles from "./SpotList.module.css";

export function SpotList() {
  const filteredSpots = useMapStore((s) => s.filteredSpots);
  const selectSpot = useMapStore((s) => s.selectSpot);
  const spots = [...filteredSpots()].sort((a, b) => {
    const ra = a.rating ?? -1;
    const rb = b.rating ?? -1;
    if (rb !== ra) return rb - ra;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className={styles.list}>
      <header className={styles.intro}>
        <h2 className={styles.heading}>Pacific NW SUP spots</h2>
        <p className={styles.sub}>
          Tap a pin or pick a spot below. {spots.length} shown.
        </p>
      </header>
      <ul className={styles.items} role="list">
        {spots.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={styles.item}
              onClick={() => selectSpot(s.id, { snap: "half" })}
            >
              {s.photoUrl ? (
                <img
                  className={styles.thumb}
                  src={s.photoUrl}
                  alt=""
                  loading="lazy"
                />
              ) : (
                <div className={styles.thumbPlaceholder} />
              )}
              <div className={styles.meta}>
                <span className={styles.title}>{s.title}</span>
                {s.rating != null && <Rating value={s.rating} />}
                <Badges waterType={s.waterType} difficulty={s.difficulty} />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
