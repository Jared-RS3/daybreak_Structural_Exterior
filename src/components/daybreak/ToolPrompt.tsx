import { axButton } from "./ax";

/**
 * Where the live-tool band used to be: one slim black strip that says the
 * tools exist and opens them. The buttons are plain links to #tools and
 * #estimate, which the launcher (ToolLauncher) turns into "open the window".
 */
export function ToolPrompt({ checker = true }: { checker?: boolean }) {
  return (
    <div className="flex flex-col gap-5 border-t-[3px] border-sun bg-fg p-5 text-white sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
      <div>
        <p className="mono-label flex items-center gap-2.5 text-[12px] text-white">
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#3ecf7a] opacity-60 motion-reduce:hidden" />
            <span className="relative size-2 rounded-full bg-[#3ecf7a]" />
          </span>
          Live tools · try them now
        </p>
        <p className="font-home mt-3 text-[clamp(1.4rem,2.2vw,1.9rem)] leading-[1.2] tracking-[-0.02em]">
          {checker ? "Click the house to price a repair, or check how serious a crack is." : "Click the house to price a siding job."}{" "}
          <span className="text-sun">Exactly what your customers would use.</span>
        </p>
        <p className="mt-2.5 text-[15px] leading-[1.5] text-white/75">
          Finish one and we&rsquo;ll email you the PDF your customers would get.
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
        <a href="#estimate" className={axButton("light")}>
          House estimator: click, get a price
        </a>
        {checker && (
          <a href="#tools" className={axButton("lineLight")}>
            Crack checker: is it serious?
          </a>
        )}
      </div>
    </div>
  );
}
