import type { Cta, ImageRef, TrustItem } from "@/lib/template/types";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/utils";
import { ArrowLink, Illustrative, PillLabel } from "./primitives";
import { TrustMarquee } from "./TrustMarquee";
import { TrustRow } from "./TrustRow";

/**
 * Crest's hero: a sky, a centred headline, the actions, and a real house
 * standing in the sky below it. The headline sells the contractor; the tool
 * that makes the site different floats over the house as a card, one click
 * from the primary action rather than in place of it.
 *
 * The house is a cut-out (transparent WebP) so it sits in the gradient with
 * no rectangle around it; its base dissolves into the white page. The header
 * reads #header-overlay-end to know when the sky has scrolled away.
 *
 * `phone="proof-first"` is the agency home's phone layout (desktop is
 * unchanged): no kicker, no proof pill, a heavier three-line
 * headline, buttons sized to their labels, the inset floated on the house,
 * a bigger house pulled up under the actions, and a brighter sky. The contractor template keeps the default stack.
 */
export function Hero({
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
  phone = "stacked",
}: {
  kicker: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  action: React.ReactNode;
  secondary?: Cta;
  /** A line under the actions, e.g. "or call (817) 555-0142". */
  contact?: { prefix: string; label: string; href: string };
  house: ImageRef & { width: number; height: number };
  inset?: React.ReactNode;
  /** Proof shown under the actions, above the house (e.g. founders and a track record). */
  proof?: React.ReactNode;
  trust: TrustItem[];
  /** Tag under the trust row — the "illustrative" label on a demo, null on a real site. */
  trustNote?: React.ReactNode;
  /** Run the trust facts as a full-width moving strip instead of a static row. */
  trustMarquee?: boolean;
  /** Phone layout; see above. */
  phone?: "stacked" | "proof-first";
}) {
  const pf = phone === "proof-first";
  return (
    <>
      <section
        aria-labelledby="hero-title"
        className={cn("sky-hero relative -mt-[72px] overflow-hidden pt-[72px]", pf && "sky-hero-bright")}
      >
        <div
          className={cn(
            "container-x relative z-10 pt-14 text-center sm:pt-20 lg:pt-24",
            pf && "max-sm:flex max-sm:flex-col max-sm:items-center max-sm:px-5 max-sm:pt-8",
          )}
        >
          {kicker && (
            <PillLabel tone="sky" className={cn("animate-[rise-in_0.9s_var(--ease-out-expo)_both]", pf && "max-sm:hidden")}>
              {kicker}
            </PillLabel>
          )}
          <h1
            id="hero-title"
            className={cn(
              "home-display mx-auto mt-6 max-w-[17ch] animate-[rise-in-text_1.1s_var(--ease-out-expo)_0.08s_both] text-[clamp(2.6rem,6vw,5.25rem)] text-white",
              // Sized to the screen so the headline never breaks mid-word,
              // with a margin either side and its lines balanced.
              pf && "max-sm:mt-0 max-sm:max-w-none max-sm:text-balance max-sm:text-[min(8vw,2.1rem)] max-sm:font-semibold max-sm:leading-[1.1] max-sm:tracking-[-0.035em]",
            )}
          >
            {title}
          </h1>
          <p
            className={cn(
              "mx-auto mt-6 max-w-[36rem] animate-[rise-in_1.1s_var(--ease-out-expo)_0.2s_both] text-[17px] leading-[1.55] text-white sm:text-[19px]",
              pf && "max-sm:mt-5 max-sm:max-w-[20rem] max-sm:text-pretty max-sm:text-[16px] max-sm:leading-[1.6] max-sm:text-white/85",
            )}
          >
            {lede}
          </p>
          <div
            className={cn(
              "mx-auto mt-9 max-w-xl animate-[rise-in_1.1s_var(--ease-out-expo)_0.32s_both]",
              pf && "max-sm:mt-8 max-sm:w-full",
            )}
          >
            {action}
          </div>
          {(secondary || contact) && (
            <div className="mt-6 flex animate-[rise-in_1.1s_var(--ease-out-expo)_0.42s_both] flex-wrap items-center justify-center gap-x-7 gap-y-2">
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
          {proof && (
            <div
              className={cn(
                "mt-8 animate-[rise-in_1.1s_var(--ease-out-expo)_0.52s_both]",
                pf && "max-sm:hidden",
              )}
            >
              {proof}
            </div>
          )}
        </div>

        <div
          className={cn(
            "relative mx-auto mt-10 w-full max-w-[1080px] sm:mt-4",
            // Phone: the house pulled up and a touch wider than the screen, so more of it shows.
            pf && "max-sm:-ml-[8%] max-sm:mt-2 max-sm:w-[116%] max-sm:max-w-none",
          )}
        >
          <span id="header-overlay-end" aria-hidden className="absolute top-[18%]" />
          <div
            className="house-fade relative w-full animate-[house-in_2.2s_var(--ease-out-expo)_0.25s_both]"
            style={{ aspectRatio: `${house.width} / ${house.height}` }}
          >
            <Img src={house.src} alt={house.alt} priority sizes="(min-width:1080px) 1080px, 100vw" className="object-contain object-bottom" />
          </div>
          {inset && (
            <div
              className={cn(
                "relative z-10 -mt-24 flex animate-[card-in_1s_var(--ease-out-expo)_1.1s_both] justify-center px-5 sm:absolute sm:right-[5%] sm:top-[16%] sm:mt-0 sm:block sm:px-0 lg:right-[3%]",
                // Phone: low on the house, over the street where the photo fades, so
                // it never sits on top of the house itself.
                pf && "max-sm:absolute max-sm:bottom-[7%] max-sm:right-[calc(8%+1rem)] max-sm:mt-0 max-sm:block max-sm:px-0",
              )}
            >
              {inset}
            </div>
          )}
        </div>
      </section>

      <div className={trustMarquee ? "bg-white" : "bg-white pb-6 pt-4"}>
        {trustMarquee ? <TrustMarquee items={trust} /> : <TrustRow items={trust} />}
        {trustNote && <div className="mt-5 flex justify-center">{trustNote}</div>}
      </div>
    </>
  );
}
