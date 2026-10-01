import { AboutStatement } from "@/components/daybreak/AboutStatement";
import { AutomationFilm } from "@/components/daybreak/AutomationFilm";
import { AxButton } from "@/components/daybreak/ax";
import { AxContact } from "@/components/daybreak/AxContact";
import { AxFaq } from "@/components/daybreak/AxFaq";
import { AxProcess } from "@/components/daybreak/AxProcess";
import { AxReviews } from "@/components/daybreak/AxReviews";
import { AxTerms } from "@/components/daybreak/AxTerms";
import { AxToolBand } from "@/components/daybreak/AxTools";
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
import { WorkShowcase } from "@/components/daybreak/WorkShowcase";
import { Hero } from "@/components/template/Hero";
import { PillLink } from "@/components/template/primitives";
import { CrackChecker } from "@/components/tools/CrackChecker";
import { CrackChip } from "@/components/tools/CrackChip";
import { Icon } from "@/components/ui/Icon";
import { founders } from "@/lib/agency";
import {
  about,
  automationFilm,
  bookingHref,
  daybreak,
  draftReviews,
  faqs,
  heroPromises,
  heroTrust,
  offer,
  placeholderReviews,
  promise,
  reviews,
  process as startSteps,
  system,
} from "@/lib/daybreak";
import { houseImage, tool } from "@/lib/demo-site";
import { openGraphDefaults, site } from "@/lib/seo";
import { homeStructuredData, jsonLd } from "@/lib/structured-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: site.title },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    ...openGraphDefaults,
    url: "/",
    title: site.title,
    description:
      "Custom websites for foundation, crawl space and siding contractors who want more calls, inspection requests and signed jobs. See a site we built, then see a free concept of your own homepage.",
  },
};

/**
 * The agency homepage. The hero is Crest's sky; everything after it is
 * Axion's business-professional language — hairlines, mono labels, square
 * grey panels, black rectangular buttons, a black footer.
 *
 * Order follows a skimming contractor's questions, proof and money before
 * anything about us: is this for my trade (hero) → show me one (work, ending
 * on the live crack checker) → why should it run without me (a 30-second
 * film) → how does it get me jobs → what's it worth to
 * me → what do I have to do (the free concept) → what if I don't like it →
 * who's accountable → questions → the ask. Kept short: each section makes
 * one point, and nothing repeats an earlier one.
 */
export default function AgencyHome() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(homeStructuredData()) }}
      />
      <Hero
        kicker=""
        title="Websites that book foundation, crawl space & siding jobs."
        lede="Custom websites that turn a worried homeowner's search into a booked inspection and a signed job."
        action={
          <>
            <div className="flex justify-center">
              <PillLink
                href={bookingHref}
                variant="light"
                size="lg"
                className="max-sm:px-9"
              >
                {offer.cta}
              </PillLink>
            </div>
            <ul className="mx-auto mt-6 flex w-fit flex-col items-start gap-x-5 gap-y-2 text-[15px] text-white max-sm:gap-y-2.5 max-sm:text-[16px] sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:text-[16px]">
              {heroPromises.map((p) => (
                <li key={p} className="flex items-center gap-1.5 max-sm:gap-3">
                  <Icon
                    name="check"
                    className="size-4.5 text-sun max-sm:size-5"
                  />
                  {p}
                </li>
              ))}
            </ul>
          </>
        }
        proof={
          <HeroProof
            people={founders.map((f) => ({ name: f.name, src: f.headshot }))}
            claim="Every client we've worked with is still with us."
            byline="Jared & Yaaseen, founders"
          />
        }
        house={houseImage}
        inset={<CrackChip href="#tools" compact />}
        phone="proof-first"
        trust={heroTrust}
        trustMarquee
        trustNote={null}
      />

      <WorkShowcase
        offerHref={daybreak.offerHref}
        tool={
          <AxToolBand tool={tool} checker={<CrackChecker shape="square" />} />
        }
      />

      {/* Real reviews go in lib/daybreak.ts. Drafts awaiting a client's
          approval show in development only. */}
      {reviews.length ? (
        <AxReviews
          reviews={
            process.env.NODE_ENV === "development"
              ? [...reviews, ...draftReviews]
              : reviews
          }
        />
      ) : (
        process.env.NODE_ENV === "development" && (
          <AxReviews reviews={placeholderReviews} placeholder />
        )
      )}

      <section
        id="system"
        aria-labelledby="system-title"
        className="scroll-mt-20 overflow-clip bg-panel py-20 sm:py-24 lg:py-28"
      >
        <div className="container-wide">
          <AutomationFilm
            label="Why it matters"
            title={
              <>
                A business that stops
                <br className="hidden sm:block" /> when you do is a job.
              </>
            }
            lede="The contractors who grow are the ones whose leads get answered, booked and followed up while they're on a roof, in a crawl space, or off for the day. Thirty seconds on why."
            src={automationFilm.src}
            poster={automationFilm.poster}
            duration={`0:${automationFilm.seconds}`}
          />
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
              label: "Get a free homepage concept",
            }}
          />
        </div>
      </section>

      {/* <AxCalculator trades={calculatorTrades} offerHref={daybreak.offerHref} /> */}

      <AxProcess
        steps={startSteps}
        title="Start with a free homepage concept."
        lede="See your company on a better website before you spend anything. The concept is free; the final design and build are paid work, at a fixed price you agree first."
        action={<AxButton href={daybreak.offerHref}>{offer.cta}</AxButton>}
      />

      <AxTerms
        label="Our promise"
        title={promise.title}
        lede={promise.lede}
        items={promise.items}
      />

      <AboutStatement
        label="Who you'll work with"
        statement={about.statement}
        offerHref={daybreak.offerHref}
        stats={about.stats}
        people={founders.map((f) => ({
          name: f.name,
          role: f.role,
          src: f.portrait,
        }))}
      />

      <AxFaq items={faqs} email={daybreak.email} />

      <AxContact
        label={offer.label}
        title="Get your free homepage concept."
        lede="Answer a few quick questions about your business. We'll design a concept of your new homepage, with your logo, services and towns, and walk you through it on a call. No cost, no obligation."
        includes={offer.includes}
        email={daybreak.email}
        image="/images/aerial-neighborhood.jpg"
      />
    </>
  );
}
