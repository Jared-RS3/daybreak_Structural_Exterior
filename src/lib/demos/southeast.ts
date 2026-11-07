import type { IconKey } from "@/components/ui/Icon";
import { areas, itemsById, sceneImages, type Area, type Hotspot, type RepairItem } from "@/lib/estimator";

/* ==========================================================================
   Southeast Crawlspace Consulting concept demo: content

   A pitch page for Southeast Crawlspace Consulting (SECC, Tucker GA,
   southeastcrawlspaceconsulting.com), styled after their site, running
   Daybreak's house estimator: the same cut-away photographs, the same
   hotspot positions, the same sample price engine (lib/estimator).

   Their services and wording, checked 2026-11-07: crawl space cleanouts,
   drainage solutions, encapsulation, vapor barriers, humidity and moisture
   control, floor support and sagging floor repairs ("adjustable floor jacks
   installed on engineered footings"), foundation and crack repairs, French
   drains, basement waterproofing; free crawlspace inspections with 3D Lidar
   rendering. No siding or concrete leveling: they don't sell them.

   Prices are Daybreak's sample figures, never SECC's. The page says so.
   /api/tool-lead reads this file too (brand "southeast"), so the emailed PDF
   and the Airtable row use the same wording as the page.
   ========================================================================== */

export const southeast = {
  name: "Southeast Crawlspace Consulting",
  short: "Southeast Crawlspace Consulting",
  site: "https://www.southeastcrawlspaceconsulting.com/",
  logo: {
    src: "/demo/southeast/logo.png",
    light: "/demo/southeast/logo-light.png",
    width: 143,
    height: 131,
    alt: "Southeast Crawlspace Consulting",
  },
  /** The number in their site header. Shown as text, and in the email's call button. */
  phone: "(678) 920-8128",
  location: "Tucker, GA 30087",
  tagline: "Protect Your Home From Below",
  areaLine: "Atlanta and the surrounding area",
  hours: ["Mon – Fri: 8 AM – 5 PM", "Sat – Sun: Closed"],
  /** Their own promises, from the homepage copy. */
  promises: [
    { icon: "search", title: "Free Crawlspace Inspections", text: "Every inspection includes 3D Lidar rendering, so you see exactly what's going on." },
    { icon: "wallet", title: "Fair Prices, No Pressure", text: "A family-focused approach, with reliable solutions and no high-pressure sales." },
    { icon: "shield", title: "Lifelong Solutions", text: "Quality workmanship on every project, large or small, built to stand the test of time." },
  ] satisfies { icon: IconKey; title: string; text: string }[],
  nav: ["Home", "About", "Services", "Areas We Serve", "Gallery", "Reviews", "Blog", "Contact"],
  services: [
    "Crawl Space Cleanouts",
    "Drainage Solutions",
    "Crawl Space Encapsulation",
    "Vapor Barriers",
    "Humidity and Moisture Control",
    "Floor Support & Sagging Repairs",
    "Foundation Repairs",
    "French Drains",
    "Basement Waterproofing",
    "Crack Repairs",
  ],
} as const;

/* ---- The menu: SECC's services, in their words ---- */

export type DemoItem = RepairItem & { category: string };
export type DemoCategory = { id: string; name: string; sub: string; icon: IconKey; intro: string; items: DemoItem[] };

/** An item from the shared catalog (its sizes and sample prices), retold in SECC's words. */
const item = (id: string, category: string, words: Partial<RepairItem>): DemoItem => ({
  ...itemsById[id],
  ...words,
  category,
});

export const southeastCategories: DemoCategory[] = [
  {
    id: "crawl",
    name: "Crawl Space Encapsulation",
    sub: "Musty smells · mold · torn barriers",
    icon: "crawl",
    intro: "Check what's going on beneath your home. Most crawl spaces have more than one thing going on.",
    items: [
      item("encapsulation", "crawl", {
        symptom: "Musty smell, or mold on the joists",
        fix: "Crawl space encapsulation",
        note: "Priced per square foot of crawl space.",
      }),
      item("vapor-barrier", "crawl", {
        symptom: "Torn, missing or thin plastic on the ground",
        fix: "Vapor barrier",
        note: "Priced per square foot of crawl space floor.",
      }),
      item("dehumidifier", "crawl", {
        symptom: "Damp air, sweating pipes and ducts",
        fix: "Humidity and moisture control",
        note: "A crawl space dehumidifier, installed and drained.",
      }),
      item("crawl-cleanout", "crawl", {
        symptom: "Debris, old insulation or junk under the house",
        fix: "Crawl space cleanout",
        note: "Priced per square foot of crawl space.",
      }),
    ],
  },
  {
    id: "drainage",
    name: "Drainage Solutions",
    sub: "Standing water · wet foundation",
    icon: "storm",
    intro: "Poor drainage sends water toward your crawl space and foundation. Check what you're seeing.",
    items: [
      item("crawl-drain", "drainage", {
        symptom: "Standing water in the crawl space",
        fix: "Crawl space drainage & sump",
        note: "Drain line and pump.",
      }),
      item("french-drain", "drainage", {
        symptom: "Water pooling around the foundation after rain",
        fix: "French drain",
        note: "Priced per foot.",
      }),
    ],
  },
  {
    id: "floor",
    name: "Floor Support & Sagging Repairs",
    sub: "Bouncy floors · sagging · rot",
    icon: "wrench",
    intro: "Sagging floors and weak support start beneath the home. Check what you've noticed.",
    items: [
      item("support-posts", "floor", {
        symptom: "Bouncy or sagging floors",
        fix: "Adjustable floor jacks",
        note: "Priced per jack, on an engineered footing.",
        unit: "jacks",
        question: "How much of the floor is sagging?",
        sizes: [
          { label: "A soft spot", qty: 2 },
          { label: "One room", qty: 4 },
          { label: "Several rooms", qty: 6 },
        ],
        measure: "Jacks usually go every 6 to 8 feet along the beam under the sagging area.",
      }),
      item("sister-joists", "floor", {
        symptom: "Cracked or weakened floor joists",
        fix: "Sister floor joists",
        note: "Priced per joist.",
      }),
      item("girder", "floor", {
        symptom: "A cracked or failing main beam",
        fix: "Beam repair",
        note: "Priced per foot of beam.",
      }),
      item("rim-joist", "floor", {
        symptom: "Soft or rotted wood around the edge of the floor",
        fix: "Perimeter work: rim joist repair",
        note: "Priced per foot.",
      }),
    ],
  },
  {
    id: "foundation",
    name: "Foundation & Crack Repairs",
    sub: "Cracks · settlement · bowing walls",
    icon: "foundation",
    intro: "Settling soil and moisture move foundations. Check the signs you've noticed.",
    items: [
      item("foam-injection", "foundation", {
        symptom: "Cracks letting water in",
        fix: "Crack repair",
        note: "Priced per crack, sealed from the inside.",
      }),
      item("push-piers", "foundation", {
        symptom: "Stair-step cracks, doors and windows that stick",
        fix: "Foundation piers",
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
    id: "basement",
    name: "Basement Waterproofing",
    sub: "Leaks · damp walls · flooding",
    icon: "drop",
    intro: "Water in the basement has more than one way in. Check everything you're seeing.",
    items: [
      item("interior-drain", "basement", {
        symptom: "Water seeping in where the wall meets the floor",
        fix: "Interior drainage system",
        note: "Priced per foot of wall.",
      }),
      item("sump-pump", "basement", {
        symptom: "Standing water, or no sump pump",
        fix: "Sump pump system",
        note: "Complete install, tied into the drainage.",
      }),
      item("battery-backup", "basement", {
        symptom: "The pump stops when the power goes out",
        fix: "Battery back-up sump pump",
        note: "Keeps pumping through a storm outage.",
      }),
      item("wall-liner", "basement", {
        symptom: "Damp walls or white, chalky stains",
        fix: "Basement wall barrier",
        note: "Priced per square foot of wall.",
      }),
    ],
  },
];

export const southeastItems: Record<string, DemoItem> = Object.fromEntries(
  southeastCategories.flatMap((c) => c.items.map((i) => [i.id, i])),
);

/* ---- The house: the same photographs and hotspot positions, SECC's words ---- */

type Words = Partial<Pick<Hotspot, "label" | "title" | "body" | "item" | "side">>;

/** One of the shared areas, its hotspots retold. Positions stay put: they're placed on the photos. */
const area = (id: Area["id"], changes: Partial<Pick<Area, "label" | "title">>, words: Words[]): Area => {
  const base = areas.find((a) => a.id === id)!;
  return { ...base, ...changes, hotspots: base.hotspots.map((h, i) => ({ ...h, ...words[i] })) };
};

export const southeastAreas: Area[] = [
  area("crawl", { title: "Beneath your home, in the crawl space" }, [
    { body: "Damp crawl space air rises into the rooms above. Encapsulation seals the space from outside moisture, walls and floor." },
    { body: "Condensation on pipes and ducts means the air down there is too humid. Moisture control keeps it dry all year." },
    { label: "Sagging floor above", title: "A sagging floor above", body: "Weak support lets the floor above dip and bounce. Adjustable floor jacks on engineered footings take the load back.", item: "support-posts" },
    { body: "Water pooling under the house needs a drainage system and a pump to carry it out and away." },
    { body: "Torn or pushed aside, the plastic stops keeping ground moisture out. A new heavy-duty vapor barrier covers the floor and runs up the walls.", item: "vapor-barrier" },
  ]),
  area("framing", { label: "Floor support", title: "The floor framing, from below" }, [
    { label: "Bouncy floor", title: "A bouncy, sagging floor", body: "The joists under it have weakened. New joists alongside the old ones stiffen it back up." },
    { label: "Cracked main beam", title: "A cracked main beam", body: "The main beam carries the whole floor. Once it cracks, it needs repairing before the floor follows." },
    { label: "Leaning post", title: "A leaning or rotted post", body: "A post that leans, rots or sits on bare soil is replaced with an adjustable floor jack on an engineered footing." },
    { body: "The board around the edge of the floor frame rots where moisture gets in. Perimeter work replaces it." },
  ]),
  area("foundation", { title: "Your foundation, from the outside" }, [
    { body: "Cracks that step along the mortar joints mean part of the house is settling more than the rest. Piers driven to stable soil stop it." },
    { label: "Crack letting water in", title: "A crack that leaks", body: "Not structural on its own, but it lets water in every time it rains. A crack repair seals it from the inside." },
    { body: "A horizontal crack with an inward bow means soil pressure is pushing the wall in. Wall anchors hold it." },
    { body: "The footing has dropped under one corner. Piers driven down to load-bearing soil lift it and hold it there." },
  ]),
  area("basement", { title: "Inside your basement" }, [
    { body: "Water follows the crack straight through the wall. A crack repair seals the path." },
    { body: "That white residue is minerals left behind as water moves through the wall: a sign of ongoing moisture." },
    { body: "The joint between the wall and the floor is the most common way water gets in. An interior drain catches it right there." },
    { body: "Water that pools with nowhere to go needs a sump pump to lift it out." },
    { label: "Pump fails in a storm", title: "When the power goes out", body: "Storms bring the most water and the most power cuts. A battery back-up keeps the pump running." },
  ]),
];

export const southeastScenes = {
  house: sceneImages.house!,
  crawl: sceneImages.crawl!,
  framing: sceneImages.framing!,
  foundation: sceneImages.foundation!,
  basement: sceneImages.basement!,
} as Record<"house" | Area["id"], { src: string; alt: string }>;
