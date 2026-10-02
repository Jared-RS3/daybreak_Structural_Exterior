import { AboutStatement } from "@/components/daybreak/AboutStatement";
import { AutomationFilm } from "@/components/daybreak/AutomationFilm";
import { AutomationRun } from "@/components/daybreak/AutomationRun";
import { AxButton } from "@/components/daybreak/ax";
import { AxComparison } from "@/components/daybreak/AxComparison";
import { AxContact } from "@/components/daybreak/AxContact";
import { AxFaq } from "@/components/daybreak/AxFaq";
import { AxProcess } from "@/components/daybreak/AxProcess";
import { AxReviews } from "@/components/daybreak/AxReviews";
import { AxTerms } from "@/components/daybreak/AxTerms";
import { AxToolBand } from "@/components/daybreak/AxTools";
import { HeroProof } from "@/components/daybreak/HeroProof";
import { LeakBand, LostRevenue } from "@/components/daybreak/LostRevenue";
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
  beforeAfter,
  bookingHref,
  callSteps,
  daybreak,
  draftReviews,
  faqs,
  heroPromises,
  heroTrust,
  leakBand,
  liveRun,
  liveRunCopy,
  lostLeadStats,
  offer,
  placeholderReviews,
  promise,
  reviews,
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
 * One job: get a busy contractor onto a call. Each section answers the next
 * question they'd ask, in order. NN/g's eyetracking puts 57% of viewing time
 * on the first screen and 74% on the first two, so the founder on camera and
 * the money problem sit straight under the hero, ahead of everything else.
 *
 *   1. Is this for my trade?             hero
 *   2. Are these people real?            the founder's 30-second film
 *      Am I losing money right now?      lost-revenue band, two sourced stats
 *   3. Can you actually build it?        our work, ending on the crack checker
 *   4. How would it stop the leak?       one missed call, saved live
 *   5. What changes for me?              before & after
 *   6. What happens if I book a call?    the call in three steps → book
 *   7. What if it's not for me?          the promise: free concept, you own it
 *   8. Do other clients trust you?       reviews
 *      Who would I be dealing with?      the founders
 *   9. Anything else?                    FAQ
 *  10. Book the call.
 *
 * /how-it-works holds the extra detail (the 6-step journey, the three leaks
 * card by card, outcomes, how we start) for the visitor who wants more. Every
 * point that sells the call is here as well. The lost-revenue calculator is
 * at /calculator, unlisted, to work through with a contractor on the call
 * (step two above).
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

      <LeakBand
        {...leakBand}
        stats={lostLeadStats}
        href="/how-it-works#leaks"
        before={
          <AutomationFilm
            label="From the founders"
            title={
              <>
                A business that stops
                <br className="hidden sm:block" /> when you do is a job.
              </>
            }
            lede="Thirty seconds from us on why the contractors who grow are the ones whose leads get answered, booked and followed up while they're on a roof, in a crawl space, or off for the day."
            src={automationFilm.src}
            poster={automationFilm.poster}
            duration={`0:${automationFilm.seconds}`}
          />
        }
      />

      <WorkShowcase
        offerHref={daybreak.offerHref}
        tool={
          <AxToolBand tool={tool} checker={<CrackChecker shape="square" />} />
        }
      />

      <LostRevenue
        label={liveRunCopy.label}
        title={
          <>
            {liveRunCopy.title[0]}
            <br /> {liveRunCopy.title[1]}
          </>
        }
        lede={liveRunCopy.lede}
        run={<AutomationRun steps={liveRun} />}
        action={
          <AxButton href="/how-it-works" variant="line">
            See the full system
            <Icon name="arrowRight" className="size-4" />
          </AxButton>
        }
      />

      <AxComparison
        label="Before & after"
        title="The same lead, before and after Daybreak."
        lede="Homeowners find you the same way they do now. What changes is what happens in the first minute, and in the month after the quote."
        data={beforeAfter}
      />

      <AxProcess
        id="call"
        label="Your first call"
        title="What happens when you book a call."
        lede="One call with the two of us. You see your new homepage, we work out what your missed calls and unsold estimates are costing you, and you leave with a fixed price if it's a fit."
        steps={callSteps}
        action={<AxButton href={bookingHref}>Book a discovery call</AxButton>}
      />

      <AxTerms
        label="Our promise"
        title={promise.title}
        lede={promise.lede}
        items={promise.items}
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
