import Papa from "papaparse";
import { rawSpotRowSchema, rowToSpot, type Spot } from "./schema";

const FETCH_TIMEOUT_MS = 5000;

async function fetchWithTimeout(
  url: string,
  ms = FETCH_TIMEOUT_MS,
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

function parseCsvText(text: string): Spot[] {
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors.length) {
    console.warn("[spots] CSV parse warnings:", parsed.errors.slice(0, 5));
  }

  const spots: Spot[] = [];
  parsed.data.forEach((row, i) => {
    const rowNum = i + 2; // header is row 1
    const result = rawSpotRowSchema.safeParse(row);
    if (!result.success) {
      console.warn(
        `[spots] row ${rowNum}: skipped —`,
        result.error.issues.map((e) => e.message).join("; "),
        row,
      );
      return;
    }
    if (!result.data.published) return;
    // Require water_type and difficulty for published spots when present in schema;
    // allow null during migration so existing data still loads.
    const spot = rowToSpot(result.data, rowNum);
    if (spot) spots.push(spot);
  });
  return spots;
}

async function loadSnapshot(): Promise<Spot[]> {
  const res = await fetch("./spots.json");
  if (!res.ok) throw new Error(`spots.json ${res.status}`);
  const data = (await res.json()) as Spot[] | { spots: Spot[] };
  return Array.isArray(data) ? data : data.spots;
}

export async function fetchSpots(): Promise<Spot[]> {
  const sheetUrl = import.meta.env.VITE_SHEET_CSV_URL?.trim();

  if (sheetUrl) {
    try {
      const res = await fetchWithTimeout(sheetUrl);
      if (!res.ok) throw new Error(`sheet ${res.status}`);
      const text = await res.text();
      const spots = parseCsvText(text);
      if (spots.length === 0) {
        console.warn("[spots] sheet returned 0 spots, trying snapshot");
        return loadSnapshot();
      }
      return spots;
    } catch (err) {
      console.warn("[spots] sheet fetch failed, using snapshot:", err);
      return loadSnapshot();
    }
  }

  return loadSnapshot();
}
