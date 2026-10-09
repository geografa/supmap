import { useMapStore } from "../store/useMapStore";
import styles from "./Toast.module.css";

export function Toast() {
  const toast = useMapStore((s) => s.toast);
  if (!toast) return null;
  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {toast.message}
    </div>
  );
}
