"use client";

import { Icon } from "@/components/ui/Icon";
import { Turnstile, type TurnstileHandle } from "@/components/ui/Turnstile";
import {
  readToolContact,
  toolContactFields,
  validateToolContact,
  type ToolContactField,
  type ToolLeadResult,
} from "@/lib/tool-lead";
import { track } from "@/lib/analytics";
import { turnstileOn } from "@/lib/turnstile";
import { cn } from "@/lib/utils";
import { PhotoUpload } from "./PhotoUpload";
import { useEffect, useId, useRef, useState } from "react";

/**
 * The details step of both live tools: name, email, phone and ZIP, then the
 * PDF. Posts to /api/tool-lead with the tool's answers (never its prices: the
 * server works those out again), and reports exactly what happened. Nothing
 * here says "sent" unless the server saved the lead.
 */
export function ToolLeadForm({
  tool,
  payload,
  submitLabel,
  onDone,
  photos = false,
}: {
  tool: "estimate" | "crack";
  /** The answers, read at the moment they press send. */
  payload: () => Record<string, unknown>;
  submitLabel: string;
  onDone: (result: ToolLeadResult & { email: string }) => void;
  /** Show the photo step (a demo on this site: see PhotoUpload). */
  photos?: boolean;
}) {
  const uid = useId();
  const [errors, setErrors] = useState<Partial<Record<ToolContactField, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "failed">("idle");
  const [failure, setFailure] = useState("");
  // Signed by the server when the form appears (lib/server/form-token.ts).
  const token = useRef("");
  const human = useRef<TurnstileHandle>(null);
  const fetchToken = () =>
    fetch("/api/tool-lead", { cache: "no-store" })
      .then((r) => r.json() as Promise<{ token?: string }>)
      .then((j) => {
        token.current = j.token ?? "";
      })
      .catch(() => {});
  useEffect(() => {
    fetchToken();
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const contact = readToolContact((k) => data.get(k));
    const next = validateToolContact(contact);
    setErrors(next);
    const first = toolContactFields.find((k) => next[k]);
    if (first) {
      form.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (!token.current) {
      fetchToken();
      setFailure("That didn't go through. Give it a second and try again.");
      return setState("failed");
    }

    setState("sending");
    const check = turnstileOn ? ((await human.current?.get()) ?? "") : "";
    if (turnstileOn && !check) {
      setFailure("We couldn't confirm you're a person. Complete the check above the button and try again.");
      return setState("failed");
    }
    try {
      const res = await fetch("/api/tool-lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...contact, ...payload(), tool, token: token.current, turnstile: check, fax: data.get("fax") ?? "" }),
      });
      const json = (await res.json().catch(() => ({}))) as Partial<ToolLeadResult> & {
        error?: string;
        errors?: Partial<Record<ToolContactField, string>>;
      };
      if (res.ok && json.ok) {
        // GA4's own lead event, so it can be marked as a key event. Never
        // the contact details: only which tool the lead came from.
        track("generate_lead", { tool });
        onDone({ ...(json as ToolLeadResult), email: contact.email });
        return;
      }
      // A Turnstile token works once; the next try needs a fresh one.
      human.current?.reset();
      if (json.errors) setErrors(json.errors);
      setFailure(json.error ?? (json.errors ? "" : "That didn't go through. Please try again."));
      setState("failed");
    } catch {
      human.current?.reset();
      setFailure("That didn't go through. Check your connection and try again.");
      setState("failed");
    }
  };

  const field = (name: Exclude<ToolContactField, "consent">, text: string, ph: string, auto: string) => (
    <label className="block">
      <span className="mono-label text-[11.5px]">{text} *</span>
      <input
        name={name}
        placeholder={ph}
        autoComplete={auto}
        type={name === "email" ? "email" : name === "phone" ? "tel" : "text"}
        inputMode={name === "zip" ? "numeric" : undefined}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${uid}-${name}-err` : undefined}
        className="mt-1.5 h-11 w-full border border-rule bg-white px-3 text-[15px] outline-none focus:border-fg"
      />
      {errors[name] && (
        <span id={`${uid}-${name}-err`} className="mt-1 block text-[13px] text-[#a8321f]">
          {errors[name]}
        </span>
      )}
    </label>
  );

  return (
    <form noValidate onSubmit={submit} className="text-fg">
      <div className="grid gap-3.5">
        {field("name", "Full name", "Jane Smith", "name")}
        {field("email", "Email", "jane@email.com", "email")}
        <div className="grid gap-3.5 sm:grid-cols-2">
          {field("phone", "Phone", "(555) 555-0100", "tel")}
          {field("zip", "Property ZIP / postal code", "76248", "postal-code")}
        </div>
      </div>

      {photos && <PhotoUpload variant="full" />}

      <label className="mt-4 flex cursor-pointer items-start gap-3 text-[13.5px] leading-[1.5] text-fg">
        <input
          type="checkbox"
          name="consent"
          value="yes"
          aria-invalid={errors.consent ? true : undefined}
          className={cn("mt-0.5 size-4 shrink-0 cursor-pointer accent-fg", errors.consent && "outline-2 outline-offset-2 outline-[#c0392b]")}
        />
        <span>
          Email me the PDF and contact me about an inspection by email, phone or text, as set out in the{" "}
          <a href="/privacy" target="_blank" rel="noopener" className="underline decoration-fg/30 underline-offset-4 hover:decoration-fg">
            Privacy Policy
          </a>
          .
        </span>
      </label>
      {errors.consent && <p className="mt-1 pl-7 text-[13px] text-[#a8321f]">{errors.consent}</p>}

      {/* Hidden from people; bots fill it in, and the route drops those. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Fax
          <input type="text" name="fax" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Turnstile action="tool-lead" ref={human} className="mt-4 empty:hidden" />

      <button
        type="submit"
        disabled={state === "sending"}
        className="mono-label mt-5 inline-flex h-12 w-full items-center justify-center gap-2.5 bg-fg text-[12.5px] text-white transition-colors hover:bg-[#333] disabled:cursor-progress"
      >
        {state === "sending" ? (
          <>
            <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
            Preparing your PDF
          </>
        ) : (
          submitLabel
        )}
      </button>
      {state === "failed" && failure && (
        <p role="alert" className="mt-3 text-[13.5px] text-[#a8321f]">
          {failure}
        </p>
      )}
    </form>
  );
}

/** What happened after sending: emailed or not, and the PDF to download either way. */
export function ToolLeadSent({ result, className }: { result: ToolLeadResult & { email: string }; className?: string }) {
  const download = () => {
    const bytes = Uint8Array.from(atob(result.pdf), (c) => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `${result.reference}.pdf` });
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  };
  return (
    <div role="status" className={cn("flex flex-col gap-3 bg-card p-4 text-fg sm:flex-row sm:items-center sm:justify-between", className)}>
      <p className="flex items-start gap-2.5 text-[14px] leading-snug">
        <Icon name="check" className="mt-0.5 size-4 shrink-0 text-[#1d6b3f]" />
        <span>
          {result.emailed ? (
            <>
              Sent to <strong className="font-medium">{result.email}</strong>. Check your inbox for the PDF.
            </>
          ) : (
            "Saved. Your PDF is ready to download."
          )}
          {result.reference && <span className="block text-[12.5px] text-muted">Reference {result.reference}</span>}
        </span>
      </p>
      {result.pdf && (
        <button
          type="button"
          onClick={download}
          className="mono-label inline-flex h-10 shrink-0 items-center justify-center gap-2 border border-fg/25 bg-white px-3.5 text-[11.5px] transition-colors hover:border-fg"
        >
          <Icon name="document" className="size-4" />
          Download PDF
        </button>
      )}
    </div>
  );
}
