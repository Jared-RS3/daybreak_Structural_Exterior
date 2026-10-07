import type { Area } from "@/lib/estimator";
import { cn } from "@/lib/utils";

/** Small on a phone or in the tools side window, full size when wide. Inside
    the estimator "wide" is its own container's width; on the page, the screen's. */
const sizes = {
  container: {
    tag: "gap-1 p-0.5 @xl:gap-1.5 @xl:p-1",
    n: "size-3.5 text-[8px] @xl:size-[18px] @xl:text-[10px]",
    label: "pr-1 text-[7px] @xl:pr-1.5 @xl:text-[9.5px]",
  },
  screen: {
    tag: "gap-1 p-0.5 lg:gap-1.5 lg:p-1",
    n: "size-3.5 text-[8px] lg:size-[18px] lg:text-[10px]",
    label: "pr-1 text-[7px] lg:pr-1.5 lg:text-[9.5px]",
  },
};

/**
 * An area's tag on the house picture: its number and name. It sits above,
 * below or inside its zone (the area's `chip`, chosen so neighbouring tags
 * never overlap), and against the zone's right side when the zone runs to
 * the picture's edge, so it never hangs off the photo. Place it inside an
 * absolutely positioned box the size of the zone.
 */
export function AreaTag({ area, n, scale }: { area: Area; n: number; scale: keyof typeof sizes }) {
  const s = sizes[scale];
  const atEdge = area.zone.x + area.zone.w >= 99;
  return (
    <span
      className={cn(
        "absolute flex items-center whitespace-nowrap bg-fg text-white",
        s.tag,
        atEdge ? "right-0" : "left-1/2 -translate-x-1/2",
      )}
      style={area.chip === "above" ? { bottom: "calc(100% + 3px)" } : area.chip === "below" ? { top: "calc(100% + 3px)" } : { bottom: "3px" }}
    >
      <span className={cn("flex shrink-0 items-center justify-center bg-sun font-medium text-fg", s.n)}>{n}</span>
      <span className={cn("mono-label", s.label)}>{area.label}</span>
    </span>
  );
}
