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
 * GET /api/places?q=dallas texas  →  { places: ["Dallas, TX"] }  (no comma needed)
 * GET /api/places?q=texas  →  { places: ["Texas City, TX", "Houston, TX", …] }
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

/** The list shows US states by code ("TX"); people type the name ("Texas"). */
const usStates: Record<string, string> = {
  al: "Alabama", ak: "Alaska", az: "Arizona", ar: "Arkansas", ca: "California",
  co: "Colorado", ct: "Connecticut", de: "Delaware", dc: "District of Columbia",
  fl: "Florida", ga: "Georgia", hi: "Hawaii", id: "Idaho", il: "Illinois",
  in: "Indiana", ia: "Iowa", ks: "Kansas", ky: "Kentucky", la: "Louisiana",
  me: "Maine", md: "Maryland", ma: "Massachusetts", mi: "Michigan", mn: "Minnesota",
  ms: "Mississippi", mo: "Missouri", mt: "Montana", ne: "Nebraska", nv: "Nevada",
  nh: "New Hampshire", nj: "New Jersey", nm: "New Mexico", ny: "New York",
  nc: "North Carolina", nd: "North Dakota", oh: "Ohio", ok: "Oklahoma", or: "Oregon",
  pa: "Pennsylvania", pr: "Puerto Rico", ri: "Rhode Island", sc: "South Carolina",
  sd: "South Dakota", tn: "Tennessee", tx: "Texas", ut: "Utah", vt: "Vermont",
  va: "Virginia", wa: "Washington", wv: "West Virginia", wi: "Wisconsin", wy: "Wyoming",
};

/** Same for the provinces and states scripts/build-places.mjs shortens. */
const regionNames: Record<string, Record<string, string>> = {
  canada: {
    ab: "Alberta", bc: "British Columbia", mb: "Manitoba", nb: "New Brunswick",
    nl: "Newfoundland and Labrador", nt: "Northwest Territories", ns: "Nova Scotia",
    nu: "Nunavut", on: "Ontario", pe: "Prince Edward Island", qc: "Quebec",
    sk: "Saskatchewan", yt: "Yukon",
  },
  australia: {
    act: "Australian Capital Territory", nsw: "New South Wales", nt: "Northern Territory",
    qld: "Queensland", sa: "South Australia", tas: "Tasmania", vic: "Victoria",
    wa: "Western Australia",
  },
};

/**
 * Folded once at start-up: [folded city, folded region / country names,
 * display]. US entries are "City, ST" with the country left implied; every
 * code also gets its full name, so "texas" narrows like "tx" does.
 */
const index = (places as string[]).map((p) => {
  const [city, ...rest] = p.split(", ");
  const quals = rest.map(fold);
  if (quals.length === 1 && /^[a-z]{2}$/.test(quals[0])) {
    const state = usStates[quals[0]];
    if (state) quals.push(fold(state));
    quals.push("united states");
  } else if (quals.length === 2) {
    const region = regionNames[quals[1]]?.[quals[0]];
    if (region) quals.push(fold(region));
  }
  for (const q of [...quals]) quals.push(...(aliases[q] ?? []));
  return [fold(city), quals, p] as const;
});

/** Every state, region, country and alias, to spot one at the end of "dallas texas". */
const qualifiers = new Set(index.flatMap(([, quals]) => quals));

const stateNames = Object.values(usStates).map(fold);

/**
 * Places whose name starts with `cityPart` (then ones where a later word
 * does), within every qualifier in `narrow`. The list is in population
 * order, so the first matches are the likeliest.
 */
function search(cityPart: string, narrow: string[]) {
  const starts: string[] = [];
  const words: string[] = [];
  for (const [city, quals, display] of index) {
    if (!narrow.every((n) => quals.some((q) => q.startsWith(n)))) continue;
    if (city.startsWith(cityPart) || city.startsWith(`the ${cityPart}`)) starts.push(display);
    else if (words.length < LIMIT && city.includes(` ${cityPart}`)) words.push(display);
    if (starts.length >= LIMIT) break;
  }
  return [...starts, ...words].slice(0, LIMIT);
}

/** The biggest places in one US state, for a query that is the state itself. */
function inState(state: string, skip: string[]) {
  const out: string[] = [];
  for (const [, quals, display] of index) {
    if (out.length + skip.length >= LIMIT) break;
    if (quals.includes(state) && !skip.includes(display)) out.push(display);
  }
  return out;
}

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

  let found: string[] = [];
  if (narrow.length) {
    found = search(cityPart, narrow);
  } else {
    // No comma: "dallas tx" or "austin texas" still narrows, when the last
    // word or two is a state, region or country. If that finds nothing, the
    // whole thing is tried as a name ("kansas city", "new york").
    const w = cityPart.split(" ");
    for (let k = Math.min(3, w.length - 1); k >= 1 && !found.length; k--) {
      const tail = w.slice(-k).join(" ");
      if (qualifiers.has(tail)) found = search(w.slice(0, -k).join(" "), [tail]);
    }
    if (!found.length) found = search(cityPart, []);

    // A US state on its own ("texas", or "tex" on the way there) fills the
    // rest of the list with that state's biggest places.
    const states = cityPart.length >= 3 ? stateNames.filter((s) => s.startsWith(cityPart)) : [];
    if (states.length === 1 && found.length < LIMIT) found = [...found, ...inState(states[0], found)];
  }

  return NextResponse.json(
    { places: found.slice(0, LIMIT) },
    { headers: { "cache-control": "public, max-age=86400, s-maxage=604800" } },
  );
}
