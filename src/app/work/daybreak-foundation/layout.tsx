import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/template/SiteHeader";
import { SiteFooter } from "@/components/template/SiteFooter";
import { StickyCta } from "@/components/template/StickyCta";
import { Icon } from "@/components/ui/Icon";
import { areas, company, demoBase, homeHref, quoteCta, services, siteTheme, tool } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${company.name} — Foundation Repair in ${company.locality} | Daybreak reference build`,
    template: `%s | ${company.name} (reference build)`,
  },
  description:
    "A complete, working foundation repair, crawl space and siding website built by Daybreak: a crack & symptom checker, inspection booking, and the conversion architecture behind it. Demonstration build — the contractor is fictional.",
  // The contractor here is fictional. Letting search engines index it under
  // the agency's domain would put a business that does not exist into local
  // results, so the whole subtree stays out of the index. Structured data is
  // built (lib/template/schema.ts) but held behind `publishStructuredData`
  // for the same reason.
  robots: { index: false, follow: true },
};


const nav = [
  { label: "Services", href: `${homeHref}#services` },
  { label: "Projects", href: `${demoBase}/projects` },
  { label: "Reviews", href: `${homeHref}#reviews` },
  { label: "Service area", href: `${homeHref}#areas` },
];

// The contractor's own call to action leads; the crack checker is one feature.
const primary = quoteCta;
const secondary = { label: tool.cta, href: tool.href };

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={siteTheme as React.CSSProperties}
      className="flex min-h-full flex-1 flex-col bg-white text-fg"
    >
      {/* Says what this is before anything else does. Set in the sky's own
          colour so it reads as part of the page, not a warning bar. */}
      <aside className="relative z-[60] bg-sky-1 text-white">
        <div className="container-x flex items-center justify-between gap-4 py-2 text-[13px]">
          <p className="min-w-0 truncate">
            <span className="mr-2 font-semibold">Reference build</span>
            <span className="hidden text-white/85 sm:inline">
              A working home-services site by Daybreak. The contractor, reviews and figures are illustrative.
            </span>
            <span className="text-white/85 sm:hidden">Fictional contractor</span>
          </p>
          <Link href="/" className="group inline-flex shrink-0 items-center gap-1.5 font-medium hover:text-white/80">
            Back to Daybreak
            <Icon name="arrowRight" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </aside>

      <SiteHeader
        brand={company}
        phone={{
          display: company.phoneDisplay,
          href: company.phoneHref,
          note: `${company.hours[0].d}, ${company.hours[0].h}`,
        }}
        homeHref={homeHref}
        nav={nav}
        primary={primary}
        secondary={secondary}
        solidOn={[`${demoBase}/book`]}
      />

      <main id="main" className="flex-1">
        {children}
      </main>

      <SiteFooter
        business={company}
        base={demoBase}
        services={services}
        areas={areas.filter((a) => a.page)}
        links={[
          { label: tool.name, href: tool.href },
          { label: quoteCta.label, href: quoteCta.href },
          { label: "Recent projects", href: `${demoBase}/projects` },
          { label: "Reviews", href: `${homeHref}#reviews` },
          { label: "Questions", href: `${homeHref}#faq` },
        ]}
        disclaimer={
          <>
            <p className="text-[14px] font-semibold text-fg">Concept demonstration</p>
            <p className="mt-2 max-w-3xl text-[13.5px] leading-[1.65] text-fg/75">
              {company.name} is a fictional business built by Daybreak to demonstrate a foundation
              repair, crawl space and siding website. Company details, project histories, reviews,
              ratings, guarantees and pricing are illustrative and do not describe a real contractor.
              Crack checker results are a rule of thumb, not an engineering assessment or a quote.
            </p>
          </>
        }
      />

      <StickyCta
        primary={primary}
        secondary={{ label: "Call", href: company.phoneHref, icon: "phone" }}
        hideOn={[`${demoBase}/book`]}
      />
    </div>
  );
}
