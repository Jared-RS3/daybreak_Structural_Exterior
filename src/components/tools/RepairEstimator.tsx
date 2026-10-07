"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { cn, newTab } from "@/lib/utils";
import { areas, categories, defaultQty, itemsById, priceEstimate, sceneImages, type Area, type Hotspot } from "@/lib/estimator";
import type { ToolLeadResult } from "@/lib/tool-lead";
import { AreaTag } from "./AreaTag";
import { HouseScene, scenes } from "./EstimatorScenes";
import { ToolLeadForm, ToolLeadSent } from "./ToolLeadForm";

/* ==========================================================================
   Instant repair estimate

   Two ways in, one estimate. The homeowner clicks the part of the house that
   worries them, looks inside and taps the problem they recognise; or ticks
   symptoms in the lists below. Either way the repair lands in the estimate
   with a size they can pick without a tape measure. The range unlocks once
   they've left their details, which is the lead: it's saved to Airtable and
   they're emailed the estimate as a PDF (ToolLeadForm → /api/tool-lead).
   Prices are sample figures (lib/estimator.ts).
   ========================================================================== */

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const still = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Where a label sits beside a point, kept inside the picture at the edges. */
function chipPos(p: { x: number; y: number }) {
  const below = p.y < 18;
  const tx = p.x < 16 ? "-14px" : p.x > 84 ? "calc(-100% + 14px)" : "-50%";
  const ty = below ? "18px" : "calc(-100% - 18px)";
  return { left: `${p.x}%`, top: `${p.y}%`, transform: `translate(${tx}, ${ty})` };
}

export function RepairEstimator({
  cta,
  focus,
}: {
  cta?: { href: string; label: string; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void };
  /** A section to open first, e.g. "siding" on the siding page. */
  focus?: string;
}) {
  const uid = useId();
  const [areaId, setAreaId] = useState<Area["id"] | null>(null);
  const [spot, setSpot] = useState<number | null>(null);
  /** Repair id → quantity. */
  const [picked, setPicked] = useState<Record<string, number>>({});
  // Every section starts closed, except the one a page asks to open first.
  const [chosen, setOpen] = useState<string[] | null>(null);
  const open = chosen ?? (focus ? [focus] : []);
  /** Repair id → the chosen option (e.g. siding material), by index. */
  const [variant, setVariant] = useState<Record<string, number>>({});
  const [help, setHelp] = useState<Record<string, "measure" | "exact" | undefined>>({});
  const [flash, setFlash] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "result">("form");
  const [sent, setSent] = useState<(ToolLeadResult & { email: string }) | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  /** The card a number opens: over the picture on wide layouts, under it on narrow ones. */
  const cardOver = useRef<HTMLDivElement>(null);
  const cardUnder = useRef<HTMLDivElement>(null);

  const area = areas.find((a) => a.id === areaId) ?? null;
  const Scene = area ? scenes[area.id] : HouseScene;
  const photo = sceneImages[area ? area.id : "house"];
  const active = area && spot !== null ? area.hotspots[spot] : null;

  const picks = Object.entries(picked).map(([id, qty]) => ({ id, qty, variant: variant[id] ?? 0 }));
  const { lines, low, high } = priceEstimate(picks);

  const toggle = (id: string) =>
    setPicked((cur) => {
      const next = { ...cur };
      if (id in next) delete next[id];
      else next[id] = defaultQty(itemsById[id]);
      return next;
    });
  const setQty = (id: string, qty: number) => setPicked((cur) => ({ ...cur, [id]: Math.max(1, Math.round(qty) || 1) }));

  /** From a hotspot: add the repair, open its list and bring it into view. */
  const price = (h: Hotspot) => {
    const item = itemsById[h.item];
    setPicked((cur) => (h.item in cur ? cur : { ...cur, [h.item]: defaultQty(item) }));
    setOpen(open.includes(item.category) ? open : [...open, item.category]);
    setSpot(null);
    setFlash(h.item);
    window.setTimeout(() => setFlash(null), 1800);
    requestAnimationFrame(() =>
      document.getElementById(`${uid}-${h.item}`)?.scrollIntoView({ block: "center", behavior: still() ? "auto" : "smooth" }),
    );
  };

  // A number opens its card; bring the card, and its "get pricing" button,
  // into view. Under the picture on a phone it would otherwise open below
  // the fold, and the tap would seem to do nothing. Already in view: no scroll.
  useEffect(() => {
    if (spot === null) return;
    const frame = requestAnimationFrame(() =>
      [cardOver.current, cardUnder.current]
        .find((el) => el && el.offsetParent !== null)
        ?.scrollIntoView({ block: "nearest", behavior: still() ? "auto" : "smooth" }),
    );
    return () => cancelAnimationFrame(frame);
  }, [areaId, spot]);

  const reset = () => {
    setPicked({});
    setVariant({});
    setAreaId(null);
    setSpot(null);
    setHelp({});
  };

  const reveal = () => {
    setStep("form");
    setSent(null);
    dialog.current?.showModal();
  };

  const marker = (on: boolean) =>
    cn(
      "flex size-7 items-center justify-center text-[12.5px] font-medium tabular-nums shadow-[0_4px_14px_-4px_rgb(0_0_0/0.5)] transition-colors",
      on ? "bg-sun text-fg" : "bg-fg text-white hover:bg-sun hover:text-fg",
    );
  // Each problem's name beside its number: tiny in the side window and on a
  // phone so it doesn't cover the photo, full size when the estimator is wide.
  const label =
    "mono-label pointer-events-none absolute z-10 whitespace-nowrap bg-fg px-1 py-0.5 text-[7px] text-white @xl:px-2 @xl:py-1 @xl:text-[10.5px]";

  return (
    // A container: everything below is laid out by the estimator's own
    // width, so it works in the small tools window and full screen alike.
    <div className="@container bg-card text-fg">
      {/* ---- Look inside ---- */}
      <div className="p-5 @xl:p-7">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[1.3rem] font-bold leading-tight tracking-[-0.02em] @xl:text-[1.85rem]">
            {area ? area.title : "Click an area to look inside"}
          </p>
          <p className="mt-1.5 text-[14px] leading-snug text-muted @xl:text-[15.5px]">
            {area ? "Tap a number to see what it means and get pricing." : "Step into the basement, crawl space, foundation and more, then get pricing."}
          </p>
          {area && (
            <button
              type="button"
              onClick={() => {
                setAreaId(null);
                setSpot(null);
              }}
              className="mono-label mt-3 inline-flex h-10 items-center gap-2 border border-fg/25 bg-white px-3.5 text-[12px] transition-colors hover:border-fg"
            >
              <Icon name="arrowRight" className="size-3.5 rotate-180" />
              Back to the house
            </button>
          )}
        </div>

        <div className="relative mt-4 aspect-[1000/560] border border-rule bg-white">
          {photo ? <Img src={photo.src} alt={photo.alt} sizes="100vw" /> : <Scene />}

          {!area &&
            areas.map((a, i) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAreaId(a.id)}
                aria-label={`Look inside: ${a.label}`}
                className="group absolute border-2 border-dashed border-sun/90 bg-sun/0 transition-colors hover:bg-sun/20 focus-visible:bg-sun/20"
                style={{ left: `${a.zone.x}%`, top: `${a.zone.y}%`, width: `${a.zone.w}%`, height: `${a.zone.h}%` }}
              >
                {/* Small type in the side window and on a phone, so the tags
                    name each area without covering the house. */}
                <AreaTag area={a} n={i + 1} scale="container" />
              </button>
            ))}

          {area &&
            area.hotspots.map((h, i) => {
              const on = spot === i || h.item in picked;
              return (
                <div key={h.label}>
                  <span className={label} style={chipPos(h)}>
                    {i + 1}. {h.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSpot(spot === i ? null : i)}
                    aria-expanded={spot === i}
                    aria-label={`${i + 1}. ${h.label}`}
                    className={cn(marker(on), "absolute z-20 -translate-x-1/2 -translate-y-1/2")}
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  >
                    {h.item in picked ? <Icon name="check" className="size-3.5" /> : i + 1}
                  </button>
                </div>
              );
            })}

          {active && (
            <div
              ref={cardOver}
              className="absolute z-30 hidden w-[17rem] -translate-x-1/2 @xl:block"
              style={{
                left: `clamp(8.75rem, ${active.x}%, calc(100% - 8.75rem))`,
                ...(active.y > 55 ? { bottom: `calc(${100 - active.y}% + 22px)` } : { top: `calc(${active.y}% + 22px)` }),
              }}
            >
              <SpotCard h={active} added={active.item in picked} onPrice={() => price(active)} onClose={() => setSpot(null)} />
            </div>
          )}
        </div>

        {/* Phones: the labels as a list, and the card under the picture. */}
        <ol className="mt-3 grid gap-1.5 @xl:hidden">
          {(area ? area.hotspots : areas).map((x, i) => {
            const on = area ? spot === i : false;
            return (
              <li key={x.label}>
                <button
                  type="button"
                  onClick={() => (area ? setSpot(spot === i ? null : i) : setAreaId((x as Area).id))}
                  className={cn("flex w-full items-center gap-3 bg-white px-3 py-2.5 text-left text-[14.5px]", on && "ring-2 ring-sun")}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center bg-fg text-[12px] text-white">{i + 1}</span>
                  {x.label}
                  {area && (x as Hotspot).item in picked && <Icon name="check" className="ml-auto size-4" />}
                </button>
              </li>
            );
          })}
        </ol>
        {active && (
          <div ref={cardUnder} className="mt-2 scroll-mb-4 @xl:hidden">
            <SpotCard h={active} added={active.item in picked} onPrice={() => price(active)} onClose={() => setSpot(null)} />
          </div>
        )}
      </div>

      {/* ---- Or by symptom ---- */}
      <div className="border-t border-rule p-5 @xl:p-7">
        <p className="text-[15.5px] font-medium">Or tell us your symptoms directly</p>
        <p className="mt-1 max-w-2xl text-[14px] text-muted">
          More than one problem? That&rsquo;s common. Check everything that applies, in any section, and the estimate adds it all up.
        </p>
        <p className="mt-3 flex items-start gap-2 bg-white px-3.5 py-2.5 text-[13.5px] leading-snug">
          <Icon name="ruler" className="mt-px size-4 shrink-0" />
          <span>
            <strong className="font-medium">You don&rsquo;t need exact measurements.</strong> Pick the closest size, or tap
            &ldquo;How do I measure this?&rdquo;
          </span>
        </p>

        <div className="mt-4 grid items-start gap-2 @4xl:grid-cols-2">
          {categories.map((c) => {
            const isOpen = open.includes(c.id);
            const count = c.items.filter((i) => i.id in picked).length;
            return (
              <div key={c.id} className={cn("border bg-white", count ? "border-fg" : "border-rule")}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${uid}-${c.id}`}
                  onClick={() => setOpen(isOpen ? open.filter((x) => x !== c.id) : [...open, c.id])}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center bg-card">
                    <Icon name={c.icon} className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15.5px] font-medium">{c.name}</span>
                    <span className="block text-[13px] text-muted">{c.sub}</span>
                  </span>
                  {count > 0 && <span className="mono-label bg-sun px-2 py-1 text-[11px]">{count} added</span>}
                  <Icon name="chevronDown" className={cn("size-4.5 shrink-0 transition-transform", isOpen && "rotate-180")} />
                </button>

                <div id={`${uid}-${c.id}`} hidden={!isOpen} className="border-t border-rule px-4 pb-2 pt-3">
                  <p className="text-[13.5px] text-muted">{c.intro}</p>
                  <ul className="mt-1">
                    {c.items.map((item) => {
                      const on = item.id in picked;
                      const qty = picked[item.id];
                      const tip = help[item.id];
                      return (
                        <li
                          key={item.id}
                          id={`${uid}-${item.id}`}
                          className={cn("scroll-mt-24 border-b border-rule py-3 transition-colors last:border-0", flash === item.id && "bg-sun/25")}
                        >
                          <label className="flex cursor-pointer items-start gap-3">
                            <input type="checkbox" checked={on} onChange={() => toggle(item.id)} className="peer sr-only" />
                            <span
                              aria-hidden
                              className={cn(
                                "mt-0.5 flex size-5 shrink-0 items-center justify-center border peer-focus-visible:ring-2 peer-focus-visible:ring-sun",
                                on ? "border-fg bg-fg text-white" : "border-fg/35 bg-white",
                              )}
                            >
                              {on && <Icon name="check" className="size-3.5" />}
                            </span>
                            <span>
                              <span className="block text-[14.5px] font-medium leading-snug">
                                {item.symptom} <span className="text-muted">&mdash;</span> {item.fix}
                              </span>
                              <span className="mt-0.5 block text-[13px] text-muted">{item.note}</span>
                            </span>
                          </label>

                          {on && (
                            <div className="ml-8 mt-3 bg-card p-3.5">
                              {item.options && (
                                <div className="mb-3.5">
                                  <p className="text-[13.5px] font-medium">{item.options.question}</p>
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    {item.options.choices.map((o, k) => {
                                      const sel = (variant[item.id] ?? 0) === k;
                                      return (
                                        <button
                                          key={o.label}
                                          type="button"
                                          aria-pressed={sel}
                                          onClick={() => setVariant((v) => ({ ...v, [item.id]: k }))}
                                          className={cn(
                                            "min-h-9 px-3 text-[13px] transition-colors",
                                            sel ? "bg-fg text-white" : "bg-white hover:bg-[#e6e6e6]",
                                          )}
                                        >
                                          {o.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                              {item.sizes && (
                                <>
                                  <p className="text-[13.5px] font-medium">{item.question}</p>
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    {item.sizes.map((s) => (
                                      <button
                                        key={s.label}
                                        type="button"
                                        aria-pressed={qty === s.qty}
                                        onClick={() => setQty(item.id, s.qty)}
                                        className={cn(
                                          "min-h-9 px-3 text-[13px] transition-colors",
                                          qty === s.qty ? "bg-fg text-white" : "bg-white hover:bg-[#e6e6e6]",
                                        )}
                                      >
                                        {s.label}
                                        {!/\(/.test(s.label) && ` (${s.qty})`}
                                      </button>
                                    ))}
                                  </div>
                                  {tip === "exact" && (
                                    <label className="mt-2.5 flex items-center gap-2 text-[13px]">
                                      Exact number of {item.unit}
                                      <input
                                        type="number"
                                        min={1}
                                        inputMode="numeric"
                                        value={qty}
                                        onChange={(e) => setQty(item.id, Number(e.target.value))}
                                        className="h-9 w-24 border border-rule bg-white px-2 tabular-nums"
                                      />
                                    </label>
                                  )}
                                  {tip === "measure" && item.measure && (
                                    <p className="mt-2.5 text-[13px] leading-snug text-muted">{item.measure}</p>
                                  )}
                                </>
                              )}
                              <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px]", item.sizes && "mt-2.5")}>
                                {item.measure && (
                                  <button
                                    type="button"
                                    onClick={() => setHelp((h) => ({ ...h, [item.id]: tip === "measure" ? undefined : "measure" }))}
                                    className="underline underline-offset-4"
                                  >
                                    How do I measure this?
                                  </button>
                                )}
                                {item.sizes && (
                                  <button
                                    type="button"
                                    onClick={() => setHelp((h) => ({ ...h, [item.id]: tip === "exact" ? undefined : "exact" }))}
                                    className="underline underline-offset-4"
                                  >
                                    Enter exact number
                                  </button>
                                )}
                                <span className="ml-auto flex items-center gap-1 text-[#1d6b3f]">
                                  <Icon name="check" className="size-3.5" />
                                  Added
                                </span>
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- The estimate, always in reach ---- */}
      <div className="sticky bottom-0 z-40 flex flex-col gap-2.5 border-t-[3px] border-sun bg-white px-4 py-3 shadow-[0_-12px_30px_-18px_rgb(0_0_0/0.5)] @xl:flex-row @xl:items-center @xl:justify-between @xl:gap-3 @xl:px-7 @xl:py-4">
        <div aria-live="polite">
          <p className="mono-label hidden text-[11px] text-muted @xl:block">Your instant ballpark estimate</p>
          <p className="text-[14px] font-medium @xl:mt-1 @xl:text-[14.5px]">
            {lines.length
              ? `Your estimate is ready: ${lines.length} ${lines.length === 1 ? "repair" : "repairs"}.`
              : "Pick an area or tick a symptom to start."}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={!lines.length && !area}
            className="mono-label h-11 whitespace-nowrap border border-fg/25 px-4 text-[12px] transition-colors hover:border-fg disabled:opacity-40"
          >
            Start over
          </button>
          <button
            type="button"
            onClick={reveal}
            disabled={!lines.length}
            className="mono-label inline-flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap bg-fg px-4 text-[12px] text-white transition-colors hover:bg-[#333] disabled:opacity-40 @xl:flex-none @xl:px-5"
          >
            See my <span className="hidden @xl:inline">instant</span> estimate
            <Icon name="arrowRight" className="size-4" />
          </button>
        </div>
      </div>
      <p className="px-5 py-4 text-[12.5px] leading-snug text-muted @xl:px-7">
        A ballpark only, from typical projects and what you told us. The exact price comes from a free in-person
        inspection: soil, access, depth and how far the problem has gone all change it. Sample prices for a demo company;
        your site uses yours.
      </p>

      {/* ---- Details first, then the number ---- */}
      <dialog
        ref={dialog}
        aria-labelledby={`${uid}-dialog`}
        className="m-auto w-[calc(100%-2rem)] max-w-md border-t-[3px] border-sun bg-white p-0 text-fg backdrop:bg-black/60"
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <p id={`${uid}-dialog`} className="font-home text-[1.6rem] leading-tight tracking-[-0.02em]">
              {step === "form" ? "See your instant estimate" : "Your ballpark estimate"}
            </p>
            <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="-mr-2 -mt-1 p-2">
              <Icon name="close" className="size-5" />
            </button>
          </div>

          {step === "form" ? (
            <div className="mt-3">
              <p className="mb-5 text-[14.5px] leading-[1.55] text-muted">
                Enter your details to see your ballpark range now. We&rsquo;ll email you a PDF copy, and a specialist
                follows up to confirm it at your free, no-obligation inspection.
              </p>
              <ToolLeadForm
                tool="estimate"
                payload={() => ({ picks })}
                submitLabel="Show my instant estimate"
                onDone={(r) => {
                  setSent(r);
                  setStep("result");
                }}
              />
            </div>
          ) : (
            <div className="mt-4">
              <p className="font-home text-[2.4rem] leading-none tracking-[-0.03em] tabular-nums">
                {usd(low)} &ndash; {usd(high)}
              </p>
              <ul className="mt-5 border-t border-rule">
                {lines.map((l) => (
                  <li key={l.item.id} className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5 text-[14px]">
                    <span>
                      {l.item.fix}
                      {l.choice && ` (${l.choice})`}
                      <span className="text-muted">{l.item.unit ? `, ${l.qty.toLocaleString("en-US")} ${l.item.unit}` : ""}</span>
                    </span>
                    <span className="shrink-0 tabular-nums">
                      {usd(l.low)} &ndash; {usd(l.high)}
                    </span>
                  </li>
                ))}
              </ul>
              {sent && <ToolLeadSent result={sent} className="mt-4" />}
              <p className="mt-4 text-[13px] leading-snug text-muted">
                A ballpark from sample prices, not a quote. The free inspection gives you the real number in writing.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                {cta && (
                  <a
                    href={cta.href}
                    {...newTab(cta.href)}
                    onClick={(e) => {
                      dialog.current?.close();
                      cta.onClick?.(e);
                    }}
                    className="mono-label inline-flex h-12 items-center justify-center whitespace-nowrap bg-fg px-5 text-[12.5px] text-white transition-colors hover:bg-[#333] sm:flex-1"
                  >
                    {cta.label}
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => dialog.current?.close()}
                  className="mono-label h-12 whitespace-nowrap border border-fg/25 px-5 text-[12.5px] transition-colors hover:border-fg"
                >
                  Back to the estimate
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}

function SpotCard({ h, added, onPrice, onClose }: { h: Hotspot; added: boolean; onPrice: () => void; onClose: () => void }) {
  return (
    <div className="border-t-[3px] border-sun bg-white p-4 text-left shadow-[0_18px_40px_-16px_rgb(0_0_0/0.45)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[14.5px] font-medium leading-snug">{h.title}</p>
        <button type="button" onClick={onClose} aria-label="Close" className="-mr-1.5 -mt-1 p-1.5">
          <Icon name="close" className="size-4" />
        </button>
      </div>
      <p className="mt-1.5 text-[13.5px] leading-snug text-muted">{h.body}</p>
      <button
        type="button"
        onClick={onPrice}
        className="mono-label mt-3 inline-flex h-10 w-full items-center justify-center gap-2 bg-fg text-[11.5px] text-white transition-colors hover:bg-[#333]"
      >
        {added ? "Added: see it below" : "Get pricing"}
        <Icon name="arrowRight" className="size-3.5" />
      </button>
    </div>
  );
}
