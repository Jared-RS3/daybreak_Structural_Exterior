import type { Comparison } from "@/lib/template/types";
import { Icon } from "@/components/ui/Icon";
import { AxHead, AxLabel } from "./ax";

/**
 * The brochure site against a Daybreak site, as two square panels. The usual
 * way is grey and mostly waiting; the Daybreak way is black, and the first
 * three steps are marked as happening in the first minute.
 */
export function AxComparison({ data, title, lede }: { data: Comparison; title: React.ReactNode; lede: React.ReactNode }) {
  const fast = data.ours.steps.slice(0, data.ours.fastSteps);
  const rest = data.ours.steps.slice(data.ours.fastSteps);
  return (
    <section aria-labelledby="compare-title" className="bg-panel py-20 sm:py-24 lg:py-28">
      <div className="container-wide">
        <AxHead id="compare-title" label="Why it's different" title={title} lede={lede} />
        <div className="mt-14 grid gap-2.5 lg:mt-16 lg:grid-cols-2">
          <div className="bg-panel-2 p-7 sm:p-10">
            <AxLabel>{data.usual.label}</AxLabel>
            <ol className="mt-8 border-t border-rule">
              {data.usual.steps.map((s) => (
                <li key={s.label} className="flex items-center gap-3 border-b border-rule py-4 text-[17px]">
                  {s.wait ? (
                    <>
                      <Icon name="clock" className="size-4.5 text-muted" />
                      <span className="italic text-muted">{s.label}</span>
                    </>
                  ) : (
                    <>
                      <span aria-hidden className="size-4.5 shrink-0 border border-fg/30" />
                      <span className="text-fg/80">{s.label}</span>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col bg-fg p-7 text-white sm:p-10">
            <AxLabel tone="light">{data.ours.label}</AxLabel>
            <ol className="mt-8 border-t border-white/15">
              {fast.map((s, i) => (
                <li key={s} className="flex items-center gap-3 border-b border-white/15 py-4 text-[17px]">
                  <span aria-hidden className="flex size-4.5 shrink-0 items-center justify-center bg-sun text-fg">
                    <Icon name="check" className="size-3" />
                  </span>
                  {s}
                  {i === 0 && <span className="mono-label ml-auto shrink-0 text-[12.5px] text-sun">{data.ours.fastLabel}</span>}
                </li>
              ))}
              {rest.map((s) => (
                <li key={s} className="flex items-center gap-3 border-b border-white/15 py-4 text-[17px] text-white/85">
                  <span aria-hidden className="flex size-4.5 shrink-0 items-center justify-center bg-white text-fg">
                    <Icon name="check" className="size-3" />
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <p className="font-home mt-10 max-w-sm text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.2] tracking-[-0.02em] lg:mt-auto lg:pt-10">
              {data.ours.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
