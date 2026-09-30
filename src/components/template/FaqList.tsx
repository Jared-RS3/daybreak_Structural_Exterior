"use client";

import { useId, useState } from "react";
import type { Faq } from "@/lib/template/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Crest's FAQ rows: the question, a round chevron at the right, a hairline
 * between. Each question is an h3 wrapping a button that controls a labelled
 * region, so heading navigation and the accordion both work with a screen
 * reader; closed answers stay in the DOM so find-in-page still reaches them.
 */
export function FaqList({
  items,
  defaultOpen = 0,
  variant = "round",
}: {
  items: Faq[];
  defaultOpen?: number | null;
  /** "square" for the agency site's Axion styling. */
  variant?: "round" | "square";
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const uid = useId();

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = open === i;
        const btn = `${uid}-q${i}`;
        const panel = `${uid}-a${i}`;
        return (
          <div key={item.q} className="border-b border-line">
            <h3>
              <button
                id={btn}
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={panel}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="home-title text-[18px] text-fg sm:text-[21px]">{item.q}</span>
                <span
                  aria-hidden
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center text-fg transition-transform duration-300",
                    variant === "square" ? "bg-panel-2 group-hover:bg-[#dedede]" : "rounded-full bg-accent-soft group-hover:bg-[#e2e2e2]",
                    isOpen && "rotate-180",
                  )}
                >
                  <Icon name="chevronDown" className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panel}
              role="region"
              aria-labelledby={btn}
              className={cn(
                "grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p className="max-w-2xl pb-7 pr-14 text-[16px] leading-[1.65] text-muted">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
