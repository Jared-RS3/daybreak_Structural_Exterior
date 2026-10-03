"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { axButton, axCardTitle } from "./ax";

export type WorkItem = {
  id: string;
  name: string;
  trade: string;
  domain: string;
  kind: "live" | "concept";
  blurb: string;
  /** What runs behind the design, shown small under the blurb. */
  behind?: string[];
  href?: string;
};

/** How long each site holds before the showcase moves on to the next. */
const HOLD_MS = 8000;

function mediaStore(query: string) {
  return {
    subscribe(onChange: () => void) {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    get: () => window.matchMedia(query).matches,
    server: () => false,
  };
}
const phone = mediaStore("(max-width: 639px)");
const motionOk = mediaStore("(prefers-reduced-motion: no-preference)");

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The work showcase: a row of tabs (one per site), a browser frame showing
 * the selected site, and a panel describing it. A proper ARIA tablist —
 * arrow keys move between sites. The previews are server-rendered and passed
 * in as `previews`, one per item, so none of the image pipeline ships to the
 * client. Only the active preview is mounted.
 *
 * So nobody mistakes the first site for the only one, the showcase moves on
 * by itself while the preview is on screen: the active tab's rule fills as a
 * countdown (a composited `scale` animation), then the next site opens, and
 * on a phone the tab strip slides to keep it in view. The browser bar counts
 * the sites and carries a pause control. Any click inside the showcase — a
 * tab, "Next site", the panel — hands control to the visitor; keyboard focus
 * holds it. Never runs under reduced motion.
 */
export function WorkTabs({
  items,
  previews,
  offerHref,
  mobileOrder,
}: {
  items: WorkItem[];
  previews: React.ReactNode[];
  offerHref: string;
  /** Tab order on phones, by item id. Defaults to the order of `items`. */
  mobileOrder?: string[];
}) {
  const onPhone = useSyncExternalStore(
    phone.subscribe,
    phone.get,
    phone.server,
  );
  const canPlay = useSyncExternalStore(
    motionOk.subscribe,
    motionOk.get,
    motionOk.server,
  );

  /** Display order, as indices into `items`. */
  const order = useMemo(() => {
    const byId = mobileOrder
      ?.map((id) => items.findIndex((it) => it.id === id))
      .filter((i) => i >= 0);
    return onPhone && byId?.length === items.length
      ? byId
      : items.map((_, i) => i);
  }, [onPhone, items, mobileOrder]);

  // `picked` is an index into `items`; until the visitor or the timer picks
  // one, the first tab in the current order is showing.
  const [picked, setPicked] = useState<number | null>(null);
  const [mode, setMode] = useState<"auto" | "paused" | "manual">("auto");
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const strip = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const countdown = useRef<Animation | null>(null);
  const uid = useId();

  const current = picked ?? order[0];
  const pos = order.indexOf(current);
  const item = items[current];
  /** One site (a trade page with a single concept): no tabs, arrows or timer. */
  const single = items.length === 1;
  const timed = canPlay && mode !== "manual" && !single;
  const running = timed && mode === "auto" && inView && !held;

  /** Only count down while the preview itself is on screen. */
  useEffect(() => {
    const el = stage.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const bar = bars.current[current];
    if (!timed || !bar || typeof bar.animate !== "function") return;
    const anim = bar.animate([{ scale: "0 1" }, { scale: "1 1" }], {
      duration: HOLD_MS,
      easing: "linear",
      fill: "both",
    });
    anim.pause();
    anim.onfinish = () =>
      setPicked(order[(order.indexOf(current) + 1) % order.length]);
    countdown.current = anim;
    return () => {
      anim.cancel();
      countdown.current = null;
    };
  }, [current, timed, order]);

  useEffect(() => {
    const anim = countdown.current;
    if (!anim) return;
    if (running) anim.play();
    else anim.pause();
  }, [running, current, timed, order]);

  /** Keep the active tab in view inside the strip when it scrolls (phones). */
  useEffect(() => {
    const box = strip.current;
    const tab = tabs.current[current];
    if (!box || !tab || box.scrollWidth <= box.clientWidth) return;
    const b = box.getBoundingClientRect();
    const t = tab.getBoundingClientRect();
    box.scrollBy({
      left: t.left - b.left - (b.width - t.width) / 2,
      behavior: canPlay ? "smooth" : "auto",
    });
  }, [current, canPlay]);

  /** The visitor chose a site: show it and stop moving on by itself. */
  const choose = (i: number) => {
    setPicked(i);
    setMode("manual");
  };

  const go = (p: number) => {
    const i = order[(p + order.length) % order.length];
    choose(i);
    tabs.current[i]?.focus();
  };

  return (
    <div
      onClick={() => setMode("manual")}
      onFocus={(e) => (e.target as Element) !== toggle.current && setHeld(true)}
      onBlur={(e) =>
        !e.currentTarget.contains(e.relatedTarget as Node | null) &&
        setHeld(false)
      }
    >
      <div
        ref={strip}
        className={cn("-mx-5 overflow-x-auto px-5 scrollbar-none sm:mx-0 sm:px-0", single && "hidden")}
      >
        <div
          role="tablist"
          aria-label="Sites"
          className="flex w-max gap-px bg-rule sm:w-full"
        >
          {order.map((i, p) => {
            const it = items[i];
            return (
              <button
                key={it.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`${uid}-t${i}`}
                role="tab"
                type="button"
                aria-selected={i === current}
                aria-controls={`${uid}-panel`}
                tabIndex={i === current ? 0 : -1}
                onClick={() => choose(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") go(p + 1);
                  if (e.key === "ArrowLeft") go(p - 1);
                }}
                className={cn(
                  "relative flex min-w-[11rem] flex-1 flex-col items-start gap-1 px-4 py-4 text-left transition-colors sm:px-5",
                  i === current ? "bg-white" : "bg-panel hover:bg-white/70",
                )}
              >
                <span className="mono-label flex items-center gap-2 text-[12px] text-muted">
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5",
                      it.kind === "live"
                        ? "rounded-full bg-[#2f9e5b]"
                        : "bg-[#b9b9be]",
                    )}
                  />
                  {it.kind === "live" ? "Live build" : `${pad(p + 1)}`}
                </span>
                <span className="font-home text-[17px] tracking-[-0.01em] text-fg">
                  {it.name}
                </span>
                <span
                  ref={(el) => {
                    bars.current[i] = el;
                  }}
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-[2px] origin-left bg-sun transition-transform duration-500",
                    i === current && !timed ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-t${current}`}
        className="mt-2.5 overflow-hidden bg-panel-2 px-3 pb-10 pt-8 sm:px-6 sm:pt-12 lg:pb-14"
      >
        {/* The previews are drawn illustrations and hidden from screen
            readers; this is what they show, in words. */}
        <p className="sr-only">
          {item.name}. {item.kind === "live" ? "Live site" : "Concept"} for {item.trade.toLowerCase()}. {item.blurb}
          {item.behind && ` Behind the site: ${item.behind.join(", ")}.`}
        </p>

        {/* ---- Coverflow: the chosen site large in the middle, its
            neighbours smaller, tilted and faded at either side. Only
            transform and opacity animate. ---- */}
        <div ref={stage} className="relative aspect-[16/12] sm:aspect-[16/8.2] lg:aspect-[16/7.2]">
          <p
            key={item.id + "-word"}
            aria-hidden
            className="font-home pointer-events-none absolute inset-x-0 top-[2%] animate-[panel-in_0.8s_var(--ease-out-expo)_both] select-none text-center font-semibold uppercase leading-none tracking-[-0.05em] text-fg/[0.07]"
          >
            <span style={{ fontSize: `min(12.5rem, ${Math.min(13, 96 / item.name.split(" ")[0].length)}vw)` }}>
              {item.name.split(" ")[0]}
            </span>
          </p>

          {order.map((i, p) => {
            const it = items[i];
            let d = p - pos;
            if (d > order.length / 2) d -= order.length;
            if (d < -order.length / 2) d += order.length;
            const abs = Math.abs(d);
            const center = d === 0;
            return (
              <button
                key={it.id}
                type="button"
                tabIndex={-1}
                aria-hidden
                disabled={center}
                onClick={() => choose(i)}
                className={cn(
                  "absolute left-1/2 top-[8%] w-[86%] origin-center text-left transition-[transform,opacity] duration-700 ease-[var(--ease-out-expo)] sm:w-[62%] lg:w-[56%]",
                  center ? "z-30 cursor-default" : abs === 1 ? "z-20 cursor-pointer" : "z-10",
                )}
                style={{
                  transform: `translateX(calc(-50% + ${d * (onPhone ? 70 : 78)}%)) scale(${center ? 1 : abs === 1 ? 0.64 : 0.45}) rotate(${center ? 0 : d > 0 ? 4 : -4}deg)`,
                  opacity: center ? 1 : abs === 1 ? 0.45 : 0,
                }}
              >
                <span
                  className={cn(
                    "block overflow-hidden border border-rule bg-white transition-shadow duration-700",
                    center ? "shadow-[0_40px_80px_-40px_rgb(0_0_0/0.55)]" : "shadow-none",
                  )}
                >
                  <span className="flex items-center gap-1.5 border-b border-rule px-3.5 py-2">
                    <span className="size-2.5 rounded-full bg-[#d6d6db]" />
                    <span className="size-2.5 rounded-full bg-[#d6d6db]" />
                    <span className="size-2.5 rounded-full bg-[#d6d6db]" />
                    <span className="mono-label ml-3 min-w-0 flex-1 truncate text-[12px] text-muted">{it.domain}</span>
                    {it.kind === "concept" && (
                      <span className="mono-label shrink-0 bg-[#fbf0d3] px-2 py-0.5 text-[11px] text-[#6a5200]">Concept</span>
                    )}
                  </span>
                  <span className="block">{previews[i]}</span>
                </span>
              </button>
            );
          })}

          {!single && (
          <button
            type="button"
            onClick={() => go(pos - 1)}
            aria-label="Previous site"
            className="absolute left-0 top-1/2 z-40 hidden sm:flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-fg shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)] transition-colors hover:bg-panel sm:left-2 sm:size-14"
          >
            <Icon name="arrowRight" className="size-4 rotate-180" />
          </button>
          )}
          {!single && (
          <button
            type="button"
            onClick={() => go(pos + 1)}
            aria-label="Next site"
            className="absolute right-0 top-1/2 z-40 hidden sm:flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-fg shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)] transition-colors hover:bg-panel sm:right-2 sm:size-14"
          >
            <Icon name="arrowRight" className="size-4" />
          </button>
          )}
        </div>

        {/* ---- The chosen site, in words ---- */}
        <div key={item.id + "-info"} className="mx-auto mt-4 max-w-xl animate-[panel-in_0.6s_var(--ease-out-expo)_both] text-center sm:mt-6">
          <p className="mono-label flex items-center justify-center gap-3 text-[12.5px] text-muted">
            {single ? (
              <span>{item.trade}</span>
            ) : (
            <>
            <button type="button" onClick={() => go(pos - 1)} aria-label="Previous site" className="flex size-9 items-center justify-center rounded-full bg-white text-fg sm:hidden">
              <Icon name="arrowRight" className="size-3.5 rotate-180" />
            </button>
            <span className="max-sm:hidden">{item.trade}</span>
            <span aria-hidden className="text-rule max-sm:hidden">/</span>
            <span className="text-fg">
              {pad(pos + 1)}
              <span className="text-muted"> / {pad(order.length)}</span>
            </span>
            {canPlay && (
              <button
                ref={toggle}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMode(mode === "auto" ? "paused" : "auto");
                  setHeld(false);
                }}
                aria-label={mode === "auto" ? "Pause the showcase" : "Play the showcase"}
                className="-my-1 flex size-7 items-center justify-center text-fg transition-colors hover:bg-white"
              >
                {mode === "auto" ? (
                  <span aria-hidden className="flex h-2.5 gap-[3px]">
                    <span className="w-[3px] bg-current" />
                    <span className="w-[3px] bg-current" />
                  </span>
                ) : (
                  <Icon name="play" filled className="size-3" />
                )}
              </button>
            )}
            <button type="button" onClick={() => go(pos + 1)} aria-label="Next site" className="flex size-9 items-center justify-center rounded-full bg-white text-fg sm:hidden">
              <Icon name="arrowRight" className="size-3.5" />
            </button>
            </>
            )}
          </p>
          <h3 className={`${axCardTitle} mt-3 text-fg`}>
            {item.name}
          </h3>
          <p className="mt-3 text-[17px] leading-[1.6] text-muted">{item.blurb}</p>
          {item.behind && (
            <p aria-hidden className="mono-label mt-4 text-[11.5px] leading-[1.6] text-muted">
              <span className="text-fg">Behind the site:</span> {item.behind.join(" · ")}
            </p>
          )}
          <div className="mt-7 flex justify-center">
            {item.href ? (
              <Link href={item.href} className={axButton("dark")}>
                Open the live site
              </Link>
            ) : (
              <Link href={offerHref} className={axButton("dark")}>
                Get a site like this
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
