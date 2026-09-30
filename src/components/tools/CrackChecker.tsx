"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Crack & symptom checker

   The question every foundation lead starts with is "is this serious?". Four
   taps answer it well enough to decide what to do next: where the crack is,
   what it looks like, how wide it is, and what else the house is doing. The
   answer is a severity, the usual cause, and what a fix typically costs —
   then the button that books the right visit.

   Everything runs in the browser; nothing is sent anywhere. The scoring is a
   triage rule of thumb for a demo, not an engineering assessment, and the
   result says so.
   ========================================================================== */

const where = [
  { id: "brick", label: "Brick or stone outside" },
  { id: "drywall", label: "Inside wall or ceiling" },
  { id: "slab", label: "Slab or garage floor" },
  { id: "block", label: "Block or basement wall" },
] as const;

const pattern = [
  { id: "vertical", label: "Straight up and down", score: 0 },
  { id: "stair", label: "Stair-step or diagonal", score: 2 },
  { id: "horizontal", label: "Horizontal, along the wall", score: 3 },
  { id: "offset", label: "One side sits higher", score: 3 },
] as const;

const width = [
  { id: "hair", label: "Hairline", note: "under 1/16 in", score: 0 },
  { id: "pencil", label: "Pencil-lead wide", note: "up to 1/8 in", score: 1 },
  { id: "nickel", label: "A nickel fits edge-on", note: "up to 1/4 in", score: 2 },
  { id: "coin", label: "A coin slides in", note: "over 1/4 in", score: 3 },
] as const;

const signs = [
  { id: "doors", label: "Doors or windows stick" },
  { id: "floors", label: "Floors slope or bounce" },
  { id: "gaps", label: "Gaps at trim or baseboards" },
  { id: "musty", label: "Musty smell or damp crawl space" },
  { id: "water", label: "Water pools after rain" },
] as const;

type WhereId = (typeof where)[number]["id"];
type PatternId = (typeof pattern)[number]["id"];
type WidthId = (typeof width)[number]["id"];
type SignId = (typeof signs)[number]["id"];

type Level = { id: "watch" | "inspect" | "soon"; label: string; line: string; tone: string; dot: string };

const levels: Record<Level["id"], Level> = {
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

function assess(w: WhereId, p: PatternId, wd: WidthId, s: SignId[]) {
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

export function CrackChecker({
  bookHref,
  phone,
  shape = "round",
  className,
}: {
  /** Where "book an inspection" goes. The severity is added as a query. */
  bookHref: string;
  phone?: { display: string; href: string };
  /** "square" for the agency site's Axion panels; "round" for the Crest template. */
  shape?: "round" | "square";
  className?: string;
}) {
  const sq = shape === "square";
  const uid = useId();
  const [w, setW] = useState<WhereId>("brick");
  const [p, setP] = useState<PatternId>("stair");
  const [wd, setWd] = useState<WidthId>("pencil");
  const [s, setS] = useState<SignId[]>(["doors"]);

  const { level, cause, fixes } = assess(w, p, wd, s);
  const toggle = (id: SignId) => setS((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const chip = (on: boolean) =>
    cn(
      "flex min-h-11 items-center gap-2 px-4 py-2 text-left text-[14.5px] leading-snug transition-colors",
      sq ? "" : "rounded-full",
      on ? "bg-fg text-white" : "bg-white text-fg hover:bg-[#e9e9ea]",
    );

  const question = (n: number, label: string) => (
    <legend className="flex items-center gap-2.5 text-[15.5px] font-medium text-fg">
      <span className={cn("flex size-6 items-center justify-center bg-white text-[12.5px] text-fg", !sq && "rounded-full")}>{n}</span>
      {label}
    </legend>
  );

  return (
    <div className={cn("grid gap-2 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-2.5", className)}>
      {/* ---- questions ---- */}
      <div className={cn("space-y-7 bg-card p-5 sm:p-7", !sq && "rounded-[24px]")}>
        <fieldset>
          {question(1, "Where is the crack?")}
          <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {where.map((o) => (
              <button key={o.id} type="button" aria-pressed={w === o.id} onClick={() => setW(o.id)} className={chip(w === o.id)}>
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          {question(2, "What does it look like?")}
          <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {pattern.map((o) => (
              <button key={o.id} type="button" aria-pressed={p === o.id} onClick={() => setP(o.id)} className={chip(p === o.id)}>
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          {question(3, "How wide is it at the widest point?")}
          <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {width.map((o) => (
              <button key={o.id} type="button" aria-pressed={wd === o.id} onClick={() => setWd(o.id)} className={chip(wd === o.id)}>
                <span>
                  {o.label}
                  <span className={cn("ml-1.5 text-[12.5px]", wd === o.id ? "text-white/70" : "text-muted")}>{o.note}</span>
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          {question(4, "Anything else going on?")}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {signs.map((o) => {
              const on = s.includes(o.id);
              return (
                <button key={o.id} type="button" aria-pressed={on} onClick={() => toggle(o.id)} className={chip(on)}>
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center border",
                      !sq && "rounded-[5px]",
                      on ? "border-white bg-white text-fg" : "border-fg/25",
                    )}
                  >
                    {on && <Icon name="check" className="size-3" />}
                  </span>
                  {o.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* ---- answer ---- */}
      <div
        aria-live="polite"
        aria-labelledby={`${uid}-result`}
        className={cn("flex flex-col bg-white p-6 sm:p-8", sq ? "border border-rule" : "rounded-[24px] border border-line")}
      >
        <p className="text-[14px] text-muted">Our read</p>
        <p
          id={`${uid}-result`}
          className={cn("mt-3 inline-flex w-fit items-center gap-2 px-3.5 py-2 text-[15px] font-medium", !sq && "rounded-full", level.tone)}
        >
          <span aria-hidden className={cn("size-2 rounded-full", level.dot)} />
          {level.label}
        </p>
        <p className="font-home mt-5 text-[21px] leading-[1.35] tracking-[-0.02em] text-fg">{level.line}</p>

        <dl className="mt-6 space-y-4 border-t border-line pt-5">
          <div>
            <dt className="text-[13px] text-muted">Most likely cause</dt>
            <dd className="mt-1 text-[15.5px] leading-[1.5] text-fg">{cause}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-muted">What it usually costs to fix</dt>
            <dd className="mt-1.5">
              <ul>
                {fixes.map((f) => (
                  <li key={f.label} className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-[14.5px] last:border-0">
                    <span className="text-fg">{f.label}</span>
                    <span className="shrink-0 tabular-nums text-fg">{f.range}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-2 pt-1 sm:flex-row lg:mt-auto">
          <Link
            href={`${bookHref}${bookHref.includes("?") ? "&" : "?"}problem=cracks`}
            className={cn(
              "inline-flex h-12 flex-1 items-center justify-center gap-2 bg-fg px-5 text-[15px] font-medium text-white transition-colors hover:bg-accent-strong",
              !sq && "rounded-full",
            )}
          >
            Book a free inspection
            <Icon name="arrowRight" className="size-4" />
          </Link>
          {phone && (
            <a
              href={phone.href}
              className={cn(
                "inline-flex h-12 items-center justify-center gap-2 bg-card px-5 text-[15px] font-medium text-fg transition-colors hover:bg-[#e6e6e6]",
                !sq && "rounded-full",
              )}
            >
              <Icon name="phone" className="size-4" />
              <span className="tabular-nums">{phone.display}</span>
            </a>
          )}
        </div>
        <p className="mt-4 text-[12.5px] leading-snug text-muted">
          A rule of thumb from what you told us, not an engineering assessment. The inspection is free and gives you the
          real answer in writing.
        </p>
      </div>
    </div>
  );
}
