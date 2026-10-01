"use client";

import { Icon } from "@/components/ui/Icon";
import { bookingHref, offer } from "@/lib/daybreak";
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
 * then posted to /api/growth-audit, which saves it to Airtable. The town field
 * suggests US places as they type (PlaceInput). On success it hands them
 * straight to the booking calendar, with their name and email filled in.
 */
export function DesignForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle",
  );
  const [sent, setSent] = useState<LeadRequest | null>(null);
  const uid = useId();
  // When the form appeared: the route treats a near-instant submit as a bot.
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  if (state === "sent" && sent) {
    const book = new URL(bookingHref);
    book.searchParams.set("name", sent.name);
    book.searchParams.set("email", sent.email);
    book.searchParams.set(
      "notes",
      `${sent.company} · ${sent.trade} · ${sent.area}`,
    );
    return (
      <div role="status" className="bg-white py-4 text-left">
        <span className="flex size-10 items-center justify-center rounded-full bg-[#e3f1e8] text-[#1d6b3f]">
          <Icon name="check" className="size-5" />
        </span>
        <p className="home-title mt-5 text-[24px] text-fg">
          Thanks, {sent.name.split(" ")[0]}. Last step: pick a time for your
          call.
        </p>
        <p className="mt-2 max-w-lg text-[17px] leading-[1.6] text-muted">
          On the call we&rsquo;ll walk you through a concept of {sent.company}
          &rsquo;s new homepage and answer your questions. There&rsquo;s nothing
          to pay.
        </p>
        <a
          href={book.toString()}
          target="_blank"
          rel="noopener"
          className="mono-label mt-7 inline-flex h-12 items-center justify-center gap-2.5 bg-fg px-6 text-white transition-colors hover:bg-[#333]"
        >
          <Icon name="calendar" className="size-4" />
          Pick a time
        </a>
        <p className="mt-4 text-[15px] text-muted">
          Can&rsquo;t pick one now? We&rsquo;ll call you {offer.reply}.
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

    setState("sending");
    try {
      const res = await fetch("/api/growth-audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...body,
          fax: String(data.get("fax") ?? ""),
          elapsed: Date.now() - shownAt.current,
        }),
      });
      const json = (await res.json()) as { ok: boolean; errors?: Errors };
      if (json.ok) {
        setSent(body);
        return setState("sent");
      }
      if (json.errors) setErrors(json.errors);
      setState(json.errors ? "idle" : "failed");
    } catch {
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
              <input type="radio" name={name} value={o} className="sr-only" />
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
      {choice("trade", "What do you mainly sell?", trades)}
      {choice("jobs", "Jobs you sign in a typical month", jobVolumes)}
      {choice("jobValue", "Your average job size", jobValues)}
      {choice("timeline", "When do you want a new site?", timelines)}
      {/* Hidden from people; bots fill it in, and the route drops those. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Fax
          <input type="text" name="fax" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
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
            offer.cta
          )}
        </button>
        {/* <p className="text-[14.5px] text-muted">Takes a minute. Free, no obligation.</p> */}
      </div>
      {state === "failed" && (
        <p role="alert" className="text-[15px] text-[#9b1c1c] sm:col-span-2">
          That didn&rsquo;t go through. Try again, or email us directly.
        </p>
      )}
    </form>
  );
}
