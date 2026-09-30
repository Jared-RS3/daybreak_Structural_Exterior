import Link from "next/link";
import type { Area, Business, Cta, Service } from "@/lib/template/types";
import { Wordmark } from "./SiteHeader";

/**
 * Sits in the closing sky, as Crest's footer does — but with dark type:
 * white on this blue measures about 2:1, dark measures 11:1.
 *
 * The link columns are also the site's internal-linking spine: every service
 * page and every area page is one click from every page.
 */
export function SiteFooter({
  business,
  base,
  services,
  areas,
  links,
  disclaimer,
}: {
  business: Business;
  base: string;
  services: Service[];
  areas: Area[];
  links: Cta[];
  disclaimer?: React.ReactNode;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sky-5 text-fg">
      <div className="container-x">
        <div className="grid gap-12 border-t border-fg/10 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <Link href={base || "/"} aria-label={`${business.name} — home`}>
              <Wordmark brand={business} tone="dark" />
            </Link>
            <p className="mt-5 max-w-xs text-[15px] leading-[1.6] text-fg/75">
              Family-owned in {business.address.city} since {business.founded}. Foundation and crawl space repair, and the
              siding around it — all by our own crews.
            </p>
            <a href={business.phoneHref} className="font-home mt-6 inline-block text-[26px] font-medium tracking-[-0.03em] tabular-nums hover:opacity-70">
              {business.phoneDisplay}
            </a>
            <address className="mt-3 text-[14px] not-italic leading-[1.6] text-fg/75">
              {business.address.street}, {business.address.city}, {business.address.state} {business.address.zip}
              <br />
              <a href={`mailto:${business.email}`} className="hover:text-fg">
                {business.email}
              </a>
            </address>
          </div>

          <FooterList title="Services">
            {services.map((s) => (
              <FooterLink key={s.slug} href={`${base}/services/${s.slug}`}>
                {s.title}
              </FooterLink>
            ))}
          </FooterList>

          <FooterList title="Service areas">
            {areas.map((a) => (
              <FooterLink key={a.slug} href={`${base}/areas/${a.slug}`}>
                Foundation repair in {a.city}
              </FooterLink>
            ))}
          </FooterList>

          <FooterList title="Company">
            {links.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterList>
        </div>

        {disclaimer && <div className="border-t border-fg/10 py-8">{disclaimer}</div>}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-fg/10 py-8 text-[13.5px] text-fg/70">
          <p>
            © {year} {business.legal}. {business.license}.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            {business.hours.map((h) => (
              <span key={h.d}>
                {h.d.replace("Monday – Friday", "Mon–Fri")}: {h.h}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[14px] font-semibold text-fg">{title}</h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-[15px] text-fg/75 transition-colors hover:text-fg">
        {children}
      </Link>
    </li>
  );
}
