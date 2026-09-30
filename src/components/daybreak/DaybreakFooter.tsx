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
  return (
    <footer className="overflow-hidden bg-black text-white">
      <div className="container-wide">
        {/* SVG text stretched to the container, so the wordmark spans the
            full width at every screen size without overflowing. */}
        <svg aria-hidden viewBox="0 0 1000 150" className="mt-14 block h-auto w-full select-none">
          <text
            x="0"
            y="138"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            className="fill-[#2b2b2b]"
            style={{ font: "500 188px var(--font-home)", letterSpacing: "-0.04em" }}
          >
            {brand.name.toUpperCase()}
          </text>
        </svg>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <p className="font-home text-[22px] tracking-[-0.02em] text-white">Websites built for the work ahead.</p>
            <p className="mt-3 max-w-xs text-[16.5px] leading-[1.6] text-white/60">
              Websites, tools and lead systems for foundation repair, crawl space and siding contractors.
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
              <p className="mono-label text-[12.5px] text-white/50">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[16.5px] text-white/85 transition-colors hover:text-white">
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
          <p className="text-[14px]">The contractor site at /work/daybreak-foundation is a fictional company built to demonstrate our work.</p>
        </div>
      </div>
    </footer>
  );
}
