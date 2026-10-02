import { AxHead } from "./ax";
import { BedrockMock, ClapboardMock, CornerstoneMock, DryLineMock, KeystoneMock } from "./MiniSites";
import { WorkTabs, type WorkItem } from "./WorkTabs";

/**
 * The work showcase: five concept homepages across the three trades, each
 * labelled as a concept for a fictional company, all drawn in code. `tool`
 * (the live crack checker) follows the tabs, so the proof ends with something
 * the contractor can try for themselves.
 */
export function WorkShowcase({ offerHref, tool }: { offerHref: string; tool?: React.ReactNode }) {
  const items: WorkItem[] = [
    {
      id: "cornerstone",
      name: "Cornerstone Foundation",
      trade: "Premium foundation repair",
      domain: "cornerstonefoundation.example",
      kind: "concept",
      blurb: "For a high end foundation company. Calm and confident, and it shows homeowners where each pier goes before showing the price.",
      behind: ["Lead qualification", "CRM", "SMS follow-up", "Inspection booking"],
    },
    {
      id: "bedrock",
      name: "Bedrock Foundation Repair",
      trade: "Foundation repair",
      domain: "bedrockfoundation.example",
      kind: "concept",
      blurb: "For a busy foundation repair company. Bold and easy to act on, with the crack checker right at the top.",
      behind: ["Crack checker", "CRM", "SMS follow-up", "Inspection booking"],
    },
    {
      id: "dryline",
      name: "DryLine Crawl Spaces",
      trade: "Crawl space repair",
      domain: "drylinecrawlspaces.example",
      kind: "concept",
      blurb: "For a crawl space company that wants to explain the problem clearly, with the numbers up front.",
      behind: ["Moisture questions", "CRM", "SMS follow-up", "Inspection booking"],
    },
    {
      id: "clapboard",
      name: "Clapboard & Co.",
      trade: "Siding & exterior",
      domain: "clapboardandco.example",
      kind: "concept",
      blurb: "For a siding contractor. Big photos, plus a material and colour picker near the top of the page.",
      behind: ["Project qualifier", "CRM", "SMS follow-up", "Estimate booking"],
    },
    {
      id: "keystone",
      name: "Keystone Basements",
      trade: "Basements & foundations",
      domain: "keystonebasements.example",
      kind: "concept",
      blurb: "For a waterproofing and foundation company. Lots of before & after photos, and a simple way to describe the problem.",
      behind: ["Lead qualification", "CRM", "SMS follow-up", "Inspection booking"],
    },
  ];

  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-20 bg-panel py-20 sm:py-24 lg:py-28">
      <div className="container-wide">
        <AxHead
          id="work-title"
          label="Our work"
          title={
            <>
              Sites built for
              <br className="hidden sm:block" /> the trades.
            </>
          }
          lede="Sample homepages we designed for foundation, crawl space and siding contractors. Each one is built around how that business gets its jobs."
        />
        <div className="mt-14 lg:mt-16">
          <WorkTabs
            items={items}
            offerHref={offerHref}
            mobileOrder={["bedrock", "dryline", "clapboard", "keystone", "cornerstone"]}
            previews={[
              <CornerstoneMock key="c" />,
              <BedrockMock key="b" />,
              <DryLineMock key="d" />,
              <ClapboardMock key="cl" />,
              <KeystoneMock key="k" />,
            ]}
          />
        </div>
        {tool && <div className="mt-10 lg:mt-14">{tool}</div>}
      </div>
    </section>
  );
}
