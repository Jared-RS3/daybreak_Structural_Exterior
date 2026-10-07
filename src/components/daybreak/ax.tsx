import Link from "next/link";
import { cn, newTab } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

/* ==========================================================================
   Axion-style primitives for the agency site, below the hero.

   Business-professional rather than soft: a full-width hairline over every
   section, a small monospace label with a sunrise-yellow square, large plain
   headlines, square grey panels and rectangular buttons with monospace text.
   The hero keeps the Crest sky; everything after it speaks this language.
   ========================================================================== */

export function AxLabel({ children, tone = "dark", className }: { children: React.ReactNode; tone?: "dark" | "light"; className?: string }) {
  return (
    <p className={cn("mono-label flex items-center gap-2.5", tone === "light" ? "text-white" : "text-fg", className)}>
      <span aria-hidden className="size-1.5 shrink-0 bg-sun" />
      {children}
    </p>
  );
}

/**
 * Every section title on the site, whether it sits in an AxHead or is laid
 * out by hand next to a film or a form, so no two titles drift apart.
 */
export const axTitle = "font-home text-[clamp(2.2rem,4.2vw,3.6rem)] font-normal leading-[1.06] tracking-[-0.03em]";

/** The title on a card or row inside a section: a leak, a step, a concept, an outcome. */
export const axCardTitle = "font-home text-[clamp(1.8rem,2.6vw,2.3rem)] font-normal leading-[1.08] tracking-[-0.03em]";

/**
 * Section opening: hairline, label, headline — centred on phones, left-set
 * from desktop up, with an optional lede and a right-hand slot (buttons, a
 * count) on the same row.
 */
export function AxHead({
  id,
  label,
  title,
  lede,
  aside,
  align = "left",
  tone = "dark",
  className,
}: {
  id?: string;
  label: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  aside?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <Reveal className={cn("border-t pt-6", light ? "border-white/20" : "border-rule", className)}>
      <div className={cn("flex justify-center", align === "left" && "lg:justify-start")}>
        {typeof label === "string" ? <AxLabel tone={tone}>{label}</AxLabel> : label}
      </div>
      {/* Two columns on desktop: the headline on the left, the lede (and any
          aside) bottom-aligned on the right — so a head never leaves half the
          row empty. */}
      <div
        className={cn(
          "mt-10 lg:mt-14",
          align === "center"
            ? "mx-auto max-w-3xl text-center"
            : "grid gap-6 text-center lg:grid-cols-12 lg:items-end lg:gap-10 lg:text-left",
        )}
      >
        <h2
          id={id}
          className={cn(
            axTitle,
            align === "center" ? "" : "lg:col-span-7",
            light ? "text-white" : "text-fg",
          )}
        >
          {title}
        </h2>
        {(lede || aside) && (
          <div className={cn(align === "center" ? "mt-5" : "lg:col-span-5 lg:pb-1.5", "space-y-5")}>
            {lede && (
              <p
                className={cn(
                  "mx-auto max-w-md text-[17px] leading-[1.6]",
                  align === "left" && "lg:mx-0",
                  light ? "text-white/80" : "text-muted",
                )}
              >
                {lede}
              </p>
            )}
            {aside}
          </div>
        )}
      </div>
    </Reveal>
  );
}

const btnBase =
  "mono-label inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap px-6 transition-colors duration-200 disabled:cursor-progress";
const btnVariants = {
  dark: "bg-fg text-white hover:bg-[#333]",
  light: "bg-white text-fg hover:bg-[#ececec]",
  line: "border border-fg/25 text-fg hover:border-fg",
  lineLight: "border border-white/40 text-white hover:border-white",
} as const;

export function axButton(variant: keyof typeof btnVariants = "dark") {
  return cn(btnBase, btnVariants[variant]);
}

export function AxButton({
  href,
  children,
  variant = "dark",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof btnVariants;
  className?: string;
}) {
  const cls = cn(axButton(variant), className);
  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...newTab(href)}>
      {children}
    </Link>
  );
}

/** Small mono tag, as Axion tags equipment ("OPERATOR AVAILABLE"). */
export function AxTag({ children, tone = "grey", className }: { children: React.ReactNode; tone?: "grey" | "white" | "sun" | "dark"; className?: string }) {
  const tones = {
    grey: "bg-panel-2 text-fg",
    white: "bg-white text-fg",
    sun: "bg-sun text-fg",
    dark: "bg-white/10 text-white",
  } as const;
  return <span className={cn("mono-label inline-flex items-center px-2.5 py-1.5 text-[12.5px]", tones[tone], className)}>{children}</span>;
}
