import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { SectionIntro } from "./primitives";

const tones = {
  white: "bg-white",
  soft: "bg-surface-2",
  fade: "bg-gradient-to-b from-white to-[#efefef]",
} as const;

/**
 * Section shell for chapters that open with Crest's pill-and-headline intro
 * and then hand the floor to one component.
 */
export function Chapter({
  id,
  label,
  title,
  lede,
  aside,
  align = "center",
  tone = "white",
  children,
  className,
}: {
  id: string;
  label: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  aside?: React.ReactNode;
  align?: "center" | "left";
  tone?: keyof typeof tones;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-20 py-24 sm:py-28 lg:py-32", tones[tone], className)}>
      <div className="container-x">
        <Reveal>
          <SectionIntro id={`${id}-title`} label={label} title={title} lede={lede} align={align} aside={aside} />
        </Reveal>
        <div className="mt-12 lg:mt-16">{children}</div>
      </div>
    </section>
  );
}
