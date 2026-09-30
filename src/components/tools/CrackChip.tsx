import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";

/**
 * A floating card over the hero house, the way Crest floats UI over its
 * render: a crack already checked, with the answer a homeowner gets. It is
 * the differentiator in the first screen, and it links down to the tool.
 */
export function CrackChip({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="group flex w-[21rem] max-w-full items-center gap-4 rounded-[24px] bg-white p-2.5 pr-5 text-left shadow-[0_24px_60px_-24px_rgb(20_40_60/0.45)] transition-transform duration-500 hover:-translate-y-0.5"
    >
      <div className="relative size-[5.5rem] shrink-0 overflow-hidden rounded-[18px]">
        <Img src="/images/foundation-crack-brick.jpg" alt="" sizes="180px" />
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[12.5px] text-muted">
          <Icon name="crack" className="size-3.5" />
          Crack checked
        </p>
        <p className="font-home mt-1 text-[19px] font-medium leading-tight tracking-[-0.02em] text-fg">
          Stair-step, ⅛ in wide
        </p>
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#fff4d6] px-2.5 py-1 text-[12.5px] font-medium text-[#8a5a00]">
          <span aria-hidden className="size-1.5 rounded-full bg-[#e5a50a]" />
          Worth an inspection
        </p>
      </div>
    </a>
  );
}
