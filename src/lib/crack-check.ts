/* ==========================================================================
   Crack & symptom checker: the questions and the scoring.

   Shared by the checker in the browser (components/tools/CrackChecker.tsx)
   and the server that emails the report (app/api/tool-lead). The server
   scores the answers again itself, so a report can only ever say what the
   checker would have said.

   The scoring is a triage rule of thumb for a demo, not an engineering
   assessment, and every place the result is shown says so.
   ========================================================================== */

export const where = [
  { id: "brick", label: "Brick or stone outside" },
  { id: "drywall", label: "Inside wall or ceiling" },
  { id: "slab", label: "Slab or garage floor" },
  { id: "block", label: "Block or basement wall" },
] as const;

export const pattern = [
  { id: "vertical", label: "Straight up and down", score: 0 },
  { id: "stair", label: "Stair-step or diagonal", score: 2 },
  { id: "horizontal", label: "Horizontal, along the wall", score: 3 },
  { id: "offset", label: "One side sits higher", score: 3 },
] as const;

export const width = [
  { id: "hair", label: "Hairline", note: "under 1/16 in", score: 0 },
  { id: "pencil", label: "Pencil-lead wide", note: "up to 1/8 in", score: 1 },
  { id: "nickel", label: "A nickel fits edge-on", note: "up to 1/4 in", score: 2 },
  { id: "coin", label: "A coin slides in", note: "over 1/4 in", score: 3 },
] as const;

export const signs = [
  { id: "doors", label: "Doors or windows stick" },
  { id: "floors", label: "Floors slope or bounce" },
  { id: "gaps", label: "Gaps at trim or baseboards" },
  { id: "musty", label: "Musty smell or damp crawl space" },
  { id: "water", label: "Water pools after rain" },
] as const;

export type WhereId = (typeof where)[number]["id"];
export type PatternId = (typeof pattern)[number]["id"];
export type WidthId = (typeof width)[number]["id"];
export type SignId = (typeof signs)[number]["id"];

export type CrackAnswers = { where: WhereId; pattern: PatternId; width: WidthId; signs: SignId[] };

export type Level = { id: "watch" | "inspect" | "soon"; label: string; line: string; tone: string; dot: string };

export const levels: Record<Level["id"], Level> = {
  watch: {
    id: "watch",
    label: "Keep an eye on it",
    line: "This looks like normal shrinkage or early settling. Mark both ends of the crack with a pencil and today's date. If it grows in the next three months, get it checked.",
    tone: "bg-[#e3f4ea] text-[#1d6b3f]",
    dot: "bg-[#2f9e5b]",
  },
  inspect: {
    id: "inspect",
    label: "Worth an inspection",
    line: "These are signs of movement. A free inspection and elevation survey will show whether it's active, before it gets any bigger.",
    tone: "bg-[#fff4d6] text-[#8a5a00]",
    dot: "bg-[#e5a50a]",
  },
  soon: {
    id: "soon",
    label: "Book an inspection soon",
    line: "Several signs point to active foundation movement. The sooner it's measured, the fewer piers it usually takes to fix.",
    tone: "bg-[#fde7e4] text-[#a8321f]",
    dot: "bg-[#d9482b]",
  },
};

export function assess({ where: w, pattern: p, width: wd, signs: s }: CrackAnswers) {
  const structural = s.filter((x) => x === "doors" || x === "floors" || x === "gaps").length;
  let score = pattern.find((x) => x.id === p)!.score + width.find((x) => x.id === wd)!.score + structural;
  // A hairline, vertical crack in a slab is almost always curing shrinkage.
  if (w === "slab" && p === "vertical") score -= 1;
  // A horizontal crack in a block wall means the wall is being pushed in.
  if (w === "block" && p === "horizontal") score += 1;

  const level = score <= 1 ? levels.watch : score <= 4 ? levels.inspect : levels.soon;

  const cause =
    w === "block" && p === "horizontal"
      ? "Soil pressure pushing the wall inward, usually from wet ground on the outside."
      : p === "offset"
        ? "One part of the foundation has settled more than the part beside it."
        : p === "stair" && (w === "brick" || w === "block")
          ? "Differential settlement: one corner of the house is dropping as the soil under it dries and shrinks."
          : w === "drywall" && structural > 0
            ? "The frame is racking as the foundation moves, which shows up first at door and window corners."
            : s.includes("floors")
              ? "Failed supports in the crawl space, like rotted shims, sinking piers or a soft sill plate."
              : "Concrete shrinking as it cures and ages, plus normal seasonal movement.";

  const fixes: { label: string; range: string }[] = [];
  if (level.id === "watch") fixes.push({ label: "Seal and monitor", range: "$150 – $400" });
  if (level.id === "inspect") fixes.push({ label: "If it's settlement: 4–8 piers", range: "$5,400 – $14,000" });
  if (level.id === "soon") fixes.push({ label: "Often 8–16 piers plus drainage", range: "$10,800 – $28,000" });
  if (w === "block" && p === "horizontal") fixes.push({ label: "Wall anchors or carbon-fiber straps", range: "$4,500 – $12,000" });
  if (s.includes("floors")) fixes.push({ label: "Crawl space supports & re-level", range: "$2,400 – $7,500" });
  if (s.includes("musty")) fixes.push({ label: "Crawl space encapsulation", range: "$6,500 – $15,000" });
  if (s.includes("water")) fixes.push({ label: "Drainage & downspout extensions", range: "$1,200 – $4,800" });

  return { level, cause, fixes };
}

/** The answers as label pairs, for the report and the Airtable summary. */
export function describeAnswers(a: CrackAnswers): [string, string][] {
  const wd = width.find((x) => x.id === a.width)!;
  return [
    ["Where", where.find((x) => x.id === a.where)!.label],
    ["Looks like", pattern.find((x) => x.id === a.pattern)!.label],
    ["Width", `${wd.label} (${wd.note})`],
    ["Also noticed", a.signs.length ? a.signs.map((id) => signs.find((x) => x.id === id)!.label).join(", ") : "Nothing else"],
  ];
}

/** Checks answers sent from a browser against the lists above. */
export function readCrackAnswers(v: unknown): CrackAnswers | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const ok = <T extends { id: string }>(list: readonly T[], x: unknown) => list.some((i) => i.id === x);
  if (!ok(where, o.where) || !ok(pattern, o.pattern) || !ok(width, o.width)) return null;
  if (!Array.isArray(o.signs) || o.signs.length > signs.length || !o.signs.every((x) => ok(signs, x))) return null;
  return {
    where: o.where as WhereId,
    pattern: o.pattern as PatternId,
    width: o.width as WidthId,
    signs: [...new Set(o.signs as SignId[])],
  };
}
