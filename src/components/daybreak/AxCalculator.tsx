"use client";

import { useId, useState } from "react";
import type { CalculatorTrade } from "@/lib/daybreak";
import { cn } from "@/lib/utils";
import { AxButton, AxHead, AxLabel } from "./ax";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const one = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

const MONTHS = 12;
/** Months a new site takes to reach the visitor's goal; earlier months count pro rata. */
const RAMP_MONTHS = 3;

/**
 * The value calculator: a contractor's own numbers in, what a few extra
 * leads a month add up to over a year out.
 *
 * Every figure is arithmetic on what the visitor set. The only assumption is
 * the three month ramp, and it makes the total smaller, not larger. The extra
 * leads are the visitor's goal, never a number we promise.
 *
 * The chart is a running total, month by month, drawn with scaleY so a drag
 * only touches transforms.
 */
export function AxCalculator({ trades, offerHref }: { trades: CalculatorTrade[]; offerHref: string }) {
  const [trade, setTrade] = useState(trades[0]);
  const [leads, setLeads] = useState(25);
  const [jobValue, setJobValue] = useState(trades[0].jobValue);
  const [close, setClose] = useState(30);
  const [extra, setExtra] = useState(5);

  const rate = close / 100;
  const extraJobs = extra * rate;
  const fullMonth = extraJobs * jobValue;
  const running: number[] = [];
  for (let m = 1; m <= MONTHS; m++) {
    running.push((running.at(-1) ?? 0) + fullMonth * Math.min(1, m / RAMP_MONTHS));
  }
  const firstYear = running[MONTHS - 1];
  const jobsNow = Math.round(leads * rate * 12);
  const jobsNew = Math.round((leads + extra) * rate * 12);

  return (
    <section id="calculator" aria-labelledby="calculator-title" className="scroll-mt-20 bg-white py-20 sm:py-24 lg:py-28">
      <div className="container-wide">
        <AxHead
          id="calculator-title"
          label="Value calculator"
          title={
            <>
              What could a better
              <br className="hidden sm:block" /> website be worth?
            </>
          }
          lede="Move the sliders to match your business. You'll see what a few more leads a month could add up to over a year."
        />

        <div className="mt-14 grid gap-2.5 lg:mt-16 lg:grid-cols-12">
          {/* ---- Inputs ---- */}
          <div className="bg-panel p-6 sm:p-8 lg:col-span-5 lg:p-10">
            <AxLabel>Your business</AxLabel>
            <div role="group" aria-label="Your trade" className="mt-6 flex flex-wrap gap-1.5">
              {trades.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  aria-pressed={trade.name === t.name}
                  onClick={() => {
                    setTrade(t);
                    setJobValue(t.jobValue);
                  }}
                  className={cn(
                    "mono-label h-10 px-3.5 text-[13px] transition-colors",
                    trade.name === t.name ? "bg-fg text-white" : "bg-white text-fg hover:bg-panel-2",
                  )}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <Slider label="Leads a month" hint="Calls and quote requests you get now" value={leads} onChange={setLeads} min={5} max={150} step={1} format={(v) => String(v)} />
              <Slider label="Average job" hint="What a typical job is worth to you" value={jobValue} onChange={setJobValue} min={1000} max={40000} step={250} format={usd.format} />
              <Slider label="Close rate" hint="How many leads turn into paying jobs" value={close} onChange={setClose} min={5} max={80} step={1} format={(v) => `${v}%`} />
              <Slider label="Extra leads a month" hint="Your goal for a new website" value={extra} onChange={setExtra} min={1} max={40} step={1} format={(v) => `+${v}`} accent />
            </div>
          </div>

          {/* ---- Result ---- */}
          <div className="flex flex-col border-t-[3px] border-sun bg-fg p-6 text-white sm:p-8 lg:col-span-7 lg:p-10">
            <AxLabel tone="light">Extra revenue in your first year</AxLabel>
            <p aria-live="polite" className="font-home mt-6 text-[clamp(3rem,7vw,5.5rem)] font-light leading-none tracking-[-0.04em] tabular-nums">
              {usd.format(firstYear)}
            </p>
            <p className="mt-4 max-w-md text-[17px] leading-[1.55] text-white/75">
              From about {one.format(extraJobs)} more {trade.jobs} a month once your new site is up to speed.
            </p>

            <div aria-hidden className="mt-10 lg:mt-auto lg:pt-10">
              <p className="mono-label text-[12.5px] text-white/60">Running total, month by month</p>
              <div className="mt-4 flex h-36 items-end gap-1.5 sm:h-44 sm:gap-2">
                {running.map((v, i) => (
                  <div key={i} className="h-full flex-1">
                    <div
                      className={cn(
                        "h-full origin-bottom transition-transform duration-500 ease-out motion-reduce:transition-none",
                        i === MONTHS - 1 ? "bg-sun" : "bg-white/20",
                      )}
                      style={{ transform: `scaleY(${firstYear > 0 ? v / firstYear : 0})` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mono-label mt-2.5 flex justify-between text-[12.5px] text-white/60">
                <span>Month 1</span>
                <span>Month 12</span>
              </div>
            </div>

            <dl className="mt-8 border-t border-white/15">
              <Row label="Extra revenue a month, from month 3" value={usd.format(fullMonth)} />
              <Row label="Leads a month" value={`${leads} → ${leads + extra}`} />
              <Row label="Jobs a year" value={`${jobsNow} → ${jobsNew}`} />
            </dl>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xs text-[16px] leading-[1.5] text-white/75">Want a site that does this? See your new homepage first. The design is free.</p>
              <AxButton href={offerHref} variant="light">
                Get a free design
              </AxButton>
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-[15px] leading-[1.6] text-muted">
          This is simple math on your own numbers, not a promise. We assume a new site takes about three months to reach
          your goal, so the first two months count for less.
        </p>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/15 py-3.5">
      <dt className="text-[16px] text-white/70">{label}</dt>
      <dd className="font-home text-[20px] tracking-[-0.01em] tabular-nums">{value}</dd>
    </div>
  );
}

/* A square thumb on a thin track, filled up to the value via --p (inherited
   by the track pseudo element). Firefox fills with ::-moz-range-progress. */
const range = cn(
  "mt-3 h-7 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none",
  "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--fill)_var(--p),var(--color-rule)_var(--p))]",
  "[&::-webkit-slider-thumb]:-mt-2 [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-fg [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_var(--color-fg)]",
  "focus-visible:[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_var(--color-sun)]",
  "[&::-moz-range-track]:h-1 [&::-moz-range-track]:bg-rule [&::-moz-range-progress]:h-1 [&::-moz-range-progress]:bg-[var(--fill)]",
  "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-fg [&::-moz-range-thumb]:shadow-[0_0_0_1px_var(--color-fg)]",
  "focus-visible:[&::-moz-range-thumb]:shadow-[0_0_0_4px_var(--color-sun)]",
);

export function Slider({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step,
  format,
  accent = false,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  /** The goal slider: filled in sunrise yellow so it reads apart from today's numbers. */
  accent?: boolean;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("border-t py-5 last:pb-0", accent ? "border-fg" : "border-rule")}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[17px] text-fg">
          {label}
        </label>
        <output htmlFor={id} className="font-home text-[24px] leading-none tracking-[-0.02em] text-fg tabular-nums">
          {format(value)}
        </output>
      </div>
      <p className="mt-1.5 text-[15px] text-muted">{hint}</p>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--p": `${pct}%`, "--fill": accent ? "var(--color-sun)" : "var(--color-fg)" } as React.CSSProperties}
        className={range}
      />
    </div>
  );
}
