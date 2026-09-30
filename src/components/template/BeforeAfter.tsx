"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Drag, click or use the arrow keys. The pointer handling lives on the frame
 * so a tap anywhere moves the divide; a visually hidden range input carries
 * keyboard and screen-reader control, and its focus ring is drawn on the
 * handle. `touch-action: pan-y` keeps vertical page scrolling working on a
 * phone — only a sideways drag is captured.
 */
export function BeforeAfter({
  before,
  after,
  note,
  className,
}: {
  /** `node` is a server-rendered image, so the blur data stays off the client. */
  before: { label: string; node: React.ReactNode };
  after: { label: string; node: React.ReactNode };
  note?: string;
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromPointer = (clientX: number) => {
    const r = frame.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={frame}
      className={cn("relative cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[24px] bg-card", className)}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        // A touch might be the start of a vertical scroll, so it only moves
        // the divide once it actually moves sideways (pointermove).
        if (e.pointerType === "mouse") fromPointer(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      {after.node}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {before.node}
      </div>

      <span className="pill-label absolute left-4 top-4 bg-white/90 font-medium text-fg">{before.label}</span>
      <span className="pill-label absolute right-4 top-4 bg-white/90 font-medium text-fg">{after.label}</span>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Compare ${before.label.toLowerCase()} and ${after.label.toLowerCase()}`}
        aria-valuetext={`${Math.round(pos)}% ${before.label.toLowerCase()}`}
        className="peer pointer-events-none absolute inset-0 size-full appearance-none opacity-0"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white"
        style={{ left: `${pos}%` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-fg shadow-[0_10px_30px_-10px_rgb(0_0_0/0.45)] ring-fg ring-offset-2 peer-focus-visible:ring-2"
        style={{ left: `${pos}%` }}
      >
        <Icon name="chevronRight" className="size-4 rotate-180" />
        <Icon name="chevronRight" className="-ml-1 size-4" />
      </div>

      {note && (
        <p className="pointer-events-none absolute inset-x-4 bottom-4 rounded-[14px] bg-white/90 px-3.5 py-2.5 text-[12.5px] leading-snug text-fg sm:inset-x-auto sm:left-4 sm:max-w-sm">
          {note}
        </p>
      )}
    </div>
  );
}
