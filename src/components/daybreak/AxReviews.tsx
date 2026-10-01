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
  // A short list leaves each marquee row narrower than a wide screen, so it
  // gaps as it loops. Repeat the same reviews, the second pass rotated so the
  // two rows don't scroll the same cards side by side.
  const shift = Math.ceil(reviews.length / 2);
  const cards =
    reviews.length < 8
      ? [
          ...reviews,
          ...[...reviews.slice(shift), ...reviews.slice(0, shift)].map((r) => ({ ...r, id: `${r.id}-again` })),
        ]
      : reviews;
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
              What our clients say
              <br className="hidden sm:block" /> about working with us.
            </>
          }
          lede="Business owners on their new websites, in their own words."
        />
      </div>
      <div className="mt-10 sm:mt-14 lg:mt-16">
        <ReviewMarquee reviews={cards} square />
      </div>
    </section>
  );
}
