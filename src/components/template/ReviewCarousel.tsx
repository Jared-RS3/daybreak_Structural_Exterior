"use client";

import { useState } from "react";
import type { Review } from "@/lib/template/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * The right-hand half of Crest's reviews section: one story at a time, set
 * large, with the round arrows on the left driving it. Nothing auto-advances
 * — a quote that moves while you are reading it is a quote you don't finish.
 */
export function ReviewCarousel({ reviews, intro }: { reviews: Review[]; intro: React.ReactNode }) {
  const [i, setI] = useState(0);
  const r = reviews[i];
  const go = (d: 1 | -1) => setI((v) => (v + d + reviews.length) % reviews.length);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
      <div className="flex flex-col">
        {intro}
        <div className="mt-8 flex items-center gap-2 lg:mt-auto lg:pt-10">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => go(d)}
              aria-label={d === -1 ? "Previous review" : "Next review"}
              className="flex size-11 items-center justify-center rounded-full bg-accent-soft text-fg transition-colors hover:bg-[#e2e2e2]"
            >
              <Icon name="arrowRight" className={cn("size-4.5", d === -1 && "rotate-180")} />
            </button>
          ))}
          <span className="ml-3 text-[14px] text-muted tabular-nums" aria-live="polite">
            {i + 1} of {reviews.length}
          </span>
        </div>
      </div>

      <figure key={r.id} className="animate-[panel-in_0.5s_var(--ease-out-expo)_both]">
        <svg viewBox="0 0 24 24" aria-hidden className="size-7 text-muted">
          <path
            fill="currentColor"
            d="M9.5 6C6.5 7.4 5 10 5 13.2V18h5.6v-5.6H8.2c0-2.3.8-3.9 2.4-4.8zm9 0c-3 1.4-4.5 4-4.5 7.2V18h5.6v-5.6h-2.4c0-2.3.8-3.9 2.4-4.8z"
          />
        </svg>
        <p className="home-heading mt-5 max-w-xl text-[clamp(2rem,4vw,3.25rem)] text-fg">{r.headline}</p>
        <blockquote className="mt-6 max-w-xl text-[17px] leading-[1.6] text-muted">&ldquo;{r.quote}&rdquo;</blockquote>
        <figcaption className="mt-8 flex items-center gap-3">
          <span
            aria-hidden
            className="inline-flex size-11 items-center justify-center rounded-full bg-sky-4 text-[13px] font-semibold text-fg"
          >
            {r.name
              .split(" ")
              .map((w) => w[0])
              .join("")}
          </span>
          <span className="text-[14.5px] leading-tight">
            <span className="block text-fg">{r.name}</span>
            <span className="block text-muted">
              {r.city} · {r.service}
            </span>
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
