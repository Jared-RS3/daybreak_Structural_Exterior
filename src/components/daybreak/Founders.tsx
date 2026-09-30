import type { Founder } from "@/lib/agency";
import { Img } from "@/components/ui/Img";
import { ZoomIn } from "@/components/motion/ZoomIn";
import { AxLabel } from "./ax";

/**
 * Axion's "From the CEO" band — a statement set large over a darkened
 * photograph, signed by both founders. (Their portraits sit in the About
 * section, so they aren't repeated here.)
 *
 * The statement is Daybreak's own words for its own site (see `founderNote`
 * in lib/daybreak.ts); the founders should sign off on the wording.
 */
export function Founders({
  founders,
  agencyName,
  note,
  image,
}: {
  founders: Founder[];
  agencyName: string;
  note: string;
  image: string;
}) {
  const names = founders.map((f) => f.name).join(" & ");
  return (
    <>
      <section id="team" aria-label="From the founders" className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-fg">
        <div className="absolute inset-0 -z-10">
          <ZoomIn className="absolute inset-0" from={1.18}>
            <div className="relative size-full">
              <Img src={image} alt="" sizes="100vw" className="object-[50%_30%] opacity-60" />
            </div>
          </ZoomIn>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />
        </div>
        <div className="container-wide py-20 sm:py-24 lg:py-28">
          <AxLabel tone="light">From the founders</AxLabel>
          <blockquote className="font-home mt-10 max-w-4xl text-[clamp(1.9rem,4vw,3.4rem)] font-normal leading-[1.15] tracking-[-0.03em] text-white">
            {note}
          </blockquote>
          <p className="mono-label mt-8 text-white/80">
            {names}, founders of {agencyName}
          </p>
        </div>
      </section>

    </>
  );
}
