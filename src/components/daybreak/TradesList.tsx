import type { Trade } from "@/lib/daybreak";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/utils";
import { AxHead, AxLabel } from "./ax";

/**
 * The trades as Axion's equipment deck: each card pins below the header and
 * the next one slides up over it, leaving a sliver of every earlier card
 * showing, so the list builds into a stack as you scroll. Pure CSS
 * `position: sticky` — native scrolling, no scroll-jacking, fine on iOS.
 *
 * Each card: photograph left, numbered mono label, the trade large, a rule,
 * one line, then what the site does for that trade as ruled rows. Only
 * "live" features are listed — the roadmap isn't the client's concern.
 */
export function TradesList({ trades }: { trades: Trade[] }) {
  return (
    <section id="trades" aria-labelledby="trades-title" className="scroll-mt-20 bg-white pt-20 sm:pt-24 lg:pt-28">
      <div className="container-wide">
        <AxHead
          id="trades-title"
          label="Who we build for"
          title={
            <>
              Built for the trades that hold
              <br className="hidden sm:block" /> a house up and keep it dry.
            </>
          }
          lede="Foundation repair, crawl space and siding. Nothing else. Each one gets its own pages, questions and quote paths."
        />

        <ol className="relative mt-14 pb-20 lg:mt-16 lg:pb-28">
          {trades.map((t, i) => (
            <li
              key={t.name}
              className="sticky mb-6 last:mb-0"
              style={{ top: `calc(88px + ${i} * 14px)` }}
            >
              <article
                className={cn(
                  "grid gap-2.5 p-2.5 shadow-[0_-18px_40px_-30px_rgb(0_0_0/0.45)] md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:h-[25rem] lg:h-[28rem]",
                  i % 2 ? "bg-panel" : "bg-panel-2",
                )}
              >
                <div className="relative aspect-[16/9] overflow-hidden md:aspect-auto md:h-full">
                  <Img src={t.image} alt="" sizes="(min-width:768px) 48vw, 100vw" />
                  <span className="mono-label absolute bottom-3 left-3 bg-white px-2.5 py-1.5 text-[12.5px] text-fg">
                    {String(i + 1).padStart(2, "0")} / {String(trades.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-col p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <AxLabel>Trade / {String(i + 1).padStart(2, "0")}</AxLabel>
                    {t.specialty && <span className="mono-label bg-sun px-2.5 py-1.5 text-[12.5px] text-fg">Specialty</span>}
                  </div>

                  <h3 className="font-home mt-8 text-[clamp(2rem,3.4vw,3rem)] font-normal leading-none tracking-[-0.035em] text-fg md:mt-auto">
                    {t.name}
                  </h3>
                  <p className="mt-3 text-[17px] leading-[1.55] text-muted">{t.line}</p>

                  <ul className="mt-6 border-t border-rule">
                    {t.features.filter((f) => f.status === "live").map((f) => (
                      <li key={f.label} className="flex items-center justify-between gap-4 border-b border-rule py-2.5 text-[16px] text-fg">
                        <span className="flex items-center gap-2.5">
                          <span
                            aria-hidden
                            className={cn("size-1.5 rounded-full", f.status === "live" ? "bg-[#2f9e5b]" : "bg-[#b9b9be]")}
                          />
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
