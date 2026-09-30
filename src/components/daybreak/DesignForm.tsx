"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { offer } from "@/lib/daybreak";
import { isEmail, jobVolumes, normalizeDomain } from "@/lib/lead";
import { cn } from "@/lib/utils";

type Field = "company" | "domain" | "name" | "email";
type Errors = Partial<Record<Field, string>>;

const fieldClass =
  "mt-2 h-11 w-full border-b bg-transparent text-[17px] text-fg outline-none transition-colors placeholder:text-[#a8a8ad] focus:border-fg";

/**
 * The agency's one ask: tell us about your company, get your homepage
 * designed free. Company, name and email are required; the website is
 * optional because plenty of contractors don't have one yet, and the jobs
 * question helps us size the design. Validated here with the same rules the
 * route handler uses (lib/lead.ts), then posted to /api/growth-audit — which
 * forwards to DAYBREAK_LEAD_WEBHOOK, or logs the lead when none is set.
 */
export function DesignForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const uid = useId();

  if (state === "sent") {
    return (
      <div role="status" className="bg-white py-4 text-left">
        <span className="flex size-10 items-center justify-center rounded-full bg-[#e3f1e8] text-[#1d6b3f]">
          <Icon name="check" className="size-5" />
        </span>
        <p className="home-title mt-5 text-[24px] text-fg">Got it. We&rsquo;ll start on your homepage.</p>
        <p className="mt-2 text-[17px] leading-[1.6] text-muted">
          We&rsquo;ll email you {offer.reply} with anything we need, then send you your design. No call needed
          unless you want one.
        </p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = {
      company: String(data.get("company") ?? "").trim(),
      domain: String(data.get("domain") ?? "").trim(),
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      jobs: String(data.get("jobs") ?? ""),
    };
    const next: Errors = {};
    if (body.company.length < 2) next.company = "Enter your company name.";
    if (body.domain && !normalizeDomain(body.domain)) next.domain = "Enter your website, like yourfoundationcompany.com";
    if (body.name.length < 2) next.name = "Enter your name.";
    if (!isEmail(body.email)) next.email = "Enter an email we can send your design to.";
    setErrors(next);
    const first = (["company", "domain", "name", "email"] as const).find((k) => next[k]);
    if (first) {
      form.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setState("sending");
    try {
      const res = await fetch("/api/growth-audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { ok: boolean; errors?: Errors };
      if (json.ok) return setState("sent");
      if (json.errors) setErrors(json.errors);
      setState(json.errors ? "idle" : "failed");
    } catch {
      setState("failed");
    }
  };

  const input = (name: Field | "phone", label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const err = name !== "phone" ? errors[name] : undefined;
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
        {err && (
          <p id={`${id}-err`} className="mt-1.5 text-[14px] text-[#9b1c1c]">
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
      {input("company", "Company name", { type: "text", autoComplete: "organization", placeholder: "Smith Foundation Repair" })}
      {input("domain", "Website (if you have one)", {
        type: "text",
        inputMode: "url",
        autoComplete: "url",
        placeholder: "yourcompany.com",
      })}
      {input("name", "Full name", { type: "text", autoComplete: "name", placeholder: "Jane Smith" })}
      {input("email", "Email", { type: "email", autoComplete: "email", placeholder: "jane@company.com" })}
      {input("phone", "Phone (optional)", { type: "tel", autoComplete: "tel", placeholder: "(555) 555-0100" })}
      <div className="text-left">
        <label htmlFor={`${uid}-jobs`} className="mono-label block text-[12.5px] text-fg">
          Jobs a month (optional)
        </label>
        <div className="relative">
          <select
            id={`${uid}-jobs`}
            name="jobs"
            defaultValue=""
            className={cn(fieldClass, "appearance-none border-rule pr-8")}
          >
            <option value="">Choose one</option>
            {jobVolumes.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <Icon
            name="chevronDown"
            className="pointer-events-none absolute right-1 top-1/2 mt-1 size-4 -translate-y-1/2 text-muted"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={state === "sending"}
        className="mono-label inline-flex h-12 items-center justify-center gap-2.5 justify-self-start bg-fg px-6 text-white transition-colors hover:bg-[#333] disabled:cursor-progress sm:col-span-2"
      >
        {state === "sending" ? (
          <>
            <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
            Sending
          </>
        ) : (
          offer.cta
        )}
      </button>
      {state === "failed" && (
        <p role="alert" className="text-[15px] text-[#9b1c1c] sm:col-span-2">
          That didn&rsquo;t go through. Try again, or email us directly.
        </p>
      )}
    </form>
  );
}
