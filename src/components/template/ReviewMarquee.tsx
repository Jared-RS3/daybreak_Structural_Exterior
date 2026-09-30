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
 */
export function ReviewMarquee({ reviews, speed = 90 }: { reviews: Review[]; speed?: number }) {
  const half = Math.ceil(reviews.length / 2);
  const rows = [reviews.slice(0, half), reviews.slice(half)].filter((r) => r.length);

  return (
    <div className="space-y-5 [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]">
      {rows.map((row, i) => (
        <div key={i} className="group overflow-hidden motion-reduce:overflow-x-auto">
          <ul
            className={cn(
              "flex w-max gap-5 pr-5 group-hover:[animation-play-state:paused] motion-reduce:animate-none",
              i % 2
                ? "animate-[marquee-reverse_var(--dur)_linear_infinite]"
                : "animate-[marquee_var(--dur)_linear_infinite]",
            )}
            style={{ "--dur": `${speed + i * 12}s` } as React.CSSProperties}
          >
            {[...row, ...row].map((r, j) => (
              <ReviewCard key={`${r.id}-${j}`} review={r} hidden={j >= row.length} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ReviewCard({ review: r, hidden }: { review: Review; hidden: boolean }) {
  const initials = r.name
    .split(" ")
    .map((w) => w[0])
    .join("");
  return (
    <li aria-hidden={hidden || undefined} className="w-[82vw] max-w-[31rem] shrink-0">
      <figure className="flex h-full flex-col rounded-[14px] bg-[#f7f6f3] p-7 sm:p-8">
        <blockquote className="text-[17px] leading-[1.6] text-fg/85 sm:text-[18px]">&ldquo;{r.quote}&rdquo;</blockquote>
        <div className="mt-auto pt-8">
          <p className="flex items-center justify-between gap-4 text-[15px] text-muted">
            <span className="flex items-center gap-2">
              <Icon name="pin" className="size-4.5 text-[#e0a33b]" />
              {r.city}
            </span>
            {r.date && (
              <span className="flex items-center gap-2 tabular-nums">
                <CalendarIcon />
                {r.date}
              </span>
            )}
          </p>
          <div className="mt-6 flex items-center gap-4 border-t border-[#e7e4dd] pt-6">
            <span
              aria-hidden
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#e9e5dc] text-[15px] font-semibold text-fg"
            >
              {initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-home block truncate text-[19px] font-medium tracking-[-0.01em] text-fg">{r.name}</span>
              <span className="block truncate text-[15px] text-muted">{r.role ?? r.service}</span>
            </span>
            <span className="flex shrink-0 gap-0.5" role="img" aria-label={`${r.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, k) => (
                <Icon
                  key={k}
                  name="star"
                  filled
                  className={cn("size-4.5", k < r.rating ? "text-[#f2b53a]" : "text-[#e7e4dd]")}
                />
              ))}
            </span>
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
