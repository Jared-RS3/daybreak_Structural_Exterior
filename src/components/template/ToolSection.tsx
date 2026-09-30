import type { ToolConfig } from "@/lib/template/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIntro } from "./primitives";

/**
 * The "give them something first" chapter — the Daybreak signature. The frame
 * is the template's; the instrument is the client's. A foundation company
 * passes a crack checker, a pool builder would pass a pool-size estimator,
 * and this section — heading, the working tool in a soft grey tray, an
 * optional input, three honest steps — stays the same.
 */
export function ToolSection({
  id,
  tool,
  title,
  lede,
  showcase,
  launcher,
  tryTitle,
}: {
  id: string;
  tool: ToolConfig;
  title: React.ReactNode;
  lede: React.ReactNode;
  showcase: React.ReactNode;
  /** An input under the tray that starts the tool on the visitor's own details. */
  launcher?: React.ReactNode;
  tryTitle?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 bg-white py-24 sm:py-28 lg:py-36">
      <div className="container-x">
        <Reveal>
          <SectionIntro id={`${id}-title`} label={tool.name} title={title} lede={lede} />
        </Reveal>

        <div className="mt-14 rounded-[32px] bg-card p-2 sm:p-2.5 lg:mt-16">{showcase}</div>

        {launcher && (
          <div className="mx-auto mt-16 max-w-xl text-center">
            {tryTitle && <h3 className="home-title text-[26px] text-fg">{tryTitle}</h3>}
            <div className="mt-6">{launcher}</div>
          </div>
        )}

        <ol className="mt-16 grid gap-3 sm:grid-cols-3">
          {tool.steps.map((s, i) => (
            <li key={s.title} className="rounded-[28px] bg-card px-7 py-8 text-center">
              <span className="mx-auto flex size-9 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-fg">
                {i + 1}
              </span>
              <h4 className="home-title mt-5 text-[20px] text-fg">{s.title}</h4>
              <p className="mx-auto mt-2 max-w-xs text-[15px] leading-[1.55] text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
