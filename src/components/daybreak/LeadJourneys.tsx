import { Icon } from "@/components/ui/Icon";
import { AxHead } from "./ax";

/**
 * One lead journey per trade, in ruled columns: what the homeowner starts
 * with, then each step the site takes them through, ending on the hand-off
 * (marked in sunrise yellow). Typography and rules only, no cards: the point
 * is that the three columns differ.
 */
export function LeadJourneys({
  label,
  title,
  lede,
  journeys,
}: {
  label: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  journeys: { trade: string; opener: string; steps: string[] }[];
}) {
  return (
    <section id="journeys" aria-labelledby="journeys-title" className="scroll-mt-20 bg-panel py-20 sm:py-24 lg:py-28">
      <div className="container-wide">
        <AxHead id="journeys-title" label={label} title={title} lede={lede} />
        <ol className="mt-14 grid gap-14 sm:gap-10 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {journeys.map((j, i) => (
            <li key={j.trade} className="border-t border-fg pt-5">
              <p className="mono-label text-muted">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="font-home mt-8 text-[clamp(1.8rem,2.6vw,2.3rem)] font-normal tracking-[-0.03em] text-fg">{j.trade}</h3>
              <p className="mt-3 max-w-sm text-[17px] leading-[1.6] text-muted lg:min-h-[3.2em]">{j.opener}</p>
              <ol className="mt-7 border-t border-rule">
                {j.steps.map((s, k) => {
                  const end = k === j.steps.length - 1;
                  return (
                    <li key={s} className="flex items-start gap-3 border-b border-rule py-3.5 text-[16.5px] leading-[1.45]">
                      <span aria-hidden className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center">
                        {end ? (
                          <span className="flex size-4.5 items-center justify-center bg-sun text-fg">
                            <Icon name="check" className="size-3" />
                          </span>
                        ) : (
                          <Icon name="arrowRight" className={k === 0 ? "size-3.5 text-fg" : "size-3.5 rotate-90 text-muted"} />
                        )}
                      </span>
                      <span className={end ? "font-medium text-fg" : "text-fg/85"}>{s}</span>
                    </li>
                  );
                })}
              </ol>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
