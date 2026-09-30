"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Area, Business, Project } from "@/lib/template/types";
import { fitProjection, milesBetween } from "@/lib/template/geo";
import { cn } from "@/lib/utils";
import { pillClass } from "./pill";

const W = 1000;
const RINGS = [10, 20, 30];

/**
 * A plotted drawing of the service area — city centres at their true
 * relative positions, range rings from the yard, and a measured line to
 * whichever town you pick. It answers "do you come out to me?" and "have you
 * worked near me?" in one interaction, and it is drawn in the same
 * measurement language as the rest of the site.
 *
 * Not a tile map: no library, no third-party requests, nothing to load. The
 * town list beside it is the accessible control; the dots are a pointer
 * shortcut to the same state.
 */
export function AreaMap({
  areas,
  projects,
  business,
  base,
  toolHref,
  initial,
}: {
  areas: Area[];
  projects: Project[];
  business: Business;
  base: string;
  toolHref: string;
  initial?: string;
}) {
  const { project, height, unitsPerMile } = useMemo(
    () => fitProjection([...areas, business.geo], W, 80),
    [areas, business.geo],
  );
  const [selected, setSelected] = useState(initial ?? areas[0].slug);
  const [hovered, setHovered] = useState<string | null>(null);

  /* The drawing scales with its container, but type and dots shouldn't: a
     13px label at desktop width would be 8px on a phone. `k` is viewBox
     units per screen pixel, so every size below is written in pixels. */
  const frameRef = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1.8);
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setK(W / Math.max(1, e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const px = (n: number) => n * k;
  const labelSize = px(13);

  const pts = useMemo(() => new Map(areas.map((a) => [a.slug, project(a)])), [areas, project]);
  const yard = project(business.geo);
  const sel = areas.find((a) => a.slug === selected) ?? areas[0];
  const selPt = pts.get(sel.slug)!;
  const fromYard = milesBetween(business.geo, sel);

  const nearest = useMemo(() => {
    let best: { p: Project; miles: number } | null = null;
    for (const p of projects) {
      const home = areas.find((a) => a.slug === p.areaSlug);
      if (!home) continue;
      const miles = milesBetween(home, sel);
      if (!best || miles < best.miles) best = { p, miles };
    }
    return best;
  }, [projects, areas, sel]);

  /* Labels go left when another labelled town sits just to the right. */
  const labelled = areas.filter((a) => a.page || a.slug === selected || a.slug === hovered);
  const labelWidth = (a: Area) => a.city.length * labelSize * 0.56 + px(14);
  /* Right of the dot if there's room and no labelled town in the way, then
     left, then centred underneath. Collisions are checked against dots, which
     is enough for a handful of labels. */
  const side = (a: Area): "right" | "left" | "below" => {
    const p = pts.get(a.slug)!;
    const w = labelWidth(a);
    const near = (dir: 1 | -1) =>
      labelled.some((o) => {
        if (o.slug === a.slug) return false;
        const q = pts.get(o.slug)!;
        const dx = (q.x - p.x) * dir;
        return dx > 0 && dx < w && Math.abs(q.y - p.y) < labelSize * 1.4;
      });
    if (p.x + w <= W - px(8) && !near(1)) return "right";
    if (p.x - w >= px(8) && !near(-1)) return "left";
    return "below";
  };

  const counties = [...new Set(areas.map((a) => a.county))];
  const midX = (yard.x + selPt.x) / 2;
  const midY = (yard.y + selPt.y) / 2;

  return (
    <div className="grid gap-2 rounded-[32px] bg-card p-2 sm:gap-2.5 sm:p-2.5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* ---- detail + town list ---- */}
      <div className="order-2 rounded-[24px] bg-white p-6 sm:p-8 lg:order-1">
        <div aria-live="polite">
          <p className="text-[14px] text-muted">
            {sel.county} County · <span className="tabular-nums">{Math.round(fromYard)}</span> mi from our yard
          </p>
          <h3 className="home-heading mt-2 text-[clamp(2.2rem,3.6vw,3rem)] text-fg">{sel.city}</h3>

          <dl className="mt-6 grid gap-2 sm:grid-cols-2">
            <div className="rounded-[18px] bg-card p-4">
              <dt className="text-[13px] text-muted">Nearest recent project</dt>
              <dd className="mt-1 text-[15px] leading-snug text-fg">
                {nearest ? (
                  <>
                    <Link
                      href={`${base}/projects/${nearest.p.slug}`}
                      className="font-medium underline decoration-fg/25 underline-offset-4 hover:decoration-fg"
                    >
                      {nearest.p.title}
                    </Link>
                    <span className="mt-1 block text-[13.5px] text-muted tabular-nums">
                      {nearest.miles < 3 ? `${nearest.p.location}` : `${nearest.p.location} · ${Math.round(nearest.miles)} mi away`}
                    </span>
                  </>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className="rounded-[18px] bg-card p-4">
              <dt className="text-[13px] text-muted">Typical inspection lead time</dt>
              <dd className="font-home mt-1 text-[20px] font-medium tracking-[-0.02em] text-fg">{sel.leadTime}</dd>
            </div>
          </dl>

          {sel.note && <p className="mt-6 max-w-lg text-[15px] leading-[1.6] text-muted">{sel.note}</p>}

          <div className="mt-7 flex flex-wrap gap-2">
            <Link href={toolHref} className={pillClass("dark", "md")}>
              Free inspection in {sel.city}
            </Link>
            {sel.page && (
              <Link href={`${base}/areas/${sel.slug}`} className={pillClass("soft", "md")}>
                Foundation repair in {sel.city}
              </Link>
            )}
          </div>
        </div>

        <div className="mt-9 space-y-4 border-t border-line pt-6">
          {counties.map((county) => (
            <div key={county}>
              <p className="text-[13px] text-muted">{county} County</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {areas
                  .filter((a) => a.county === county)
                  .map((a) => (
                    <li key={a.slug}>
                      <button
                        type="button"
                        aria-pressed={a.slug === selected}
                        onClick={() => setSelected(a.slug)}
                        onMouseEnter={() => setHovered(a.slug)}
                        onMouseLeave={() => setHovered(null)}
                        className={cn(
                          "min-h-9 rounded-full px-3.5 text-[14px] transition-colors",
                          a.slug === selected ? "bg-accent text-white" : "bg-card text-fg hover:bg-[#e6e6e6]",
                          a.page && "font-medium",
                        )}
                      >
                        {a.city}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ---- plotted map ---- */}
      <div className="order-1 lg:order-2">
        <div ref={frameRef} className="relative overflow-hidden rounded-[24px] bg-white">
          <svg
            viewBox={`0 0 ${W} ${height}`}
            className="block h-auto w-full"
            role="img"
            aria-label={`Service area map: ${areas.length} towns around ${business.address.city}. ${sel.city} selected, ${Math.round(fromYard)} miles from our yard.`}
          >
            <defs>
              <pattern id="area-grid" width={unitsPerMile * 5} height={unitsPerMile * 5} patternUnits="userSpaceOnUse" x={yard.x} y={yard.y}>
                <path
                  d={`M ${unitsPerMile * 5} 0 L 0 0 0 ${unitsPerMile * 5}`}
                  fill="none"
                  stroke="rgb(0 0 0 / 0.045)"
                  strokeWidth={1.5}
                />
              </pattern>
            </defs>
            <rect width={W} height={height} fill="url(#area-grid)" />

            {RINGS.map((mi) => (
              <g key={mi}>
                <circle
                  cx={yard.x}
                  cy={yard.y}
                  r={mi * unitsPerMile}
                  fill="none"
                  stroke="rgb(0 0 0 / 0.14)"
                  strokeWidth={1.5}
                  strokeDasharray="4 8"
                />
                <text
                  x={yard.x + px(5)}
                  y={yard.y - mi * unitsPerMile - px(5)}
                  className="fill-muted"
                  style={{ font: `500 ${px(11)}px var(--font-sans)` }}
                >
                  {mi} mi
                </text>
              </g>
            ))}

            {/* measured line: yard → selected town */}
            {fromYard > 1 && (
              <g>
                <line
                  x1={yard.x}
                  y1={yard.y}
                  x2={selPt.x}
                  y2={selPt.y}
                  className="stroke-signal"
                  strokeWidth={px(1.5)}
                  strokeDasharray={`${px(6)} ${px(4)}`}
                />
                <rect x={midX - px(23)} y={midY - px(10)} width={px(46)} height={px(20)} rx={px(10)} className="fill-fg" />
                <text
                  x={midX}
                  y={midY + px(4)}
                  textAnchor="middle"
                  className="fill-white"
                  style={{ font: `600 ${px(12)}px var(--font-sans)` }}
                >
                  {Math.round(fromYard)} mi
                </text>
              </g>
            )}

            {/* towns */}
            {areas.map((a) => {
              const p = pts.get(a.slug)!;
              const isSel = a.slug === selected;
              const isHover = a.slug === hovered;
              return (
                <g
                  key={a.slug}
                  className="cursor-pointer"
                  onClick={() => setSelected(a.slug)}
                  onMouseEnter={() => setHovered(a.slug)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <circle cx={p.x} cy={p.y} r={px(14)} fill="transparent" />
                  {isSel && <circle cx={p.x} cy={p.y} r={px(13)} className="fill-signal/15" />}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={px(isSel ? 6.5 : isHover ? 6 : a.page ? 5 : 3.5)}
                    className={isSel ? "fill-signal" : a.page || isHover ? "fill-fg" : "fill-[#a1a1a6]"}
                    stroke="#fff"
                    strokeWidth={px(1.5)}
                  />
                </g>
              );
            })}

            {/* labels on top of every dot */}
            {labelled.map((a) => {
              const p = pts.get(a.slug)!;
              const at = side(a);
              const isSel = a.slug === selected;
              return (
                <text
                  key={a.slug}
                  x={at === "below" ? p.x : p.x + (at === "left" ? -px(10) : px(10))}
                  y={at === "below" ? p.y + px(10) + labelSize * 0.8 : p.y + labelSize * 0.35}
                  textAnchor={at === "below" ? "middle" : at === "left" ? "end" : "start"}
                  paintOrder="stroke"
                  stroke="#fff"
                  strokeWidth={px(4)}
                  strokeLinejoin="round"
                  className={isSel ? "fill-signal" : "fill-fg"}
                  style={{ font: `${isSel ? 700 : 600} ${labelSize}px var(--font-sans)`, pointerEvents: "none" }}
                >
                  {a.city}
                </text>
              );
            })}

            {/* the yard */}
            <g>
              <rect
                x={yard.x - px(6)}
                y={yard.y - px(6)}
                width={px(12)}
                height={px(12)}
                transform={`rotate(45 ${yard.x} ${yard.y})`}
                className="fill-fg"
                stroke="#fff"
                strokeWidth={px(1.75)}
              />
              <text
                x={yard.x - px(12)}
                y={yard.y + px(20)}
                textAnchor="end"
                paintOrder="stroke"
                stroke="#fff"
                strokeWidth={px(4)}
                className="fill-muted"
                style={{ font: `600 ${px(10)}px var(--font-sans)`, letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                Our yard
              </text>
            </g>

            {/* north + scale */}
            <g transform={`translate(${W - px(24)} ${px(26)}) scale(${k})`} aria-hidden>
              <path d="M0 -14 L5.5 4 L0 1 L-5.5 4 Z" className="fill-fg" />
              <text y={18} textAnchor="middle" className="fill-muted" style={{ font: "600 10px var(--font-sans)" }}>
                N
              </text>
            </g>
            <g transform={`translate(${px(16)} ${height - px(18)})`} aria-hidden>
              <line x1={0} y1={0} x2={unitsPerMile * 10} y2={0} className="stroke-fg" strokeWidth={px(1.5)} />
              <line x1={0} y1={-px(4)} x2={0} y2={px(4)} className="stroke-fg" strokeWidth={px(1.5)} />
              <line x1={unitsPerMile * 10} y1={-px(4)} x2={unitsPerMile * 10} y2={px(4)} className="stroke-fg" strokeWidth={px(1.5)} />
              <text x={unitsPerMile * 5} y={-px(7)} textAnchor="middle" className="fill-muted" style={{ font: `600 ${px(10)}px var(--font-sans)` }}>
                10 miles
              </text>
            </g>
          </svg>
        </div>
        <p className="px-4 pb-3 pt-2 text-[12.5px] text-muted">
          Towns plotted at their city-centre coordinates. Rings measured from our yard on{" "}
          {business.address.street.split(",")[0]}.
        </p>
      </div>
    </div>
  );
}
