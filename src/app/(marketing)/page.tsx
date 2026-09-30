import { AboutStatement } from "@/components/daybreak/AboutStatement";
import { AxCalculator } from "@/components/daybreak/AxCalculator";
import { AxContact } from "@/components/daybreak/AxContact";
import { AxFaq } from "@/components/daybreak/AxFaq";
import { AxProcess } from "@/components/daybreak/AxProcess";
import { AxTerms } from "@/components/daybreak/AxTerms";
import { AxTools } from "@/components/daybreak/AxTools";
import { Founders } from "@/components/daybreak/Founders";
import { HeroProof } from "@/components/daybreak/HeroProof";
import { SystemJourney } from "@/components/daybreak/SystemJourney";
import {
  SceneCapture,
  SceneEstimate,
  SceneFollowUp,
  SceneRespond,
  SceneRevenue,
  SceneSearch,
} from "@/components/daybreak/SystemScenes";
import { TradesList } from "@/components/daybreak/TradesList";
import { WorkShowcase } from "@/components/daybreak/WorkShowcase";
import { CrackChecker } from "@/components/tools/CrackChecker";
import { CrackChip } from "@/components/tools/CrackChip";
import { Hero } from "@/components/template/Hero";
import { PillLink } from "@/components/template/primitives";
import { Icon } from "@/components/ui/Icon";
import { founders } from "@/lib/agency";
import {
  about,
  bookingHref,
  calculatorTrades,
  daybreak,
  faqs,
  founderNote,
  heroPromises,
  heroTrust,
  offer,
  process,
  promise,
  system,
  trades,
} from "@/lib/daybreak";
import { houseImage, quoteCta, tool } from "@/lib/demo-site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daybreak | Websites for foundation repair, crawl space & siding contractors",
  description:
    "Daybreak builds custom websites for foundation repair, crawl space and siding contractors. We design lead-generating sites that turn a worried homeowner into a booked inspection, and show you exactly where each lead came from. Get your homepage designed free.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Daybreak",
    title: "Daybreak | Websites for foundation repair, crawl space & siding contractors",
    description:
      "Custom websites for foundation, crawl space and siding contractors who want more calls, inspection requests and signed jobs. See a site we built, then get your own homepage designed free.",
  },
};

/**
 * The agency homepage. The hero is Crest's sky; everything after it is
 * Axion's business-professional language — hairlines, mono labels, square
 * grey panels, black rectangular buttons, a black footer.
 *
 * Order follows a contractor's questions: what is this (hero) → who are you
 * (about) → is it for my trade → show me → what's behind it → what do
 * homeowners see → what it's worth to me → how it starts → who's
 * accountable → what if I don't like it → questions → the ask. Kept short:
 * each section makes one point, and nothing repeats an earlier one.
 */
export default function AgencyHome() {
  return (
    <>
      <Hero
        kicker="Websites for foundation, crawl space & siding contractors"
        title="Websites that book foundation, crawl space & siding jobs."
        lede="We design custom websites for foundation repair, crawl space and siding contractors that turn a worried homeowner's search into a call, a booked inspection and a signed job."
        action={
          <>
            <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <PillLink href={daybreak.offerHref} variant="light" size="lg">
                {offer.cta}
              </PillLink>
              <PillLink href={bookingHref} variant="glass" size="lg">
                <Icon name="calendar" className="size-4.5" />
                Book a call
              </PillLink>
            </div>
            <ul className="mx-auto mt-6 flex w-fit flex-col items-start gap-x-5 gap-y-2 text-[15px] text-white sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:text-[16px]">
              {heroPromises.map((p) => (
                <li key={p} className="flex items-center gap-1.5">
                  <Icon name="check" className="size-4.5 text-sun" />
                  {p}
                </li>
              ))}
            </ul>
          </>
        }
        // secondary={{ label: "See a site we built", href: daybreak.workHref }}
        proof={
          <HeroProof
            people={founders.map((f) => ({ name: f.name, src: f.headshot }))}
            claim="Every client we've worked with is still with us."
            byline="Jason & Jared, founders"
          />
        }
        house={houseImage}
        inset={<CrackChip href="#tools" />}
        trust={heroTrust}
        trustMarquee
        trustNote={null}
      />

      <AboutStatement
        statement={about.statement}
        stats={about.stats}
        people={founders.map((f) => ({
          name: f.name,
          role: f.role,
          src: f.portrait,
        }))}
      />

      <TradesList trades={trades} />

      <WorkShowcase offerHref={daybreak.offerHref} />

      <section
        id="system"
        aria-labelledby="system-title"
        className="scroll-mt-20 overflow-clip bg-panel py-20 sm:py-24 lg:py-28"
      >
        <div className="container-wide">
          <SystemJourney
            label="How it works"
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
              label: "Get a free homepage design",
            }}
            live={{ href: daybreak.workHref, label: "See it on a live site" }}
          />
        </div>
      </section>

      <AxTools
        tool={tool}
        title={
          <>
            Tell homeowners if their
            <br className="hidden sm:block" /> crack is serious.
          </>
        }
        lede="The first thing a worried homeowner wants to know is how bad it is. Your site answers that in 30 seconds, then books the inspection."
        checker={<CrackChecker shape="square" bookHref={quoteCta.href} />}
      />

      <AxCalculator trades={calculatorTrades} offerHref={daybreak.offerHref} />

      <AxProcess steps={process} title="How we get started." />

      <Founders
        founders={founders}
        agencyName={daybreak.name}
        note={founderNote}
        image="/images/hero_founder.png"
      />

      <AxTerms
        label="Our promise"
        title={promise.title}
        lede={promise.lede}
        items={promise.items}
      />

      <AxFaq items={faqs} email={daybreak.email} />

      <AxContact
        label={offer.label}
        title="Get your homepage designed free."
        lede="Tell us about your company and we'll design your new homepage, with your logo, your services and the towns you work in. You see it before you pay anything. No cost, no obligation."
        includes={offer.includes}
        email={daybreak.email}
        image="/images/aerial-neighborhood.jpg"
      />
    </>
  );
}
