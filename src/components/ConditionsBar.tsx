import { useEffect, useState } from "react";
import { useMapStore } from "../store/useMapStore";
import styles from "./ConditionsBar.module.css";

type Conditions = {
  waterC: number | null;
  waterF: number | null;
  windMph: number | null;
  airC: number | null;
  airF: number | null;
};

export function ConditionsBar() {
  const dismissed = useMapStore((s) => s.bannerDismissed);
  const dismiss = useMapStore((s) => s.dismissBanner);
  const [data, setData] = useState<Conditions | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [usgsRes, owRes] = await Promise.all([
          fetch(
            "https://waterservices.usgs.gov/nwis/iv/?site=14211720&format=json",
          ),
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=Portland,US&APPID=${import.meta.env.VITE_OPENWEATHER_KEY}`,
          ),
        ]);
        let waterC: number | null = null;
        let waterF: number | null = null;
        if (usgsRes.ok) {
          const json = await usgsRes.json();
          const v =
            json?.value?.timeSeries?.[0]?.values?.[0]?.value?.[0]?.value;
          if (v != null) {
            waterC = Math.round(Number(v));
            waterF = Math.round((Number(v) * 9) / 5 + 32);
          }
        }
        let windMph: number | null = null;
        let airC: number | null = null;
        let airF: number | null = null;
        if (owRes.ok) {
          const w = await owRes.json();
          if (w?.wind?.speed != null) {
            windMph = Math.round(w.wind.speed * 2.237);
          }
          if (w?.main?.temp != null) {
            airC = Math.round(w.main.temp - 273.15);
            airF = Math.round((w.main.temp * 9) / 5 - 459.67);
          }
        }
        if (!cancelled) {
          setData({ waterC, waterF, windMph, airC, airF });
        }
      } catch {
        // banner stays empty / partial
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (dismissed) return null;

  return (
    <div className={styles.banner} role="region" aria-label="Portland conditions">
      <div className={styles.content}>
        {data?.waterF != null && (
          <span>
            Willamette {data.waterF}°F / {data.waterC}°C
          </span>
        )}
        {data?.windMph != null && <span>Wind {data.windMph} mph</span>}
        {data?.airF != null && (
          <span>
            Air {data.airF}°F / {data.airC}°C
          </span>
        )}
        <a
          href="https://player.streamguys.com/allclassical/tilicam/sgplayer/player.php"
          target="_blank"
          rel="noopener noreferrer"
        >
          Live
        </a>
      </div>
      <button
        type="button"
        className={styles.close}
        aria-label="Dismiss conditions bar"
        onClick={dismiss}
      >
        ×
      </button>
    </div>
  );
}
