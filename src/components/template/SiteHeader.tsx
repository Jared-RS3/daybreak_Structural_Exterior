"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Cta } from "@/lib/template/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { pillClass } from "./pill";

/** Rising-sun glyph: half a disc on a horizon line. */
function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-6", className)}>
      <path d="M5 16a7 7 0 0 1 14 0Z" fill="currentColor" />
      <path d="M2.5 19h19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export type Brand = { name: string; descriptor: string };
export type Phone = { display: string; href: string; note?: string };

export function Wordmark({ brand, tone }: { brand: Brand; tone: "light" | "dark" }) {
  return (
    <span className={cn("flex items-center gap-2", tone === "light" ? "text-white" : "text-fg")}>
      <Mark />
      <span className="font-home text-[23px] font-medium leading-none tracking-[-0.03em]">
        {brand.name.split(" ")[0]}
      </span>
      <span className={cn("hidden text-[13px] font-medium sm:inline", tone === "light" ? "text-white/75" : "text-muted")}>
        {brand.descriptor}
      </span>
    </span>
  );
}

/**
 * Transparent over the sky, as Crest's is, then solid white once the sky has
 * scrolled away so the nav stays legible over white sections. The switch is
 * driven by a sentinel the hero places at its bottom edge
 * (#header-overlay-end); pages without a sky header start solid.
 *
 * The primary action is always the tool, with the phone number beside it
 * because for an active leak calling is genuinely faster.
 */
export function SiteHeader({
  brand,
  phone,
  homeHref,
  nav,
  primary,
  secondary,
  solidOn,
  wide = false,
}: {
  brand: Brand;
  /** Contractor sites show a phone number; the agency site doesn't. */
  phone?: Phone;
  homeHref: string;
  nav: Cta[];
  primary: Cta;
  secondary: Cta;
  /** Path prefixes whose first section is not a sky header. */
  solidOn: string[];
  /** Use the full-width grid (agency site) instead of the centred one. */
  wide?: boolean;
}) {
  const pathname = usePathname();
  const overlayPage = !solidOn.some((p) => pathname.startsWith(p));
  const [pastSky, setPastSky] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const end = document.getElementById("header-overlay-end");
    if (!end) return;
    const io = new IntersectionObserver(([e]) => setPastSky(e.boundingClientRect.top < 72), {
      rootMargin: "-72px 0px 0px 0px",
      threshold: [0, 1],
    });
    io.observe(end);
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const clear = overlayPage && !pastSky && !open;
  const close = () => setOpen(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,border-color] duration-300",
          clear ? "border-b border-transparent bg-transparent" : "border-b border-line bg-white",
        )}
      >
        <div className={cn(wide ? "container-wide" : "container-x", "flex h-[72px] items-center gap-8")}>
          <Link href={homeHref} aria-label={`${brand.name} — home`} onClick={close}>
            <Wordmark brand={brand} tone={clear ? "light" : "dark"} />
          </Link>

          <nav aria-label="Main" className="ml-6 hidden items-center gap-7 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[15px] font-medium transition-opacity hover:opacity-70",
                  clear ? "text-white" : "text-fg",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            {phone && (
              <a
                href={phone.href}
                className={cn(
                  "hidden items-center gap-2 text-[15px] font-medium tabular-nums transition-opacity hover:opacity-70 md:flex",
                  clear ? "text-white" : "text-fg",
                )}
              >
                <Icon name="phone" className="size-4" />
                {phone.display}
              </a>
            )}
            <span className="hidden sm:block">
              <Link href={primary.href} className={pillClass(clear ? "light" : "dark", "md")}>
                {primary.label}
              </Link>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="site-menu"
              className={cn(
                "-mr-2 flex size-11 items-center justify-center rounded-full transition-colors lg:hidden",
                clear ? "text-white hover:bg-white/15" : "text-fg hover:bg-accent-soft",
              )}
            >
              <svg viewBox="0 0 24 24" aria-hidden className={cn("size-6 transition-transform duration-300", open && "rotate-45")}>
                <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-white lg:hidden"
      >
        <nav aria-label="Mobile" className={cn(wide ? "container-wide" : "container-x", "pt-4")}>
          <ul>
            {nav.map((n) => (
              <li key={n.href} className="border-b border-line">
                <Link href={n.href} onClick={close} className="home-title flex items-center justify-between py-5 text-[28px] text-fg">
                  {n.label}
                  <Icon name="arrowRight" className="size-5 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={cn(wide ? "container-wide" : "container-x", "grid gap-3 py-8")}>
          <Link href={primary.href} onClick={close} className={cn(pillClass("dark", "lg"), "w-full")}>
            {primary.label}
          </Link>
          <Link href={secondary.href} onClick={close} className={cn(pillClass("soft", "lg"), "w-full")}>
            {secondary.label}
          </Link>
          {phone && (
            <a href={phone.href} className="mt-4 rounded-[20px] bg-card p-5">
              <span className="block text-[14px] text-muted">Speak to someone</span>
              <span className="home-title mt-1 block text-[26px] tabular-nums text-fg">{phone.display}</span>
              {phone.note && <span className="mt-1 block text-[13px] text-muted">{phone.note}</span>}
            </a>
          )}
        </div>
      </div>
    </>
  );
}
