"use client";

import { useEffect, useRef, useState } from "react";

const DIGITS = Array.from({ length: 20 }, (_, i) => i % 10);

/**
 * An odometer: each digit is a column of 0–9 twice over that rolls up to its
 * value when the number scrolls into view, the way Axion's stats do.
 * Non-digits (+, %) sit still. Transform-only, so it runs on the compositor.
 *
 * Renders the final value on the server and without JS; arms itself (drops
 * to zero) after mount, then rolls when seen. Reduced motion: stays final.
 */
export function RollingNumber({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [armed, setArmed] = useState(false);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = requestAnimationFrame(() => setArmed(true));
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, []);

  let digitIndex = 0;
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="inline-flex">
        {[...value].map((ch, i) => {
          if (!/\d/.test(ch)) return <span key={i}>{ch}</span>;
          const d = Number(ch);
          const target = 10 + d;
          const pos = armed && !run ? 0 : target;
          const delay = digitIndex++ * 0.12;
          return (
            <span key={i} className="inline-block h-[1em] overflow-hidden leading-none">
              <span
                className="flex flex-col"
                style={{
                  transform: `translateY(-${pos}em)`,
                  transition: run ? `transform 1.8s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s` : "none",
                }}
              >
                {DIGITS.map((n, k) => (
                  <span key={k} className="h-[1em] leading-none">
                    {n}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
