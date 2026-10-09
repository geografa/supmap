import { lazy, Suspense, useEffect } from "react";
import { ConditionsBar } from "./components/ConditionsBar";
import { SearchBox } from "./components/SearchBox";
import { SpotPanel } from "./components/SpotPanel/SpotPanel";
import { Toast } from "./components/Toast";
import { fetchSpots } from "./data/fetchSpots";
import { useHashRoute } from "./hooks/useHashRoute";
import { detectEmbed } from "./lib/embed";
import { useMapStore } from "./store/useMapStore";
import styles from "./App.module.css";

const MapView = lazy(() =>
  import("./components/MapView").then((m) => ({ default: m.MapView })),
);

export default function App() {
  const setSpots = useMapStore((s) => s.setSpots);
  const setError = useMapStore((s) => s.setError);
  const setEmbed = useMapStore((s) => s.setEmbed);
  const loading = useMapStore((s) => s.loading);
  const error = useMapStore((s) => s.error);
  const panelOpen = useMapStore((s) => s.panelOpen);

  useHashRoute();

  useEffect(() => {
    setEmbed(detectEmbed());
    fetchSpots()
      .then(setSpots)
      .catch((err) => {
        console.error(err);
        setError("Could not load spots");
      });
  }, [setSpots, setError, setEmbed]);

  return (
    <div className={styles.app}>
      <ConditionsBar />
      <div className={styles.stage}>
        <Suspense fallback={<div className={styles.mapFallback}>Loading map…</div>}>
          <MapView />
        </Suspense>
        <div
          className={`${styles.chrome} ${panelOpen ? styles.chromeShifted : ""}`}
        >
          <SearchBox />
        </div>
        {!loading && !error && <SpotPanel />}
        {error && <div className={styles.error}>{error}</div>}
      </div>
      <Toast />
    </div>
  );
}
