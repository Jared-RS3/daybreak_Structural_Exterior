// Builds src/data/places.json, the list behind /api/places.
//
// US: every city, town and CDP from src/data/us-places.json (Census
// Gazetteer, already in population order), shown as "Fort Worth, TX".
// Everywhere else: GeoNames places with 5,000+ people, shown as
// "Toronto, ON, Canada" or "Manchester, England, United Kingdom".
// The two are merged into one list, biggest first.
//
// Usage: download cities5000.zip (unzipped), admin1CodesASCII.txt and
// countryInfo.txt from https://download.geonames.org/export/dump/ into one
// folder, then run: node scripts/build-places.mjs <that folder>
// GeoNames data is CC BY 4.0.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) throw new Error("Usage: node scripts/build-places.mjs <geonames folder>");

const lines = (f) =>
  readFileSync(join(dir, f), "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => l.split("\t"));

const fold = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

const countries = new Map(lines("countryInfo.txt").map((r) => [r[0], r[4]]));
const regions = new Map(lines("admin1CodesASCII.txt").map((r) => [r[0], r[1]]));

// Where locals write the short form, use it.
const short = {
  CA: { Alberta: "AB", "British Columbia": "BC", Manitoba: "MB", "New Brunswick": "NB", "Newfoundland and Labrador": "NL", "Northwest Territories": "NT", "Nova Scotia": "NS", Nunavut: "NU", Ontario: "ON", "Prince Edward Island": "PE", Quebec: "QC", Saskatchewan: "SK", Yukon: "YT" },
  AU: { "Australian Capital Territory": "ACT", "New South Wales": "NSW", "Northern Territory": "NT", Queensland: "QLD", "South Australia": "SA", Tasmania: "TAS", Victoria: "VIC", "Western Australia": "WA" },
};

// Neighbourhoods and historical, abandoned or destroyed places.
const skip = new Set(["PPLX", "PPLH", "PPLQ", "PPLW"]);

const usPop = new Map();
const world = [];
for (const r of lines("cities5000.txt")) {
  const [, name, , , , , , code, cc, , admin1] = r;
  const pop = Number(r[14]) || 0;
  if (skip.has(code)) continue;
  // City districts like "Paris 15 Vaugirard" or "Lyon 03".
  if (/^(Paris|Lyon|Marseille) \d/.test(name)) continue;
  if (cc === "US") {
    const key = `${fold(name)}|${admin1}`;
    usPop.set(key, Math.max(usPop.get(key) ?? 0, pop));
    continue;
  }
  const country = countries.get(cc);
  if (!country) continue;
  let region = regions.get(`${cc}.${admin1}`) ?? "";
  region = short[cc]?.[region] ?? region;
  const parts = [name];
  if (region && !fold(region).startsWith(fold(name)) && fold(region) !== fold(country)) parts.push(region);
  parts.push(country);
  world.push({ display: parts.join(", "), pop });
}

// The Census list has no numbers in it, only order, so borrow GeoNames'
// population where the place matches and otherwise carry the last one down.
const us = JSON.parse(readFileSync("src/data/us-places.json", "utf8"));
let floor = Infinity;
const usRanked = us.map((display) => {
  const comma = display.lastIndexOf(", ");
  const pop = usPop.get(`${fold(display.slice(0, comma))}|${display.slice(comma + 2)}`);
  floor = Math.min(floor, pop ?? floor);
  return { display, pop: floor === Infinity ? Number.MAX_SAFE_INTEGER : floor };
});

const seen = new Set();
const out = [...usRanked, ...world]
  .sort((a, b) => b.pop - a.pop)
  .map((p) => p.display)
  .filter((d) => !seen.has(d) && seen.add(d));

writeFileSync("src/data/places.json", JSON.stringify(out));
console.log(`${out.length} places (${us.length} US, ${world.length} elsewhere)`);
