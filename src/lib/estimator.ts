import type { IconKey } from "@/components/ui/Icon";

/* ==========================================================================
   Instant repair estimate: the second live tool beside the crack checker.

   A homeowner points at the part of the house that worries them (or ticks
   their symptoms), picks a size without needing a tape measure, and gets a
   ballpark range once they've left a name, phone and ZIP. For a contractor
   that last step is the point: every estimate arrives as a lead.

   The prices are sample figures for the same fictional company as the crack
   checker, and sit in the same ranges (its "4–8 piers, $5,400 – $14,000"
   is about $1,350–$1,750 a pier). The page says they're samples. A client's
   site uses the client's own prices.
   ========================================================================== */

/** A size the homeowner can pick instead of measuring. */
export type Size = { label: string; qty: number };

export type RepairItem = {
  id: string;
  /** What the homeowner notices… */
  symptom: string;
  /** …and what fixes it. */
  fix: string;
  /** How it's priced, in a few words. */
  note: string;
  /** Sample price per unit, low and high. */
  low: number;
  high: number;
  /** Singular unit for "Enter exact number", e.g. "piers". Absent for a fixed-price item. */
  unit?: string;
  question?: string;
  sizes?: Size[];
  measure?: string;
  /** A choice that changes the unit price, e.g. the siding material. The
      first choice is the default, and its prices match `low` and `high`. */
  options?: {
    question: string;
    choices: { label: string; low: number; high: number }[];
  };
};

export type RepairCategory = {
  id: string;
  name: string;
  sub: string;
  icon: IconKey;
  intro: string;
  items: RepairItem[];
};

export const categories: RepairCategory[] = [
  {
    id: "foundation",
    name: "Foundation repair",
    sub: "Cracks · bowing walls · settling",
    icon: "foundation",
    intro:
      "Check the symptoms you're seeing. Settling can be fixed with anything from foam injection to piers.",
    items: [
      {
        id: "push-piers",
        symptom: "Stair-step cracks, sticking doors",
        fix: "Push piers",
        note: "Per pier.",
        low: 1300,
        high: 1700,
        unit: "piers",
        question: "How much of the house is settling?",
        sizes: [
          { label: "One corner", qty: 4 },
          { label: "One side", qty: 8 },
          { label: "Two sides", qty: 14 },
        ],
        measure:
          "Walk the outside. Count the corners and sides where you see cracks or gaps; the inspector confirms where each pier goes.",
      },
      {
        id: "helical-piers",
        symptom: "A sinking or dropped corner",
        fix: "Helical piers",
        note: "Per pier. For lighter loads and wet soil.",
        low: 1500,
        high: 2100,
        unit: "piers",
        question: "How much of the house is sinking?",
        sizes: [
          { label: "One corner", qty: 4 },
          { label: "One side", qty: 8 },
          { label: "Two sides", qty: 14 },
        ],
        measure:
          "A sinking corner usually takes 3 to 5 piers. A whole side is roughly one pier every 6 to 8 feet.",
      },
      {
        id: "wall-anchors",
        symptom: "Bowing or leaning basement wall",
        fix: "Wall anchors",
        note: "Per anchor, about every 5 feet of wall.",
        low: 800,
        high: 1200,
        unit: "anchors",
        question: "How much of the wall is bowing?",
        sizes: [
          { label: "Part of one wall", qty: 3 },
          { label: "A full wall", qty: 5 },
          { label: "Two walls", qty: 9 },
        ],
        measure:
          "Lay a straight edge or tight string along the wall. Wherever there's a gap behind it, the wall is bowing.",
      },
      {
        id: "foam-injection",
        symptom: "Small cracks letting water in",
        fix: "Crack injection",
        note: "Per crack. Seals it from the inside.",
        low: 500,
        high: 900,
        unit: "cracks",
        question: "How many cracks?",
        sizes: [
          { label: "One", qty: 1 },
          { label: "A few", qty: 3 },
          { label: "Several", qty: 5 },
        ],
      },
    ],
  },
  {
    id: "waterproofing",
    name: "Basement waterproofing",
    sub: "Seepage · damp walls · flooding",
    icon: "drop",
    intro: "Check what's happening in your basement.",
    items: [
      {
        id: "interior-drain",
        symptom: "Water seeping in at the floor or wall",
        fix: "Interior drainage system",
        note: "Per linear foot of wall.",
        low: 45,
        high: 75,
        unit: "feet",
        question: "How much wall is wet at the bottom?",
        sizes: [
          { label: "One wall (~30 ft)", qty: 30 },
          { label: "Two walls (~60 ft)", qty: 60 },
          { label: "Whole basement (~120 ft)", qty: 120 },
        ],
        measure: "Pace along the wet walls; one long stride is about 3 feet.",
      },
      {
        id: "sump-pump",
        symptom: "Standing water, or no sump pump",
        fix: "Sump pump install",
        note: "Complete install.",
        low: 1200,
        high: 2200,
      },
      {
        id: "battery-backup",
        symptom: "Pump stops when the power goes out",
        fix: "Battery back-up pump",
        note: "Backup pump system.",
        low: 900,
        high: 1600,
      },
      {
        id: "wall-liner",
        symptom: "Damp or white-stained walls",
        fix: "Basement wall liner",
        note: "Per sq ft of foundation wall.",
        low: 5,
        high: 9,
        unit: "sq ft",
        question: "How much wall do you want covered?",
        sizes: [
          { label: "One wall (~250 sq ft)", qty: 250 },
          { label: "Two walls (~500)", qty: 500 },
          { label: "Whole basement (~900)", qty: 900 },
        ],
        measure:
          "Wall length times height. An 8-foot wall that's 30 feet long is 240 sq ft.",
      },
    ],
  },
  {
    id: "crawl",
    name: "Crawl space encapsulation",
    sub: "Moisture · mold · musty smell",
    icon: "crawl",
    intro: "Check what's going on under the house.",
    items: [
      {
        id: "encapsulation",
        symptom: "Musty smell, mold on the joists",
        fix: "Full encapsulation",
        note: "Per sq ft of crawl space.",
        low: 5,
        high: 9,
        unit: "sq ft",
        question: "How big is the crawl space?",
        sizes: [
          { label: "Small (~800 sq ft)", qty: 800 },
          { label: "Average (~1,200)", qty: 1200 },
          { label: "Large (~1,800)", qty: 1800 },
        ],
        measure:
          "It's usually close to the footprint of the ground floor, without the garage and porch.",
      },
      {
        id: "dehumidifier",
        symptom: "Damp air, sweating pipes and ducts",
        fix: "Crawl space dehumidifier",
        note: "Installed and drained.",
        low: 1500,
        high: 2800,
      },
      {
        id: "crawl-drain",
        symptom: "Standing water on the ground",
        fix: "Crawl space drain & sump",
        note: "Drain line and pump.",
        low: 2000,
        high: 4000,
      },
    ],
  },
  {
    id: "concrete",
    name: "Concrete leveling",
    sub: "Sunken slabs · trip hazards",
    icon: "crack",
    intro: "Check what's wrong with the driveway, walks or patio.",
    items: [
      {
        id: "slab-lift",
        symptom: "Sunken slab or a trip ledge",
        fix: "Lift & level the slab",
        note: "Per slab section.",
        low: 600,
        high: 1300,
        unit: "sections",
        question: "How many sections have dropped?",
        sizes: [
          { label: "One", qty: 1 },
          { label: "A few", qty: 3 },
          { label: "Whole driveway", qty: 6 },
        ],
        measure:
          "A section is the square between two cut joints, usually about 10 by 10 feet.",
      },
      {
        id: "joint-seal",
        symptom: "Open cracks and joints",
        fix: "Seal cracks & joints",
        note: "Per linear foot.",
        low: 4,
        high: 8,
        unit: "feet",
        question: "How much needs sealing?",
        sizes: [
          { label: "A little (~20 ft)", qty: 20 },
          { label: "Some (~50 ft)", qty: 50 },
          { label: "A lot (~100 ft)", qty: 100 },
        ],
      },
    ],
  },
  {
    id: "framing",
    name: "Framing & structural",
    sub: "Joists · beams · posts",
    icon: "wrench",
    intro: "Check any framing or structural repairs you may need.",
    items: [
      {
        id: "sister-joists",
        symptom: "Sagging or bouncy floor",
        fix: "Sister floor joists",
        note: "Per joist.",
        low: 250,
        high: 450,
        unit: "joists",
        question: "How big is the sagging area?",
        sizes: [
          { label: "A soft spot", qty: 4 },
          { label: "One room", qty: 8 },
          { label: "Whole floor", qty: 14 },
        ],
        measure:
          "Joists are usually 16 inches apart, so a 10-foot-wide room has about 8.",
      },
      {
        id: "girder",
        symptom: "Cracked or failing main beam",
        fix: "Replace the girder",
        note: "Per linear foot.",
        low: 150,
        high: 300,
        unit: "feet",
        question: "How much of the beam?",
        sizes: [
          { label: "A short span (~8 ft)", qty: 8 },
          { label: "Half the house (~16 ft)", qty: 16 },
          { label: "Full length (~32 ft)", qty: 32 },
        ],
      },
      {
        id: "support-posts",
        symptom: "Leaning, rotted or missing posts",
        fix: "New support posts",
        note: "Per post, with a footing.",
        low: 350,
        high: 650,
        unit: "posts",
        question: "How many posts?",
        sizes: [
          { label: "Two", qty: 2 },
          { label: "Four", qty: 4 },
          { label: "Six", qty: 6 },
        ],
      },
      {
        id: "rim-joist",
        symptom: "Soft or rotted rim joist",
        fix: "Replace the rim joist",
        note: "Per linear foot.",
        low: 40,
        high: 80,
        unit: "feet",
        question: "How much is rotted?",
        sizes: [
          { label: "One section (~10 ft)", qty: 10 },
          { label: "One side (~30 ft)", qty: 30 },
          { label: "Two sides (~60 ft)", qty: 60 },
        ],
      },
    ],
  },
  {
    id: "siding",
    name: "Siding & exterior",
    sub: "Cracked boards · rot · leaks",
    icon: "siding",
    intro: "Check what you're seeing on the outside of the house.",
    items: [
      {
        id: "siding-repair",
        symptom: "Cracked, loose or missing boards",
        fix: "Siding repair",
        note: "Per damaged spot, matched to your siding.",
        low: 350,
        high: 800,
        unit: "spots",
        question: "How many damaged spots?",
        sizes: [
          { label: "One", qty: 1 },
          { label: "A few", qty: 3 },
          { label: "Several", qty: 6 },
        ],
        measure:
          "Count each patch of damaged boards a few feet wide or less as one spot.",
      },
      {
        id: "siding-replace",
        symptom: "Warped, faded or failing siding",
        fix: "New siding",
        note: "Per sq ft of wall. The price depends on the material.",
        low: 5,
        high: 9,
        unit: "sq ft",
        options: {
          question: "Which material?",
          choices: [
            { label: "Vinyl", low: 5, high: 9 },
            { label: "Engineered wood", low: 7, high: 11 },
            { label: "Fiber cement", low: 9, high: 14 },
          ],
        },
        question: "How much of the house?",
        sizes: [
          { label: "One side (~500 sq ft)", qty: 500 },
          { label: "Two sides (~1,000)", qty: 1000 },
          { label: "Whole house (~2,000)", qty: 2000 },
        ],
        measure:
          "Each wall's length times its height, leaving out windows and doors. A two-story house is usually 1,800 to 2,500 sq ft in all.",
      },
      {
        id: "trim-soffit",
        symptom: "Rotted trim, soffit or fascia",
        fix: "Trim, soffit & fascia repair",
        note: "Per linear foot.",
        low: 12,
        high: 25,
        unit: "feet",
        question: "How much is rotted?",
        sizes: [
          { label: "One area (~20 ft)", qty: 20 },
          { label: "One side (~60 ft)", qty: 60 },
          { label: "Whole house (~150 ft)", qty: 150 },
        ],
      },
      {
        id: "flashing",
        symptom: "Water stains inside, under windows",
        fix: "Window flashing & housewrap repair",
        note: "Per window or door.",
        low: 250,
        high: 600,
        unit: "windows",
        question: "How many windows or doors?",
        sizes: [
          { label: "One", qty: 1 },
          { label: "A few", qty: 3 },
          { label: "A whole side", qty: 6 },
        ],
      },
    ],
  },
];

export const itemsById = Object.fromEntries(
  categories.flatMap((c) =>
    c.items.map((i) => [i.id, { ...i, category: c.id }]),
  ),
) as Record<string, RepairItem & { category: string }>;

/** The middle size, or 1 for a fixed-price item: what "Get pricing" adds. */
export const defaultQty = (item: RepairItem) =>
  item.sizes?.[Math.floor(item.sizes.length / 2)].qty ?? 1;

/** One repair the homeowner picked: its id, how many, and which option. */
export type Pick = { id: string; qty: number; variant: number };

/**
 * Prices the picks: each line, and the total rounded out to the hundred.
 * The estimator and the emailed PDF both use this, and the server runs it
 * again on the ids it's sent, so a quote always carries the site's prices.
 */
export function priceEstimate(picks: Pick[]) {
  const lines = picks.map(({ id, qty, variant }) => {
    const item = itemsById[id];
    const choice = item.options?.choices[variant];
    const per = choice ?? item;
    return { item, qty, choice: choice?.label, low: per.low * qty, high: per.high * qty };
  });
  const low = Math.floor(lines.reduce((s, l) => s + l.low, 0) / 100) * 100;
  const high = Math.ceil(lines.reduce((s, l) => s + l.high, 0) / 100) * 100;
  return { lines, low, high };
}

/** Checks picks sent from a browser: known repairs, sane quantities, real options. */
export function readPicks(v: unknown): Pick[] | null {
  if (!Array.isArray(v) || !v.length || v.length > Object.keys(itemsById).length) return null;
  const picks: Pick[] = [];
  for (const p of v) {
    const { id, qty, variant } = (p ?? {}) as Record<string, unknown>;
    if (typeof id !== "string" || !Object.hasOwn(itemsById, id)) return null;
    if (!Number.isInteger(qty) || (qty as number) < 1 || (qty as number) > 100_000) return null;
    // A fixed-price item has no sizes, so it only ever comes once.
    if (!itemsById[id].sizes && qty !== 1) return null;
    const choices = itemsById[id].options?.choices.length ?? 1;
    if (!Number.isInteger(variant) || (variant as number) < 0 || (variant as number) >= choices) return null;
    if (picks.some((x) => x.id === id)) return null;
    picks.push({ id, qty: qty as number, variant: variant as number });
  }
  return picks;
}

/* ---- The house, and what's inside each part of it ---- */

/** Position on a 1000 × 560 scene, in percent. */
type Point = { x: number; y: number };

export type Hotspot = Point & {
  label: string;
  title: string;
  body: string;
  item: string;
};

export type Area = {
  id: "foundation" | "basement" | "crawl" | "framing" | "driveway" | "siding";
  label: string;
  /** The clickable zone on the house, in percent. */
  zone: { x: number; y: number; w: number; h: number };
  /** Where its label sits, so neighbouring labels never overlap. */
  chip: "above" | "below" | "inside";
  title: string;
  hotspots: Hotspot[];
};

export const areas: Area[] = [
  {
    id: "foundation",
    label: "Foundation",
    zone: { x: 15, y: 40, w: 13, h: 55 },
    chip: "above",
    title: "The foundation wall, from the outside",
    hotspots: [
      {
        x: 38,
        y: 33,
        label: "Stair-step cracks",
        title: "Stair-step cracks",
        body: "Cracks that follow the mortar joints like steps mean one part of the house is settling more than another.",
        item: "push-piers",
      },
      {
        x: 64,
        y: 31,
        label: "Small crack, letting water in",
        title: "A small crack that leaks",
        body: "Not structural on its own, but it lets water in every time it rains. Injection seals it from the inside.",
        item: "foam-injection",
      },
      {
        x: 50,
        y: 54,
        label: "Horizontal crack & bowing",
        title: "Horizontal crack & bowing",
        body: "A horizontal crack with an inward bow means soil pressure is pushing the wall in. It needs anchoring.",
        item: "wall-anchors",
      },
      {
        x: 70,
        y: 88,
        label: "Sinking corner",
        title: "A sinking corner",
        body: "The footing has dropped under one corner. Piers driven to stable soil lift it and hold it there.",
        item: "helical-piers",
      },
    ],
  },
  {
    id: "basement",
    label: "Basement",
    zone: { x: 28, y: 67, w: 18, h: 26 },
    chip: "inside",
    title: "Inside the basement",
    hotspots: [
      {
        x: 30,
        y: 38,
        label: "Wall cracks letting water in",
        title: "Wall cracks letting water in",
        body: "Water follows the crack through the wall. Injecting it seals the path.",
        item: "foam-injection",
      },
      {
        x: 66,
        y: 45,
        label: "White chalky staining",
        title: "White chalky staining (efflorescence)",
        body: "That white residue is mineral deposit left by water moving through the wall: a sign of ongoing moisture.",
        item: "wall-liner",
      },
      {
        x: 56,
        y: 75,
        label: "Water seeping at the floor",
        title: "Water seeping where the wall meets the floor",
        body: "The joint between wall and floor is the most common way water gets in. An interior drain catches it there.",
        item: "interior-drain",
      },
      {
        x: 40,
        y: 89,
        label: "Standing water",
        title: "Standing water",
        body: "Water that pools with nowhere to go needs a sump pump to lift it out of the basement.",
        item: "sump-pump",
      },
      {
        x: 86,
        y: 28,
        label: "Where the water goes",
        title: "When the power goes out",
        body: "Storms bring the most water and the most power cuts. A battery back-up keeps the pump running.",
        item: "battery-backup",
      },
    ],
  },
  {
    id: "crawl",
    label: "Crawl space",
    zone: { x: 47, y: 67, w: 17, h: 12 },
    chip: "below",
    title: "Under the house, in the crawl space",
    hotspots: [
      {
        x: 24,
        y: 14,
        label: "Mold & musty smell",
        title: "Mold on the joists and a musty smell",
        body: "Damp crawl space air rises into the house. Sealing the space off, walls and floor, stops it at the source.",
        item: "encapsulation",
      },
      {
        x: 58,
        y: 31,
        label: "Sweating duct",
        title: "Damp air, sweating pipes and ducts",
        body: "Condensation on cold surfaces means the air is too wet. A dehumidifier keeps it dry year round.",
        item: "dehumidifier",
      },
      {
        x: 78,
        y: 25,
        label: "Sagging joist",
        title: "A sagging joist",
        body: "Years of damp soften the wood, and the floor above starts to dip. A new joist alongside takes the load.",
        item: "sister-joists",
      },
      {
        x: 70,
        y: 86,
        label: "Standing water",
        title: "Standing water on the ground",
        body: "Water that collects under the house needs a drain and a pump to get it out.",
        item: "crawl-drain",
      },
    ],
  },
  {
    id: "framing",
    label: "Floor & framing",
    zone: { x: 28, y: 61.5, w: 36, h: 5.5 },
    chip: "above",
    title: "The floor framing, from below",
    hotspots: [
      {
        x: 78,
        y: 10,
        label: "Sagging floor",
        title: "A sagging, bouncy floor",
        body: "The joists under it have weakened or were undersized. New joists alongside the old ones stiffen it.",
        item: "sister-joists",
      },
      {
        x: 50,
        y: 26,
        label: "Cracked main beam",
        title: "A cracked main beam",
        body: "The girder carries the whole floor. Once it cracks, it needs replacing.",
        item: "girder",
      },
      {
        x: 55,
        y: 58,
        label: "Leaning post",
        title: "A leaning or rotted post",
        body: "Posts hold the beam up. One that leans, rots or sits on bare soil needs replacing with a proper footing.",
        item: "support-posts",
      },
      {
        x: 6,
        y: 20,
        label: "Rotted rim joist",
        title: "A rotted rim joist",
        body: "The board around the edge of the floor frame rots where water gets behind the siding.",
        item: "rim-joist",
      },
    ],
  },
  {
    id: "driveway",
    label: "Driveway / concrete",
    zone: { x: 83, y: 59.5, w: 17, h: 7.5 },
    chip: "above",
    title: "The driveway, from the side",
    hotspots: [
      {
        x: 30,
        y: 53,
        label: "Open cracks",
        title: "Open cracks and joints",
        body: "Water gets into open joints and washes out the soil underneath. Sealing them stops the slab from dropping.",
        item: "joint-seal",
      },
      {
        x: 54,
        y: 59,
        label: "Sunken slab",
        title: "A sunken slab",
        body: "The soil under it has washed out or settled. Lifting it from below levels it in an afternoon.",
        item: "slab-lift",
      },
      {
        x: 66,
        y: 52,
        label: "Trip ledge",
        title: "A trip ledge",
        body: "Where one slab has dropped against the next, it leaves an edge people trip on. Lifting it removes the ledge.",
        item: "slab-lift",
      },
    ],
  },
  {
    id: "siding",
    label: "Siding & exterior",
    zone: { x: 64, y: 41.5, w: 19, h: 21 },
    chip: "above",
    title: "The siding, up close",
    hotspots: [
      {
        x: 73,
        y: 15,
        label: "Rotted fascia & soffit",
        title: "Rotted fascia and soffit",
        body: "Water from the gutter soaks the boards along the roof edge until they soften and open up to pests.",
        item: "trim-soffit",
      },
      {
        x: 80,
        y: 40,
        label: "Warped, faded boards",
        title: "Warped and faded siding",
        body: "Boards that wave, chalk or fade have reached the end of their life. Patching won't match; it's time for new siding.",
        item: "siding-replace",
      },
      {
        x: 22,
        y: 54,
        label: "Cracked board",
        title: "A cracked board",
        body: "A crack lets water behind the siding. One damaged board can be replaced and matched.",
        item: "siding-repair",
      },
      {
        x: 45,
        y: 75,
        label: "Leaky window",
        title: "Water getting in at a window",
        body: "Stains under a window mean the flashing around it has failed. It's resealed and the housewrap patched behind the siding.",
        item: "flashing",
      },
      {
        x: 78,
        y: 72,
        label: "Missing board",
        title: "A board blown off in a storm",
        body: "The wall behind is exposed to every rain. A matching board goes back in, often the same week.",
        item: "siding-repair",
      },
    ],
  },
];

/** The estimator's tab in the live-tool band: its pitch and three steps. */
export const estimatorTool = {
  name: "House estimator",
  lede: "They point at the problem or tick their symptoms, pick a size, and see a ballpark once they've left a name and number. Every estimate arrives as a lead, with the job already described.",
  steps: [
    // {
    //   title: "Point to the problem",
    //   body: "They click the part of the house that's worrying them, or tick what they're noticing. No jargon needed.",
    // },
    // {
    //   title: "Pick a size, not a measurement",
    //   body: "Each job is priced per pier, foot or square foot, with sizes they can choose without a tape measure.",
    // },
    // {
    //   title: "Their details unlock the price",
    //   body: "Name, phone and ZIP come first, so every estimate lands in your CRM as a lead.",
    // },
  ],
};

/**
 * Photographic versions of the scenes, used instead of the drawings when set.
 * Generated renders go in public/images/estimator/ (16:9, 2400 px wide or
 * more): house, foundation, basement, crawl, framing, driveway, siding. When one is
 * added here, move that scene's `zone` / `hotspots` in `areas` onto what the
 * image actually shows; the drawing's positions won't line up with it.
 */
export const sceneImages: Partial<
  Record<"house" | Area["id"], { src: string; alt: string }>
> = {};
