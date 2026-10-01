import { Img } from "@/components/ui/Img";
import { ScrollText } from "@/components/motion/ScrollText";
import { RollingNumber } from "@/components/motion/RollingNumber";
import { ZoomIn } from "@/components/motion/ZoomIn";
import { AxButton, AxLabel } from "./ax";

/**
 * Axion's About block, full screen and on a 12-column grid: the two founders
 * as a matched pair of portraits in the left third, the statement set large in the right two
 * thirds — its words darken as you scroll — then a full-width row of figures
 * that roll into place like an odometer.
 */
export function AboutStatement({
  label = "About us",
  statement,
  stats,
  people,
  offerHref,
}: {
  label?: string;
  statement: string;
  stats: { value: string; label: string }[];
  people: { name: string; role: string; src: string }[];
  offerHref: string;
}) {
  return (
    <section id="about" aria-labelledby="about-title" className="flex min-h-svh scroll-mt-20 flex-col bg-panel py-16 sm:py-20">
      <div className="container-wide flex flex-1 flex-col">
        <div className="border-t border-rule pt-6">
          <AxLabel>{label}</AxLabel>
        </div>
        <h2 id="about-title" className="sr-only">
          About Daybreak Structure-Works
        </h2>

        <div className="grid flex-1 gap-10 py-14 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-20">
          <ul className="order-2 grid max-w-md grid-cols-2 gap-2.5 lg:order-1 lg:col-span-4 lg:max-w-none">
            {people.map((p, i) => (
              <li key={p.name} className={i === 1 ? "lg:mt-16" : ""}>
                <ZoomIn className="relative aspect-[4/5] bg-panel-2">
                  <div className="relative size-full">
                    <Img src={p.src} alt={`${p.name}, ${p.role.toLowerCase()} of Daybreak Structure-Works`} sizes="(min-width:1024px) 16vw, 45vw" className="object-[50%_20%]" />
                  </div>
                </ZoomIn>
                <p className="mt-3 flex items-baseline justify-between gap-2">
                  <span className="font-home text-[17px] tracking-[-0.01em] text-fg">{p.name}</span>
                  <span className="mono-label text-[12px] text-muted">{p.role}</span>
                </p>
              </li>
            ))}
          </ul>

          <div className="order-1 lg:order-2 lg:col-span-8 lg:pl-8">
            <ScrollText
              text={statement}
              className="font-home text-[clamp(1.7rem,2.9vw,2.75rem)] font-normal leading-[1.32] tracking-[-0.02em] text-fg"
            />
            <div className="mt-10 flex flex-wrap gap-2">
              <AxButton href={offerHref}>Get a free homepage concept</AxButton>
              <AxButton href="#work" variant="line">
                See our work
              </AxButton>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-y-10 border-t border-rule pt-10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse border-l border-rule py-1 pl-5 sm:pl-7">
              <dt className="relative mt-4 text-[13px] text-fg">
                <span aria-hidden className="absolute -left-5 top-1/2 h-3.5 w-[3px] -translate-y-1/2 bg-sun sm:-left-7" />
                <span className="mono-label">{s.label}</span>
              </dt>
              <dd className="font-home text-[clamp(3.2rem,6.2vw,5.5rem)] font-light leading-none tracking-[-0.04em] text-fg tabular-nums">
                <RollingNumber value={s.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
