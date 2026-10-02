import { NextResponse } from "next/server";
import places from "@/data/places.json";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";

/**
 * Town and city suggestions for the form's "Main town or city" field.
 *
 * The list covers the world, biggest places first: every US city, town and
 * census-designated place (US Census Bureau 2023 Gazetteer), shown as
 * "Fort Worth, TX", plus every place elsewhere with 5,000+ people (GeoNames,
 * CC BY 4.0), shown as "Toronto, ON, Canada". scripts/build-places.mjs
 * builds it. It lives on the server and is searched here, so no API key, no
 * third party seeing what visitors type, and nothing large shipped to the
 * browser.
 *
 * GET /api/places?q=fort wo  →  { places: ["Fort Worth, TX", "Fort Wayne, IN", …] }
 * GET /api/places?q=london, uk  →  { places: ["London, England, United Kingdom", …] }
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

/** Other names people type for a country, so "leeds, uk" still narrows. */
const aliases: Record<string, string[]> = {
  "united states": ["us", "usa", "america"],
  "united kingdom": ["uk", "gb", "great britain", "britain"],
  "united arab emirates": ["uae"],
  "south africa": ["sa", "rsa"],
  "new zealand": ["nz"],
  australia: ["au", "aus"],
  canada: ["ca"],
};

/**
 * Folded once at start-up: [folded city, folded region / country names,
 * display]. US entries are "City, ST" with the country left implied.
 */
const index = (places as string[]).map((p) => {
  const [city, ...rest] = p.split(", ");
  const quals = rest.map(fold);
  if (quals.length === 1 && /^[a-z]{2}$/.test(quals[0])) quals.push("united states");
  for (const q of [...quals]) quals.push(...(aliases[q] ?? []));
  return [fold(city), quals, p] as const;
});

export function GET(request: Request) {
  if (!rateLimit(`places:${clientIp(request)}`, 120, 60_000)) {
    return NextResponse.json({ places: [] }, { status: 429 });
  }

  const q = fold((new URL(request.url).searchParams.get("q") ?? "").slice(0, 60));
  if (q.length < 2) return NextResponse.json({ places: [] });

  // "springfield, il" or "london, uk" narrows by state, region or country;
  // "springfield" alone doesn't.
  const [cityPart, ...qualParts] = q.split(",").map((s) => s.trim());
  const narrow = qualParts.filter(Boolean).slice(0, 3);
  if (!cityPart || cityPart.length < 2) return NextResponse.json({ places: [] });

  // The list is in population order, so the first matches are the likeliest.
  // Names that start with what was typed come before a later word matching.
  const starts: string[] = [];
  const words: string[] = [];
  for (const [city, quals, display] of index) {
    if (!narrow.every((n) => quals.some((q) => q.startsWith(n)))) continue;
    if (city.startsWith(cityPart) || city.startsWith(`the ${cityPart}`)) starts.push(display);
    else if (words.length < LIMIT && city.includes(` ${cityPart}`)) words.push(display);
    if (starts.length >= LIMIT) break;
  }

  return NextResponse.json(
    { places: [...starts, ...words].slice(0, LIMIT) },
    { headers: { "cache-control": "public, max-age=86400, s-maxage=604800" } },
  );
}
