import { NextResponse } from "next/server";
import places from "@/data/us-places.json";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";

/**
 * Town and city suggestions for the form's "Main town or city" field.
 *
 * The list is every US city, town and census-designated place (US Census
 * Bureau: 2023 Gazetteer, ranked by the 2023 population estimates; places
 * without an estimate are ranked by land area). It lives on the server and
 * is searched here, so no API key, no third party seeing what visitors type,
 * and nothing large shipped to the browser.
 *
 * GET /api/places?q=fort wo  →  { places: ["Fort Worth, TX", "Fort Wayne, IN", …] }
 */
const LIMIT = 6;

const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9, ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Folded once at start-up: [folded city, folded state, display]. */
const index = (places as string[]).map((p) => {
  const comma = p.lastIndexOf(", ");
  return [fold(p.slice(0, comma)), p.slice(comma + 2).toLowerCase(), p] as const;
});

export function GET(request: Request) {
  if (!rateLimit(`places:${clientIp(request)}`, 120, 60_000)) {
    return NextResponse.json({ places: [] }, { status: 429 });
  }

  const q = fold(new URL(request.url).searchParams.get("q") ?? "").slice(0, 60);
  if (q.length < 2) return NextResponse.json({ places: [] });

  // "springfield, il" narrows by state; "springfield" alone doesn't.
  const [cityPart, statePart = ""] = q.split(",").map((s) => s.trim());
  if (!cityPart) return NextResponse.json({ places: [] });

  // The list is in population order, so the first matches are the likeliest.
  // Names that start with what was typed come before a later word matching.
  const starts: string[] = [];
  const words: string[] = [];
  for (const [city, state, display] of index) {
    if (statePart && !state.startsWith(statePart)) continue;
    if (city.startsWith(cityPart) || city.startsWith(`the ${cityPart}`)) starts.push(display);
    else if (words.length < LIMIT && city.includes(` ${cityPart}`)) words.push(display);
    if (starts.length >= LIMIT) break;
  }

  return NextResponse.json(
    { places: [...starts, ...words].slice(0, LIMIT) },
    { headers: { "cache-control": "public, max-age=86400, s-maxage=604800" } },
  );
}
