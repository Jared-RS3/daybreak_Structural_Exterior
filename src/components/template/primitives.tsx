import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { illustrative, publishStructuredData } from "@/lib/site";
import { pillClass, type PillSize, type PillVariant } from "./pill";

export { pillClass };

/* ==========================================================================
   Template primitives. Everything visual that repeats across sections lives
   here, so the Crest language — pill labels, pill buttons, soft centred
   intros — is defined once.
   ========================================================================== */

/** Small grey pill naming a section: "Services", "Reviews". */
export function PillLabel({
  children,
  tone = "grey",
  className,
}: {
  children: React.ReactNode;
  tone?: "grey" | "sky" | "white";
  className?: string;
}) {
  const tones = {
    grey: "bg-accent-soft text-fg",
    sky: "bg-white/25 text-white",
    white: "bg-white text-fg",
  } as const;
  return <span className={cn("pill-label", tones[tone], className)}>{children}</span>;
}

/**
 * The section opening Crest uses throughout: pill, headline, one line of
 * grey text. Centred by default; left-aligned where a section pairs its
 * intro with controls on the right.
 */
export function SectionIntro({
  id,
  label,
  title,
  lede,
  align = "center",
  tone = "light",
  aside,
  as: H = "h2",
  className,
}: {
  id?: string;
  label: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "center" | "left";
  tone?: "light" | "sky";
  aside?: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div
      className={cn(
        center ? "mx-auto max-w-3xl text-center" : "flex flex-wrap items-end justify-between gap-x-10 gap-y-6",
        className,
      )}
    >
      <div className={center ? "" : "max-w-2xl"}>
        <div className={cn("flex flex-wrap items-center gap-2", center && "justify-center")}>
          {typeof label === "string" ? <PillLabel tone={tone === "sky" ? "sky" : "grey"}>{label}</PillLabel> : label}
        </div>
        <H
          id={id}
          className={cn(
            "home-heading mt-5 text-[clamp(2.1rem,4.4vw,3.5rem)]",
            tone === "sky" ? "text-white" : "text-fg",
          )}
        >
          {title}
        </H>
        {lede && (
          <p
            className={cn(
              "mt-4 text-[17px] leading-[1.55]",
              center && "mx-auto max-w-xl",
              !center && "max-w-xl",
              tone === "sky" ? "text-white/90" : "text-muted",
            )}
          >
            {lede}
          </p>
        )}
      </div>
      {aside}
    </div>
  );
}

/** A link styled as Crest's pill button. */
export function PillLink({
  href,
  children,
  variant = "dark",
  size = "md",
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  variant?: PillVariant;
  size?: PillSize;
  className?: string;
  onClick?: () => void;
}) {
  const cls = cn(pillClass(variant, size), className);
  // Other sites (a Cal.com booking page) open in a new tab, and say so to
  // screen readers.
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onClick}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  if (href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} onClick={onClick}>
      {children}
    </Link>
  );
}

/** Text link with a trailing arrow, for tertiary actions. */
export function ArrowLink({
  href,
  children,
  tone = "dark",
  className,
}: {
  href: string;
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 text-[15px] font-medium transition-colors",
        tone === "light" ? "text-white hover:text-white/80" : "text-fg hover:text-muted",
        className,
      )}
    >
      {children}
      <Icon name="arrowRight" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
    </Link>
  );
}

export function Stars({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <span className={cn("flex gap-0.5", className)} aria-label={`${count} out of 5 stars`} role="img">
      {Array.from({ length: count }).map((_, i) => (
        <Icon key={i} name="star" filled className="size-3.5 text-[#f2a93b]" />
      ))}
    </span>
  );
}

/** Two-letter initials in a circle — the avatar when there's no photo. */
export function Initials({ name, className }: { name: string; className?: string }) {
  const letters = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-3 text-[13px] font-semibold text-fg",
        className,
      )}
    >
      {letters}
    </span>
  );
}

/**
 * Marks proof that is placeholder content. Driven by one flag in the content
 * file, so a real client build loses every tag at once — and a demo build can
 * never quietly drop one.
 */
export function Illustrative({
  children = "Illustrative — fictional contractor",
  className,
}: {
  tone?: "dark" | "light";
  children?: React.ReactNode;
  className?: string;
}) {
  if (!illustrative) return null;
  return <span className={cn("pill-label bg-[#fbf0d3] font-medium text-[#6a5200]", className)}>{children}</span>;
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  if (!publishStructuredData) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Breadcrumb trail for inner pages. */
export function Crumbs({ trail, tone = "dark" }: { trail: { name: string; href?: string }[]; tone?: "dark" | "light" }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px]", tone === "light" ? "text-white/80" : "text-muted")}>
        {trail.map((t, i) => (
          <li key={t.name} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {t.href ? (
              <Link href={t.href} className={cn("hover:underline", tone === "light" ? "hover:text-white" : "hover:text-fg")}>
                {t.name}
              </Link>
            ) : (
              <span aria-current="page" className={tone === "light" ? "text-white" : "text-fg"}>
                {t.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
