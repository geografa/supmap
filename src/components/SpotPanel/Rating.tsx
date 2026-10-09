import styles from "./Rating.module.css";

export function Rating({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div
      className={styles.rating}
      role="img"
      aria-label={`${value} out of 5`}
    >
      {Array.from({ length: full }, (_, i) => (
        <span key={`f${i}`} className={styles.star}>
          ★
        </span>
      ))}
      {half && <span className={`${styles.star} ${styles.half}`}>★</span>}
      {Array.from({ length: empty }, (_, i) => (
        <span key={`e${i}`} className={`${styles.star} ${styles.empty}`}>
          ★
        </span>
      ))}
      <span className={styles.num}>{value.toFixed(1)}</span>
    </div>
  );
}
