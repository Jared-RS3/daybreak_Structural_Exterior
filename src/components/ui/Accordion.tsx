"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

export function Accordion({
  items,
  tone = "dark",
  defaultOpen = 0,
}: {
  items: { q: string; a: string }[];
  tone?: "dark" | "light";
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="divide-y divide-ink-900/8">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={tone === "light" ? "border-white/10" : ""}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-6 py-6 text-left"
            >
              <span
                className={cn(
                  "text-[17px] [font-weight:700] tracking-[-0.02em] sm:text-[19px]",
                  tone === "light" ? "text-white" : "text-ink-900",
                )}
              >
                {item.q}
              </span>
              <span
                className={cn(
                  "mt-0.5 flex size-9 shrink-0 items-center justify-center border transition-all duration-300",
                  isOpen
                    ? "rotate-180 border-ember-500 bg-ember-500 text-white"
                    : tone === "light"
                      ? "border-white/20 text-white"
                      : "border-ink-900/15 text-ink-500",
                )}
              >
                <Icon name="chevronDown" className="size-4" />
              </span>
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity,visibility,padding] duration-500 ease-[var(--ease-out-expo)]",
                isOpen
                  ? "visible grid-rows-[1fr] pb-7 opacity-100"
                  : "invisible grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p
                  className={cn(
                    "max-w-3xl pr-10 text-[15px] leading-[1.7]",
                    tone === "light" ? "text-ink-300" : "text-ink-500",
                  )}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
