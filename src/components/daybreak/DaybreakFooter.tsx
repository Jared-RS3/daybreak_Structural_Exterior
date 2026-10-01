import Link from "next/link";
import { AxLabel } from "./ax";

/**
 * Axion's footer: black, the wordmark set enormous in a near-black grey, then
 * a line about the company, the link columns in mono labels, and the legal
 * line. The demo disclaimer lives here too, because the agency links to a
 * fictional contractor and should say so on every page.
 */
export function DaybreakFooter({
  brand,
  email,
  entity,
  columns,
}: {
  brand: { name: string; descriptor: string };
  email: string;
  entity: string;
  columns: { title: string; links: { label: string; href: string }[] }[];
}) {
  const year = new Date().getFullYear();
  // A multi-word name stacks: the first word on its own line, the rest below,
  // each stretched to the full width. The second line is sized to its length
  // (an uppercase glyph here averages ~0.66em) so neither line is squashed.
  const [lead, ...rest] = brand.name.toUpperCase().split(" ");
  const tail = rest.join(" ");
  const tailSize = tail
    ? Math.min(188, Math.round(1000 / (tail.length * 0.66)))
    : 0;
  const tailY = 138 + 18 + Math.round(tailSize * 0.72);
  const height = tail ? tailY + 12 : 150;
  return (
    <footer className="overflow-hidden bg-black text-white">
      <div className="container-wide">
        {/* SVG text stretched to the container, so the wordmark spans the
            full width at every screen size without overflowing. */}
        <svg
          aria-hidden
          viewBox={`0 0 1000 ${height}`}
          className="mt-14 block h-auto w-full select-none"
        >
          <text
            x="0"
            y="138"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            className="fill-[#2b2b2b]"
            style={{
              font: "500 188px var(--font-home)",
              letterSpacing: "-0.04em",
            }}
          >
            {lead}
          </text>
          {tail && (
            <text
              x="0"
              y={tailY}
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              className="fill-[#2b2b2b]"
              style={{
                font: `500 ${tailSize}px var(--font-home)`,
                letterSpacing: "-0.04em",
              }}
            >
              {tail}
            </text>
          )}
        </svg>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <p className="font-home text-[22px] tracking-[-0.02em] text-white">
              Websites built for the work ahead.
            </p>
            <p className="mt-3 max-w-xs text-[16.5px] leading-[1.6] text-white/60">
              Websites, tools and lead systems for foundation repair, crawl
              space and siding contractors.
            </p>
            <a
              href={`mailto:${email}`}
              className="mono-label mt-8 inline-flex h-11 items-center border border-white/25 px-4 text-white transition-colors hover:border-white"
            >
              {email}
            </a>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <p className="mono-label text-[12.5px] text-white/50">
                {c.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[16.5px] text-white/85 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 py-8 text-white/60">
          <AxLabel tone="light" className="text-white/60">
            © {year} {entity}
          </AxLabel>
        </div>
      </div>
    </footer>
  );
}
