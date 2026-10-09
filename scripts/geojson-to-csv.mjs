// Usage: node scripts/geojson-to-csv.mjs [input.geojson] [output.csv]
import fs from "node:fs";
import path from "node:path";

const [, , inputArg, outputArg] = process.argv;
const input =
  inputArg ?? path.join("assets", "geojson", "supspots.geojson");
const output = outputArg ?? path.join("assets", "csv", "supspots.csv");

const fc = JSON.parse(fs.readFileSync(input, "utf8"));

const COLUMNS = [
  "id",
  "title",
  "tagline",
  "description",
  "photo_url",
  "youtube_url",
  "water_type",
  "difficulty",
  "parking",
  "weather",
  "rating",
  "nearby",
  "lat",
  "lng",
  "published",
];

const ALIASES = {
  title: ["title", "name", "Name", "Title"],
  tagline: ["tagline", "byline", "subtitle"],
  description: ["description", "desc", "body", "Description"],
  photo_url: ["photo_url", "photo", "image", "img", "Photo"],
  water_type: ["water_type", "waterType", "type"],
  difficulty: ["difficulty", "level"],
  parking: ["parking"],
  weather: ["weather"],
  rating: ["rating", "stars"],
  youtube_url: ["youtube_url", "youtube", "video", "video_url"],
  id: ["id", "ID"],
};

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const htmlToMd = (s) =>
  String(s)
    .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, "[$2]($1)")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(ul|ol|li|strong|b|em|i|p|div|span)[^>]*>/gi, (tag) => {
      const t = tag.toLowerCase();
      if (t.startsWith("<strong") || t.startsWith("<b")) return "**";
      if (t.startsWith("</strong") || t.startsWith("</b")) return "**";
      if (t.startsWith("<em") || t.startsWith("<i")) return "_";
      if (t.startsWith("</em") || t.startsWith("</i")) return "_";
      if (t.startsWith("<li")) return "- ";
      if (t.startsWith("</li") || t.startsWith("</p")) return "\n";
      return "";
    })
    .replace(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi, "\n\n![photo]($1)\n\n")
    .replace(/<video[\s\S]*?<\/video>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, (iframe) => {
      const m = iframe.match(/src=["']([^"']+)["']/i);
      return m ? `\n\n${m[1]}\n\n` : "";
    })
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const extractYoutube = (html) => {
  const m = String(html).match(
    /(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([\w-]{11})/,
  );
  return m ? `https://www.youtube.com/watch?v=${m[1]}` : "";
};

const pick = (p, keys) => {
  for (const k of keys) if (p[k] != null && p[k] !== "") return p[k];
  return "";
};

const haversineKm = (a, b) => {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

const inferWaterType = (title, description) => {
  const t = `${title} ${description}`.toLowerCase();
  if (/\briver\b|\bfalls\b|\bnarrows\b|\bdeschutes\b|\bmckenzie\b/.test(t))
    return "river";
  if (/\bbay\b|\bsea\b|\bcoast\b|\bocean\b/.test(t)) return "coastal";
  if (/\blake\b|\bisland\b/.test(t)) return "lake";
  return "lake";
};

const inferDifficulty = (title, description) => {
  const t = `${title} ${description}`.toLowerCase();
  if (
    /beginner|kids|kiddo|easy|approachable|beginner-friendly|chill/.test(t)
  )
    return "beginner";
  if (/tricky|advanced|rocks|current|adventurous|experienced/.test(t))
    return "intermediate";
  return "beginner";
};

const used = new Set();
const mappedKeys = new Set([
  ...Object.values(ALIASES).flat(),
  "id",
  "ID",
]);
const unmapped = new Set();

const rows = fc.features
  .filter((f) => f.geometry?.type === "Point")
  .map((f, i) => {
    const p = f.properties ?? {};
    Object.keys(p).forEach((k) => {
      if (!mappedKeys.has(k)) unmapped.add(k);
    });
    const [lng, lat] = f.geometry.coordinates;
    const title = pick(p, ALIASES.title) || `Spot ${i + 1}`;
    const existingId = pick(p, ALIASES.id);
    let id = existingId
      ? String(existingId).replace(/^id-/, "")
      : slugify(title);
    id = slugify(id);
    let n = 2;
    const base = id;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);

    const descriptionRaw = pick(p, ALIASES.description);
    const youtube =
      pick(p, ALIASES.youtube_url) || extractYoutube(descriptionRaw);
    const water =
      String(pick(p, ALIASES.water_type)).toLowerCase() ||
      inferWaterType(title, descriptionRaw);
    const diff =
      String(pick(p, ALIASES.difficulty)).toLowerCase() ||
      inferDifficulty(title, descriptionRaw);

    let photo = pick(p, ALIASES.photo_url);
    if (photo.startsWith("./assets/img/spots/")) {
      photo = photo.replace("./assets/img/spots/", "./images/spots/");
    }

    return {
      id,
      title,
      tagline: pick(p, ALIASES.tagline),
      description: htmlToMd(descriptionRaw),
      photo_url: photo,
      youtube_url: youtube,
      water_type: ["coastal", "river", "lake"].includes(water)
        ? water
        : "lake",
      difficulty: ["beginner", "intermediate", "advanced"].includes(diff)
        ? diff
        : "beginner",
      parking: pick(p, ALIASES.parking),
      weather: pick(p, ALIASES.weather),
      rating: pick(p, ALIASES.rating),
      nearby: "",
      lat: Number(lat).toFixed(6),
      lng: Number(lng).toFixed(6),
      published: "TRUE",
    };
  });

for (const r of rows) {
  const here = { lat: +r.lat, lng: +r.lng };
  r.nearby = rows
    .filter((o) => o !== r)
    .map((o) => ({
      id: o.id,
      d: haversineKm(here, { lat: +o.lat, lng: +o.lng }),
    }))
    .filter((o) => o.d <= 50)
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .map((o) => o.id)
    .join(",");
}

const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const csv = [
  COLUMNS.join(","),
  ...rows.map((r) => COLUMNS.map((c) => esc(r[c])).join(",")),
].join("\n");

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, csv);

console.log(`Wrote ${rows.length} spots to ${output}`);
if (unmapped.size)
  console.log("Unmapped properties (review):", [...unmapped].join(", "));
