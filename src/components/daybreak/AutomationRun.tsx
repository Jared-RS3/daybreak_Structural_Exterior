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
      {/* Desktop: the section heading carries the story; this row is just the control. */}
      <div className="hidden justify-end lg:flex">
        <PlayButton playing={playing} ended={step === last} onClick={toggle} />
      </div>

      {/* Phones: which step you're on sits directly above the phone, so it's in
          view while the messages arrive, with back / pause / next to step
          through at your own pace. */}
      <div className="mt-4 bg-fg p-4 text-white lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="mono-label bg-sun px-2 py-1 text-[11.5px] text-fg tabular-nums">
            Step {pad(step)} / {pad(last)}
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => jump(Math.max(0, step - 1))}
              disabled={step === 0}
              aria-label="Previous step"
              className="flex size-10 items-center justify-center border border-white/25 disabled:opacity-35"
            >
              <Icon name="arrowRight" className="size-4 rotate-180" />
            </button>
            <PlayButton playing={playing} ended={step === last} onClick={toggle} compact />
            <button
              type="button"
              onClick={() => jump(Math.min(last, step + 1))}
              disabled={step === last}
              aria-label="Next step"
              className="flex size-10 items-center justify-center bg-white text-fg disabled:opacity-35"
            >
              <Icon name="arrowRight" className="size-4" />
            </button>
          </div>
        </div>
        <p key={step} aria-hidden className={cn("font-home mt-3 text-[1.5rem] leading-tight tracking-[-0.02em]", enter)}>
          {steps[step]}
        </p>
        <ol aria-label="What happens, step by step" className="mt-3 flex gap-1">
          {steps.map((s, i) => (
            <li key={s} className="flex-1">
              <button
                type="button"
                onClick={() => jump(i)}
                aria-label={`Step ${i + 1}: ${s}`}
                aria-current={i === step ? "step" : undefined}
                className="block w-full py-2"
              >
                <span
                  className={cn(
                    "block h-1.5 transition-colors duration-300",
                    i < step ? "bg-white" : i === step ? "bg-sun" : "bg-white/20",
                  )}
                />
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* ---- the stage ---- */}
      <div
        aria-hidden
        className="flex flex-col items-center gap-4 bg-panel-2 px-4 py-6 sm:px-8 sm:py-8 lg:mt-4 lg:flex-row lg:justify-center lg:gap-12 lg:py-10"
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

    </div>
  );
}

function PlayButton({
  playing,
  ended,
  onClick,
  compact = false,
}: {
  playing: boolean;
  ended: boolean;
  onClick: () => void;
  /** Icon-only, for the dark caption on phones. */
  compact?: boolean;
}) {
  const label = playing ? "Pause" : ended ? "Replay" : "Play";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={compact ? label : undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2",
        compact
          ? "size-10 border border-white/25 text-white"
          : "mono-label h-11 border border-fg/25 px-4 text-[12.5px] text-fg transition-colors hover:border-fg",
      )}
    >
      {playing ? (
        <span aria-hidden className="flex gap-[3px]">
          <span className={cn("h-3 w-[3px]", compact ? "bg-white" : "bg-fg")} />
          <span className={cn("h-3 w-[3px]", compact ? "bg-white" : "bg-fg")} />
        </span>
      ) : (
        <Icon name="play" filled className="size-3.5" />
      )}
      {!compact && label}
    </button>
  );
}

/** The homeowner's phone. Messages arrive at the bottom and push older ones up. */
function Phone({ step }: { step: number }) {
  /** Outlines whatever arrived at this step, so the eye goes straight to it. */
  const now = (n: number) => step === n && "ring-2 ring-sun ring-offset-2 ring-offset-panel";
  return (
    <div className="flex h-[24rem] w-full max-w-[19rem] flex-col overflow-hidden rounded-[2.4rem] border-[7px] border-fg bg-white shadow-[0_30px_70px_-30px_rgb(0_0_0/0.55)] sm:h-[30rem]">
      <div className="shrink-0 border-b border-rule px-4 pb-3 pt-3.5 text-center">
        <span className="mx-auto mb-2.5 block h-1.5 w-16 rounded-full bg-fg/80" />
        <span className="text-[14px] font-semibold text-fg">Your Foundation Co.</span>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-2 overflow-hidden bg-panel px-3 py-4 [mask-image:linear-gradient(to_bottom,transparent,#000_3rem)]">
        {step === 0 ? (
          <p className={cn("mx-auto flex items-center gap-2 bg-white px-3 py-2 text-[13px] text-fg", enter, now(0))}>
            <span className="relative flex size-6 items-center justify-center">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#1d6b3f]/30" />
              <Icon name="phone" className={cn("relative size-4", GREEN)} />
            </span>
            Calling… 4:52 PM
          </p>
        ) : (
          <p className={cn("mx-auto flex items-center gap-2 bg-white px-3 py-2 text-[13px] text-fg", now(1))}>
            <Icon name="phone" className={cn("size-4", RED)} />
            <span className={RED}>Missed call</span> · 4:52 PM
          </p>
        )}
        {step >= 2 && (
          <div className={enter}>
            <p className="mono-label mb-1.5 text-center text-[9px] text-muted">Text · 4 sec after the call</p>
            <Us className={cn(now(2))}>Sorry we missed your call! This is Your Foundation Co.</Us>
          </div>
        )}
        {step >= 3 && <Us className={cn(enter, now(3))}>What issue are you seeing? Cracks, moisture, sagging floors or bowing walls?</Us>}
        {step >= 4 && <Them className={cn(enter, now(4))}>Foundation cracks</Them>}
        {step >= 5 && (
          <div className={cn("space-y-2", enter)}>
            <Us>What&rsquo;s your ZIP code?</Us>
            <Them className={cn(now(5))}>76248</Them>
            <p className={cn("mono-label flex items-center justify-center gap-1 whitespace-nowrap text-[9.5px]", GREEN)}>
              <Icon name="check" className="size-3" /> In your service area
            </p>
          </div>
        )}
        {step >= 6 && (
          <div className={cn("space-y-2", enter)}>
            <Us>Can you send a photo or two of the crack?</Us>
            <div className={cn("ml-auto flex w-fit gap-1.5 rounded-lg", now(6))}>
              <CrackPhoto d="M8 4 L20 18 L15 28 L30 40 L26 50 L38 60" />
              <CrackPhoto d="M56 6 L44 16 L48 26 L36 36 L40 46 L28 58" />
            </div>
          </div>
        )}
        {step >= 7 && (
          <Us className={cn("border-l-[3px] border-sun", HIGHLIGHT, enter, now(7))}>
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
