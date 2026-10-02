import type { ToolConfig } from "@/lib/template/types";

/**
 * The Daybreak signature: a tool that gives a homeowner an answer before
 * they are asked for anything. For foundation and crawl space work that
 * answer is "how serious is this?", so the crack checker runs live on a black
 * band with a sunrise rule, followed by its three steps. It sits inside the
 * work section (the proof), rather than as a section of its own.
 */
export function AxToolBand({
  tool,
  checker,
}: {
  tool: ToolConfig;
  /** The live tool. It carries its own panels, so it reads on black. */
  checker: React.ReactNode;
}) {
  return (
    <section id="tools" aria-labelledby="tools-title" className="scroll-mt-20 border-t-[3px] border-sun bg-fg p-4 text-white sm:p-8 lg:p-12">
      <div className="grid gap-6 px-2 pt-2 sm:px-0 sm:pt-0 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="text-center lg:col-span-7 lg:text-left">
          <p className="mono-label flex items-center justify-center gap-2.5 text-white lg:justify-start">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#3ecf7a] opacity-60 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-[#3ecf7a]" />
            </span>
            Live tool · try it now
          </p>
          <h3 id="tools-title" className="font-home mt-6 text-[clamp(2rem,3.6vw,3.1rem)] font-normal leading-[1.05] tracking-[-0.03em]">
            Give them an answer before you ask for their number.
            <span className="mt-3 block text-sun">Try our {tool.name.toLowerCase()}.</span>
          </h3>
        </div>
        <p className="mx-auto max-w-md text-center text-[17px] leading-[1.6] text-white/75 lg:col-span-5 lg:mx-0 lg:text-left">
          Four questions, and the site tells the homeowner how worried to be, what a fix usually costs, and books
          the right visit. This is exactly what your customers would see.
        </p>
      </div>

      <div className="mt-8 lg:mt-10">{checker}</div>

      <ol className="mt-10 grid gap-6 border-t border-white/15 px-2 pt-8 sm:grid-cols-3 sm:px-0 lg:mt-12">
        {tool.steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="mono-label flex size-8 shrink-0 items-center justify-center bg-sun text-[12.5px] text-fg">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              <span className="font-home block text-[18px] tracking-[-0.02em] text-white">{s.title}</span>
              <span className="mt-1.5 block text-[16px] leading-[1.55] text-white/65">{s.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
