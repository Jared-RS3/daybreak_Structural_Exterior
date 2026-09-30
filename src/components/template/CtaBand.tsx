import type { Cta, ImageRef } from "@/lib/template/types";
import { Img } from "@/components/ui/Img";
import { ArrowLink, PillLabel } from "./primitives";

/**
 * The page ends where the buying journey starts: the sky again, the address
 * field again, a house standing in it — Crest's closing move — and the footer
 * continues in the same sky below, so the close and the contact details read
 * as one block rather than two endings.
 */
export function CtaBand({
  id = "cta",
  kicker,
  title,
  lede,
  action,
  secondary,
  contact,
  house,
}: {
  id?: string;
  kicker: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  action: React.ReactNode;
  secondary?: Cta;
  /** A line under the actions, e.g. "or call (817) 555-0142". */
  contact?: { prefix: string; label: string; href: string };
  house: ImageRef & { width: number; height: number };
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="sky-close relative scroll-mt-16 overflow-hidden">
      <div className="container-x relative z-10 pt-24 text-center sm:pt-28 lg:pt-32">
        <PillLabel tone="sky">{kicker}</PillLabel>
        <h2 id={`${id}-title`} className="home-display mx-auto mt-6 max-w-[14ch] text-[clamp(2.75rem,6vw,5rem)] text-white">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-[1.55] text-white sm:text-[18px]">{lede}</p>
        <div className="mx-auto mt-9 max-w-[36rem]">{action}</div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
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
      </div>

      <div className="relative mx-auto mt-6 w-full max-w-[880px]">
        <div className="house-fade relative w-full -scale-x-100" style={{ aspectRatio: `${house.width} / ${house.height}` }}>
          <Img src={house.src} alt={house.alt} sizes="(min-width:880px) 880px, 100vw" className="object-contain object-bottom" />
        </div>
      </div>
    </section>
  );
}
