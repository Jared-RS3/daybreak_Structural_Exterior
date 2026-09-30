import type { ProcessStep } from "@/lib/template/types";
import type { IconKey } from "@/components/ui/Icon";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIntro } from "./primitives";

/**
 * Three steps, because there are three — set as Crest sets its "why choose
 * us" cards: white on a soft grey fade, a line icon, the number and the word,
 * a sentence of grey underneath.
 */
export function ProcessSteps({
  steps,
  title,
  lede,
  icons,
}: {
  steps: ProcessStep[];
  title: React.ReactNode;
  lede?: React.ReactNode;
  icons: IconKey[];
}) {
  return (
    <section aria-labelledby="process-title" className="bg-gradient-to-b from-white to-[#efefef] py-24 sm:py-28 lg:py-32">
      <div className="container-x">
        <Reveal>
          <SectionIntro id="process-title" label="How it works" title={title} lede={lede} />
        </Reveal>
        <ol className="mx-auto mt-14 grid max-w-5xl gap-3 sm:grid-cols-3 lg:mt-16">
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-col items-center rounded-[28px] bg-white px-7 py-10 text-center">
              <Icon name={icons[i] ?? "check"} className="size-8 text-fg" />
              <h3 className="home-title mt-6 text-[21px] text-fg">
                <span className="font-semibold tabular-nums">{String(i + 1).padStart(2, "0")}</span> {s.title}
              </h3>
              <p className="mt-3 text-[15px] italic leading-[1.55] text-muted">{s.body}</p>
              <span className="pill-label mt-6 bg-card font-medium text-fg">{s.detail}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
