import type { IconKey } from "@/components/ui/Icon";
import { areas, itemsById, sceneImages, type Area, type Hotspot, type RepairItem } from "@/lib/estimator";

/* ==========================================================================
   HomeSpec concept demo: content

   A pitch page for HomeSpec Waterproofing & Foundation Repair
   (basementfix.com), styled after their site, running the same estimator as
   Daybreak's own /estimator: the same cut-away photographs, the same hotspot
   positions, the same sample price engine (priceEstimate in lib/estimator).

   What changes here is the voice and the menu. Services, wording and product
   names follow basementfix.com (checked 2026-11-07): basement waterproofing,
   crawl space repair, foundation repair, concrete leveling & repair; "Crawl
   Space Support Jacks", "PolyLevel", "Basement Crack Repairs", sump pumps,
   wall anchors and pier systems. Siding and general framing are left out;
   HomeSpec doesn't sell them.

   Prices are Daybreak's sample figures, never HomeSpec's. The page says so.
   /api/tool-lead reads this file too (brand "homespec"), so the emailed PDF
   and the Airtable row use the same wording as the page.
   ========================================================================== */

export const homespec = {
  name: "HomeSpec Waterproofing & Foundation Repair",
  short: "HomeSpec",
  site: "https://www.basementfix.com/",
  logo: { src: "/demo/homespec/logo.png", width: 599, height: 243, alt: "HomeSpec Waterproofing & Foundation Repair" },
  /** The number in their site header. Shown as text only: the demo never dials it. */
  phone: "1-888-363-1212",
  serving: "Metro Detroit",
  areaLine: "Ann Arbor • Westland • Metro Detroit",
  /** Their own promise line, from the homepage hero. */
  promises: ["Free Inspections", "Lifetime Warranties", "Financing Available"],
  /** Their "Why Metro Detroit Homeowners Trust HomeSpec" tiles. */
  trust: [
    { icon: "shield", text: "Serving Michigan Homeowners Since 1994" },
    { icon: "users", text: "Over 40,000 Homes Protected" },
    { icon: "badge", text: "Lifetime Warranties & Flexible Financing Options" },
    { icon: "document", text: "Free, No-Obligation Inspections & Estimates" },
  ] satisfies { icon: IconKey; text: string }[],
  nav: ["Services", "Our Work", "About Us", "Service Area", "Free Estimate"],
} as const;

/* ---- The menu: HomeSpec's four services, in their words ---- */

export type DemoItem = RepairItem & { category: string };
export type DemoCategory = { id: string; name: string; sub: string; icon: IconKey; intro: string; items: DemoItem[] };

/** An item from the shared catalog (its sizes and sample prices), retold in HomeSpec's words. */
const item = (id: string, category: string, words: Partial<RepairItem>): DemoItem => ({
  ...itemsById[id],
  ...words,
  category,
});

export const homespecCategories: DemoCategory[] = [
  {
    id: "waterproofing",
    name: "Basement Waterproofing",
    sub: "Leaks · wet walls · flooding",
    icon: "drop",
    intro: "Check everything you're seeing. Most wet basements have more than one way in.",
    items: [
      item("interior-drain", "waterproofing", {
        symptom: "Water seeping in where the wall meets the floor",
        fix: "Interior perimeter drainage",
        note: "Priced per foot of wall.",
      }),
      item("foam-injection", "waterproofing", {
        symptom: "Water coming through a wall crack",
        fix: "Basement crack repair",
        note: "Priced per crack, sealed from the inside.",
      }),
      item("sump-pump", "waterproofing", {
        symptom: "Standing water, or no sump pump",
        fix: "Sump pump system",
        note: "Complete install, tied into the drainage.",
      }),
      item("battery-backup", "waterproofing", {
        symptom: "The pump stops when the power goes out",
        fix: "Battery back-up sump pump",
        note: "Keeps pumping through a storm outage.",
      }),
      item("wall-liner", "waterproofing", {
        symptom: "Damp walls or white, chalky stains",
        fix: "Basement wall vapor barrier",
        note: "Priced per square foot of wall.",
      }),
    ],
  },
  {
    id: "crawl",
    name: "Crawl Space Repair",
    sub: "Moisture · mold · sagging floors",
    icon: "crawl",
    intro: "Check what's going on under your home.",
    items: [
      item("encapsulation", "crawl", {
        symptom: "Musty smell, or mold on the joists",
        fix: "Crawl space encapsulation",
        note: "Priced per square foot of crawl space.",
      }),
      item("dehumidifier", "crawl", {
        symptom: "Damp air, sweating pipes and ducts",
        fix: "Crawl space dehumidifier",
        note: "Installed and drained.",
      }),
      item("crawl-drain", "crawl", {
        symptom: "Standing water on the crawl space floor",
        fix: "Crawl space drainage & sump",
        note: "Drain line and pump.",
      }),
      item("support-posts", "crawl", {
        symptom: "Sagging or bouncy floors above",
        fix: "Crawl space support jacks",
        note: "Priced per jack, on a solid footing.",
        unit: "jacks",
        question: "How much of the floor is sagging?",
        sizes: [
          { label: "A soft spot", qty: 2 },
          { label: "One room", qty: 4 },
          { label: "Several rooms", qty: 6 },
        ],
        measure: "Jacks usually go every 6 to 8 feet along the beam under the sagging area.",
      }),
    ],
  },
  {
    id: "foundation",
    name: "Foundation Repair",
    sub: "Cracks · bowing walls · settlement",
    icon: "foundation",
    intro: "Settling soil and Michigan's freeze-thaw push foundations around. Check what you've noticed.",
    items: [
      item("push-piers", "foundation", {
        symptom: "Stair-step cracks, doors and windows that stick",
        fix: "Foundation pier system",
        note: "Priced per pier.",
      }),
      item("helical-piers", "foundation", {
        symptom: "A sinking or settling corner",
        fix: "Helical piers",
        note: "Priced per pier. For lighter loads and wet soil.",
      }),
      item("wall-anchors", "foundation", {
        symptom: "A bowing wall, or a horizontal crack",
        fix: "Wall anchors",
        note: "Priced per anchor, about one every 5 feet.",
      }),
    ],
  },
  {
    id: "concrete",
    name: "Concrete Leveling & Repair",
    sub: "Sunken slabs · trip hazards · cracks",
    icon: "crack",
    intro: "Check what's wrong with the driveway, sidewalk, patio or steps.",
    items: [
      item("slab-lift", "concrete", {
        symptom: "A sunken slab or a trip ledge",
        fix: "PolyLevel concrete lifting",
        note: "Priced per slab section.",
      }),
      item("joint-seal", "concrete", {
        symptom: "Open cracks and joints",
        fix: "Concrete crack & joint sealant",
        note: "Priced per foot.",
      }),
    ],
  },
];

export const homespecItems: Record<string, DemoItem> = Object.fromEntries(
  homespecCategories.flatMap((c) => c.items.map((i) => [i.id, i])),
);

/* ---- The house: the same photographs and hotspot positions, HomeSpec's words ---- */

type Words = Partial<Pick<Hotspot, "label" | "title" | "body" | "item" | "side">>;

/** One of the shared areas, its hotspots retold. Positions stay put: they're placed on the photos. */
const area = (id: Area["id"], changes: Partial<Pick<Area, "label" | "title">>, words: Words[]): Area => {
  const base = areas.find((a) => a.id === id)!;
  return { ...base, ...changes, hotspots: base.hotspots.map((h, i) => ({ ...h, ...words[i] })) };
};

export const homespecAreas: Area[] = [
  area("foundation", { title: "Your foundation, from the outside" }, [
    { body: "Cracks that step along the mortar joints mean part of the house is settling more than the rest. Piers driven to stable soil stop it." },
    { label: "Crack letting water in", title: "A crack that leaks", body: "Not structural on its own, but it lets water in every time it rains. A crack repair seals it from the inside." },
    { body: "A horizontal crack with an inward bow means soil pressure is pushing the wall in. Wall anchors hold it and can straighten it over time." },
    { body: "The footing has dropped under one corner. Piers driven down to load-bearing soil lift it and hold it there." },
  ]),
  area("basement", { title: "Inside your basement" }, [
    { body: "Water follows the crack straight through the wall. A basement crack repair seals the path for good." },
    { body: "That white residue is minerals left behind as water moves through the wall: a sign of ongoing moisture." },
    { body: "The joint between the wall and the floor is the most common way water gets in. A perimeter drain catches it right there." },
    { body: "Water that pools with nowhere to go needs a sump pump to lift it out of your basement." },
    { label: "Pump fails in a storm", title: "When the power goes out", body: "Storms bring the most water and the most power cuts. A battery back-up keeps the pump running." },
  ]),
  area("crawl", { title: "Under your home, in the crawl space" }, [
    { body: "Damp crawl space air rises into the rooms above. Sealing the space off, walls and floor, stops the smell at the source." },
    { body: "Condensation on cold pipes and ducts means the air is too wet. A crawl space dehumidifier keeps it dry all year." },
    { label: "Sagging floor above", title: "A sagging floor above", body: "Damp softens the wood and the floor starts to dip. Support jacks on solid footings take the load back.", item: "support-posts" },
    { body: "Water that collects under the house needs a drain and a pump to get it out." },
    { body: "Torn or pushed aside, the plastic on the ground stops keeping moisture out. A sealed liner over the floor and walls replaces it." },
  ]),
  area("driveway", { label: "Concrete", title: "Driveways, sidewalks and patios" }, [
    { body: "Water gets into open joints and washes out the soil underneath. Sealing them stops the slab from dropping." },
    { body: "The soil underneath has washed out or settled. PolyLevel foam lifts it back in a few hours, ready to use the same day." },
    { body: "Where one slab has dropped against the next it leaves an edge people trip on. Lifting it removes the ledge." },
  ]),
];

export const homespecScenes = {
  house: sceneImages.house!,
  foundation: sceneImages.foundation!,
  basement: sceneImages.basement!,
  crawl: sceneImages.crawl!,
  driveway: sceneImages.driveway!,
} as Record<"house" | Area["id"], { src: string; alt: string }>;

