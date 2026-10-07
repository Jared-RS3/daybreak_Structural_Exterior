import { AutomationRun } from "@/components/daybreak/AutomationRun";
import { AxButton, AxLabel } from "@/components/daybreak/ax";
import { AxContact } from "@/components/daybreak/AxContact";
import { AxFaq } from "@/components/daybreak/AxFaq";
import { AxProcess } from "@/components/daybreak/AxProcess";
import { EstimateFollowUp } from "@/components/daybreak/EstimateFollowUp";
import { LostRevenue } from "@/components/daybreak/LostRevenue";
import { SystemStrip } from "@/components/daybreak/SystemStrip";
import { ToolPrompt } from "@/components/daybreak/ToolPrompt";
import { WorkShowcase } from "@/components/daybreak/WorkShowcase";
import { Img } from "@/components/ui/Img";
import {
  bookingHref,
  daybreak,
  estimateFollowUp,
  liveRun,
  liveRunCopy,
  offer,
  type TradePage as Trade,
} from "@/lib/daybreak";
import { jsonLd, tradePageStructuredData } from "@/lib/structured-data";

/** Every ask opens the booking calendar; the form stays at the foot. */
const formHref = bookingHref;

/**
 * One trade's landing page, for the contractor who searched for their own
 * trade: what we build for it, where its leads leak, the path the site takes
 * a homeowner down, that trade's concepts (and the checker, where it fits),
 * follow-up, its questions, then the form. Every section
 * is one the homepage already uses, so the two never look like different
 * companies.
 */
export function TradePage({ page }: { page: Trade }) {
  const { journey } = page;
  const one = page.concepts.length === 1;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(tradePageStructuredData(page)),
        }}
      />

      <header className="bg-white pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="container-wide">
          <div className="border-t border-rule pt-6">
            <AxLabel>{journey.trade}</AxLabel>
          </div>
          <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-start lg:gap-10">
            <div className="lg:col-span-7">
              <h1 className="font-home max-w-4xl text-[clamp(2.4rem,5vw,4.4rem)] font-normal leading-[1.04] tracking-[-0.035em] text-fg">
                {page.h1}
              </h1>
              <p className="mt-6 max-w-xl text-[17px] leading-[1.6] text-muted">
                {page.lede}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                <AxButton href={formHref}>{offer.cta}</AxButton>
                <AxButton href="/how-it-works" variant="line">
                  See how it works
                </AxButton>
              </div>
              {/* <ul className="mt-8 flex flex-col gap-2.5 text-[16px] text-fg sm:flex-row sm:flex-wrap sm:gap-x-6">
            {heroPromises.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Icon name="check" className="size-4.5 text-fg" />
                {p}
              </li>
            ))}
          </ul> */}
            </div>
            <div className="relative aspect-[4/3] bg-panel-2 lg:col-span-5 lg:aspect-[4/5]">
              <Img
                src={page.heroImage.src}
                alt={page.heroImage.alt}
                priority
                sizes="(min-width:1024px) 40vw, 100vw"
              />
            </div>
          </div>
        </div>
      </header>

      <AxProcess
        id="leaks"
        label="Where leads leak"
        title={page.leaksTitle}
        lede={page.leaksLede}
        steps={page.leaks}
      />

      <SystemStrip
        id="journey"
        label="The lead journey"
        title={journey.opener}
        steps={journey.steps}
        mark={journey.steps[journey.steps.length - 1]}
      />

      <WorkShowcase
        only={page.concepts}
        offerHref={formHref}
        title={
          one
            ? `A concept for a ${page.short} company.`
            : `Concepts for ${page.short} companies.`
        }
        lede={`${one ? "A sample homepage" : "Sample homepages"} we designed for ${page.short} contractors. Yours is built around your services, your towns and how you sell.`}
        tool={<ToolPrompt checker={page.tool} />}
      />

      {page.run ? (
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
        >
          <EstimateFollowUp {...estimateFollowUp} />
        </LostRevenue>
      ) : (
        <section
          aria-label="Estimate follow-up"
          className="bg-white py-20 sm:py-24 lg:py-28"
        >
          <div className="container-wide">
            <EstimateFollowUp
              {...estimateFollowUp}
              label="Estimate follow-up"
              className=""
            />
          </div>
        </section>
      )}

      <AxFaq items={page.faqs} email={daybreak.email} />

      <AxContact
        label={offer.label}
        title={offer.formTitle}
        lede={offer.formLede}
        includes={offer.includes}
        email={daybreak.email}
        image={page.image}
      />
    </>
  );
}
