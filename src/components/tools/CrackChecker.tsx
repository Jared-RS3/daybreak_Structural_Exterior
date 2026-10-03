"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { assess, pattern, signs, where, width, type PatternId, type SignId, type WhereId, type WidthId } from "@/lib/crack-check";
import type { ToolLeadResult } from "@/lib/tool-lead";
import { cn } from "@/lib/utils";
import { ToolLeadForm, ToolLeadSent } from "./ToolLeadForm";

/* ==========================================================================
   Crack & symptom checker

   The question every foundation lead starts with is "is this serious?". Four
   taps answer it well enough to decide what to do next: where the crack is,
   what it looks like, how wide it is, and what else the house is doing. The
   answer is a severity, the usual cause, and what a fix typically costs —
   then the button that books the right visit.

   The answer appears as they tap, in the browser (lib/crack-check.ts holds
   the scoring). To keep it, they leave their details and get the report as
   a PDF by email; that's the lead, saved to Airtable (ToolLeadForm →
   /api/tool-lead). The scoring is a triage rule of thumb for a demo, not an
   engineering assessment, and the result says so.
   ========================================================================== */

export function CrackChecker({
  bookHref,
  phone,
  shape = "round",
  className,
}: {
  /** Where "book an inspection" goes. The severity is added as a query. */
  /** Where "Book a free inspection" goes. Without it the button isn't shown. */
  bookHref?: string;
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

  const answers = { where: w, pattern: p, width: wd, signs: s };
  const { level, cause, fixes } = assess(answers);
  // The report they asked for, and the answers it was for: change an answer
  // and they can send the new one.
  const [asking, setAsking] = useState(false);
  const [sent, setSent] = useState<{ key: string; result: ToolLeadResult & { email: string } } | null>(null);
  const key = JSON.stringify(answers);
  const sentNow = sent?.key === key ? sent.result : null;
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
    // Laid out by its own width (a container query), so it works in the
    // small tools window and full screen alike.
    <div className={cn("@container", className)}>
    <div className="grid gap-2 @4xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] @4xl:gap-2.5">
      {/* ---- questions ---- */}
      <div className={cn("space-y-7 bg-card p-5 @lg:p-7", !sq && "rounded-[24px]")}>
        <fieldset>
          {question(1, "Where is the crack?")}
          <div className="mt-3 grid gap-1.5 @lg:grid-cols-2">
            {where.map((o) => (
              <button key={o.id} type="button" aria-pressed={w === o.id} onClick={() => setW(o.id)} className={chip(w === o.id)}>
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          {question(2, "What does it look like?")}
          <div className="mt-3 grid gap-1.5 @lg:grid-cols-2">
            {pattern.map((o) => (
              <button key={o.id} type="button" aria-pressed={p === o.id} onClick={() => setP(o.id)} className={chip(p === o.id)}>
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          {question(3, "How wide is it at the widest point?")}
          <div className="mt-3 grid gap-1.5 @lg:grid-cols-2">
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
        className={cn("flex flex-col bg-white p-6 @lg:p-8", sq ? "border border-rule" : "rounded-[24px] border border-line")}
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

        <div className="mt-6 flex flex-col gap-2 pt-1 @lg:flex-row @4xl:mt-auto">
          {bookHref && (
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
          )}
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
        <div className="mt-5 border-t border-line pt-5">
          {sentNow ? (
            <ToolLeadSent result={sentNow} />
          ) : asking ? (
            <>
              <p className="mb-4 text-[15px] font-medium text-fg">Get this report as a PDF</p>
              <ToolLeadForm
                tool="crack"
                payload={() => ({ answers })}
                submitLabel="Email me the report"
                onDone={(result) => {
                  setSent({ key, result });
                  setAsking(false);
                }}
              />
            </>
          ) : (
            <button
              type="button"
              onClick={() => setAsking(true)}
              className={cn(
                "inline-flex h-12 w-full items-center justify-center gap-2 border border-fg/25 px-5 text-[15px] font-medium text-fg transition-colors hover:border-fg",
                !sq && "rounded-full",
              )}
            >
              <Icon name="document" className="size-4" />
              Email me this report
            </button>
          )}
        </div>
        <p className="mt-4 text-[12.5px] leading-snug text-muted">
          A rule of thumb from what you told us, not an engineering assessment. The inspection is free and gives you the
          real answer in writing.
        </p>
      </div>
    </div>
    </div>
  );
}
