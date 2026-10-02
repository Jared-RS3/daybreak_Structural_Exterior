"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { Bar, Card, GREEN, HIGHLIGHT, RED, Them, Us } from "./LeakScenes";

const pad = (i: number) => String(i + 1).padStart(2, "0");

/** How long each step holds, in ms. The first and last hold longer. */
const STEP_MS = 1300;
const FIRST_MS = 1700;
const LAST_MS = 3800;

/** Enter animation for a message as its step arrives. */
const enter = "animate-[panel-in_0.45s_var(--ease-out-expo)_both]";

/**
 * One missed call followed until it's a booked inspection, playing itself:
 * the homeowner's phone on the left fills in a message at a time, and the
 * contractor's CRM on the right fills in field by field. The step track under
 * it lights up as it goes, and any step can be clicked to stop there.
 *
 * It only runs while on screen, pauses on request (WCAG 2.2.2: anything
 * moving for more than five seconds needs a pause), and with reduced motion
 * it doesn't play at all: it opens on the finished run.
 *
 * The drawing is aria-hidden; the step list carries the meaning. The
 * headline ("A missed call at 4:52 PM…") belongs to the section around it.
 */
export function AutomationRun({ steps }: { steps: string[] }) {
  const last = steps.length - 1;
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const checked = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !checked.current) {
          checked.current = true;
          if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setPlaying(false);
            setStep(last);
          }
        }
        setVisible(e.isIntersecting);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [last]);

  useEffect(() => {
    if (!playing || !visible) return;
    const hold = step === last ? LAST_MS : step === 0 ? FIRST_MS : STEP_MS;
    const t = setTimeout(() => setStep((s) => (s >= last ? 0 : s + 1)), hold);
    return () => clearTimeout(t);
  }, [playing, visible, step, last]);

  const jump = (i: number) => {
    setStep(i);
    setPlaying(false);
  };
  const toggle = () => {
    if (!playing && step === last) setStep(0);
    setPlaying((p) => !p);
  };

  return (
    <div ref={ref}>
      {/* The section heading above carries the story; this row is just the control. */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={toggle}
          className="mono-label inline-flex h-11 shrink-0 items-center gap-2 border border-fg/25 px-4 text-[12.5px] text-fg transition-colors hover:border-fg"
        >
          {playing ? (
            <>
              <span aria-hidden className="flex gap-[3px]">
                <span className="h-3 w-[3px] bg-fg" />
                <span className="h-3 w-[3px] bg-fg" />
              </span>
              Pause
            </>
          ) : (
            <>
              <Icon name="play" filled className="size-3.5" />
              {step === last ? "Replay" : "Play"}
            </>
          )}
        </button>
      </div>

      {/* ---- the stage ---- */}
      <div
        aria-hidden
        className="mt-4 flex flex-col items-center gap-4 bg-panel-2 px-4 py-6 sm:px-8 sm:py-8 lg:flex-row lg:justify-center lg:gap-12 lg:py-10"
      >
        <Phone step={step} />
        <Crm step={step} done={step === last} />
      </div>

      {/* ---- steps: full track from lg ---- */}
      <ol aria-label="What happens, step by step" className="relative mt-6 hidden grid-cols-9 lg:grid">
        <span aria-hidden className="absolute left-[calc(100%/18)] right-[calc(100%/18)] top-[13px] h-[2px] bg-rule">
          <span
            className="absolute inset-0 origin-left bg-fg transition-transform duration-500 ease-[var(--ease-out-expo)]"
            style={{ transform: `scaleX(${step / last})` }}
          />
        </span>
        {steps.map((s, i) => (
          <li key={s} className="relative px-1 text-center">
            <button
              type="button"
              onClick={() => jump(i)}
              aria-current={i === step ? "step" : undefined}
              className="group flex w-full flex-col items-center"
            >
              <span
                aria-hidden
                className={cn(
                  "mono-label flex size-7 items-center justify-center text-[11px] transition-colors duration-300",
                  i < step ? "bg-fg text-white" : i === step ? "bg-sun text-fg" : "border border-rule bg-white text-muted",
                )}
              >
                {i < step ? <Icon name="check" className="size-3.5" /> : pad(i)}
              </span>
              <span
                className={cn(
                  "mt-3 text-[13.5px] leading-[1.3] transition-colors duration-300",
                  i === step ? "text-fg" : "text-muted group-hover:text-fg",
                )}
              >
                {s}
              </span>
            </button>
          </li>
        ))}
      </ol>

      {/* ---- steps: segmented bar on smaller screens ---- */}
      <div className="mt-5 lg:hidden">
        <ol aria-label="What happens, step by step" className="flex gap-1">
          {steps.map((s, i) => (
            <li key={s} className="flex-1">
              <button
                type="button"
                onClick={() => jump(i)}
                aria-label={`Step ${i + 1}: ${s}`}
                aria-current={i === step ? "step" : undefined}
                className="block w-full py-2.5"
              >
                <span className={cn("block h-1 transition-colors duration-300", i <= step ? "bg-fg" : "bg-rule")} />
              </button>
            </li>
          ))}
        </ol>
        <p aria-hidden className="mt-2 flex items-baseline gap-3">
          <span className="mono-label text-[12px] text-muted tabular-nums">
            {pad(step)} / {pad(last)}
          </span>
          <span className="font-home text-[1.35rem] leading-tight tracking-[-0.02em] text-fg">{steps[step]}</span>
        </p>
      </div>
    </div>
  );
}

/** The homeowner's phone. Messages arrive at the bottom and push older ones up. */
function Phone({ step }: { step: number }) {
  return (
    <div className="flex h-[27rem] w-full max-w-[19rem] flex-col overflow-hidden rounded-[2.4rem] border-[7px] border-fg bg-white shadow-[0_30px_70px_-30px_rgb(0_0_0/0.55)] sm:h-[30rem]">
      <div className="shrink-0 border-b border-rule px-4 pb-3 pt-3.5 text-center">
        <span className="mx-auto mb-2.5 block h-1.5 w-16 rounded-full bg-fg/80" />
        <span className="text-[14px] font-semibold text-fg">Your Foundation Co.</span>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-2 overflow-hidden bg-panel px-3 py-4 [mask-image:linear-gradient(to_bottom,transparent,#000_3rem)]">
        {step === 0 ? (
          <p className={cn("mx-auto flex items-center gap-2 bg-white px-3 py-2 text-[13px] text-fg", enter)}>
            <span className="relative flex size-6 items-center justify-center">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#1d6b3f]/30" />
              <Icon name="phone" className={cn("relative size-4", GREEN)} />
            </span>
            Calling… 4:52 PM
          </p>
        ) : (
          <p className="mx-auto flex items-center gap-2 bg-white px-3 py-2 text-[13px] text-fg">
            <Icon name="phone" className={cn("size-4", RED)} />
            <span className={RED}>Missed call</span> · 4:52 PM
          </p>
        )}
        {step >= 2 && (
          <div className={enter}>
            <p className="mono-label mb-1.5 text-center text-[9px] text-muted">Text · 4 sec after the call</p>
            <Us>Sorry we missed your call! This is Your Foundation Co.</Us>
          </div>
        )}
        {step >= 3 && <Us className={enter}>What issue are you seeing? Cracks, moisture, sagging floors or bowing walls?</Us>}
        {step >= 4 && <Them className={enter}>Foundation cracks</Them>}
        {step >= 5 && (
          <div className={cn("space-y-2", enter)}>
            <Us>What&rsquo;s your ZIP code?</Us>
            <Them>76248</Them>
            <p className={cn("mono-label flex items-center justify-center gap-1 whitespace-nowrap text-[9.5px]", GREEN)}>
              <Icon name="check" className="size-3" /> In your service area
            </p>
          </div>
        )}
        {step >= 6 && (
          <div className={cn("space-y-2", enter)}>
            <Us>Can you send a photo or two of the crack?</Us>
            <div className="ml-auto flex w-fit gap-1.5">
              <CrackPhoto d="M8 4 L20 18 L15 28 L30 40 L26 50 L38 60" />
              <CrackPhoto d="M56 6 L44 16 L48 26 L36 36 L40 46 L28 58" />
            </div>
          </div>
        )}
        {step >= 7 && (
          <Us className={cn("border-l-[3px] border-sun", HIGHLIGHT, enter)}>
            You&rsquo;re booked: free inspection, Tue 9:00 AM. Mike will see you then.
          </Us>
        )}
      </div>
    </div>
  );
}

function CrackPhoto({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 64 64" className="size-16 rounded-lg bg-[#d9d3c9]">
      <path d={d} fill="none" stroke="#4d463e" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

/** The contractor's side: the lead fills in as the conversation happens. */
function Crm({ step, done }: { step: number; done: boolean }) {
  const fields: [string, string, number][] = [
    ["Source", "Missed call · 4:52 PM", 1],
    ["Issue", "Foundation cracks", 4],
    ["ZIP", "76248 · Keller, TX", 5],
    ["Photos", "2 uploaded", 6],
    ["Inspection", "Tue 9:00 AM · Mike R.", 7],
  ];
  const stages = ["New", "Contacted", "Booked", "Estimate", "Won"];
  const stage = done ? 2 : step >= 2 ? 1 : 0;
  return (
    <div className="w-full max-w-[19rem] space-y-2.5 lg:max-w-[20rem]">
      {/* Phones show the phone and the rep's alert; the CRM card waits for room. */}
      <Card className={cn("hidden transition-opacity duration-500 lg:block", step === 0 && "opacity-50")}>
        <Bar
          label="CRM · Lead"
          right={
            done ? (
              <span className={cn("mono-label flex items-center gap-1 bg-sun px-2 py-1 text-[9.5px] text-fg", "animate-[panel-in_0.45s_var(--ease-out-expo)_both]")}>
                <Icon name="check" className="size-3" /> Updated
              </span>
            ) : (
              <span className="mono-label text-[9.5px] text-muted">{step === 0 ? "Waiting…" : "Filling in"}</span>
            )
          }
        />
        <div className="flex items-center gap-3 px-3 pt-3">
          <span className="flex size-9 items-center justify-center bg-panel-2 text-[12px] font-semibold text-fg">DR</span>
          <span>
            <span className="font-home block text-[16px] tracking-[-0.01em] text-fg">Dana R.</span>
            <span className="block text-[12px] text-muted">(817) ••• ••19</span>
          </span>
        </div>
        <dl className="mt-3 border-t border-rule">
          {fields.map(([k, v, at]) => {
            const on = step >= at;
            return (
              <div
                key={k}
                className={cn(
                  "grid grid-cols-[5.5rem_1fr] gap-2 border-b border-rule px-3 py-2 transition-colors duration-500",
                  step === at && HIGHLIGHT,
                )}
              >
                <dt className="mono-label pt-0.5 text-[9.5px] text-muted">{k}</dt>
                <dd className={cn("text-[13px]", on ? "text-fg" : "text-fg/25")}>{on ? v : "—"}</dd>
              </div>
            );
          })}
        </dl>
        <ol className="flex gap-1 p-3">
          {stages.map((s, i) => (
            <li
              key={s}
              className={cn(
                "mono-label flex-auto px-1 py-1.5 text-center text-[8.5px] transition-colors duration-500",
                i === stage ? (done ? "bg-sun text-fg" : "bg-fg text-white") : "bg-panel text-muted",
              )}
            >
              {s}
            </li>
          ))}
        </ol>
      </Card>
      <div
        className={cn(
          "bg-fg p-3.5 text-white transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)]",
          done ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <p className="mono-label flex items-center gap-1.5 text-[9.5px] text-white/70">
          <Icon name="bolt" className="size-3.5 text-sun" /> To: Mike R. · now
        </p>
        <p className="mt-1.5 text-[14px]">Inspection booked: Dana R., Keller. Tue 9:00 AM. Added to your CRM.</p>
      </div>
    </div>
  );
}
