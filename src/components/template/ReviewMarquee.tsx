import type { Review } from "@/lib/template/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Two rows of review cards drifting sideways in opposite directions, slowly
 * enough to read. CSS only: each row renders its cards twice and translates
 * by half its width, so the loop is seamless and nothing runs on the main
 * thread. Hovering a row pauses it.
 *
 * With reduced motion the rows stop and become ordinary horizontal scrollers,
 * so every review stays reachable.
 *
 * `square` swaps the warm rounded cards for the agency site's square grey
 * panels.
 */
export function ReviewMarquee({
  reviews,
  speed = 90,
  square = false,
}: {
  reviews: Review[];
  speed?: number;
  square?: boolean;
}) {
  const half = Math.ceil(reviews.length / 2);
  const rows = [reviews.slice(0, half), reviews.slice(half)].filter((r) => r.length);

  return (
    <div className="space-y-3 sm:space-y-5 [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]">
      {rows.map((row, i) => (
        <div key={i} className="group overflow-hidden motion-reduce:overflow-x-auto">
          <ul
            className={cn(
              "flex w-max gap-3 pr-3 max-sm:items-start sm:gap-5 sm:pr-5 group-hover:[animation-play-state:paused] motion-reduce:animate-none",
              i % 2
                ? "animate-[marquee-reverse_var(--dur)_linear_infinite]"
                : "animate-[marquee_var(--dur)_linear_infinite]",
            )}
            style={{ "--dur": `${speed + i * 12}s` } as React.CSSProperties}
          >
            {[...row, ...row].map((r, j) => (
              <ReviewCard key={`${r.id}-${j}`} review={r} hidden={j >= row.length} square={square} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ReviewCard({ review: r, hidden, square }: { review: Review; hidden: boolean; square: boolean }) {
  const initials = r.name
    .split(" ")
    .map((w) => w[0])
    .join("");
  // On phones the stars sit above the quote, so the name has the footer's width.
  const stars = (className: string) => (
    <span className={cn("flex gap-0.5", className)} role="img" aria-label={`${r.rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, k) => (
        <Icon
          key={k}
          name="star"
          filled
          className={cn("size-4 sm:size-4.5", k < r.rating ? "text-[#f2b53a]" : square ? "text-panel-2" : "text-[#e7e4dd]")}
        />
      ))}
    </span>
  );
  return (
    // Phones get a compact card, so a whole review and the next one's edge fit on screen.
    <li aria-hidden={hidden || undefined} className="w-[68vw] max-w-[31rem] shrink-0 sm:w-[82vw]">
      <figure className={cn("flex h-full flex-col p-5 sm:p-8", square ? "bg-panel" : "rounded-[14px] bg-[#f7f6f3]")}>
        {stars("mb-3 sm:hidden")}
        <blockquote className="text-[15px] leading-[1.5] text-fg/85 sm:text-[18px] sm:leading-[1.6]">&ldquo;{r.quote}&rdquo;</blockquote>
        <div className="mt-auto pt-5 sm:pt-8">
          {(r.city || r.date) && (
          <p className="mb-4 flex items-center justify-between gap-4 text-[13px] text-muted sm:mb-6 sm:text-[15px]">
            {r.city && (
              <span className="flex items-center gap-2">
                <Icon name="pin" className="size-4.5 text-[#e0a33b]" />
                {r.city}
              </span>
            )}
            {r.date && (
              <span className="flex items-center gap-2 tabular-nums">
                <CalendarIcon />
                {r.date}
              </span>
            )}
          </p>
          )}
          <div className={cn("flex items-center gap-3 border-t pt-4 sm:gap-4 sm:pt-6", square ? "border-rule" : "border-[#e7e4dd]")}>
            <span
              aria-hidden
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-fg sm:size-12 sm:text-[15px]",
                square ? "bg-panel-2" : "bg-[#e9e5dc]",
              )}
            >
              {initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-home block truncate text-[16px] font-medium tracking-[-0.01em] text-fg sm:text-[19px]">{r.name}</span>
              <span className="block truncate text-[13px] text-muted sm:text-[15px]">{r.role ?? r.service}</span>
            </span>
            {stars("shrink-0 max-sm:hidden")}
          </div>
        </div>
      </figure>
    </li>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4.5 text-[#e0a33b]" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01" />
    </svg>
  );
}
