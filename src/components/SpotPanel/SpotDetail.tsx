import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import type { Spot } from "../../data/schema";
import { Badges } from "./Badges";
import { NearbyChips } from "./NearbyChips";
import { Rating } from "./Rating";
import { ShareButton } from "./ShareButton";
import { YouTubeFacade } from "./YouTubeFacade";
import styles from "./SpotDetail.module.css";

export function SpotDetail({ spot }: { spot: Spot }) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;

  return (
    <article className={styles.detail}>
      {spot.photoUrl && (
        <div className={styles.photoWrap}>
          <img
            className={styles.photo}
            src={spot.photoUrl}
            alt=""
            loading="lazy"
            onError={(e) => {
              (e.currentTarget.parentElement as HTMLElement).style.display =
                "none";
            }}
          />
        </div>
      )}

      <h2 className={styles.title}>{spot.title}</h2>
      {spot.tagline && <p className={styles.tagline}>{spot.tagline}</p>}
      {spot.rating != null && <Rating value={spot.rating} />}
      <Badges waterType={spot.waterType} difficulty={spot.difficulty} />

      {spot.description && (
        <div className={styles.body}>
          <ReactMarkdown
            rehypePlugins={[rehypeSanitize]}
            components={{
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <img src={src} alt={alt ?? ""} loading="lazy" />
              ),
            }}
          >
            {spot.description}
          </ReactMarkdown>
        </div>
      )}

      {spot.youtube && (
        <YouTubeFacade
          videoId={spot.youtube.videoId}
          start={spot.youtube.start}
          title={spot.title}
        />
      )}

      {spot.parking && (
        <section className={styles.meta}>
          <h3>Parking</h3>
          <p>{spot.parking}</p>
        </section>
      )}

      {spot.weather && (
        <section className={styles.meta}>
          <h3>Weather</h3>
          <p>{spot.weather}</p>
        </section>
      )}

      <a
        className={styles.directions}
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Directions
      </a>

      <NearbyChips ids={spot.nearby} />
      <ShareButton spotId={spot.id} title={spot.title} />
    </article>
  );
}
