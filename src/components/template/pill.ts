import { cn } from "@/lib/utils";

/* Crest's pill button, as a class string. Kept in its own module (no content
   imports) so client components can use it without pulling the site's
   content file into the browser bundle. */

const pillBase =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-colors duration-200 disabled:cursor-progress";

const pillVariants = {
  dark: "bg-accent text-white hover:bg-accent-strong",
  light: "bg-white text-fg hover:bg-white/85",
  soft: "bg-accent-soft text-fg hover:bg-[#e2e2e2]",
  glass: "bg-white/20 text-white hover:bg-white/30",
} as const;

const pillSizes = {
  sm: "h-9 px-4 text-[14px]",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-[16px]",
} as const;

export type PillVariant = keyof typeof pillVariants;
export type PillSize = keyof typeof pillSizes;

export function pillClass(variant: PillVariant = "dark", size: PillSize = "md") {
  return cn(pillBase, pillVariants[variant], pillSizes[size]);
}
