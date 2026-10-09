// Snapshot Google Sheet CSV (or local CSV) to public/spots.json
import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";

function bool(v) {
  return ["TRUE", "1", "YES"].includes(String(v).trim().toUpperCase());
}

function normalizePhoto(url) {
  if (!url) return "";
  if (url.startsWith("./assets/img/spots/"))
    return url.replace("./assets/img/spots/", "./images/spots/");
  if (url.startsWith("assets/img/spots/"))
    return url.replace("assets/img/spots/", "./images/spots/");
  return url;
}

function parseYoutube(url) {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    const host = u.hostname.replace(/^(www\.|m\.)/, "");
    let id = null;
    if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      id =
        u.searchParams.get("v") ??
        u.pathname.match(/^\/(?:shorts|live|embed)\/([^/?]+)/)?.[1] ??
        null;
    }
    if (!id || !/^[\w-]{11}$/.test(id)) return null;
    const t = u.searchParams.get("t") ?? u.searchParams.get("start");
    let start;
    if (t) {
      if (/^\d+$/.test(t)) start = Number(t);
      else {
        const m = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
        if (m)
          start = +(m[1] ?? 0) * 3600 + +(m[2] ?? 0) * 60 + +(m[3] ?? 0);
      }
    }
    return { videoId: id, start: start || undefined };
  } catch {
    return null;
  }
}

function rowToSpot(row) {
  const lat = Number(row.lat);
  const lng = Number(row.lng);
  if (!row.id || !row.title || !Number.isFinite(lat) || !Number.isFinite(lng))
    return null;

  if (
    row.published !== undefined &&
    String(row.published).trim() !== "" &&
    !bool(row.published)
  ) {
    return null;
  }

  const ratingRaw = row.rating;
  const rating =
    ratingRaw === "" || ratingRaw == null ? null : Number(ratingRaw);

  const water = String(row.water_type || "").toLowerCase();
  const diff = String(row.difficulty || "").toLowerCase();

  let youtube = null;
  if (row.youtube_url?.trim()) {
    youtube = parseYoutube(row.youtube_url.trim());
  }

  return {
    id: String(row.id).trim(),
    title: String(row.title).trim(),
    tagline: String(row.tagline || "").trim(),
    description: String(row.description || "").trim(),
    photoUrl: normalizePhoto(String(row.photo_url || "").trim()),
    youtube,
    waterType: ["coastal", "river", "lake"].includes(water) ? water : null,
    difficulty: ["beginner", "intermediate", "advanced"].includes(diff)
      ? diff
      : null,
    parking: String(row.parking || "").trim(),
    weather: String(row.weather || "").trim(),
    rating: Number.isFinite(rating) ? rating : null,
    nearby: String(row.nearby || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    lat,
    lng,
    featured: bool(row.featured),
  };
}

const sheetUrl = process.env.VITE_SHEET_CSV_URL?.trim();
const localCsv = path.join("assets", "csv", "supspots.csv");
const outPath = path.join("public", "spots.json");

async function main() {
  let text;
  if (sheetUrl) {
    const res = await fetch(sheetUrl);
    if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.status}`);
    text = await res.text();
    console.log("Fetched sheet CSV");
  } else if (fs.existsSync(localCsv)) {
    text = fs.readFileSync(localCsv, "utf8");
    console.log(`Using local ${localCsv}`);
  } else {
    throw new Error("No VITE_SHEET_CSV_URL and no local CSV");
  }

  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors.length) {
    console.warn("CSV warnings:", parsed.errors.slice(0, 5));
  }

  const spots = parsed.data.map(rowToSpot).filter(Boolean);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(spots, null, 2));
  console.log(`Wrote ${spots.length} spots to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
