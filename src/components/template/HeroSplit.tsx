import type { Cta, ImageRef, TrustItem } from "@/lib/template/types";
import { Img } from "@/components/ui/Img";
import { ArrowLink, Illustrative, PillLabel } from "./primitives";
import { TrustMarquee } from "./TrustMarquee";
import { TrustRow } from "./TrustRow";

/* .house-fade, with the left edge's fade length in --fade-l. Standing beside
   the copy, the cut-out's left edge (a neighbour's roof and a tree) reads as
   a strip at the default 14%, so large screens fade it further. Inline rather
   than a utility because .house-fade is unlayered and would win. */
const houseMask = (() => {
  const mask =
    "linear-gradient(to bottom, #000 58%, transparent 97%), linear-gradient(to right, transparent 0%, #000 var(--fade-l), #000 86%, transparent 100%)";
  return {
    WebkitMaskImage: mask,
    WebkitMaskComposite: "source-in",
    maskImage: mask,
    maskComposite: "intersect",
  } satisfies React.CSSProperties;
})();

/**
 * A variant of Hero: the same sky, house and props, composed as a split
 * instead of a centred stack. The founders' proof opens it, the headline
 * runs wide and left-aligned across the top, the copy and actions sit under
 * it on the left, and the house stands to the right, oversized and running
 * off the edge, so it is in the first screen beside the actions rather than
 * below them. On phones the spacing is tight enough that the roof shows
 * under the buttons in the first screen.
 *
 * The sky is two bands instead of one gradient. The text band only ever runs
 * sky-1 → sky-2, so white text holds AA contrast however far the copy wraps;
 * the ground band under it fades to white, and the house's base dissolves
 * into that. On large screens the house leaves the flow and stands across
 * both bands. Takes the same props as Hero, so the two swap by name — but
 * pass `action` left-aligned, since nothing here centres it.
 */
export function HeroSplit({
  kicker,
  title,
  lede,
  action,
  secondary,
  contact,
  house,
  inset,
  proof,
  trust,
  trustMarquee = false,
  trustNote = <Illustrative>Illustrative figures — fictional contractor</Illustrative>,
}: {
  /** The pill above the headline. Only shown when there is no `proof` to put there. */
  kicker?: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  action: React.ReactNode;
  secondary?: Cta;
  /** A line under the actions, e.g. "or call (817) 555-0142". */
  contact?: { prefix: string; label: string; href: string };
  house: ImageRef & { width: number; height: number };
  inset?: React.ReactNode;
  /** Proof shown above the headline, in the kicker's place (e.g. founders and a track record). */
  proof?: React.ReactNode;
  trust: TrustItem[];
  /** Tag under the trust row — the "illustrative" label on a demo, null on a real site. */
  trustNote?: React.ReactNode;
  /** Run the trust facts as a full-width moving strip instead of a static row. */
  trustMarquee?: boolean;
}) {
  return (
    <>
      <section aria-labelledby="hero-title" className="relative -mt-[72px] overflow-hidden">
        <div className="relative bg-linear-to-b from-sky-1 to-sky-2 pt-[72px]">
          <div className="container-wide relative z-20 grid pb-6 pt-6 sm:pb-12 sm:pt-16 lg:grid-cols-12 lg:gap-x-8 lg:pb-16 lg:pt-16">
            <div className="lg:col-span-12">
              <div className="animate-[rise-in_0.9s_var(--ease-out-expo)_both]">
                {proof ?? (kicker && <PillLabel tone="sky">{kicker}</PillLabel>)}
              </div>
              <h1
                id="hero-title"
                className="home-display mt-5 max-w-[24ch] animate-[rise-in_1.1s_var(--ease-out-expo)_0.08s_both] text-[clamp(2.35rem,5.4vw,5.5rem)] text-white sm:mt-6"
              >
                {title}
              </h1>
            </div>

            <div className="mt-5 sm:mt-8 lg:col-span-6 lg:mt-12 xl:col-span-5">
              <p className="max-w-[34rem] animate-[rise-in_1.1s_var(--ease-out-expo)_0.2s_both] text-[16px] leading-[1.5] text-white sm:text-[19px] sm:leading-[1.55]">
                {lede}
              </p>
              <div className="mt-6 animate-[rise-in_1.1s_var(--ease-out-expo)_0.32s_both] sm:mt-8">{action}</div>
              {(secondary || contact) && (
                <div className="mt-6 flex animate-[rise-in_1.1s_var(--ease-out-expo)_0.42s_both] flex-wrap items-center gap-x-7 gap-y-2">
                  {secondary && (
                    <ArrowLink href={secondary.href} tone="light">
                      {secondary.label}
                    </ArrowLink>
                  )}
                  {contact && (
                    <a href={contact.href} className="text-[15px] text-white hover:text-white/80">
                      {contact.prefix} <span className="font-medium tabular-nums">{contact.label}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative bg-[linear-gradient(180deg,var(--color-sky-2)_0%,var(--color-sky-3)_34%,var(--color-sky-4)_64%,#fff_94%)] lg:h-[clamp(220px,20vw,300px)]">
          <span id="header-overlay-end" aria-hidden className="absolute top-0" />
          <div className="relative -mt-6 lg:absolute lg:bottom-0 lg:mt-0 lg:right-[-5vw] lg:z-10 lg:w-[58vw] lg:max-w-[1200px] xl:w-[62vw]">
            <div
              className="relative w-[115%] animate-[house-in_2.2s_var(--ease-out-expo)_0.25s_both] [--fade-l:14%] sm:w-[106%] lg:w-full lg:[--fade-l:32%]"
              style={{ aspectRatio: `${house.width} / ${house.height}`, ...houseMask }}
            >
              <Img
                src={house.src}
                alt={house.alt}
                priority
                sizes="(min-width:1280px) 62vw, (min-width:1024px) 58vw, 115vw"
                className="object-contain object-bottom"
              />
            </div>
            {inset && (
              <div className="relative z-10 -mt-20 flex animate-[card-in_1s_var(--ease-out-expo)_1.1s_both] justify-center px-5 pb-2 sm:-mt-28 lg:absolute lg:left-[6%] lg:top-[42%] lg:mt-0 xl:left-[2%] xl:top-[24%] lg:block lg:px-0 lg:pb-0">
                {inset}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className={trustMarquee ? "bg-white" : "bg-white pb-6 pt-4"}>
        {trustMarquee ? <TrustMarquee items={trust} /> : <TrustRow items={trust} />}
        {trustNote && <div className="mt-5 flex justify-center">{trustNote}</div>}
      </div>
    </>
  );
}
