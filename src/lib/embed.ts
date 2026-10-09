export function detectEmbed(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get("embed") === "1") return true;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function shareUrlForSpot(id: string, isEmbed: boolean): string {
  const base = import.meta.env.VITE_SHARE_BASE_URL?.trim();
  if (isEmbed && base) {
    const u = new URL(base);
    u.searchParams.set("spot", id);
    return u.toString();
  }
  const origin = window.location.origin + window.location.pathname;
  return `${origin}#/spot/${encodeURIComponent(id)}`;
}

export async function canGeolocate(): Promise<boolean> {
  if (!navigator.geolocation) return false;
  try {
    if (navigator.permissions?.query) {
      const status = await navigator.permissions.query({ name: "geolocation" });
      if (status.state === "denied") return false;
    }
  } catch {
    // permissions API may be unavailable in iframes
  }
  return true;
}
