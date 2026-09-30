import type { ProcessStep } from "@/lib/template/types";
import { AxHead } from "./ax";

/**
 * Three steps in ruled columns: the number in mono, the step, the detail.
 * With `lede` and `action` it doubles as the offer: step one is the free
 * design, so the ask sits in the head beside it.
 */
export function AxProcess({
  steps,
  title,
  lede,
  action,
}: {
  steps: ProcessStep[];
  title: React.ReactNode;
  lede?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section aria-labelledby="process-title" className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="container-wide">
        <AxHead id="process-title" label="How we start" title={title} lede={lede} aside={action} />
        <ol className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8 lg:mt-16">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t border-fg pt-5">
              <p className="mono-label text-muted">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="font-home mt-8 text-[clamp(1.8rem,2.6vw,2.3rem)] font-normal tracking-[-0.03em] text-fg">{s.title}</h3>
              <p className="mt-3 max-w-sm text-[17px] leading-[1.6] text-muted">{s.body}</p>
              <p className="mono-label mt-6 inline-flex items-center gap-2 text-[12.5px] text-fg">
                <span aria-hidden className="size-1.5 bg-sun" />
                {s.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
