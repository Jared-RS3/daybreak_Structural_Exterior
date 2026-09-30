import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/**
 * Small mono label, set like an annotation on a drawing. Carries an index
 * where the section is part of a sequence — the number is information, not
 * decoration, so it is only passed where an order actually exists.
 */
export function Eyebrow({
  children,
  index,
  tone = "ember",
  className,
}: {
  children: React.ReactNode;
  index?: string;
  tone?: "ember" | "light" | "quiet";
  className?: string;
}) {
  const tones = {
    ember: "text-ember-600",
    light: "text-dawn-300",
    quiet: "text-ink-400",
  } as const;

  return (
    <span className={cn("annotation inline-flex items-baseline gap-3", tones[tone], className)}>
      {index && <span className="numeric text-[13px] [font-weight:600] tracking-normal">{index}</span>}
      {children}
    </span>
  );
}

/**
 * Heading block. Size is a deliberate choice per section rather than one
 * clamp applied everywhere, so the page reads as a hierarchy: `hero` for the
 * one or two sections that should stop you, `lead` for the main body
 * sections, `quiet` for supporting material that should not compete.
 */
export function SectionHeading({
  eyebrow,
  index,
  title,
  lede,
  size = "lead",
  tone = "dark",
  align = "left",
  className,
  children,
}: {
  eyebrow?: string;
  index?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  size?: "hero" | "lead" | "quiet";
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
}) {
  const sizes = {
    hero: "display-xl text-[clamp(2.6rem,6vw,4.5rem)]",
    lead: "display-lg text-[clamp(2rem,4vw,3.1rem)]",
    quiet: "text-[clamp(1.5rem,2.4vw,2rem)] [font-weight:650] tracking-[-0.015em]",
  } as const;

  return (
    <Reveal className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <Eyebrow
          index={index}
          tone={tone === "light" ? "light" : "ember"}
          className={cn("mb-5", align === "center" && "justify-center")}
        >
          {eyebrow}
        </Eyebrow>
      )}
      <h2 className={cn(sizes[size], tone === "light" ? "text-white" : "text-ink-900")}>
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-5 max-w-xl text-[16.5px] leading-[1.62]",
            align === "center" && "mx-auto",
            tone === "light" ? "text-ink-300" : "text-ink-500",
          )}
        >
          {lede}
        </p>
      )}
      {children}
    </Reveal>
  );
}

/**
 * Section shell. `space` exists so the page has pacing — a thin data band
 * next to an expansive one reads very differently from twelve sections at
 * identical padding. Callers are free to skip this component entirely when
 * a section wants its own composition.
 */
export function Section({
  children,
  className,
  id,
  tone = "bone",
  space = "normal",
  as: Tag = "section",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: "bone" | "paper" | "white" | "ink" | "transparent";
  space?: "band" | "tight" | "normal" | "wide";
  as?: React.ElementType;
}) {
  const tones = {
    bone: "bg-bone-50",
    paper: "bg-bone-100",
    white: "bg-white",
    ink: "bg-ink-900 text-white",
    transparent: "",
  } as const;

  const spaces = {
    band: "py-12 md:py-14",
    tight: "py-16 md:py-20",
    normal: "py-20 md:py-28",
    wide: "py-24 md:py-36 lg:py-44",
  } as const;

  return (
    <Tag id={id} className={cn("relative", spaces[space], tones[tone], className)}>
      {children}
    </Tag>
  );
}

/** Hairline rule used to separate editorial rows instead of boxing them. */
export function Rule({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <hr
      className={cn(
        "border-0 border-t",
        tone === "light" ? "border-white/12" : "border-ink-900/12",
        className,
      )}
    />
  );
}
