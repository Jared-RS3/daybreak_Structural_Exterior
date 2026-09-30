import type { Comparison as ComparisonData } from "@/lib/template/types";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { SectionIntro } from "./primitives";

/**
 * Two cards, side by side. The usual way is grey and long, because most of it
 * is waiting — each wait drawn as a dashed gap with a clock rather than a
 * step. The Daybreak way is the sky, and short: the first three steps happen
 * online in about a minute, before anyone picks up a phone.
 *
 * No durations on the usual lane on purpose. How long it takes depends on
 * who you call, and inventing an industry average would be the one dishonest
 * thing in a section about honesty.
 */
export function Comparison({
  data,
  title,
  lede,
}: {
  data: ComparisonData;
  title: React.ReactNode;
  lede: React.ReactNode;
}) {
  const fast = data.ours.steps.slice(0, data.ours.fastSteps);
  const rest = data.ours.steps.slice(data.ours.fastSteps);

  return (
    <section aria-labelledby="compare-title" className="bg-white py-24 sm:py-28 lg:py-32">
      <div className="container-x">
        <Reveal>
          <SectionIntro id="compare-title" label="Why it's different" title={title} lede={lede} />
        </Reveal>

        <div className="mt-14 grid gap-3 lg:mt-16 lg:grid-cols-2">
          {/* ---- the usual way ---- */}
          <div className="rounded-[32px] bg-card p-7 sm:p-10">
            <p className="home-title text-[22px] text-muted">{data.usual.label}</p>
            <ol className="mt-8">
              {data.usual.steps.map((s) =>
                s.wait ? (
                  <li key={s.label} className="flex items-center gap-4 py-1.5 pl-[15px]">
                    <span aria-hidden className="h-12 border-l-2 border-dashed border-[#c9c9ce]" />
                    <span className="flex items-center gap-2 text-[14.5px] italic text-muted">
                      <Icon name="clock" className="size-4 not-italic" />
                      {s.label}
                    </span>
                  </li>
                ) : (
                  <li key={s.label} className="flex items-center gap-4 py-1">
                    <span aria-hidden className="size-8 shrink-0 rounded-full border-2 border-[#c9c9ce] bg-white" />
                    <span className="text-[16px] text-fg/80">{s.label}</span>
                  </li>
                ),
              )}
            </ol>
          </div>

          {/* ---- ours ---- */}
          <div className="sky-page flex flex-col rounded-[32px] p-7 text-white sm:p-10">
            <p className="home-title text-[22px]">{data.ours.label}</p>

            <div className="mt-8 rounded-[22px] bg-white/12 p-4">
              <p className="pill-label bg-white text-fg">{data.ours.fastLabel}</p>
              <ol className="mt-4 space-y-3">
                {fast.map((s) => (
                  <Step key={s} label={s} />
                ))}
              </ol>
            </div>
            <ol className="mt-3 space-y-3 px-4">
              {rest.map((s) => (
                <Step key={s} label={s} />
              ))}
            </ol>

            <p className="home-heading mt-10 max-w-sm text-[clamp(1.6rem,2.6vw,2.2rem)] lg:mt-auto lg:pt-10">
              {data.ours.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-4">
      <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-fg">
        <Icon name="check" className="size-4" />
      </span>
      <span className="text-[16px] text-white">{label}</span>
    </li>
  );
}
