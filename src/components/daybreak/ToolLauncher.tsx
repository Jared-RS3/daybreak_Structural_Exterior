"use client";

import { Icon } from "@/components/ui/Icon";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/* ==========================================================================
   The live tools, as a launcher in the corner of every sales page.

   The crack checker and the repair estimate used to be a long black band in
   the page. Now a sunrise-yellow button with a "Try our tools" label (above it
   on phones, beside it on larger screens) sits bottom right on every page, a
   teaser bubble points at it a few seconds in, and it opens a small window
   with both tools as tabs, which can expand to fill the screen. Any link to
   "#tools" (the checker) or "#estimate" (the estimate) opens it too: the
   nav item, the card on the hero house, the strip in the work section.

   The tools' code loads the first time the window opens, not with the page.
   ========================================================================== */

const CrackChecker = dynamic(
  () => import("@/components/tools/CrackChecker").then((m) => m.CrackChecker),
  {
    ssr: false,
    loading: () => <Loading />,
  },
);
const RepairEstimator = dynamic(
  () =>
    import("@/components/tools/RepairEstimator").then((m) => m.RepairEstimator),
  {
    ssr: false,
    loading: () => <Loading />,
  },
);

type Tab = "checker" | "estimate";
export type PageTools = { checker: boolean; focus?: string };

/** Pages without the tools: the legal ones. */
const quiet = ["/privacy", "/terms", "/paia", "/accessibility"];
const TEASER_KEY = "daybreak-tools-teaser";
const TEASER_MS = 3500;
/** Large screens open the small window by themselves, once per visit, after
    long enough to read the headline. Phones get the teaser bubble instead:
    there the window would cover the whole page. */
const AUTO_OPEN_MS = 8000;
const AUTO_OPEN_QUERY = "(min-width: 1024px)";
/** Set once the visitor closes the window: from then on, this visit, it never opens by itself. */
const CLOSED_KEY = "daybreak-tools-closed";

export function ToolLauncher({ pages }: { pages: Record<string, PageTools> }) {
  const pathname = usePathname();
  const page = pages[pathname] ?? { checker: true };
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [picked, setPicked] = useState<Tab | null>(null);
  const [teaser, setTeaser] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  const hidden = quiet.some((p) => pathname.startsWith(p));
  // The house estimator comes first: it's the visual one, and the one to show off.
  const tabs: Tab[] = page.checker ? ["estimate", "checker"] : ["estimate"];
  const tab: Tab = picked && tabs.includes(picked) ? picked : tabs[0];

  /** True while the window was opened by the timer: then it doesn't take focus. */
  const auto = useRef(false);

  const show = (t?: Tab, from = "button") => {
    auto.current = from === "auto";
    if (t) setPicked(t);
    setMounted(true);
    setOpen(true);
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, "seen");
    } catch {}
    track("tools_open", { tool: t ?? tab, from });
  };
  const close = () => {
    try {
      sessionStorage.setItem(CLOSED_KEY, "1");
    } catch {}
    setOpen(false);
    setFull(false);
    button.current?.focus();
  };

  // Links to #tools / #estimate open the window instead of jumping, and a
  // shared link to one opens it on arrival.
  useEffect(() => {
    if (hidden) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      const hash = a ? new URL((a as HTMLAnchorElement).href).hash : "";
      if (hash !== "#tools" && hash !== "#estimate") return;
      e.preventDefault();
      show(hash === "#tools" ? "checker" : "estimate", "link");
    };
    document.addEventListener("click", onClick, true);
    const hash = window.location.hash;
    const frame =
      hash === "#tools" || hash === "#estimate"
        ? requestAnimationFrame(() =>
            show(hash === "#tools" ? "checker" : "estimate", "url"),
          )
        : 0;
    return () => {
      document.removeEventListener("click", onClick, true);
      cancelAnimationFrame(frame);
    };
    // `show` only sets state and reads stable values; re-binding per render isn't needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden]);

  // Large screens: the window opens by itself after AUTO_OPEN_MS, on every
  // page load until the visitor closes it once. Phones: the teaser after
  // TEASER_MS, once per visit.
  useEffect(() => {
    if (hidden) return;
    const big = window.matchMedia(AUTO_OPEN_QUERY).matches;
    try {
      if (sessionStorage.getItem(big ? CLOSED_KEY : TEASER_KEY)) return;
    } catch {}
    const t = window.setTimeout(
      () => (big ? show(undefined, "auto") : setTeaser(true)),
      big ? AUTO_OPEN_MS : TEASER_MS,
    );
    return () => window.clearTimeout(t);
    // `show` only sets state and reads stable values; re-binding per render isn't needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden]);

  // Esc closes; full screen locks the page behind it.
  useEffect(() => {
    if (!open) return;
    if (!auto.current) panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("dialog[open]"))
        close();
    };
    window.addEventListener("keydown", onKey);
    if (full) document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, full]);

  if (hidden) return null;

  const dismissTeaser = () => {
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, "dismissed");
    } catch {}
  };

  /** The estimate's last button goes to the form on this page, or the homepage's. */
  const toForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const form = document.getElementById("free-design");
    close();
    if (!form) return;
    e.preventDefault();
    form.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ---- Teaser bubble ---- */}
      {teaser && !open && (
        <div
          role="status"
          className="fixed bottom-24 right-4 z-[60] w-[min(19rem,calc(100vw-2rem))] animate-[panel-in_0.5s_var(--ease-out-expo)_both] border-t-[3px] border-sun bg-white p-4 text-fg shadow-[0_24px_60px_-20px_rgb(0_0_0/0.5)] sm:right-6"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="mono-label flex items-center gap-2 text-[11.5px]">
              <span aria-hidden className="size-2 rounded-full bg-[#2f9e5b]" />
              Live tools
            </p>
            <button
              type="button"
              onClick={dismissTeaser}
              aria-label="Dismiss"
              className="-mr-1.5 -mt-1.5 p-1.5"
            >
              <Icon name="close" className="size-4" />
            </button>
          </div>
          <p className="font-home mt-2 text-[1.2rem] leading-snug tracking-[-0.01em]">
            Tap on the house diagram to estimate a repair, or check how serious
            a crack might be — just like your customers would.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => show("estimate", "teaser")}
              className={cn(
                "mono-label h-10 bg-fg text-[11px] text-white transition-colors hover:bg-[#333]",
                !page.checker && "col-span-2",
              )}
            >
              House estimator
            </button>
            <button
              type="button"
              onClick={() => show("checker", "teaser")}
              disabled={!page.checker}
              className="mono-label h-10 border border-fg/25 text-[11px] transition-colors hover:border-fg disabled:hidden"
            >
              Crack checker
            </button>
          </div>
        </div>
      )}

      {/* ---- The button ---- */}
      {!full && (
        <div
          className={cn(
            "fixed bottom-5 right-4 z-[60] flex items-center gap-3 sm:right-6",
            open && "max-sm:hidden",
          )}
        >
          {!open && !teaser && (
            <button
              type="button"
              onClick={() => show(undefined, "label")}
              className="mono-label hidden bg-fg px-3.5 py-2.5 text-[11.5px] text-white shadow-[0_12px_30px_-12px_rgb(0_0_0/0.5)] sm:block"
            >
              Try our live tools
            </button>
          )}
          <button
            ref={button}
            type="button"
            onClick={() => (open ? close() : show(undefined, "button"))}
            aria-expanded={open}
            aria-controls="live-tools"
            aria-label={
              open
                ? "Close the live tools"
                : "Open the live tools: house estimator and crack checker"
            }
            className="relative flex size-16 items-center justify-center rounded-full bg-sun text-fg shadow-[0_14px_34px_-10px_rgb(0_0_0/0.55)] transition-transform hover:scale-105"
          >
            {!open && (
              <span
                aria-hidden
                className="absolute inset-0 animate-ping rounded-full bg-sun opacity-40 motion-reduce:hidden"
              />
            )}
            <Icon name={open ? "close" : "crack"} className="relative size-7" />
            {/* Phones: a small label just above the circle. */}
            {!open && (
              <span
                aria-hidden
                className="mono-label absolute bottom-[calc(100%+6px)] right-0 whitespace-nowrap bg-fg px-2 py-1 text-[10.5px] text-white shadow-[0_8px_20px_-10px_rgb(0_0_0/0.6)] sm:hidden"
              >
                Try our tools
              </span>
            )}
          </button>
        </div>
      )}

      {/* ---- The window ---- */}
      {mounted && (
        <div
          id="live-tools"
          ref={panel}
          role="dialog"
          aria-modal={full}
          aria-label="Live tools"
          tabIndex={-1}
          hidden={!open}
          className={cn(
            "fixed z-[61] flex flex-col bg-fg text-white shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)] outline-none",
            full
              ? "inset-0 sm:inset-4"
              : "inset-x-2 bottom-2 top-[4.5rem] sm:inset-x-auto sm:bottom-24 sm:right-6 sm:top-auto sm:h-[min(46rem,calc(100svh-8rem))] sm:w-[30rem]",
          )}
        >
          <div className="shrink-0 border-t-[3px] border-sun px-4 pb-3 pt-3.5 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <p className="mono-label flex items-center gap-2.5 text-[11.5px]">
                <span aria-hidden className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#3ecf7a] opacity-60 motion-reduce:hidden" />
                  <span className="relative size-2 rounded-full bg-[#3ecf7a]" />
                </span>
                Live tool · try it now
              </p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setFull(!full);
                    if (!full) track("tools_expand", { tool: tab });
                  }}
                  aria-label={
                    full ? "Back to the small window" : "Expand to full screen"
                  }
                  className="flex size-9 items-center justify-center text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="size-4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {full ? (
                      <path d="M9 4v5H4M15 20v-5h5M20 9h-5V4M4 15h5v5" />
                    ) : (
                      <path d="M4 9V4h5M20 15v5h-5M15 4h5v5M9 20H4v-5" />
                    )}
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close the live tools"
                  className="flex size-9 items-center justify-center text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon name="close" className="size-4.5" />
                </button>
              </div>
            </div>
            {tabs.length > 1 && (
              <div
                role="tablist"
                aria-label="Live tools"
                className="mt-3 flex gap-1 bg-white/10 p-1"
              >
                {tabs.map((t) => (
                  <button
                    key={t}
                    role="tab"
                    type="button"
                    aria-selected={tab === t}
                    aria-controls={`live-tools-${t}`}
                    onClick={() => setPicked(t)}
                    className={cn(
                      "mono-label flex-1 px-3 py-2.5 text-[11.5px] transition-colors",
                      tab === t
                        ? "bg-white text-fg"
                        : "text-white/75 hover:text-white",
                    )}
                  >
                    {t === "checker" ? "Crack checker" : "House estimator"}
                  </button>
                ))}
              </div>
            )}
            {full && (
              <p className="mt-3 max-w-2xl text-[14.5px] leading-snug text-white/70">
                {tab === "checker"
                  ? "Four questions, and the site tells the homeowner how worried to be, what a fix usually costs, and books the right visit. They get the report as a PDF by email, and you get the lead."
                  : "Homeowners point at the problem or tick their symptoms, pick a size, and see a ballpark once they've left their details. They get the estimate as a PDF by email, and you get the lead."}
              </p>
            )}
            {/* To the contractor trying it: the PDF is the part worth seeing. */}
            <p className="mt-3 flex items-start gap-2 text-[13px] leading-snug text-white/85">
              <Icon
                name="document"
                className="mt-px size-4 shrink-0 text-sun"
              />
              <span>
                Try it as a homeowner would: finish{" "}
                {tab === "checker" ? "the check" : "an estimate"} and
                we&rsquo;ll email you the PDF.
              </span>
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-2 sm:px-3 sm:pb-3">
            <div className={cn(full && "mx-auto max-w-6xl")}>
              {page.checker && (
                <div
                  id="live-tools-checker"
                  role="tabpanel"
                  hidden={tab !== "checker"}
                >
                  <CrackChecker shape="square" />
                </div>
              )}
              <div
                id="live-tools-estimate"
                role="tabpanel"
                hidden={tab !== "estimate"}
              >
                <RepairEstimator
                  focus={page.focus}
                  cta={{
                    href: "/#free-design",
                    label: "Get this on your site",
                    onClick: toForm,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Loading() {
  return (
    <div className="flex h-60 items-center justify-center text-[13px] text-white/60">
      Loading the tool…
    </div>
  );
}
