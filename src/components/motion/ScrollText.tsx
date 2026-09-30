"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A paragraph whose words darken from light grey to full ink as it scrolls
 * through the viewport — Axion's About effect.
 *
 * Cheap on purpose: the scroll handler only runs while the paragraph is on
 * screen (IntersectionObserver gate), batches to one rAF, and writes a single
 * custom property (--p). Each word's opacity is derived from it in CSS
 * (`.word-reveal` in globals.css). The full sentence is also in the DOM as
 * visually hidden text, so screen readers get it once, whole.
 *
 * Server-rendered at --p: 1 (fully visible), so it reads fine without JS.
 */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let active = false;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.9;
      const end = vh * 0.35;
      const p = (start - r.top) / (r.height + start - end);
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const onScroll = () => {
      if (active && !frame) frame = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        active = e.isIntersecting;
        onScroll();
      },
      { rootMargin: "15% 0px" },
    );
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <span className="sr-only">{text}</span>
      <p
        ref={ref}
        aria-hidden
        className={cn("word-reveal", className)}
        style={{ "--p": 1, "--n": words.length } as React.CSSProperties}
      >
        {words.map((w, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties}>
            {w}{" "}
          </span>
        ))}
      </p>
    </>
  );
}
