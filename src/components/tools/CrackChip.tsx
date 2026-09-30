import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * A floating card over the hero house, the way Crest floats UI over its
 * render: a crack already checked, with the answer a homeowner gets. It is
 * the differentiator in the first screen, and it links down to the tool.
 * `compact` shrinks it on phones, where it floats over the house itself.
 */
export function CrackChip({ href, compact = false }: { href: string; compact?: boolean }) {
  return (
    <a
      href={href}
      className={cn(
        "group flex w-[21rem] max-w-full items-center gap-4 rounded-[24px] bg-white p-2.5 pr-5 text-left shadow-[0_24px_60px_-24px_rgb(20_40_60/0.45)] transition-transform duration-500 hover:-translate-y-0.5",
        compact && "max-sm:w-auto max-sm:gap-2.5 max-sm:rounded-[14px] max-sm:p-1.5 max-sm:pr-3 max-sm:ring-1 max-sm:ring-black/8",
      )}
    >
      <div className={cn("relative size-[5.5rem] shrink-0 overflow-hidden rounded-[18px]", compact && "max-sm:size-[3.4rem] max-sm:rounded-[10px]")}>
        <Img src="/images/foundation-crack-brick.jpg" alt="" sizes="180px" />
      </div>
      <div className="min-w-0">
        <p className={cn("flex items-center gap-1.5 text-[12.5px] text-muted", compact && "max-sm:gap-1 max-sm:text-[10.5px]")}>
          <Icon name="crack" className={cn("size-3.5", compact && "max-sm:size-3")} />
          Crack checked
        </p>
        <p
          className={cn(
            "font-home mt-1 text-[19px] font-medium leading-tight tracking-[-0.02em] text-fg",
            compact && "max-sm:mt-0.5 max-sm:text-[13px]",
          )}
        >
          Stair-step, ⅛ in wide
        </p>
        <p
          className={cn(
            "mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#fff4d6] px-2.5 py-1 text-[12.5px] font-medium text-[#8a5a00]",
            compact && "max-sm:mt-1 max-sm:gap-1 max-sm:px-1.5 max-sm:py-0.5 max-sm:text-[10.5px]",
          )}
        >
          <span aria-hidden className="size-1.5 rounded-full bg-[#e5a50a]" />
          Worth an inspection
        </p>
      </div>
    </a>
  );
}
