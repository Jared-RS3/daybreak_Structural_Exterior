"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * A horizontal rail that is just native scrolling: swipe on a phone,
 * trackpad or the round arrow buttons on a desktop, snap points so a card
 * never stops half off-screen. No wheel hijacking and no pinned section.
 *
 * It starts on the page grid and bleeds off the right edge, which is what
 * tells a visitor there is more.
 */
export function Rail({
  header,
  label,
  children,
  buttons = "round",
  wide = false,
}: {
  header: React.ReactNode;
  label: string;
  children: React.ReactNode;
  /** "square" = Axion's black square arrows, for the agency site. */
  buttons?: "round" | "square";
  /** Align to the full-width `container-wide` grid instead of container-x. */
  wide?: boolean;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = el.scrollWidth - el.clientWidth;
      setAtStart(el.scrollLeft < 8);
      setAtEnd(el.scrollLeft > max - 8);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    el.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
  };

  return (
    <div>
      <div className={cn(wide ? "container-wide" : "container-x", "flex flex-wrap items-end justify-between gap-x-10 gap-y-6")}>
        <div className="min-w-0 flex-1">{header}</div>
        <div className="hidden gap-2 md:flex">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => step(dir)}
              disabled={dir === -1 ? atStart : atEnd}
              aria-label={dir === -1 ? "Scroll back" : "Scroll forward"}
              className={cn(
                "flex size-11 items-center justify-center transition-colors disabled:opacity-30",
                buttons === "square"
                  ? "bg-fg text-white hover:bg-[#333]"
                  : "rounded-full bg-accent-soft text-fg hover:bg-[#e2e2e2]",
              )}
            >
              <Icon name="arrowRight" className={cn("size-4.5", dir === -1 && "rotate-180")} />
            </button>
          ))}
        </div>
      </div>

      <ul
        ref={listRef}
        aria-label={label}
        className={cn(
          "scrollbar-none mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 after:w-2 after:shrink-0 after:content-[''] sm:gap-4",
          wide
            ? "pl-5 scroll-pl-5 sm:pl-6 sm:scroll-pl-6 lg:pl-8 lg:scroll-pl-8"
            : "pl-container scroll-pl-5 lg:scroll-pl-[max(2.5rem,calc(50%-38.5rem))]",
        )}
      >
        {children}
      </ul>
    </div>
  );
}
