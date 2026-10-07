import { AreaTag } from "@/components/tools/AreaTag";
import { HouseScene } from "@/components/tools/EstimatorScenes";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { areas, sceneImages } from "@/lib/estimator";
import { axButton } from "./ax";

/**
 * The homepage's look at the live tools: the estimator's house, with its
 * numbered areas, set beside a short pitch. Not the tool itself (that would
 * make the page long again): the whole picture is a link to #estimate, which
 * the launcher (ToolLauncher) turns into "open the tools window". It uses the
 * photographic house as soon as one is set in lib/estimator.ts.
 */
export function ToolPreview() {
  const photo = sceneImages.house;
  return (
    <div className="grid border-t-[3px] border-sun bg-fg text-white lg:grid-cols-12">
      <div className="flex flex-col justify-center gap-6 p-6 sm:p-8 lg:col-span-5 lg:p-10">
        <p className="mono-label flex items-center gap-2.5 text-[12px]">
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#3ecf7a] opacity-60 motion-reduce:hidden" />
            <span className="relative size-2 rounded-full bg-[#3ecf7a]" />
          </span>
          Live tools · try them now
        </p>
        <h3 className="font-home text-[clamp(1.9rem,3vw,2.7rem)] font-normal leading-[1.08] tracking-[-0.03em]">
          Two tools your customers would use. <span className="text-sun">Try them yourself.</span>
        </h3>
        <dl className="max-w-md space-y-3 text-[16px] leading-[1.55]">
          <div>
            <dt className="font-medium text-white">House estimator</dt>
            <dd className="text-white/75">Click the part of the house that&rsquo;s worrying you, pick the problem and a size, and get a ballpark price.</dd>
          </div>
          <div>
            <dt className="font-medium text-white">Crack checker</dt>
            <dd className="text-white/75">Four questions about a crack, and it tells you how serious it probably is.</dd>
          </div>
        </dl>
        <div className="flex max-w-md gap-3 border-l-[3px] border-sun bg-white/[0.06] py-3.5 pl-4 pr-4">
          <Icon name="document" className="mt-0.5 size-5 shrink-0 text-sun" />
          <p className="text-[15px] leading-[1.5] text-white">
            <strong className="font-medium">Finish one and we&rsquo;ll email you the PDF</strong>{" "}
            <span className="text-white/75">
              your customers would get, so you can see it for yourself. On your site, every one reaches you as a lead.
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a href="#estimate" className={axButton("light")}>
            Try the house estimator
          </a>
          <a href="#tools" className={axButton("lineLight")}>
            Try the crack checker
          </a>
        </div>
      </div>

      <a
        href="#estimate"
        aria-label="Open the house estimator"
        className="group relative block overflow-hidden bg-[#dde8ef] lg:col-span-7 lg:flex lg:items-end"
      >
        <div className="relative aspect-[1000/560] w-full">
          {photo ? <Img src={photo.src} alt="" sizes="(min-width:1024px) 60vw, 100vw" /> : <HouseScene />}
          {areas.map((a, i) => (
            <span
              key={a.id}
              aria-hidden
              className="absolute"
              style={{ left: `${a.zone.x}%`, top: `${a.zone.y}%`, width: `${a.zone.w}%`, height: `${a.zone.h}%` }}
            >
              <AreaTag area={a} n={i + 1} scale="screen" />
            </span>
          ))}
        </div>
        <span className="mono-label absolute bottom-3 right-3 inline-flex items-center gap-2 bg-fg px-3 py-2 text-[11.5px] text-white transition-colors group-hover:bg-sun group-hover:text-fg">
          Open the house estimator
          <svg viewBox="0 0 24 24" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </a>
    </div>
  );
}
