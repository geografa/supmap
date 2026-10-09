import { useMemo, useRef, useState } from "react";
import { useMapStore } from "../store/useMapStore";
import styles from "./SearchBox.module.css";

type Result =
  | { kind: "spot"; id: string; label: string }
  | { kind: "place"; label: string; center: [number, number] };

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return false;
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  // simple subsequence
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length && q.length >= 2;
}

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [placeResults, setPlaceResults] = useState<Result[]>([]);
  const spots = useMapStore((s) => s.spots);
  const selectSpot = useMapStore((s) => s.selectSpot);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spotResults = useMemo(() => {
    if (!query.trim()) return [];
    return spots
      .filter(
        (s) =>
          fuzzyMatch(query, s.title) ||
          (s.tagline && fuzzyMatch(query, s.tagline)),
      )
      .slice(0, 8)
      .map(
        (s): Result => ({
          kind: "spot",
          id: s.id,
          label: s.title,
        }),
      );
  }, [query, spots]);

  const onChange = (value: string) => {
    setQuery(value);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPlaces(value), 280);
  };

  async function searchPlaces(q: string) {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!q.trim() || !token) {
      setPlaceResults([]);
      return;
    }
    try {
      const url = new URL(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json`,
      );
      url.searchParams.set("access_token", token);
      url.searchParams.set("country", "us");
      url.searchParams.set("bbox", "-125.7655,41.35902,-115.71895,49.64348");
      url.searchParams.set("limit", "5");
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      const results: Result[] = (data.features ?? []).map(
        (f: { place_name: string; center: [number, number] }) => ({
          kind: "place" as const,
          label: f.place_name,
          center: f.center,
        }),
      );
      setPlaceResults(results);
    } catch {
      setPlaceResults([]);
    }
  }

  const results = [...spotResults, ...placeResults.filter((p) => p.kind === "place")];

  const onSelect = (r: Result) => {
    setOpen(false);
    setQuery(r.kind === "spot" ? r.label : r.label.split(",")[0]);
    if (r.kind === "spot") {
      selectSpot(r.id, { snap: "half" });
      return;
    }
    // Dispatch a custom event MapView listens for — or fly via store
    window.dispatchEvent(
      new CustomEvent("supmap:fly", { detail: { center: r.center, zoom: 11 } }),
    );
  };

  return (
    <div className={styles.wrap}>
      <label className={styles.srOnly} htmlFor="spot-search">
        Search spots or places
      </label>
      <input
        id="spot-search"
        className={styles.input}
        type="search"
        placeholder="Search spots or places…"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        autoComplete="off"
      />
      {open && results.length > 0 && (
        <ul className={styles.list} role="listbox">
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.kind === "spot" ? r.id : r.label}-${i}`}>
              <button
                type="button"
                className={styles.item}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelect(r)}
              >
                <span className={styles.kind}>
                  {r.kind === "spot" ? "🌲" : "📍"}
                </span>
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
