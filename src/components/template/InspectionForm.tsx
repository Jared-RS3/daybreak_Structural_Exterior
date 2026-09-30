"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { Business, Problem } from "@/lib/template/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "phone" | "address", string>>;

/**
 * Four questions, three of them required: what's wrong, who you are, how to
 * reach you, where the house is. Everything else the inspector needs is
 * asked on the phone, where it takes ten seconds instead of a form field.
 *
 * Labels above fields, real input types and autocomplete tokens, errors that
 * name the field and move focus to the first one.
 *
 * DEMONSTRATION: `submit` resolves locally and nothing leaves the browser.
 * For a live client, replace it with a POST to the CRM intake (or a server
 * action that forwards to one) — the component needs no other change.
 */
const submit: (data: FormData) => Promise<void> = () => new Promise((r) => setTimeout(r, 700));

export function InspectionForm({
  problems,
  initialProblem,
  business,
  toolHref,
  demo,
}: {
  problems: Pick<Problem, "id" | "label">[];
  initialProblem?: string;
  business: Business;
  toolHref: string;
  demo: boolean;
}) {
  const [problem, setProblem] = useState(initialProblem ?? "");
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [firstName, setFirstName] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  if (state === "sent") {
    return (
      <div role="status" className="rounded-[28px] bg-card p-7 sm:p-10">
        <p className="pill-label bg-white font-medium text-fg">Request received</p>
        <h2 className="home-heading mt-5 text-[clamp(2rem,3.6vw,3rem)] text-fg">
          Thanks{firstName ? `, ${firstName}` : ""}. Here&rsquo;s what happens next.
        </h2>
        <ol className="mt-8 space-y-2">
          {[
            "A project manager calls you within one business day to pick a time.",
            "A specialist looks at the job properly — about 45 minutes.",
            "You get a written report and a fixed price. No pressure either way.",
          ].map((t, i) => (
            <li key={t} className="flex items-center gap-4 rounded-[18px] bg-white p-4 text-[16px] text-fg">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-card text-[14px] font-semibold">{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>
        <p className="mt-8 text-[15px] text-muted">
          Water coming in or a door that suddenly won&rsquo;t close? Call{" "}
          <a href={business.phoneHref} className="font-medium text-fg underline underline-offset-4 tabular-nums">
            {business.phoneDisplay}
          </a>{" "}
          and we&rsquo;ll come out sooner.
        </p>
        {demo && (
          <p className="mt-6 text-[13px] text-muted">Demonstration form — nothing was sent or stored.</p>
        )}
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").replace(/\D/g, "");
    const address = String(data.get("address") ?? "").trim();
    if (!name) next.name = "Enter your name so we know who to ask for.";
    if (phone.length < 10) next.phone = "Enter a 10-digit phone number.";
    if (address.length < 6) next.address = "Enter the property's street address.";
    setErrors(next);

    const first = (["name", "phone", "address"] as const).find((k) => next[k]);
    if (first) {
      formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setState("sending");
    setFirstName(name.split(" ")[0]);
    await submit(data);
    setState("sent");
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-9">
      <fieldset>
        <legend className="home-title text-[20px] text-fg">What do you need?</legend>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {[...problems, { id: "other", label: "Something else" }].map((p) => (
            <label
              key={p.id}
              className={cn(
                "flex min-h-13 cursor-pointer items-center gap-3 rounded-full px-5 text-[15px] transition-colors",
                problem === p.id ? "bg-accent text-white" : "bg-card text-fg hover:bg-[#e6e6e6]",
              )}
            >
              <input
                type="radio"
                name="problem"
                value={p.id}
                checked={problem === p.id}
                onChange={() => setProblem(p.id)}
                className="size-4 accent-white"
              />
              {p.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${uid}-name`} name="name" label="Your name" autoComplete="name" error={errors.name} />
        <Field
          id={`${uid}-phone`}
          name="phone"
          label="Mobile number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          hint="Only used to schedule the visit."
          error={errors.phone}
        />
        <div className="sm:col-span-2">
          <Field
            id={`${uid}-address`}
            name="address"
            label="Property address"
            autoComplete="street-address"
            error={errors.address}
          />
        </div>
      </div>

      <fieldset>
        <legend className="text-[15px] font-medium text-fg">
          Best time for the inspection <span className="text-muted">(optional)</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Morning", "Afternoon", "Either"].map((t) => (
            <label key={t} className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full bg-card px-4 text-[15px] text-fg has-[:checked]:bg-accent has-[:checked]:text-white">
              <input type="radio" name="time" value={t} className="size-4 accent-white" />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-accent px-8 text-[16px] font-medium text-white transition-colors hover:bg-accent-strong disabled:cursor-progress sm:w-auto"
        >
          {state === "sending" ? (
            <>
              <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              Sending
            </>
          ) : (
            "Request my free inspection"
          )}
        </button>
        <p className="mt-4 text-[14px] text-muted">
          Not sure it&rsquo;s serious?{" "}
          <Link href={toolHref} className="font-medium text-fg underline decoration-fg/25 underline-offset-4 hover:decoration-fg">
            Check your crack online first
          </Link>
          .
        </p>
        {demo && <p className="mt-2 text-[13px] text-muted">Demonstration form — nothing is sent or stored.</p>}
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  ...input
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-medium text-fg">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-[13px] text-muted">
          {hint}
        </p>
      )}
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "mt-2 h-13 w-full rounded-full border bg-card px-5 text-[16px] text-fg outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-fg/15",
          error ? "border-[#c0392b]" : "border-transparent",
        )}
        {...input}
      />
      {error && (
        <p id={`${id}-err`} className="mt-2 flex items-center gap-1.5 text-[13.5px] text-[#9b1c1c]">
          <Icon name="alert" className="size-4" />
          {error}
        </p>
      )}
    </div>
  );
}
