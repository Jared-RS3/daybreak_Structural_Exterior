import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { AxLabel } from "./ax";

const pad = (i: number) => String(i + 1).padStart(2, "0");

/**
 * The whole system in one line, set just ahead of the work so the visitor has
 * the path in mind before they see the design. Deliberately small: a heading
 * and the steps as single words. On phones the steps wrap as tags with arrows
 * between them; from desktop up they sit in ruled columns, `mark` on a
 * sunrise rule.
 */
export function SystemStrip({
  title,
  steps,
  mark,
}: {
  title: string;
  steps: string[];
  mark?: string;
}) {
  return (
    <section id="system" aria-labelledby="system-title" className="scroll-mt-20 bg-white pb-20 sm:pb-24">
      <div className="container-wide">
        <div className="border-t border-rule pt-6">
          <div className="flex justify-center lg:justify-start">
            <AxLabel>The system</AxLabel>
          </div>
          <h2
            id="system-title"
            className="font-home mx-auto mt-8 max-w-2xl text-center text-[clamp(1.6rem,2.6vw,2.3rem)] font-normal leading-[1.15] tracking-[-0.025em] text-fg lg:mx-0 lg:mt-10 lg:text-left"
          >
            {title}
          </h2>
        </div>

        <ol
          style={{ "--steps": steps.length } as React.CSSProperties}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2.5 lg:mt-12 lg:grid lg:grid-cols-[repeat(var(--steps),minmax(0,1fr))] lg:gap-0"
        >
          {steps.map((s, i) => {
            const marked = s === mark;
            const end = i === steps.length - 1;
            return (
              <li key={s} className="flex items-center gap-1.5 lg:block">
                <span
                  className={cn(
                    "relative flex items-baseline gap-2 px-2.5 py-2 lg:block lg:bg-transparent lg:px-0 lg:pb-0 lg:pr-6",
                    marked ? "bg-sun lg:border-t-[3px] lg:border-sun lg:pt-[14px]" : "bg-panel lg:border-t lg:border-fg lg:pt-4",
                  )}
                >
                  <span className="mono-label text-[11px] text-muted lg:block lg:text-[12px]">{pad(i)}</span>
                  <span className="font-home text-[16px] tracking-[-0.01em] text-fg lg:mt-6 lg:block lg:text-[clamp(1.3rem,1.75vw,1.7rem)] lg:tracking-[-0.025em]">
                    {s}
                  </span>
                  {!end && <Icon name="arrowRight" className="absolute right-4 top-4 hidden size-4 text-muted lg:block" />}
                </span>
                {!end && <Icon name="arrowRight" className="size-3.5 text-muted lg:hidden" />}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
