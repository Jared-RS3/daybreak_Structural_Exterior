import { cn } from "@/lib/utils";

/**
 * The house marker for content that is a placeholder or a worked example
 * rather than a measurement. Matches the tag the attribution section already
 * uses, so "example data" reads the same way everywhere on the site.
 *
 * Small on purpose. It has to be legible to anyone who looks for it without
 * shouting over the layout it is labelling — but it is not decoration, so it
 * never gets removed while the placeholder content stays.
 */
export function SampleTag({
  children = "Example content",
  tone = "dark",
  className,
}: {
  children?: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "annotation inline-block rounded-sm px-2.5 py-1",
        tone === "light" ? "bg-white/12 text-dawn-300" : "bg-dawn-400/20 text-ink-700",
        className,
      )}
    >
      {children}
    </span>
  );
}
