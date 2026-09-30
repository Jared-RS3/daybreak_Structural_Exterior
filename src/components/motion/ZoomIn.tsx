"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * An image frame whose contents settle from a slight zoom as it scrolls into
 * view — Axion's image treatment. Transform-only; plays once. Starts settled
 * on the server and with reduced motion, so nothing depends on JS to be seen.
 */
export function ZoomIn({
  children,
  className,
  from = 1.14,
}: {
  children: React.ReactNode;
  className?: string;
  from?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"settled" | "armed" | "play">("settled");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only arm frames that start below the fold; anything already visible
    // stays put rather than jumping.
    const below = el.getBoundingClientRect().top > window.innerHeight;
    if (!below) return;
    const frame = requestAnimationFrame(() => setState("armed"));
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setState("play");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <div
        className="size-full will-change-transform"
        style={{
          transform: state === "armed" ? `scale(${from})` : "none",
          transition: state === "play" ? "transform 1.8s cubic-bezier(0.23, 1, 0.32, 1)" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
