import { z } from "zod";
import { parseYouTube } from "./parseYouTube";

const boolFromSheet = z.preprocess((v) => {
  if (typeof v === "boolean") return v;
  const s = String(v ?? "")
    .trim()
    .toUpperCase();
  if (["TRUE", "1", "YES"].includes(s)) return true;
  if (["FALSE", "0", "NO", ""].includes(s)) return false;
  return false;
}, z.boolean());

const waterType = z.preprocess(
  (v) => String(v ?? "").trim().toLowerCase() || undefined,
  z.enum(["coastal", "river", "lake"]).optional(),
);

const difficulty = z.preprocess(
  (v) => String(v ?? "").trim().toLowerCase() || undefined,
  z.enum(["beginner", "intermediate", "advanced"]).optional(),
);

const ratingSchema = z.preprocess((v) => {
  if (v === null || v === undefined || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}, z.number().min(0).max(5).optional());

const nearbySchema = z.preprocess((v) => {
  if (!v || String(v).trim() === "") return [];
  return String(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}, z.array(z.string()));

export const rawSpotRowSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().optional().default(""),
  description: z.string().optional().default(""),
  photo_url: z.string().optional().default(""),
  youtube_url: z.string().optional().default(""),
  water_type: waterType,
  difficulty: difficulty,
  parking: z.string().optional().default(""),
  weather: z.string().optional().default(""),
  rating: ratingSchema,
  nearby: nearbySchema,
  lat: z.coerce.number().finite(),
  lng: z.coerce.number().finite(),
  published: boolFromSheet,
});

export type Spot = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  photoUrl: string;
  youtube: { videoId: string; start?: number } | null;
  waterType: "coastal" | "river" | "lake" | null;
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  parking: string;
  weather: string;
  rating: number | null;
  nearby: string[];
  lat: number;
  lng: number;
};

export function rowToSpot(
  row: z.infer<typeof rawSpotRowSchema>,
  rowIndex: number,
): Spot | null {
  let youtube: Spot["youtube"] = null;
  if (row.youtube_url?.trim()) {
    youtube = parseYouTube(row.youtube_url.trim());
    if (!youtube) {
      console.warn(
        `[spots] row ${rowIndex}: invalid youtube_url, dropping video only`,
        row.youtube_url,
      );
    }
  }

  return {
    id: row.id.trim(),
    title: row.title.trim(),
    tagline: row.tagline?.trim() ?? "",
    description: row.description?.trim() ?? "",
    photoUrl: normalizePhotoUrl(row.photo_url?.trim() ?? ""),
    youtube,
    waterType: row.water_type ?? null,
    difficulty: row.difficulty ?? null,
    parking: row.parking?.trim() ?? "",
    weather: row.weather?.trim() ?? "",
    rating: row.rating ?? null,
    nearby: row.nearby,
    lat: row.lat,
    lng: row.lng,
  };
}

function normalizePhotoUrl(url: string): string {
  if (!url) return "";
  // Legacy relative paths from GeoJSON
  if (url.startsWith("./assets/img/spots/")) {
    return url.replace("./assets/img/spots/", "./images/spots/");
  }
  if (url.startsWith("assets/img/spots/")) {
    return url.replace("assets/img/spots/", "./images/spots/");
  }
  return url;
}

export type SpotFeatureProperties = {
  id: string;
  title: string;
  tagline: string;
  water_type: string | null;
  difficulty: string | null;
  rating: number | null;
};

export function spotsToGeoJSON(
  spots: Spot[],
): GeoJSON.FeatureCollection<GeoJSON.Point, SpotFeatureProperties> {
  return {
    type: "FeatureCollection",
    features: spots.map((s) => ({
      type: "Feature",
      properties: {
        id: s.id,
        title: s.title,
        tagline: s.tagline,
        water_type: s.waterType,
        difficulty: s.difficulty,
        rating: s.rating,
      },
      geometry: {
        type: "Point",
        coordinates: [s.lng, s.lat],
      },
    })),
  };
}
