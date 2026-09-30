import type { RatingSummary, Review } from "@/lib/template/types";
import { num } from "@/lib/quote";
import { Illustrative, Initials, PillLabel, Stars } from "./primitives";
import { ReviewCarousel } from "./ReviewCarousel";
import { ReviewMarquee } from "./ReviewMarquee";

/**
 * Crest's reviews layout — label and a line of grey on the left, one story
 * set large on the right — with the rating the homeowner actually looks for
 * added to the left column, and a row of shorter reviews underneath so the
 * section mixes one large voice with several small ones.
 */
export function ReviewWall({
  rating,
  featured,
  more,
  marquee,
  lede,
}: {
  rating: RatingSummary;
  /** Paged through in the large carousel. */
  featured: Review[];
  /** Shown as small cards underneath. */
  more?: Review[];
  /** Or: two slow sideways rows of every review, full width. */
  marquee?: Review[];
  lede: React.ReactNode;
}) {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-20 overflow-hidden bg-white py-24 sm:py-28 lg:py-32">
      <div className="container-x">
        <ReviewCarousel
          reviews={featured}
          intro={
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <PillLabel>Reviews</PillLabel>
                <Illustrative />
              </div>
              <h2 id="reviews-title" className="mt-5 max-w-sm text-[22px] leading-[1.35] text-muted">
                {lede}
              </h2>
              <div className="mt-8 flex items-end gap-4">
                <span className="font-home text-[72px] font-medium leading-[0.85] tracking-[-0.05em] text-fg tabular-nums">
                  {rating.score}
                </span>
                <span className="pb-1">
                  <Stars className="[&_svg]:size-4" />
                  <span className="mt-1.5 block text-[14px] text-muted">
                    {num(rating.count)} {rating.source} reviews
                  </span>
                </span>
              </div>
            </div>
          }
        />

        {more && more.length > 0 && (
          <ul className="mt-20 grid gap-3 md:grid-cols-3">
            {more.map((r) => (
              <li key={r.id}>
                <figure className="flex h-full flex-col rounded-[28px] bg-card p-7">
                  <Stars count={r.rating} />
                  <p className="home-title mt-5 text-[20px] text-fg">{r.headline}</p>
                  <blockquote className="mt-2.5 text-[15px] leading-[1.6] text-muted">&ldquo;{r.quote}&rdquo;</blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 pt-6 text-[14px] leading-tight">
                    <Initials name={r.name} className="bg-white" />
                    <span>
                      <span className="block text-fg">{r.name}</span>
                      <span className="block text-muted">
                        {r.city} · {r.source} review
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
      {marquee && marquee.length > 0 && (
        <div className="mt-20">
          <ReviewMarquee reviews={marquee} />
        </div>
      )}
    </section>
  );
}
