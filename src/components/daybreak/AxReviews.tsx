import type { Review } from "@/lib/template/types";
import { ReviewMarquee } from "@/components/template/ReviewMarquee";
import { Illustrative } from "@/components/template/primitives";
import { AxHead } from "./ax";

/**
 * Reviews, as they appear on the sites Daybreak builds. These are the
 * reference build's homeowner reviews — the contractor is fictional and the
 * section says so. They are shown here as the product, not as testimonials
 * for Daybreak; client testimonials go in only once real ones are cleared.
 */
export function AxReviews({ reviews }: { reviews: Review[] }) {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-20 overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      <div className="container-wide">
        <AxHead
          id="reviews-title"
          label="Reviews, built in"
          title={
            <>
              Reviews that sell
              <br className="hidden sm:block" /> the next job.
            </>
          }
          lede="Every site we build puts real, attributed reviews next to the decision — with the town, the date and the job. Here's how they run on our reference build."
          aside={<Illustrative>Illustrative — fictional contractor</Illustrative>}
        />
      </div>
      <div className="mt-14 lg:mt-16">
        <ReviewMarquee reviews={reviews} />
      </div>
    </section>
  );
}
