import { useEffect, useState } from "react";
import styles from "./YouTubeFacade.module.css";

type Props = {
  videoId: string;
  start?: number;
  title: string;
  onPlay?: () => void;
};

export function YouTubeFacade({ videoId, start, title, onPlay }: Props) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setPlaying(false);
  }, [videoId]);

  if (playing) {
    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      playsinline: "1",
    });
    if (start) params.set("start", String(start));
    return (
      <div className={styles.wrap}>
        <iframe
          className={styles.iframe}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?${params}`}
          title={`Video: ${title}`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={styles.wrap}
      onClick={() => {
        setPlaying(true);
        onPlay?.();
      }}
      aria-label={`Play video: ${title}`}
    >
      <img
        className={styles.thumb}
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
      />
      <span className={styles.play} aria-hidden>
        ▶
      </span>
    </button>
  );
}
