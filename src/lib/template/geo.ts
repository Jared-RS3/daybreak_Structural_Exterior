/* Small geometry helpers for the service-area map and "nearest project"
   lookups. No map library: the map is a plotted drawing, not a tile viewer,
   so an equirectangular projection around the region's centre is accurate
   enough and costs nothing to ship. */

export type Pt = { lat: number; lng: number };

const MILES_PER_DEG_LAT = 69.05;

export function milesBetween(a: Pt, b: Pt) {
  const R = 3958.8;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Fits a set of points into a viewBox of the given width, preserving true
 * proportions, with `pad` units of margin. Returns the projector plus the
 * viewBox height it needs and a miles→units scale for drawing range rings.
 */
export function fitProjection(points: Pt[], width: number, pad: number) {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const k = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);

  const spanX = (maxLng - minLng) * k;
  const spanY = maxLat - minLat;
  const scale = (width - pad * 2) / spanX;
  const height = spanY * scale + pad * 2;

  return {
    height,
    project: (p: Pt) => ({
      x: pad + (p.lng - minLng) * k * scale,
      y: pad + (maxLat - p.lat) * scale,
    }),
    unitsPerMile: scale / MILES_PER_DEG_LAT,
  };
}
