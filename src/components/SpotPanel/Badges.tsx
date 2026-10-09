import styles from "./Badges.module.css";

export function Badges({
  waterType,
  difficulty,
}: {
  waterType: string | null;
  difficulty: string | null;
}) {
  if (!waterType && !difficulty) return null;
  return (
    <div className={styles.row}>
      {waterType && (
        <span className={`${styles.badge} ${styles.water}`}>{waterType}</span>
      )}
      {difficulty && (
        <span className={`${styles.badge} ${styles.diff}`}>{difficulty}</span>
      )}
    </div>
  );
}
