import { DaybreakFooter } from "@/components/daybreak/DaybreakFooter";
import { SiteHeader } from "@/components/template/SiteHeader";
import { legal } from "@/lib/agency";
import { daybreak } from "@/lib/daybreak";

const nav = [
  { label: "Our work", href: "/#work" },
  { label: "Try the crack checker", href: "/#tools" },
  { label: "How it works", href: "/#system" },
  { label: "FAQ", href: "/#faq" },
];

const primary = { label: "Free homepage concept", href: daybreak.offerHref };
const secondary = { label: "See our work", href: "/#work" };

/**
 * The agency's own chrome, in the same design language as the contractor
 * sites it builds — so the site that sells the work looks like the work.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        brand={{ ...daybreak, name: "Daybreak" }}
        email={daybreak.email}
        entity={legal.entity}
        columns={[
          {
            title: "Daybreak",
            links: [
              { label: "Our work", href: "/#work" },
              { label: "How it works", href: "/#system" },
              { label: "Who you'll work with", href: "/#about" },
              { label: "Free homepage concept", href: daybreak.offerHref },
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
      {/* <StickyCta
        primary={primary}
        secondary={secondary}
        hideOn={[]}
        spacerClassName="bg-black"
      /> */}
    </div>
  );
}
