import type { Review } from "@/lib/template/types";
import { ReviewMarquee } from "@/components/template/ReviewMarquee";
import { AxHead, AxLabel } from "./ax";

/**
 * Client reviews as two slow sideways rows, full width under an Axion head.
 * Real reviews only in production: pass `placeholder` in development to see
 * the layout, and it carries a visible tag saying so. With nothing to show,
 * the section renders nothing.
 */
export function AxReviews({ reviews, placeholder = false }: { reviews: Review[]; placeholder?: boolean }) {
  if (!reviews.length) return null;
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-20 overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      <div className="container-wide">
        <AxHead
          id="reviews-title"
          label={
            <span className="flex flex-wrap items-center justify-center gap-3">
              <AxLabel>Reviews</AxLabel>
              {placeholder && (
                <span className="mono-label bg-sun px-2.5 py-1 text-[12px] text-fg">Placeholders · hidden in production</span>
              )}
            </span>
          }
          title={
            <>
              What contractors say
              <br className="hidden sm:block" /> about working with us.
            </>
          }
          lede="Foundation repair, crawl space and siding contractors on their new sites, in their own words."
        />
      </div>
      <div className="mt-14 lg:mt-16">
        <ReviewMarquee reviews={reviews} square />
      </div>
    </section>
  );
}
