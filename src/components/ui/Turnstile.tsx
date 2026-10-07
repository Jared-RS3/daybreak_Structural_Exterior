"use client";

import { turnstileOn, turnstileSiteKey } from "@/lib/turnstile";
import { useEffect, useImperativeHandle, useRef } from "react";

/**
 * Cloudflare Turnstile on a form. Most visitors never see it: it checks in
 * the background and only shows a box to tick when it isn't sure. Renders
 * nothing while the site key is unset (lib/turnstile.ts).
 *
 * The form asks for a token as it sends (`get`, which waits for a check
 * that's still running) and calls `reset` after any failed send, because a
 * token works only once.
 */
export type TurnstileHandle = {
  /** The token, waiting up to `ms` for it; "" if there isn't one by then. */
  get: (ms?: number) => Promise<string>;
  reset: () => void;
};

type Api = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: Api;
  }
}

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loading: Promise<Api> | null = null;

function load(): Promise<Api> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise<Api>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SRC;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject());
    s.onerror = () => {
      loading = null;
      s.remove();
      reject();
    };
    document.head.appendChild(s);
  });
  return loading;
}

export function Turnstile({
  action,
  ref,
  className,
}: {
  /** Which form this is; the server checks the token was issued for it. */
  action: string;
  ref: React.Ref<TurnstileHandle>;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const token = useRef("");
  const waiting = useRef<((t: string) => void)[]>([]);

  const settle = (t: string) => {
    token.current = t;
    if (!t) return;
    waiting.current.splice(0).forEach((w) => w(t));
  };

  useImperativeHandle(
    ref,
    () => ({
      get: (ms = 15_000) =>
        token.current
          ? Promise.resolve(token.current)
          : new Promise<string>((resolve) => {
              const done = (t: string) => {
                window.clearTimeout(timer);
                resolve(t);
              };
              const timer = window.setTimeout(() => {
                waiting.current = waiting.current.filter((w) => w !== done);
                resolve("");
              }, ms);
              waiting.current.push(done);
            }),
      reset: () => {
        token.current = "";
        if (widget.current) window.turnstile?.reset(widget.current);
      },
    }),
    [],
  );

  useEffect(() => {
    if (!turnstileOn) return;
    let gone = false;
    load()
      .then((api) => {
        if (gone || !box.current) return;
        widget.current = api.render(box.current, {
          sitekey: turnstileSiteKey,
          action,
          appearance: "interaction-only",
          callback: settle,
          "expired-callback": () => settle(""),
          "error-callback": () => settle(""),
        });
      })
      .catch(() => {});
    return () => {
      gone = true;
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
      token.current = "";
    };
  }, [action]);

  if (!turnstileOn) return null;
  return <div ref={box} className={className} />;
}
