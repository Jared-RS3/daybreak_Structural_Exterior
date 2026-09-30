import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "dark" | "outline" | "ghost" | "light" | "accent" | "line" | "lineLight";
type Size = "sm" | "md" | "lg" | "xl";

/**
 * Square-cornered by design. A contractor's own work is made of flat
 * planes and clean edges; a pill button fights that. Hover is a colour and
 * border shift rather than a lift, so nothing floats without a reason to.
 */
const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 rounded-sm font-semibold tracking-[-0.01em] transition-colors duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-ember-500 text-white hover:bg-ember-600",
  dark: "bg-ink-900 text-white hover:bg-ink-800",
  outline:
    "border border-ink-900/20 bg-transparent text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-white",
  ghost: "text-ink-700 underline-offset-4 hover:text-ink-900 hover:underline",
  light: "border border-white/25 bg-transparent text-white hover:bg-white hover:text-ink-900",
  // Home-services template. These read the semantic tokens so a client
  // re-brand reaches every button without touching this file.
  accent: "bg-accent text-white hover:bg-accent-strong",
  line: "border border-ink-900/20 bg-transparent text-ink-900 hover:border-ink-900",
  lineLight: "border border-white/30 bg-transparent text-white hover:border-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-[14.5px]",
  lg: "h-13 px-7 text-[15.5px]",
  xl: "h-14 px-8 text-[16px]",
};

type Props = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & (
  | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
);

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: Props) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (rest.href !== undefined) {
    const { href, ...linkRest } = rest as { href: string };
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
