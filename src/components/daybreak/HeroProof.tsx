import { Img } from "@/components/ui/Img";

/**
 * The hero's proof line: the founders' faces and the one track record claim
 * Daybreak can make (see `heroTrust` in lib/daybreak.ts for where it comes
 * from). Real people and a checkable fact, on glass over the sky, so a visitor
 * sees who they'd be dealing with before they scroll.
 */
export function HeroProof({
  people,
  claim,
  byline,
}: {
  people: { name: string; src: string }[];
  claim: string;
  byline: string;
}) {
  return (
    <div className="mx-auto inline-flex items-center gap-3.5 rounded-[28px] sm:rounded-full border border-white/25 bg-white/12 py-2 pl-2 pr-5 text-left backdrop-blur-md sm:gap-4 sm:pr-6">
      <span className="flex shrink-0 -space-x-3">
        {people.map((p) => (
          <span key={p.name} className="relative size-11 overflow-hidden rounded-full ring-2 ring-white sm:size-12">
            <Img src={p.src} alt={p.name} sizes="48px" className="object-[50%_25%]" />
          </span>
        ))}
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-medium leading-[1.3] text-white sm:text-[16px]">{claim}</span>
        <span className="mt-0.5 block text-[14px] leading-[1.3] text-white/75 sm:text-[15px]">{byline}</span>
      </span>
    </div>
  );
}
