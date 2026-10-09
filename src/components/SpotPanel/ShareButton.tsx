import { useState } from "react";
import { shareUrlForSpot } from "../../lib/embed";
import { useMapStore } from "../../store/useMapStore";
import styles from "./ShareButton.module.css";

export function ShareButton({ spotId, title }: { spotId: string; title: string }) {
  const isEmbed = useMapStore((s) => s.isEmbed);
  const showToast = useMapStore((s) => s.showToast);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const onShare = async () => {
    const url = shareUrlForSpot(spotId, isEmbed);
    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} · SUP Map`, url });
        return;
      } catch {
        // user cancelled or failed — fall through
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied");
    } catch {
      setFallbackUrl(url);
    }
  };

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.btn} onClick={onShare}>
        Share
      </button>
      {fallbackUrl && (
        <input
          className={styles.fallback}
          readOnly
          value={fallbackUrl}
          onFocus={(e) => e.target.select()}
          aria-label="Share link"
        />
      )}
    </div>
  );
}
