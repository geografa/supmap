# Embedding SUP Map in Wix

## Setup

1. Deploy the standalone app (GitHub Pages).
2. In Wix, add an **Embed HTML** element in **Website address** mode.
3. Point it at your Pages URL, e.g. `https://geografa.github.io/supmap/`.
4. Set the embed to full width and height ≈ `100vh` minus the Wix header (desktop and mobile layouts).

## Deep links through Wix

Iframes cannot read the parent Wix URL. Shared links use a query parameter on the Wix page:

`https://<wix-site>/sup-map?spot=estacada-lake`

Add this Velo snippet on the Wix page (adjust the iframe element id and base URL):

```js
import wixLocation from "wix-location";

$w.onReady(() => {
  const base = "https://geografa.github.io/supmap/";
  const spot = wixLocation.query.spot;
  $w("#supMap").src = spot
    ? `${base}#/spot/${encodeURIComponent(spot)}`
    : base;
});
```

Set `VITE_SHARE_BASE_URL` to the Wix page URL so the Share button emits `?spot=` links when embedded.

## Mapbox token

URL-restrict the public token to:

- The GitHub Pages host
- The Wix site domain
- Wix embed host: `*.filesusr.com`

## Notes

- Geolocation and clipboard may be blocked inside the iframe; the app feature-detects both.
- Pass `?embed=1` on the iframe URL to force cooperative map gestures for page scrolling.
- Nested YouTube iframes need the outer Wix iframe to allow fullscreen for true fullscreen video.
