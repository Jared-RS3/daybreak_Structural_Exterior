import { AboutStatement } from "@/components/daybreak/AboutStatement";
import { HeroProof } from "@/components/daybreak/HeroProof";
import { HeroSplit } from "@/components/template/HeroSplit";
import { PillLink } from "@/components/template/primitives";
import { CrackChip } from "@/components/tools/CrackChip";
import { Icon } from "@/components/ui/Icon";
import { founders } from "@/lib/agency";
import {
  about,
  bookingHref,
  daybreak,
  heroPromises,
  heroTrust,
  offer,
} from "@/lib/daybreak";
import { houseImage } from "@/lib/demo-site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hero variant — split",
  robots: { index: false, follow: false },
};

/**
 * A preview of HeroSplit with the homepage's own content, followed by the
 * section that comes after it there, so the two heroes can be compared as
 * they'd actually read. To adopt it, swap `Hero` for `HeroSplit` on the
 * homepage and pass the left-aligned actions below.
 */
export default function HeroSplitPreview() {
  return (
    <>
      <HeroSplit
        title="Websites that book foundation, crawl space & siding jobs."
        lede="We design custom websites for foundation repair, crawl space and siding contractors that turn a worried homeowner's search into a call, a booked inspection and a signed job."
        action={
          <>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <PillLink href={daybreak.offerHref} variant="light" size="lg">
                {offer.cta}
              </PillLink>
              <PillLink href={bookingHref} variant="glass" size="lg">
                <Icon name="calendar" className="size-4.5" />
                Book a call
              </PillLink>
            </div>
            {/* Phones skip the list so the house reaches the first screen; the
                trust strip directly under the hero makes the same points. */}
            <ul className="mt-6 hidden flex-col gap-2 text-[15px] text-white sm:flex sm:text-[16px]">
              {heroPromises.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Icon name="check" className="size-4.5 text-sun" />
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
        inset={<CrackChip href="/#tools" />}
        trust={heroTrust}
        trustMarquee
        trustNote={null}
      />

      <AboutStatement
        statement={about.statement}
        offerHref={daybreak.offerHref}
        stats={about.stats}
        people={founders.map((f) => ({
          name: f.name,
          role: f.role,
          src: f.portrait,
        }))}
      />
    </>
  );
}
