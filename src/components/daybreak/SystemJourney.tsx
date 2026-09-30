"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SystemStep } from "@/lib/daybreak";
import { cn } from "@/lib/utils";
import { AxLabel, axButton } from "./ax";

const pad = (i: number) => String(i + 1).padStart(2, "0");

/* Desktop geometry. The stage is a fixed-height frame centred in the space
   under the 72px header; the heading pins level with the stage's top edge.
     stage height  h   = min(100svh - 200px, 42rem)
     stage top         = 36px + 50svh - h/2
     cover above head  = stage top - 72px (hides steps sliding up under it)
   `release` shortens the heading's track so it unpins with the stage rather
   than after it: h minus roughly the heading's own height. */
const stageH = "lg:h-[min(100svh_-_200px,42rem)]";
const stageTop = "lg:top-[calc(36px_+_50svh_-_min(50svh_-_100px,21rem))]";
const cover = "lg:before:h-[calc(50svh_-_36px_-_min(50svh_-_100px,21rem))]";
const release = "lg:mb-[calc(min(100svh_-_200px,42rem)_-_11rem)]";

/**
 * The system in six steps, told by scrolling — kept deliberately quiet: each
 * step is a number, a title and one line, and the picture does the rest.
 *
 * Desktop: the section heading pins at the top of the left column so it stays
 * in view; the steps scroll beneath it; on the right a sticky stage, centred
 * on screen, shows what the site is doing at that step. Native scrolling (no
 * scroll-jacking), CSS `position: sticky`, an IntersectionObserver for the
 * active step, and the stage changes only opacity and transform.
 *
 * Phone: nothing pins. The heading sits on top and each step carries its own
 * panel inline, in order.
 *
 * The panels are illustrations (aria-hidden); the step text carries the
 * meaning. The section around this needs `overflow-clip` so the heading's
 * cover can't reach into the section above on very tall screens.
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
  live: { href: string; label: string };
}) {
  const [active, setActive] = useState(0);
  const blocks = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    // A thin band two-thirds of the way down the viewport: whichever step
    // crosses it is the active one. Lower than the middle because the pinned
    // heading covers the top of the screen; with 45svh steps, a step's text
    // stays in the open space between the heading and the bottom edge for as
    // long as it's the active one.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-66% 0px -32% 0px" },
    );
    blocks.current.forEach((b) => b && io.observe(b));
    return () => io.disconnect();
  }, []);

  return (
    <div>
      {/* Above the heading's cover, so the hairline and label stay visible. */}
      <div className="relative z-20 flex justify-center border-t border-rule pt-6 lg:justify-start">
        <AxLabel>{label}</AxLabel>
      </div>

      <div className="mt-10 lg:mt-14 lg:grid lg:grid-cols-12 lg:gap-x-10">
        {/* ---- heading: pinned on desktop ---- */}
        <div className={cn("relative z-10 mb-14 lg:pointer-events-none lg:col-span-5 lg:col-start-1 lg:row-start-1", release)}>
          <div
            className={cn(
              "text-center lg:pointer-events-auto lg:sticky lg:bg-panel lg:pb-4 lg:text-left",
              stageTop,
              "lg:before:absolute lg:before:inset-x-0 lg:before:bottom-full lg:before:bg-panel",
              cover,
              "lg:after:absolute lg:after:inset-x-0 lg:after:top-full lg:after:h-8 lg:after:bg-linear-to-b lg:after:from-panel lg:after:to-transparent",
            )}
          >
            <h2
              id={titleId}
              className="font-home text-[clamp(2.2rem,4.2vw,3.6rem)] font-normal leading-[1.06] tracking-[-0.03em] text-fg lg:text-[clamp(2.2rem,3.75vw,3.4rem)]"
            >
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[17px] leading-[1.6] text-muted lg:mx-0 lg:max-w-lg">
              {lede}
            </p>
          </div>
        </div>

        {/* ---- steps ---- */}
        <ol className="lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:pt-20">
          {steps.map((s, i) => (
            <li
              key={s.title}
              ref={(el) => {
                blocks.current[i] = el;
              }}
              data-step={i}
              className="mb-2.5 bg-white p-6 sm:p-8 lg:mb-0 lg:flex lg:min-h-[45svh] lg:items-center lg:bg-transparent lg:p-0"
            >
              <div
                className={cn(
                  "w-full transition-opacity duration-500",
                  // Done steps fade out entirely as they slide under the
                  // heading; the next ones wait at 30%.
                  i === active ? "lg:opacity-100" : i < active ? "lg:opacity-0" : "lg:opacity-30",
                )}
              >
                <p className="mono-label text-[13px] text-muted">{pad(i)}</p>
                <h3 className="font-home mt-3 text-[clamp(2.1rem,3.2vw,2.9rem)] font-normal leading-none tracking-[-0.03em] text-fg">
                  {s.title}
                </h3>
                <p className="mt-4 max-w-md text-[18px] leading-[1.55] text-muted lg:text-[20px]">{s.body}</p>

                {/* Phone: the step's panel, inline. */}
                <div aria-hidden className="mt-6 flex justify-center bg-panel-2 p-3 sm:p-5 lg:hidden">
                  {scenes[i]}
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* ---- sticky stage (desktop) ---- */}
        <div className="hidden lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:block">
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

      {/* The end of the journey, and the ask. */}
      <div className="mt-10 flex flex-col items-start justify-between gap-5 bg-fg p-6 text-white sm:flex-row sm:items-center sm:p-8 lg:mt-16">
        <p className="font-home text-[clamp(1.5rem,2.4vw,2.1rem)] leading-[1.15] tracking-[-0.02em]">
          From a Google search to a signed job.
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link href={end.href} className={axButton("light")}>
            {end.label}
          </Link>
          <Link href={live.href} className={axButton("lineLight")}>
            {live.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
