"use client";

import { useId, useRef, useState } from "react";
import type { Business, Problem } from "@/lib/template/types";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { pillClass } from "./pill";

/**
 * Replaces a grid of service cards with the question a homeowner actually
 * arrives with. Each answer changes three things: what it usually turns out
 * to be, what we'd do first, and the button — a crack gets the checker, a
 * damp crawl space gets an inspection. Useful before it is persuasive.
 *
 * A real ARIA tablist: arrow keys move between answers, Home/End jump, and
 * the panel is labelled by its tab.
 */
export function ProblemSelector({
  problems,
  media,
  business,
}: {
  problems: Problem[];
  /** One server-rendered image per problem, in the same order. Passed in as
      nodes so the image pipeline (and its blur data) stays off the client. */
  media: React.ReactNode[];
  business: Business;
}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const p = problems[active];

  const focus = (i: number) => {
    const next = (i + problems.length) % problems.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const keys: Record<string, number> = {
      ArrowDown: i + 1,
      ArrowRight: i + 1,
      ArrowUp: i - 1,
      ArrowLeft: i - 1,
      Home: 0,
      End: problems.length - 1,
    };
    if (e.key in keys) {
      e.preventDefault();
      focus(keys[e.key]);
    }
  };

  return (
    <div>
      {/* Pill tabs, centred; on a phone they scroll sideways rather than
          wrapping into a ragged block. */}
      <div className="-mx-5 overflow-x-auto px-5 scrollbar-none sm:mx-0 sm:px-0">
        <div
          role="tablist"
          aria-label="What's happening with your home"
          className="mx-auto flex w-max gap-2 sm:flex-wrap sm:justify-center"
        >
          {problems.map((item, i) => {
            const selected = i === active;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`${uid}-tab-${item.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${uid}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  "h-12 whitespace-nowrap rounded-full px-5 text-[15px] font-medium transition-colors sm:px-6",
                  selected ? "bg-accent text-white" : "bg-accent-soft text-fg hover:bg-[#e2e2e2]",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${p.id}`}
        tabIndex={0}
        className="mt-8 rounded-[32px] bg-card p-2 outline-none sm:p-2.5"
      >
        {/* Keyed so the panel re-enters on each change — a short fade, not a slide show. */}
        <div key={p.id} className="grid animate-[panel-in_0.5s_var(--ease-out-expo)_both] gap-2 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] lg:aspect-auto lg:min-h-[34rem]">
            {media[active]}
          </div>

          <div className="flex flex-col rounded-[24px] bg-white p-6 sm:p-9">
            <h3 className="home-heading text-[clamp(1.7rem,2.8vw,2.4rem)] text-fg">{p.heading}</h3>

            <p className="mt-7 text-[14px] text-muted">Usually one of these</p>
            <ul className="mt-3 space-y-2.5">
              {p.causes.map((c) => (
                <li key={c.title} className="flex gap-3 text-[15px] leading-[1.5]">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-card">
                    <Icon name="check" className="size-3 text-fg" />
                  </span>
                  <span>
                    <span className="font-medium text-fg">{c.title}</span>
                    <span className="text-muted"> — {c.body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[18px] bg-card p-5">
                <p className="text-[13.5px] text-muted">What we&rsquo;d do first</p>
                <p className="mt-1.5 text-[15px] leading-[1.55] text-fg">{p.firstStep}</p>
              </div>
              <div className="rounded-[18px] bg-card p-5">
                <p className="text-[13.5px] text-muted">What to expect</p>
                <p className="mt-1.5 text-[15px] leading-[1.55] text-fg">{p.expectation}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-8">
              <Link href={p.primary.href} className={pillClass("dark", "lg")}>
                {p.primary.label}
              </Link>
              {p.secondary ? (
                <Link href={p.secondary.href} className={pillClass("soft", "lg")}>
                  {p.secondary.label}
                </Link>
              ) : (
                <a href={business.phoneHref} className={pillClass("soft", "lg")}>
                  Call {business.phoneDisplay}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
