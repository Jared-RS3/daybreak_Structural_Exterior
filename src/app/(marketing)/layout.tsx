import { CookieSettingsButton } from "@/components/consent/CookieConsent";
import { DaybreakFooter } from "@/components/daybreak/DaybreakFooter";
import { ToolLauncher } from "@/components/daybreak/ToolLauncher";
import { SiteHeader } from "@/components/template/SiteHeader";
import { legal } from "@/lib/agency";
import { analyticsOn } from "@/lib/analytics";
import { daybreak, offer, tradePages } from "@/lib/daybreak";

const nav = [
  { label: "Our work", href: "/#work" },
  { label: "Try our tools", href: "/#tools" },
  { label: "How it works", href: "/how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

const primary = { label: offer.cta, href: daybreak.offerHref };
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
        solidOn={[
          "/privacy",
          "/terms",
          "/accessibility",
          "/paia",
          "/how-it-works",
          "/calculator",
          "/foundation-repair-websites",
          "/crawl-space-websites",
          "/siding-websites",
        ]}
        wide
      />
      <main id="main" className="flex-1">
        {children}
      </main>
      <DaybreakFooter
        brand={{ ...daybreak, name: "Daybreak" }}
        email={daybreak.email}
        // The registered name and number on every page: the Companies Act
        // (s32(4)) wants both on a company's publications, websites included.
        entity={[
          `${legal.entity}, trading as ${legal.tradingName}`,
          legal.registrationNumber && `Reg. no. ${legal.registrationNumber}`,
        ]
          .filter(Boolean)
          .join(" · ")}
        company={{
          name: legal.company,
          legalName: legal.entity,
          href: legal.companyUrl,
        }}
        legalExtra={
          analyticsOn && (
            <CookieSettingsButton className="mono-label text-[12.5px] text-white/60 underline underline-offset-4 transition-colors hover:text-white" />
          )
        }
        columns={[
          {
            title: "Daybreak",
            links: [
              { label: "Our work", href: "/#work" },
              { label: "How it works", href: "/how-it-works" },
              { label: "Who you'll work with", href: "/#about" },
              { label: "Book a free call", href: daybreak.offerHref },
            ],
          },
          {
            title: "Trades",
            links: [
              {
                label: "Foundation repair",
                href: "/foundation-repair-websites",
              },
              { label: "Crawl space", href: "/crawl-space-websites" },
              { label: "Siding", href: "/siding-websites" },
            ],
          },
          {
            title: "Legal",
            links: [
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Accessibility", href: "/accessibility" },
              { label: "PAIA Manual", href: "/paia" },
            ],
          },
        ]}
      />
      {/* The live tools, in the corner of every sales page. Each trade page
          says which tools it shows and which section opens first. */}
      <ToolLauncher
        pages={Object.fromEntries(
          Object.values(tradePages).map((p) => [p.path, { checker: p.tool, focus: p.focus }]),
        )}
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
