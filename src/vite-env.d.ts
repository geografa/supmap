/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_TOKEN: string;
  readonly VITE_MAPBOX_STYLE: string;
  readonly VITE_SHEET_CSV_URL: string;
  readonly VITE_SHARE_BASE_URL: string;
  readonly VITE_OPENWEATHER_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
