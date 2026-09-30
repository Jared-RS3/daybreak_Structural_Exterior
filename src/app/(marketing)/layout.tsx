import { SiteHeader } from "@/components/template/SiteHeader";
import { StickyCta } from "@/components/template/StickyCta";
import { DaybreakFooter } from "@/components/daybreak/DaybreakFooter";
import { daybreak } from "@/lib/daybreak";
import { legal } from "@/lib/agency";

const nav = [
  { label: "Trades", href: "/#trades" },
  { label: "Our work", href: "/#work" },
  { label: "How it works", href: "/#system" },
  { label: "Try the crack checker", href: "/#tools" },
  { label: "FAQ", href: "/#faq" },
];

const primary = { label: "Free homepage design", href: daybreak.offerHref };
const secondary = { label: "See a site we built", href: daybreak.workHref };

/**
 * The agency's own chrome, in the same design language as the contractor
 * sites it builds — so the site that sells the work looks like the work.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white text-fg">
      <SiteHeader
        brand={daybreak}
        homeHref="/"
        nav={nav}
        primary={primary}
        secondary={secondary}
        solidOn={["/privacy", "/terms", "/accessibility"]}
        wide
      />
      <main id="main" className="flex-1">
        {children}
      </main>
      <DaybreakFooter
        brand={daybreak}
        email={daybreak.email}
        entity={legal.entity}
        columns={[
          {
            title: "Daybreak",
            links: [
              { label: "The trades we build for", href: "/#trades" },
              { label: "Our work", href: "/#work" },
              { label: "How it works", href: "/#system" },
              { label: "Value calculator", href: "/#calculator" },
              { label: "Free homepage design", href: daybreak.offerHref },
            ],
          },
          {
            title: "See it working",
            links: [
              { label: "Contractor site we built", href: daybreak.workHref },
              { label: "Crack & symptom checker", href: daybreak.toolHref },
              { label: "Service page example", href: `${daybreak.workHref}/services/foundation-repair` },
              { label: "Case study example", href: `${daybreak.workHref}/projects/arlington-brick-ranch-piers` },
            ],
          },
          {
            title: "Legal",
            links: [
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Accessibility", href: "/accessibility" },
            ],
          },
        ]}
      />
      <StickyCta
        primary={primary}
        secondary={{ label: "Our work", href: daybreak.workHref }}
        hideOn={[]}
        spacerClassName="bg-black"
      />
    </div>
  );
}
