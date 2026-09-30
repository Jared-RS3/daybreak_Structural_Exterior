import { AxHead } from "./ax";
import { BedrockMock, ClapboardMock, CornerstoneMock, DryLineMock, KeystoneMock } from "./MiniSites";
import { WorkTabs, type WorkItem } from "./WorkTabs";

/**
 * The work showcase: five concept homepages across the three trades, each
 * labelled as a concept for a fictional company, all drawn in code.
 */
export function WorkShowcase({ offerHref }: { offerHref: string }) {
  const items: WorkItem[] = [
    {
      id: "cornerstone",
      name: "Cornerstone Foundation",
      trade: "Premium foundation repair",
      domain: "cornerstonefoundation.example",
      kind: "concept",
      blurb: "For a high end foundation company. Calm and confident, and it shows homeowners where each pier goes before showing the price.",
      points: ["Pier positions called out on the photo", "Elevation survey explained up front", "Estimate given as a price range", "Inspection booked from the estimate"],
    },
    {
      id: "bedrock",
      name: "Bedrock Foundation Repair",
      trade: "Foundation repair",
      domain: "bedrockfoundation.example",
      kind: "concept",
      blurb: "For a busy foundation repair company. Bold and easy to act on, with the crack checker right at the top.",
      points: ["Crack checker in the first screen", "Phone number always one tap away", "Pages for every repair method", "Reviews beside every call to action"],
    },
    {
      id: "dryline",
      name: "DryLine Crawl Spaces",
      trade: "Crawl space repair",
      domain: "drylinecrawlspaces.example",
      kind: "concept",
      blurb: "For a crawl space company that wants to explain the problem clearly, with the numbers up front.",
      points: ["Musty-smell and moisture question paths", "Humidity before & after on every project", "Encapsulation explained step by step", "Town pages for local search"],
    },
    {
      id: "clapboard",
      name: "Clapboard & Co.",
      trade: "Siding & exterior",
      domain: "clapboardandco.example",
      kind: "concept",
      blurb: "For a siding contractor. Big photos, plus a material and colour picker near the top of the page.",
      points: ["Material & colour picker", "Price range by home size", "HOA & permit guidance", "Book a site visit in two taps"],
    },
    {
      id: "keystone",
      name: "Keystone Basements",
      trade: "Basements & foundations",
      domain: "keystonebasements.example",
      kind: "concept",
      blurb: "For a waterproofing and foundation company. Lots of before & after photos, and a simple way to describe the problem.",
      points: ["Before & after project pages", "Problem picker: cracks, water, floors", "Gallery filtered by repair", "Financing shown next to price"],
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
      </div>
    </section>
  );
}
