# SUPMAP

Pacific Northwest stand-up paddleboarding spots — React + Mapbox rebuild.

## Develop

```bash
cp .env.example .env   # fill Mapbox token (and optional sheet URL)
npm install
npm run migrate:csv    # GeoJSON → sheet-ready CSV
npm run snapshot:spots # CSV → public/spots.json fallback
npm run dev
```

## Data

Spots load from a published Google Sheet CSV (`VITE_SHEET_CSV_URL`). If that fetch fails or is unset, the app uses `public/spots.json`.

Admin edits the sheet; no redeploy needed for content (sheet cache ~5 minutes). Nightly / deploy CI refreshes the JSON snapshot.

Schema and Wix embed notes: see [tmp/PRD SUP Map.md](tmp/PRD%20SUP%20Map.md) and [docs/wix-embed.md](docs/wix-embed.md).

## Build

```bash
npm run build
npm run preview
```

Deploy via GitHub Pages (`.github/workflows/deploy.yml`). Configure secrets: `VITE_MAPBOX_TOKEN`, optional `VITE_SHEET_CSV_URL`, `VITE_OPENWEATHER_KEY`; optional vars `VITE_MAPBOX_STYLE`, `VITE_SHARE_BASE_URL`.
