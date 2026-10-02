import { AxButton, AxLabel } from "@/components/daybreak/ax";
import { AxComparison } from "@/components/daybreak/AxComparison";
import { AutomationRun } from "@/components/daybreak/AutomationRun";
import { AxProcess } from "@/components/daybreak/AxProcess";
import {
  Integrations,
  LostRevenue,
  Outcomes,
} from "@/components/daybreak/LostRevenue";
import { SystemJourney } from "@/components/daybreak/SystemJourney";
import {
  SceneCapture,
  SceneEstimate,
  SceneFollowUp,
  SceneRespond,
  SceneRevenue,
  SceneSearch,
} from "@/components/daybreak/SystemScenes";
import {
  beforeAfter,
  daybreak,
  integrations,
  leaks,
  liveRun,
  liveRunCopy,
  offer,
  outcomes,
  process as startSteps,
  system,
} from "@/lib/daybreak";
import { openGraphDefaults } from "@/lib/seo";
import { howItWorksStructuredData, jsonLd } from "@/lib/structured-data";
import type { Metadata } from "next";

const title = "How it works";
const description =
  "How a Daybreak website and the automations behind it turn more of a foundation, crawl space or siding contractor's leads into booked inspections and signed jobs.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    ...openGraphDefaults,
    url: "/how-it-works",
    title: "How it works | Daybreak Structure-Works",
    description,
  },
};

/**
 * The detail behind the homepage, for the contractor who wants more before a
 * call: the three places leads leak out card by card and one being saved
 * live (where the homepage's "See where you're losing leads" lands), how the
 * site wins a job end to end, how we start, and before and after with the
 * outcomes. The
 * homepage carries every point that sells the call; this page adds depth.
 */
export default function HowItWorks() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(howItWorksStructuredData({ title, description })),
        }}
      />

      <header className="bg-white pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="container-wide">
          <div className="border-t border-rule pt-6">
            <AxLabel>How it works</AxLabel>
          </div>
          <h1 className="font-home mt-10 max-w-4xl text-[clamp(2.4rem,5vw,4.4rem)] font-normal leading-[1.04] tracking-[-0.035em] text-fg lg:mt-14">
            How a Daybreak site turns more of your leads into jobs.
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.6] text-muted">
            The website that gets you found, the automations that answer, book
            and follow up, and what changes when they run.
          </p>
          <div className="mt-8">
            <AxButton href={daybreak.offerHref}>{offer.cta}</AxButton>
          </div>
        </div>
      </header>

      <LostRevenue
        id="leaks"
        label="Lost revenue"
        title="Three places jobs leak out, and how we plug them."
        lede="Missed calls, slow replies and unsold estimates. Each one is a lead you already paid for."
        leaks={leaks}
        runHead={{
          label: liveRunCopy.label,
          title: (
            <>
              {liveRunCopy.title[0]}
              <br /> {liveRunCopy.title[1]}
            </>
          ),
          lede: liveRunCopy.lede,
        }}
        run={<AutomationRun steps={liveRun} />}
      />

      <section
        id="system"
        aria-labelledby="system-title"
        className="scroll-mt-20 overflow-clip bg-panel py-20 sm:py-24 lg:py-28"
      >
        <div className="container-wide">
          <SystemJourney
            label="From search to signed job"
            titleId="system-title"
            title={
              <>
                How your new website
                <br className="hidden sm:block" /> wins you jobs.
              </>
            }
            lede="Here's what happens when a homeowner finds you on Google."
            steps={system}
            scenes={[
              <SceneSearch key="search" />,
              <SceneEstimate key="estimate" />,
              <SceneCapture key="capture" />,
              <SceneRespond key="respond" />,
              <SceneFollowUp key="follow" />,
              <SceneRevenue key="revenue" />,
            ]}
            end={{
              href: daybreak.offerHref,
              label: "Get a free homepage concept",
            }}
          />
        </div>
      </section>

      <AxProcess
        steps={startSteps}
        title="Start with a free homepage concept."
        lede="See your company on a better website before you spend anything. The concept is free; the final design and build are paid work, at a fixed price you agree first."
        action={<AxButton href={daybreak.offerHref}>{offer.cta}</AxButton>}
      />

      <AxComparison
        label="Before & after"
        title="The same lead, before and after Daybreak."
        lede="Homeowners find you the same way they do now. What changes is what happens in the first minute, and in the month after the quote."
        data={beforeAfter}
      >
        <Outcomes items={outcomes} />
        <Integrations tools={integrations} />
        <div className="mt-12">
          <AxButton href={daybreak.offerHref}>{offer.cta}</AxButton>
        </div>
      </AxComparison>

    </>
  );
}
