"use client";

import Link from "next/link";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { consentCookie, consentDays } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Cookie consent, and the Google Analytics tag behind it.

   Opt-in: Google's script is not requested, and no analytics cookie is set,
   until the visitor accepts. Accept and Decline carry equal weight, Settings
   gives a per-category switch, and "Cookie settings" in the footer reopens it
   so a choice can be changed or withdrawn at any time (POPIA s11(2)(b); the
   withdrawal also deletes the _ga cookies). A Global Privacy Control or Do Not
   Track signal counts as a decline and the banner doesn't ask.

   The choice itself is kept in one first-party cookie (lib/analytics.ts),
   which the privacy policy names. If this changes, so does the policy.
   ========================================================================== */

type Choice = "granted" | "denied";
type State = Choice | "unset" | "signal" | "server";

const OPEN = "daybreak:cookie-settings";
const CHANGE = "daybreak:consent-change";

/** Opens the settings view from anywhere, e.g. the footer link. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN));
}

function readChoice(): Choice | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${consentCookie}=(granted|denied)`));
  return (m?.[1] as Choice | undefined) ?? null;
}

/** The browser already said no: Global Privacy Control or Do Not Track. */
function privacySignal() {
  const n = navigator as Navigator & { globalPrivacyControl?: boolean };
  const w = window as Window & { doNotTrack?: string };
  return n.globalPrivacyControl === true || n.doNotTrack === "1" || w.doNotTrack === "1";
}

const subscribe = (cb: () => void) => {
  window.addEventListener(CHANGE, cb);
  return () => window.removeEventListener(CHANGE, cb);
};
const snapshot = (): State => (privacySignal() ? "signal" : (readChoice() ?? "unset"));
const serverSnapshot = (): State => "server";

function save(choice: Choice) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${consentCookie}=${choice}; Max-Age=${consentDays * 86400}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new Event(CHANGE));
}

type GaWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } & Record<string, unknown>;

let loaded = false;

/** Google's own snippet, run only after consent. Signals and ad personalisation off. */
function startAnalytics(id: string) {
  const w = window as unknown as GaWindow;
  w[`ga-disable-${id}`] = false;
  if (loaded) return;
  loaded = true;
  w.dataLayer = w.dataLayer || [];
  // gtag has to push the real `arguments` object; an array is ignored.
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", id, { allow_google_signals: false, allow_ad_personalization_signals: false });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

/** Withdrawn: stop sending and delete what Google Analytics set. */
function stopAnalytics(id: string) {
  (window as unknown as GaWindow)[`ga-disable-${id}`] = true;
  const parts = location.hostname.split(".");
  for (const c of document.cookie.split("; ")) {
    const name = c.split("=")[0];
    if (!/^_ga(_|$)/.test(name)) continue;
    document.cookie = `${name}=; Max-Age=0; Path=/`;
    for (let i = 0; i < parts.length - 1; i++) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${parts.slice(i).join(".")}`;
    }
  }
}

const button = "mono-label inline-flex h-11 items-center justify-center px-4 text-[12.5px] transition-colors";

export function CookieConsent({ gaId }: { gaId: string }) {
  const state = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"ask" | "settings">("ask");
  const [analytics, setAnalytics] = useState(false);
  const titleId = useId();
  const switchId = useId();

  useEffect(() => {
    if (state === "granted") startAnalytics(gaId);
    else if (state === "denied" || state === "signal") stopAnalytics(gaId);
  }, [state, gaId]);

  useEffect(() => {
    const reopen = () => {
      setAnalytics(readChoice() === "granted");
      setView("settings");
      setOpen(true);
    };
    window.addEventListener(OPEN, reopen);
    return () => window.removeEventListener(OPEN, reopen);
  }, []);

  if (state === "server" || (!open && state !== "unset")) return null;

  const decide = (choice: Choice) => {
    save(choice);
    setOpen(false);
    setView("ask");
  };
  const signal = state === "signal";

  return (
    <div
      role="dialog"
      aria-labelledby={titleId}
      className="fixed inset-x-3 bottom-3 z-[70] border border-rule bg-white p-5 text-fg shadow-[0_24px_60px_-24px_rgb(0_0_0/0.45)] sm:inset-x-auto sm:left-5 sm:bottom-5 sm:w-[26rem] sm:p-6"
    >
      <p className="mono-label flex items-center gap-2.5 text-[12px]">
        <span aria-hidden className="size-1.5 bg-sun" />
        {view === "ask" ? "Cookies" : "Cookie settings"}
      </p>

      {view === "ask" ? (
        <>
          <h2 id={titleId} className="font-home mt-3 text-[1.35rem] font-normal leading-tight tracking-[-0.02em]">
            Analytics, only with your OK.
          </h2>
          <p className="mt-2 text-[15px] leading-[1.55] text-muted">
            We&rsquo;d like to use Google Analytics to see which pages are useful. It sets cookies, so it only
            runs if you accept. You can change your mind any time from the footer.{" "}
            <Link href="/privacy#no-tracking" className="text-fg underline underline-offset-4">
              Privacy policy
            </Link>
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => decide("denied")} className={cn(button, "bg-fg text-white hover:bg-[#333]")}>
              Decline
            </button>
            <button type="button" onClick={() => decide("granted")} className={cn(button, "bg-fg text-white hover:bg-[#333]")}>
              Accept
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setAnalytics(false);
              setView("settings");
            }}
            className="mono-label mt-3 w-full py-2 text-center text-[12px] text-muted underline underline-offset-4 hover:text-fg"
          >
            Settings
          </button>
        </>
      ) : (
        <>
          <h2 id={titleId} className="sr-only">
            Cookie settings
          </h2>
          <ul className="mt-4 border-t border-rule">
            <li className="border-b border-rule py-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[16px]">Necessary</span>
                <span className="mono-label text-[11.5px] text-muted">Always on</span>
              </div>
              <p className="mt-1.5 text-[14px] leading-[1.5] text-muted">
                One cookie that remembers your choice here for 12 months. Nothing else.
              </p>
            </li>
            <li className="border-b border-rule py-4">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor={switchId} className="text-[16px]">
                  Analytics
                </label>
                <button
                  id={switchId}
                  type="button"
                  role="switch"
                  aria-checked={analytics}
                  disabled={signal}
                  onClick={() => setAnalytics((a) => !a)}
                  className={cn(
                    "relative h-6 w-11 shrink-0 transition-colors disabled:opacity-40",
                    analytics ? "bg-fg" : "bg-rule",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-1 size-4 bg-white transition-[left] duration-200",
                      analytics ? "left-6" : "left-1",
                    )}
                  />
                </button>
              </div>
              <p className="mt-1.5 text-[14px] leading-[1.5] text-muted">
                Google Analytics: pages visited, how you arrived, rough location and device. Google signals and
                ad personalisation are off.
              </p>
              {signal && (
                <p className="mt-2 text-[14px] leading-[1.5] text-fg">
                  Your browser is sending a privacy signal (Global Privacy Control or Do Not Track), so analytics
                  stays off.
                </p>
              )}
            </li>
          </ul>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => decide(analytics && !signal ? "granted" : "denied")}
              className={cn(button, "border border-fg/30 text-fg hover:border-fg")}
            >
              Save choices
            </button>
            <button
              type="button"
              onClick={() => decide(signal ? "denied" : "granted")}
              disabled={signal}
              className={cn(button, "bg-fg text-white hover:bg-[#333] disabled:opacity-40")}
            >
              Accept all
            </button>
          </div>
          <button
            type="button"
            onClick={() => decide("denied")}
            className="mono-label mt-3 w-full py-2 text-center text-[12px] text-muted underline underline-offset-4 hover:text-fg"
          >
            Decline all
          </button>
        </>
      )}
    </div>
  );
}

/** "Cookie settings" for the footer: reopens the banner on its settings view. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie settings
    </button>
  );
}
