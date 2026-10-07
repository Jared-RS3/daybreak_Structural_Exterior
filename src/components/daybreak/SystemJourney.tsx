"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SystemStep } from "@/lib/daybreak";
import { Icon } from "@/components/ui/Icon";
import { cn, newTab } from "@/lib/utils";
import { AxLabel, axButton, axTitle } from "./ax";

const pad = (i: number) => String(i + 1).padStart(2, "0");

/* Desktop geometry. The timeline and the stage pin together as one
   fixed-height frame, centred in the space under the 72px header:
     frame height  h   = min(100svh - 200px, 42rem)
     frame top         = 36px + 50svh - h/2
   Each step gets STEP_SVH of scroll while the frame is pinned. */
const stageH = "lg:h-[min(100svh_-_200px,42rem)]";
const stageTop = "lg:top-[calc(36px_+_50svh_-_min(50svh_-_100px,21rem))]";
const STEP_SVH = 55;

/**
 * The system in six steps, told by scrolling — kept deliberately quiet: each
 * step is a number, a title and one line, and the picture does the rest.
 *
 * Desktop: the heading scrolls by as normal, then the timeline (left) and
 * the stage (right) pin together while the section scrolls on underneath.
 * Scroll progress through the section picks the active step: the timeline
 * fills to it and opens its line, the stage shows its picture. Scrolling
 * back up past the start unpins it and it leaves with the section. Native
 * scrolling and CSS `position: sticky` (no scroll-jacking); the scroll
 * handler only runs while the section is on screen and only sets state when
 * the step changes.
 *
 * Phone: nothing pins. The steps become a sideways swipe — one card per step,
 * each with its panel scaled down — so the whole story fits in about one
 * screen instead of six. Scroll-snap does the swiping; dots and arrows show
 * where you are.
 *
 * The panels are illustrations (aria-hidden); the step text carries the
 * meaning. Clicking a step on the timeline scrolls to it.
 */
export function SystemJourney({
  label,
  title,
  titleId,
  lede,
  steps,
  scenes,
  end,
  live,
}: {
  label: string;
  title: React.ReactNode;
  titleId: string;
  lede: React.ReactNode;
  steps: SystemStep[];
  /** One pre-rendered panel per step, same order. */
  scenes: React.ReactNode[];
  end: { href: string; label: string };
  live?: { href: string; label: string };
}) {
  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState(0);
  const track = useRef<HTMLOListElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  const goTo = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };
  const onTrackScroll = () => {
    const el = track.current;
    if (!el) return;
    const w = (el.children[0] as HTMLElement | undefined)?.offsetWidth ?? el.clientWidth;
    setSlide(Math.min(steps.length - 1, Math.max(0, Math.round(el.scrollLeft / (w + 10)))));
  };

  /** How far the pinned frame is through its run, 0 to 1. */
  const pinned = () => {
    const r = row.current;
    const f = frame.current;
    if (!r || !f) return null;
    const top = parseFloat(getComputedStyle(f).top) || 0;
    const run = r.offsetHeight - f.offsetHeight;
    const box = r.getBoundingClientRect();
    return { top, run, box, progress: run > 0 ? Math.min(1, Math.max(0, (top - box.top) / run)) : 0 };
  };

  /** Desktop: scroll the page so step `i` is the active one. */
  const jumpTo = (i: number) => {
    const p = pinned();
    if (!p) return;
    const y = window.scrollY + p.box.top - p.top + ((i + 0.5) / steps.length) * p.run;
    window.scrollTo({ top: y, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  useEffect(() => {
    const r = row.current;
    if (!r || typeof IntersectionObserver === "undefined") return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = pinned();
      if (!p || !r.offsetHeight) return;
      setActive(Math.min(steps.length - 1, Math.floor(p.progress * steps.length)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // Only listen while the section is on screen.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true });
        update();
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    });
    io.observe(r);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [steps.length]);

  return (
    <div>
      {/* Above the heading's cover, so the hairline and label stay visible. */}
      <div className="relative z-20 flex justify-center border-t border-rule pt-6 lg:justify-start">
        <AxLabel>{label}</AxLabel>
      </div>

      <div className="mt-10 lg:mt-14">
        {/* ---- heading ---- */}
        <div className="mb-8 text-center lg:col-span-6 lg:mb-14 lg:text-left">
          <h2
            id={titleId}
            className={`${axTitle} text-fg`}
          >
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[17px] leading-[1.6] text-muted lg:mx-0 lg:max-w-lg">{lede}</p>
        </div>

        {/* ---- steps: phone swipe ---- */}
        <div className="lg:hidden">
          <ol
            ref={track}
            onScroll={onTrackScroll}
            aria-label="How it works, step by step"
            className="-mx-5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-5 px-5 pb-1 scrollbar-none sm:mx-0 sm:scroll-px-0 sm:px-0"
          >
            {steps.map((s, i) => (
              <li key={s.title} className="flex w-[86%] shrink-0 snap-start flex-col bg-white p-5 sm:w-[60%]">
                <p className="mono-label text-[12px] text-muted">
                  {pad(i)} / {pad(steps.length - 1)}
                </p>
                <h3 className="font-home mt-2 text-[1.9rem] font-normal leading-none tracking-[-0.03em] text-fg">{s.title}</h3>
                <p className="mt-2.5 text-[16px] leading-[1.5] text-muted">{s.body}</p>
                <div
                  aria-hidden
                  className="mt-4 flex h-[17.5rem] items-center justify-center overflow-hidden bg-panel-2 p-3"
                >
                  <div className="w-[34rem] shrink-0 [zoom:0.47] sm:[zoom:0.6] [&>*]:mx-auto">{scenes[i]}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1.5" aria-hidden>
              {steps.map((s, i) => (
                <span key={s.title} className={cn("h-1.5 transition-all duration-300", i === slide ? "w-6 bg-fg" : "w-1.5 bg-fg/20")} />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goTo(Math.max(0, slide - 1))}
                disabled={slide === 0}
                aria-label="Previous step"
                className="flex size-11 items-center justify-center bg-white text-fg disabled:opacity-35"
              >
                <Icon name="arrowRight" className="size-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => goTo(Math.min(steps.length - 1, slide + 1))}
                disabled={slide === steps.length - 1}
                aria-label="Next step"
                className="flex size-11 items-center justify-center bg-fg text-white disabled:opacity-35"
              >
                <Icon name="arrowRight" className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ---- desktop: timeline + stage, pinned together ---- */}
        <div
          ref={row}
          className="hidden lg:grid lg:grid-cols-12 lg:gap-x-10"
          style={{ height: `${steps.length * STEP_SVH}svh` }}
        >
          <div className="lg:col-span-5">
            <div ref={frame} className={cn("sticky flex flex-col justify-center", stageTop, stageH)}>
              <ol aria-label="How it works, step by step">
                {steps.map((s, i) => {
                  const done = i < active;
                  const on = i === active;
                  return (
                    <li key={s.title} className="relative pb-[min(1.75rem,2.6svh)] pl-[3.75rem] last:pb-0">
                      {/* The rail to the next step, filled once this one is done. */}
                      {i < steps.length - 1 && (
                        <span aria-hidden className="absolute bottom-0 left-[17.5px] top-10 w-[2px] bg-rule">
                          <span
                            className={cn(
                              "absolute inset-0 origin-top bg-fg transition-transform duration-500 ease-[var(--ease-out-expo)]",
                              done ? "scale-y-100" : "scale-y-0",
                            )}
                          />
                        </span>
                      )}
                      <span
                        aria-hidden
                        className={cn(
                          "mono-label absolute left-0 top-0.5 flex size-9 items-center justify-center text-[13px] transition-colors duration-300",
                          done ? "bg-fg text-white" : on ? "bg-sun text-fg" : "border border-rule bg-white text-muted",
                        )}
                      >
                        {done ? <Icon name="check" className="size-4.5" /> : pad(i)}
                      </span>
                      <button
                        type="button"
                        onClick={() => jumpTo(i)}
                        aria-current={on ? "step" : undefined}
                        className="block w-full text-left"
                      >
                        <h3
                          className={cn(
                            "font-home text-[clamp(1.75rem,min(2.9vw,5svh),2.75rem)] font-normal leading-[1.1] tracking-[-0.03em] transition-colors duration-300",
                            on ? "text-fg" : done ? "text-fg/55" : "text-fg/35 hover:text-fg/60",
                          )}
                        >
                          {s.title}
                        </h3>
                        <span
                          className={cn(
                            "grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)]",
                            on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                          )}
                        >
                          <span className="overflow-hidden">
                            <span className="block max-w-md pt-2.5 text-[clamp(1.1rem,1.4vw,1.3rem)] leading-[1.45] text-muted">{s.body}</span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className={cn("sticky flex flex-col bg-panel-2", stageTop, stageH)}>
              <div aria-hidden className="relative flex-1">
                {scenes.map((scene, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute inset-0 flex items-center justify-center p-6 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] xl:p-10",
                      i === active ? "opacity-100" : "pointer-events-none opacity-0",
                    )}
                    style={{ transform: i === active ? "none" : `translateY(${i < active ? -18 : 18}px)` }}
                  >
                    {scene}
                  </div>
                ))}
              </div>
              <p className="px-5 pb-4 text-[13px] text-muted">Example homeowner. Names and figures are illustrative.</p>
            </div>
          </div>
        </div>
      </div>

      {/* The end of the journey, and the ask. */}
      <div className="mt-10 flex flex-col items-start justify-between gap-5 bg-fg p-6 text-white sm:flex-row sm:items-center sm:p-8 lg:mt-16">
        <p className="font-home text-[clamp(1.5rem,2.4vw,2.1rem)] leading-[1.15] tracking-[-0.02em]">
          From a Google search to a signed job.
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link href={end.href} className={axButton("light")} {...newTab(end.href)}>
            {end.label}
          </Link>
          {live && (
            <Link href={live.href} className={axButton("lineLight")}>
              {live.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
