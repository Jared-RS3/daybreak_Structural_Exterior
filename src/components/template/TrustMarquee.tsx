import type { TrustItem } from "@/lib/template/types";

/**
 * The trust facts as a slow, continuous strip across the full width under the
 * hero. A pale, see-through band with hairline edges so it sits lightly on the
 * page; the emphasis comes from the type instead — value in the display face at
 * headline weight, qualifier beside it in slate, separated by an ember dot.
 *
 * The track holds the list four times and slides by -50%, so the loop is
 * seamless and never shows a gap on a wide screen.
 * It animates transform only (one composited layer) and pauses on hover. Screen
 * readers get the list once; the moving copies are aria-hidden.
 */
export function TrustMarquee({ items }: { items: TrustItem[] }) {
  const run = (copy: number) =>
    items.map((t) => (
      <li key={`${copy}-${t.label}`} className="flex shrink-0 items-baseline gap-3 pr-10 sm:pr-14">
        <span aria-hidden className="mr-7 size-2 self-center rounded-full bg-ember-500 sm:mr-11" />
        <span className="font-home text-[clamp(1.35rem,2.4vw,1.9rem)] font-semibold tracking-[-0.03em] whitespace-nowrap text-ink-950">
          {t.value}
        </span>
        <span className="text-[15px] whitespace-nowrap text-ink-500 sm:text-[17px]">{t.label}</span>
      </li>
    ));

  return (
    <div className="group border-y border-ink-100 bg-ink-50/60 py-6 sm:py-7">
      <ul className="sr-only">
        {items.map((t) => (
          <li key={t.label}>
            {t.value} {t.label}
          </li>
        ))}
      </ul>
      <div className="overflow-hidden mask-[linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <ul
          aria-hidden
          className="flex w-max animate-marquee will-change-transform group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        >
          {[0, 1, 2, 3].map(run)}
        </ul>
      </div>
    </div>
  );
}
