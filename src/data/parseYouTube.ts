export function parseYouTube(
  url: string,
): { videoId: string; start?: number } | null {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    const host = u.hostname.replace(/^(www\.|m\.)/, "");
    let id: string | null = null;

    if (host === "youtu.be") {
      id = u.pathname.slice(1).split("/")[0] ?? null;
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      id =
        u.searchParams.get("v") ??
        u.pathname.match(/^\/(?:shorts|live|embed)\/([^/?]+)/)?.[1] ??
        null;
    }
    if (!id || !/^[\w-]{11}$/.test(id)) return null;

    const t = u.searchParams.get("t") ?? u.searchParams.get("start");
    let start: number | undefined;
    if (t) {
      if (/^\d+$/.test(t)) {
        start = Number(t);
      } else {
        const m = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
        if (m) {
          start =
            +(m[1] ?? 0) * 3600 + +(m[2] ?? 0) * 60 + +(m[3] ?? 0);
        }
      }
    }
    return { videoId: id, start: start || undefined };
  } catch {
    return null;
  }
}
