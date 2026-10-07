"use client";

import { Icon } from "@/components/ui/Icon";
import type { Cta } from "@/lib/template/types";
import { cn, newTab } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { pillClass } from "./pill";

/** Rising-sun glyph: half a disc on a horizon line. */
function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-6", className)}>
      <path d="M5 16a7 7 0 0 1 14 0Z" fill="currentColor" />
      <path
        d="M2.5 19h19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}


/** `wordmark` is the logo text; without it the logo shows the name's first word. */
export type Brand = { name: string; descriptor: string; wordmark?: string };
export type Phone = { display: string; href: string; note?: string };

export function Wordmark({
  brand,
  tone,
}: {
  brand: Brand;
  tone: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-2",
        tone === "light" ? "text-white" : "text-fg",
      )}
    >
      <Mark className="max-sm:size-5" />
      {/* Smaller on phones, so the full name sits on one line beside the menu button. */}
      <span className="whitespace-nowrap font-home text-[19px] font-medium leading-none tracking-[-0.03em] max-[400px]:text-[17px] sm:text-[23px]">
        {brand.wordmark ?? brand.name.split(" ")[0]}
      </span>
      <span
        className={cn(
          "hidden text-[13px] font-medium sm:inline",
          tone === "light" ? "text-white/75" : "text-muted",
        )}
      >
        {brand.descriptor}
      </span>
    </span>
  );
}

/**
 * A "/#section" link stays on the current page when that section is here,
 * so the header's main action reaches the form on whichever page has one
 * (the agency site puts one at the foot of every sales page). Elsewhere it
 * goes to the homepage's.
 */
function scrollIfHere(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  const id = /^\/#(.+)$/.exec(href)?.[1];
  const el = id ? document.getElementById(id) : null;
  if (!el) return;
  e.preventDefault();
  history.replaceState(null, "", `#${id}`);
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // After the mobile menu has closed and let go of the page's scroll lock.
  requestAnimationFrame(() => el.scrollIntoView({ behavior: still ? "auto" : "smooth" }));
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
    const io = new IntersectionObserver(
      ([e]) => setPastSky(e.boundingClientRect.top < 72),
      {
        rootMargin: "-72px 0px 0px 0px",
        threshold: [0, 1],
      },
    );
    io.observe(end);
    return () => io.disconnect();
  }, [pathname]);

  // On phones the hero runs long, so a clear header would sit over the
  // headline and buttons as they scroll under it. Go solid on first scroll.
  const [scrolledPhone, setScrolledPhone] = useState(false);
  useEffect(() => {
    const phone = window.matchMedia("(max-width: 767px)");
    const update = () => setScrolledPhone(phone.matches && window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    phone.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", update);
      phone.removeEventListener("change", update);
    };
  }, []);

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

  const clear = overlayPage && !pastSky && !scrolledPhone && !open;
  const close = () => setOpen(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,border-color] duration-300",
          clear
            ? "border-b border-transparent bg-transparent"
            : "border-b border-line bg-white",
        )}
      >
        <div
          className={cn(
            wide ? "container-wide" : "container-x",
            "relative flex h-[72px] items-center gap-8",
          )}
        >
          <Link
            href={homeHref}
            aria-label={`${brand.name} — home`}
            onClick={close}
          >
            <Wordmark brand={brand} tone={clear ? "light" : "dark"} />
          </Link>

          <nav
            aria-label="Main"
            className={cn(
              // The wide (agency) header has a full-name wordmark, so its nav
              // waits for xl; below that it lives in the menu.
              "ml-6 hidden items-center gap-7",
              wide ? "xl:absolute xl:left-1/2 xl:ml-0 xl:flex xl:-translate-x-1/2" : "lg:flex",
            )}
          >
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
              <Link
                href={primary.href}
                onClick={(e) => scrollIfHere(e, primary.href)}
                {...newTab(primary.href)}
                className={pillClass(clear ? "light" : "dark", "md")}
              >
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
                "-mr-2 flex size-11 items-center justify-center rounded-full transition-colors",
                wide ? "xl:hidden" : "lg:hidden",
                clear
                  ? "text-white hover:bg-white/15"
                  : "text-fg hover:bg-accent-soft",
              )}
            >
              <svg viewBox="0 0 24 24" aria-hidden className="size-6">
                <path
                  d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        hidden={!open}
        className={cn(
          "fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-white",
          wide ? "xl:hidden" : "lg:hidden",
        )}
      >
        <nav
          aria-label="Mobile"
          className={cn(wide ? "container-wide" : "container-x", "pt-4")}
        >
          <ul>
            {nav.map((n) => (
              <li key={n.href} className="border-b border-line">
                <Link
                  href={n.href}
                  onClick={close}
                  className="home-title flex items-center justify-between py-5 text-[28px] text-fg"
                >
                  {n.label}
                  <Icon name="arrowRight" className="size-5 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div
          className={cn(
            wide ? "container-wide" : "container-x",
            "grid gap-3 py-8",
          )}
        >
          <Link
            href={primary.href}
            onClick={(e) => {
              close();
              scrollIfHere(e, primary.href);
            }}
            {...newTab(primary.href)}
            className={cn(pillClass("dark", "lg"), "w-full")}
          >
            {primary.label}
          </Link>
          <Link
            href={secondary.href}
            onClick={close}
            className={cn(pillClass("soft", "lg"), "w-full")}
          >
            {secondary.label}
          </Link>
          {phone && (
            <a href={phone.href} className="mt-4 rounded-[20px] bg-card p-5">
              <span className="block text-[14px] text-muted">
                Speak to someone
              </span>
              <span className="home-title mt-1 block text-[26px] tabular-nums text-fg">
                {phone.display}
              </span>
              {phone.note && (
                <span className="mt-1 block text-[13px] text-muted">
                  {phone.note}
                </span>
              )}
            </a>
          )}
        </div>
      </div>
    </>
  );
}
