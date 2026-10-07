"use client";

import { Icon } from "@/components/ui/Icon";
import { Turnstile, type TurnstileHandle } from "@/components/ui/Turnstile";
import { offer } from "@/lib/daybreak";
import {
  jobValues,
  jobVolumes,
  leadFields,
  readLead,
  timelines,
  trades,
  validateLead,
  type LeadField,
  type LeadRequest,
} from "@/lib/lead";
import { turnstileOn } from "@/lib/turnstile";
import { cn } from "@/lib/utils";
import { useEffect, useId, useRef, useState } from "react";
import { PlaceInput } from "./PlaceInput";

type Errors = Partial<Record<LeadField, string>>;

const fieldClass =
  "mt-2 h-11 w-full border-b bg-transparent text-[17px] text-fg outline-none transition-colors placeholder:text-[#a8a8ad] focus:border-fg";

/**
 * The agency's one ask: a few details about the business, then a call where
 * we show the free homepage concept. The text fields are what we need to
 * design it and reach them; the four one-tap questions qualify the lead
 * (trade, volume, job size, timing) so the call starts with the numbers.
 * Validated here with the same rules the route handler uses (lib/lead.ts),
 * then posted to /api/growth-audit with a token it signed when the form
 * appeared, and saved to Airtable. The town field suggests places worldwide
 * as they type (PlaceInput). On success it hands them straight to the
 * booking calendar, with their name and email filled in.
 */
export function DesignForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle",
  );
  const [sent, setSent] = useState<LeadRequest | null>(null);
  const [failure, setFailure] = useState("");
  // Picking "Other" opens a box for them to list their services.
  const [trade, setTrade] = useState("");
  const uid = useId();
  const human = useRef<TurnstileHandle>(null);
  // A token the route signs when the form appears; it treats a submit that
  // comes back near-instantly as a bot (lib/server/form-token.ts).
  const token = useRef("");
  const fetchToken = () =>
    fetch("/api/growth-audit", { cache: "no-store" })
      .then((r) => r.json() as Promise<{ token?: string }>)
      .then((j) => {
        token.current = j.token ?? "";
      })
      .catch(() => {});
  useEffect(() => {
    fetchToken();
  }, []);

  if (state === "sent" && sent) {
    return (
      <div role="status" className="bg-white py-4 text-left">
        <span className="flex size-10 items-center justify-center rounded-full bg-[#e3f1e8] text-[#1d6b3f]">
          <Icon name="check" className="size-5" />
        </span>
        <p className="home-title mt-5 text-[24px] text-fg">
          Thanks, {sent.name.split(" ")[0]}. We&rsquo;ve got your request.
        </p>
        <p className="mt-2 max-w-lg text-[17px] leading-[1.6] text-muted">
          We&rsquo;ll be in touch {offer.reply} to set up a call, where we walk you through a concept of {sent.company}
          &rsquo;s new homepage and answer your questions. There&rsquo;s nothing to pay.
        </p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = readLead((k) => data.get(k));
    const next = validateLead(body);
    setErrors(next);
    const first = leadFields.find((k) => next[k]);
    if (first) {
      form.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // Offline when the form appeared: get a token now, and the next try
    // (a few seconds on) goes through.
    if (!token.current) {
      fetchToken();
      setFailure("");
      return setState("failed");
    }

    setState("sending");
    const check = turnstileOn ? ((await human.current?.get()) ?? "") : "";
    if (turnstileOn && !check) {
      setFailure("We couldn’t confirm you’re a person. Complete the check above the button and try again.");
      return setState("failed");
    }
    try {
      const res = await fetch("/api/growth-audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...body,
          fax: String(data.get("fax") ?? ""),
          token: token.current,
          turnstile: check,
        }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        errors?: Errors;
        error?: string;
      };
      if (json.ok) {
        setSent(body);
        return setState("sent");
      }
      // A Turnstile token works once; the next try needs a fresh one.
      human.current?.reset();
      if (json.errors) setErrors(json.errors);
      setFailure(json.error ?? "");
      setState(json.errors ? "idle" : "failed");
    } catch {
      human.current?.reset();
      setFailure("");
      setState("failed");
    }
  };

  const error = (name: LeadField, id: string) =>
    errors[name] && (
      <p id={`${id}-err`} className="mt-1.5 text-[14px] text-[#9b1c1c]">
        {errors[name]}
      </p>
    );

  const input = (
    name: LeadField,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
  ) => {
    const err = errors[name];
    const id = `${uid}-${name}`;
    return (
      <div className="text-left">
        <label htmlFor={id} className="mono-label block text-[12.5px] text-fg">
          {label}
        </label>
        <input
          id={id}
          name={name}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `${id}-err` : undefined}
          className={cn(fieldClass, err ? "border-[#c0392b]" : "border-rule")}
          {...props}
        />
        {error(name, id)}
      </div>
    );
  };

  /** A one-tap question: radios drawn as square chips. */
  const choice = (
    name: LeadField,
    legend: string,
    options: readonly string[],
    onPick?: (value: string) => void,
  ) => {
    const err = errors[name];
    const id = `${uid}-${name}`;
    return (
      <fieldset
        className="text-left sm:col-span-2"
        aria-invalid={err ? true : undefined}
        aria-describedby={err ? `${id}-err` : undefined}
      >
        <legend className="mono-label text-[12.5px] text-fg">{legend}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((o) => (
            <label
              key={o}
              className={cn(
                "cursor-pointer border px-3.5 py-2.5 text-[15.5px] text-fg transition-colors hover:border-fg",
                "has-checked:border-fg has-checked:bg-fg has-checked:text-white",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-fg",
                err ? "border-[#c0392b]" : "border-rule",
              )}
            >
              <input
                type="radio"
                name={name}
                value={o}
                onChange={onPick && (() => onPick(o))}
                className="sr-only"
              />
              {o}
            </label>
          ))}
        </div>
        {error(name, id)}
      </fieldset>
    );
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid gap-x-6 gap-y-7 sm:grid-cols-2"
    >
      {input("company", "Company name", {
        type: "text",
        autoComplete: "organization",
        placeholder: "Smith Foundation Repair",
      })}
      {input("name", "Your name", {
        type: "text",
        autoComplete: "name",
        placeholder: "Jane Smith",
      })}
      {input("email", "Email", {
        type: "email",
        autoComplete: "email",
        placeholder: "jane@company.com",
      })}
      {input("phone", "Mobile", {
        type: "tel",
        autoComplete: "tel",
        placeholder: "(555) 555-0100",
      })}
      <div className="text-left">
        <label
          htmlFor={`${uid}-area`}
          className="mono-label block text-[12.5px] text-fg"
        >
          Main town or city you serve
        </label>
        <PlaceInput
          id={`${uid}-area`}
          name="area"
          placeholder="Start typing, e.g. Fort Worth"
          invalid={Boolean(errors.area)}
          describedBy={errors.area ? `${uid}-area-err` : undefined}
          className={cn(
            fieldClass,
            errors.area ? "border-[#c0392b]" : "border-rule",
          )}
        />
        {error("area", `${uid}-area`)}
      </div>
      {input("domain", "Website (if you have one)", {
        type: "text",
        inputMode: "url",
        autoComplete: "url",
        placeholder: "yourcompany.com",
      })}
      {choice("trade", "What do you mainly sell?", trades, setTrade)}
      {trade === "Other" && (
        <div className="sm:col-span-2">
          {input("services", "What services do you offer?", {
            type: "text",
            autoComplete: "off",
            autoFocus: true,
            maxLength: 200,
            placeholder: "e.g. Gutters, decks, concrete driveways",
          })}
        </div>
      )}
      {choice("jobs", "Jobs you sign in a typical month (optional)", jobVolumes)}
      {choice("jobValue", "Your average job size (optional)", jobValues)}
      {choice("timeline", "When do you want a new site? (optional)", timelines)}
      {/* The notice POPIA (s18) and California law want in front of someone
          before their details are collected, and the agreement the route
          saves as "POPIA Agreement". Never pre-ticked: agreement has to be
          given, not assumed. The policy opens in a new tab so the form
          keeps what they've typed. */}
      <div className="text-left sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-[15.5px] leading-[1.55] text-fg">
          <input
            id={`${uid}-consent`}
            type="checkbox"
            name="consent"
            value="yes"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={`${uid}-consent-note${errors.consent ? ` ${uid}-consent-err` : ""}`}
            className={cn(
              "mt-1 size-4.5 shrink-0 cursor-pointer accent-fg",
              errors.consent && "outline-2 outline-offset-2 outline-[#c0392b]",
            )}
          />
          <span>
            I agree that Daybreak can use these details to prepare my concept
            and contact me about it by email, phone or text, as set out in the{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener"
              className="underline decoration-fg/30 underline-offset-4 hover:decoration-fg"
            >
              Privacy Policy
            </a>
            .
          </span>
        </label>
        <p
          id={`${uid}-consent-note`}
          className="mt-2 pl-7.5 text-[14px] leading-[1.55] text-muted"
        >
          No marketing lists. Message and data rates may apply; reply STOP to
          stop texts. We use an AI note-taker on calls and will ask before it
          starts.
        </p>
        {error("consent", `${uid}-consent`)}
      </div>
      {/* Hidden from people; bots fill it in, and the route drops those. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Fax
          <input type="text" name="fax" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Turnstile action="growth-audit" ref={human} className="empty:hidden sm:col-span-2" />
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:gap-5">
        <button
          type="submit"
          disabled={state === "sending"}
          className="mono-label inline-flex h-12 items-center justify-center gap-2.5 bg-fg px-6 text-white transition-colors hover:bg-[#333] disabled:cursor-progress"
        >
          {state === "sending" ? (
            <>
              <span
                aria-hidden
                className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
              />
              Sending
            </>
          ) : (
            offer.submit
          )}
        </button>
        {/* <p className="text-[14.5px] text-muted">Takes a minute. Free, no obligation.</p> */}
      </div>
      {state === "failed" && (
        <p role="alert" className="text-[15px] text-[#9b1c1c] sm:col-span-2">
          {failure ||
            "That didn’t go through. Try again, or email us directly."}
        </p>
      )}
    </form>
  );
}
