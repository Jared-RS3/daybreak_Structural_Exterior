"use client";

import NextImage from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { Turnstile, type TurnstileHandle } from "@/components/ui/Turnstile";
import { cn } from "@/lib/utils";
import { priceEstimate, type Area, type Hotspot } from "@/lib/estimator";
import type { ToolLeadResult } from "@/lib/tool-lead";
import { turnstileOn } from "@/lib/turnstile";
import {
  southeast,
  southeastAreas,
  southeastCategories,
  southeastItems,
  southeastScenes,
  type DemoItem,
} from "@/lib/demos/southeast";

/* ==========================================================================
   Southeast Crawlspace Consulting concept demo: the estimator

   Daybreak's house estimator (components/tools/RepairEstimator.tsx) in
   SECC's clothes: the same cut-away photographs and flow (point at the
   problem or tick a symptom, pick a size, leave details, see the ballpark),
   in their blue, square uppercase buttons and Heebo.

   The lead goes where the live tool's goes: /api/tool-lead, with
   brand "southeast". Same signed form token, honeypot, consent, Turnstile and
   rate limits as ToolLeadForm; the server re-prices the picks, saves the row
   to Airtable, emails the SECC PDF and hands it back for download. Only
   the server's answer says "sent". No analytics on this page. Colours and
   the heading face come from the page (components/demo/SoutheastShell.tsx) as
   --se-* custom properties.
   ========================================================================== */

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const still = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const head = "font-(family-name:--font-se-head) font-bold tracking-[-0.01em]";
const pill = "inline-flex items-center justify-center gap-2 rounded-[3px] font-medium uppercase tracking-[0.03em] transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--se-blue)";
const pillBlack = cn(pill, "bg-(--se-blue) text-white hover:bg-(--se-navy) disabled:bg-[#9aa7b3]");
const pillLine = cn(pill, "border-2 border-(--se-ink) bg-white text-(--se-ink) hover:bg-(--se-ink) hover:text-white disabled:border-[#c4c4c4] disabled:text-[#9a9a9a] disabled:hover:bg-white");

/** Where a hotspot's label sits beside its number, kept inside the picture. */
function chipPos(p: Hotspot) {
  const side = p.side ?? (p.y < 18 ? "below" : "above");
  const at = { left: `${p.x}%`, top: `${p.y}%` };
  if (side === "left") return { ...at, transform: "translate(calc(-100% - 20px), -50%)" };
  if (side === "right") return { ...at, transform: "translate(20px, -50%)" };
  const tx = p.x < 16 ? "-14px" : p.x > 84 ? "calc(-100% + 14px)" : "-50%";
  const ty = side === "below" ? "20px" : "calc(-100% - 20px)";
  return { ...at, transform: `translate(${tx}, ${ty})` };
}

const sizeText = (item: DemoItem, qty: number) =>
  item.unit ? `${qty.toLocaleString("en-US")} ${item.unit}` : "Complete install";

type Contact = { zip: string; first: string; last: string; phone: string; email: string; consent: boolean };
const blank: Contact = { zip: "", first: "", last: "", phone: "", email: "", consent: false };
type Field = keyof Contact;
const order: Field[] = ["zip", "first", "last", "phone", "email", "consent"];

function check(c: Contact): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (!/^\d{5}$/.test(c.zip.trim())) e.zip = "Enter a 5-digit ZIP code.";
  if (c.first.trim().length < 1) e.first = "Enter your first name.";
  if (c.last.trim().length < 1) e.last = "Enter your last name.";
  if (c.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a 10-digit phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim())) e.email = "Enter a valid email address.";
  if (!c.consent) e.consent = "Tick the box to agree before sending.";
  return e;
}

export function SoutheastEstimator() {
  const uid = useId();
  const [areaId, setAreaId] = useState<Area["id"] | null>(null);
  const [spot, setSpot] = useState<number | null>(null);
  /** Repair id → quantity. */
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [open, setOpen] = useState<string[]>([]);
  const [help, setHelp] = useState<Record<string, "measure" | "exact" | undefined>>({});
  const [flash, setFlash] = useState<string | null>(null);
  const [step, setStep] = useState<"details" | "result">("details");
  const [contact, setContact] = useState<Contact>(blank);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState("");
  /** The server's answer: the reference, whether the email went, and the PDF. */
  const [sent, setSent] = useState<(ToolLeadResult & { email: string }) | null>(null);
  /** Which picks the result was priced on; changing them means sending again. */
  const [sentFor, setSentFor] = useState("");
  const [booked, setBooked] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  // Signed by the server when the page loads (lib/server/form-token.ts); it
  // has to be a few seconds old by the time they send, as with ToolLeadForm.
  const token = useRef("");
  const human = useRef<TurnstileHandle>(null);
  const cardOver = useRef<HTMLDivElement>(null);
  const cardUnder = useRef<HTMLDivElement>(null);

  const area = southeastAreas.find((a) => a.id === areaId) ?? null;
  const photo = southeastScenes[area ? area.id : "house"];
  const active = area && spot !== null ? area.hotspots[spot] : null;

  const picks = Object.entries(picked).map(([id, qty]) => ({ id, qty, variant: 0 }));
  const { lines, low, high } = priceEstimate(picks);
  const pickKey = JSON.stringify(picks);

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

  const toggle = (id: string) =>
    setPicked((cur) => {
      const next = { ...cur };
      if (id in next) delete next[id];
      else next[id] = defaultQty(southeastItems[id]);
      return next;
    });
  const setQty = (id: string, qty: number) =>
    setPicked((cur) => ({ ...cur, [id]: Math.min(100_000, Math.max(1, Math.round(qty) || 1)) }));

  /** From a hotspot: add the repair, open its section and bring it into view. */
  const add = (h: Hotspot) => {
    const item = southeastItems[h.item];
    setPicked((cur) => (h.item in cur ? cur : { ...cur, [h.item]: defaultQty(item) }));
    setOpen((cur) => (cur.includes(item.category) ? cur : [...cur, item.category]));
    setSpot(null);
    setFlash(h.item);
    window.setTimeout(() => setFlash(null), 1800);
    requestAnimationFrame(() =>
      document.getElementById(`${uid}-${h.item}`)?.scrollIntoView({ block: "center", behavior: still() ? "auto" : "smooth" }),
    );
  };

  // A number opens its card; bring the card and its button into view. On a
  // phone it opens under the picture, and would otherwise sit below the fold.
  useEffect(() => {
    if (spot === null) return;
    const frame = requestAnimationFrame(() =>
      [cardOver.current, cardUnder.current]
        .find((el) => el && el.offsetParent !== null)
        ?.scrollIntoView({ block: "nearest", behavior: still() ? "auto" : "smooth" }),
    );
    return () => cancelAnimationFrame(frame);
  }, [areaId, spot]);

  const reset = () => {
    setPicked({});
    setAreaId(null);
    setSpot(null);
    setHelp({});
  };

  const reveal = () => {
    // Same picks as last time: straight to the result. Changed: send again.
    setStep(sent && sentFor === pickKey ? "result" : "details");
    setBooked(false);
    setFailure("");
    dialog.current?.showModal();
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const found = check(contact);
    setErrors(found);
    const first = order.find((k) => found[k]);
    if (first) {
      document.getElementById(`${uid}-f-${first}`)?.focus();
      return;
    }
    if (!token.current) {
      fetchToken();
      setFailure("That didn't go through. Give it a second and try again.");
      return;
    }
    setSending(true);
    setFailure("");
    const check2 = turnstileOn ? ((await human.current?.get()) ?? "") : "";
    if (turnstileOn && !check2) {
      setFailure("We couldn't confirm you're a person. Complete the check above the button and try again.");
      setSending(false);
      return;
    }
    const email = contact.email.trim();
    try {
      const res = await fetch("/api/tool-lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: `${contact.first.trim()} ${contact.last.trim()}`,
          email,
          phone: contact.phone.trim(),
          zip: contact.zip.trim(),
          consent: "yes",
          picks,
          tool: "estimate",
          brand: "southeast",
          token: token.current,
          turnstile: check2,
          fax: new FormData(form).get("fax") ?? "",
        }),
      });
      const json = (await res.json().catch(() => ({}))) as Partial<ToolLeadResult> & {
        error?: string;
        errors?: Partial<Record<"name" | "email" | "phone" | "zip" | "consent", string>>;
      };
      if (res.ok && json.ok) {
        setSent({ ...(json as ToolLeadResult), email });
        setSentFor(pickKey);
        setStep("result");
        return;
      }
      // A Turnstile token works once; the next try needs a fresh one.
      human.current?.reset();
      if (json.errors) {
        const { name, ...rest } = json.errors;
        setErrors({ ...rest, ...(name ? { first: name } : {}) });
      }
      setFailure(json.error ?? (json.errors ? "" : "That didn't go through. Please try again."));
    } catch {
      human.current?.reset();
      setFailure("That didn't go through. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  /** The PDF the server made and emailed, saved from its answer. */
  const download = () => {
    if (!sent?.pdf) return;
    const bytes = Uint8Array.from(atob(sent.pdf), (c) => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    Object.assign(document.createElement("a"), { href: url, download: `Southeast-Crawlspace-estimate-${sent.reference}.pdf` }).click();
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  };

  const field = (key: Exclude<Field, "consent">, label: string, props: React.InputHTMLAttributes<HTMLInputElement>, wide = false) => (
    <label className={cn("block", wide && "sm:col-span-2")}>
      <span className="text-[14px] font-bold text-(--se-ink)">{label}</span>
      <input
        id={`${uid}-f-${key}`}
        value={contact[key]}
        onChange={(e) => {
          setContact((c) => ({ ...c, [key]: e.target.value.slice(0, 80) }));
          if (errors[key]) setErrors((x) => ({ ...x, [key]: undefined }));
        }}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `${uid}-e-${key}` : undefined}
        className={cn(
          "mt-1.5 block h-12 w-full rounded-md border bg-white px-3.5 text-[16px] text-(--se-ink) outline-none transition-shadow focus:border-(--se-blue) focus:ring-3 focus:ring-(--se-blue)/25",
          errors[key] ? "border-[#c62828]" : "border-[#c9ced5]",
        )}
        {...props}
      />
      {errors[key] && (
        <span id={`${uid}-e-${key}`} className="mt-1 block text-[13px] text-[#c62828]">
          {errors[key]}
        </span>
      )}
    </label>
  );

  return (
    // A container: the estimator lays itself out by its own width.
    <div className="@container rounded-lg border border-(--se-line) bg-white text-(--se-ink) shadow-[0_6px_30px_-12px_rgb(0_0_0/0.18)]">
      {/* ---- 1. Point at it ---- */}
      <div className="px-4 pb-5 pt-6 @xl:px-8 @xl:pb-8 @xl:pt-9">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[12.5px] font-bold uppercase tracking-[0.08em] text-(--se-navy)">
            {area ? area.label : "Step 1 · Find the problem"}
          </p>
          <h2 className={cn(head, "mt-2 text-[1.45rem] leading-[1.12] @xl:text-[2.1rem]")}>
            {area ? area.title : "Click the part of your home that’s worrying you"}
          </h2>
          <p className="mt-2 text-[15px] leading-snug text-(--se-muted) @xl:text-[16.5px]">
            {area
              ? "Tap a number to see what it means and add it to your estimate."
              : "Look inside the crawl space, floor framing, foundation and basement."}
          </p>
          {area && (
            <button
              type="button"
              onClick={() => {
                setAreaId(null);
                setSpot(null);
              }}
              className={cn(pillLine, "mt-4 h-10 px-4 text-[14px]")}
            >
              <Icon name="arrowRight" className="size-4 rotate-180" />
              Back to the whole house
            </button>
          )}
        </div>

        <div className="relative mt-5 aspect-1000/560 overflow-hidden rounded-lg bg-[#dfe5ec] @xl:mt-7">
          <Img key={photo.src} src={photo.src} alt={photo.alt} sizes="(min-width: 1280px) 1180px, 100vw" />

          {!area &&
            southeastAreas.map((a, i) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAreaId(a.id)}
                aria-label={`Look inside: ${a.label}`}
                className="absolute rounded-md border-2 border-dashed border-white bg-(--se-blue)/15 shadow-[0_0_0_1px_rgb(0_0_0/0.25)] transition-colors hover:bg-(--se-blue)/35 focus-visible:bg-(--se-blue)/35 focus-visible:outline-none"
                style={{ left: `${a.zone.x}%`, top: `${a.zone.y}%`, width: `${a.zone.w}%`, height: `${a.zone.h}%` }}
              >
                <AreaTag area={a} n={i + 1} />
              </button>
            ))}

          {area &&
            area.hotspots.map((h, i) => {
              const on = h.item in picked;
              return (
                <div key={h.label}>
                  <span
                    className="pointer-events-none absolute z-10 whitespace-nowrap rounded-md bg-black/85 px-1 py-0.5 text-[7.5px] font-bold text-white @xl:px-2 @xl:py-1 @xl:text-[12px]"
                    style={chipPos(h)}
                  >
                    {h.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSpot(spot === i ? null : i)}
                    aria-expanded={spot === i}
                    aria-label={`${i + 1}. ${h.label}`}
                    className={cn(
                      "absolute z-20 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10.5px] font-bold text-white ring-2 ring-white shadow-[0_4px_14px_-2px_rgb(0_0_0/0.55)] transition-transform before:absolute before:-inset-2.5 before:content-[''] hover:scale-110 @xl:size-8 @xl:text-[14px]",
                      on ? "bg-black" : spot === i ? "bg-(--se-navy)" : "bg-(--se-blue-ink)",
                    )}
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  >
                    {on ? <Icon name="check" className="size-3 @xl:size-4" /> : i + 1}
                  </button>
                </div>
              );
            })}

          {active && (
            <div
              ref={cardOver}
              className="absolute z-30 hidden w-[18rem] -translate-x-1/2 @xl:block"
              style={{
                left: `clamp(9.25rem, ${active.x}%, calc(100% - 9.25rem))`,
                ...(active.y > 55 ? { bottom: `calc(${100 - active.y}% + 26px)` } : { top: `calc(${active.y}% + 26px)` }),
              }}
            >
              <SpotCard h={active} added={active.item in picked} onAdd={() => add(active)} onClose={() => setSpot(null)} />
            </div>
          )}
        </div>

        {/* Phones: the labels as a list, and the card under the picture. */}
        <ol className="mt-3 grid gap-2 @xl:hidden">
          {(area ? area.hotspots : southeastAreas).map((x, i) => {
            const isSpot = area ? spot === i : false;
            const added = area && (x as Hotspot).item in picked;
            return (
              <li key={x.label}>
                <button
                  type="button"
                  onClick={() => (area ? setSpot(spot === i ? null : i) : setAreaId((x as Area).id))}
                  className={cn(
                    "flex min-h-12 w-full items-center gap-3 rounded-lg border bg-white px-3 py-2.5 text-left text-[15px] font-bold",
                    isSpot ? "border-(--se-blue) ring-2 ring-(--se-blue)/30" : "border-(--se-line)",
                  )}
                >
                  <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full text-[13px] text-white", added ? "bg-black" : "bg-(--se-blue-ink)")}>
                    {added ? <Icon name="check" className="size-3.5" /> : i + 1}
                  </span>
                  {x.label}
                  <Icon name="chevronRight" className="ml-auto size-4 text-(--se-muted)" />
                </button>
              </li>
            );
          })}
        </ol>
        {active && (
          // Clear of the sticky estimate bar, which stacks to ~150px on a phone.
          <div ref={cardUnder} className="mt-2 scroll-mb-44 @xl:hidden">
            <SpotCard h={active} added={active.item in picked} onAdd={() => add(active)} onClose={() => setSpot(null)} />
          </div>
        )}
      </div>

      {/* ---- 2. Or tick it off ---- */}
      <div className="border-t border-(--se-line) bg-(--se-gray) px-4 py-7 @xl:px-8 @xl:py-9">
        <p className="text-[12.5px] font-bold uppercase tracking-[0.08em] text-(--se-navy)">Step 2 · Check what you’re noticing</p>
        <h2 className={cn(head, "mt-2 text-[1.35rem] leading-tight @xl:text-[1.75rem]")}>Or check off your symptoms</h2>
        <span aria-hidden className="mt-3 block h-1 w-20 bg-(--se-blue)" />
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-(--se-muted)">
          More than one problem? That’s common. Check everything that applies, in any section, and your estimate adds it all up.
        </p>
        <p className="mt-4 flex items-start gap-2.5 rounded-lg bg-white px-4 py-3 text-[14.5px] leading-snug shadow-[0_1px_6px_rgb(0_0_0/0.06)]">
          <Icon name="ruler" className="mt-px size-5 shrink-0 text-(--se-blue)" />
          <span>
            <strong>No tape measure needed.</strong> Pick the closest size, or tap “How do I measure this?”
          </span>
        </p>

        <div className="mt-5 grid items-start gap-3 @4xl:grid-cols-2">
          {southeastCategories.map((c) => {
            const isOpen = open.includes(c.id);
            const count = c.items.filter((i) => i.id in picked).length;
            return (
              <div key={c.id} className={cn("rounded-lg bg-white shadow-[0_1px_8px_rgb(0_0_0/0.09)]", count > 0 && "ring-2 ring-(--se-blue)")}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${uid}-${c.id}`}
                  onClick={() => setOpen(isOpen ? open.filter((x) => x !== c.id) : [...open, c.id])}
                  className="flex w-full items-center gap-3.5 px-4 py-4 text-left @xl:px-5"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e9f1fe] text-(--se-blue-ink)">
                    <Icon name={c.icon} className="size-5.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-medium uppercase tracking-[0.02em] text-(--se-blue-ink)">{c.name}</span>
                    <span className="block text-[13.5px] text-(--se-muted)">{c.sub}</span>
                  </span>
                  {count > 0 && (
                    <span className="rounded-full bg-(--se-blue-ink) px-2.5 py-1 text-[12px] font-bold text-white">{count} added</span>
                  )}
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-(--se-navy) text-white">
                    <Icon name="chevronDown" className={cn("size-4 transition-transform", isOpen && "rotate-180")} />
                  </span>
                </button>

                <div id={`${uid}-${c.id}`} hidden={!isOpen} className="border-t border-(--se-line) px-4 pb-2 pt-3 @xl:px-5">
                  <p className="text-[14px] text-(--se-muted)">{c.intro}</p>
                  <ul className="mt-1">
                    {c.items.map((item) => {
                      const on = item.id in picked;
                      const qty = picked[item.id];
                      const tip = help[item.id];
                      return (
                        <li
                          key={item.id}
                          id={`${uid}-${item.id}`}
                          className={cn(
                            "-mx-2 scroll-mt-24 rounded-lg border-b border-(--se-line) px-2 py-3.5 transition-colors last:border-0",
                            flash === item.id && "bg-(--se-blue)/12",
                          )}
                        >
                          <label className="flex cursor-pointer items-start gap-3">
                            <input type="checkbox" checked={on} onChange={() => toggle(item.id)} className="peer sr-only" />
                            <span
                              aria-hidden
                              className={cn(
                                "mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-md border-2 transition-colors peer-focus-visible:ring-3 peer-focus-visible:ring-(--se-blue)/40",
                                on ? "border-(--se-blue-ink) bg-(--se-blue-ink) text-white" : "border-[#9aa1aa] bg-white",
                              )}
                            >
                              {on && <Icon name="check" className="size-3.5" />}
                            </span>
                            <span>
                              <span className="block text-[15.5px] font-bold leading-snug">{item.symptom}</span>
                              <span className="mt-1 block text-[14px] leading-snug text-(--se-muted)">
                                <span className="font-bold text-(--se-navy)">{item.fix}</span> · {item.note}
                              </span>
                            </span>
                          </label>

                          {on && (
                            <div className="ml-8.5 mt-3 rounded-lg bg-(--se-gray) p-3.5">
                              {item.sizes && (
                                <>
                                  <p className="text-[14px] font-bold">{item.question}</p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {item.sizes.map((s) => (
                                      <button
                                        key={s.label}
                                        type="button"
                                        aria-pressed={qty === s.qty}
                                        onClick={() => setQty(item.id, s.qty)}
                                        className={cn(
                                          "min-h-10 rounded-[3px] border-2 px-3.5 text-[13.5px] font-bold transition-colors",
                                          qty === s.qty
                                            ? "border-(--se-blue-ink) bg-(--se-blue-ink) text-white"
                                            : "border-[#d3d7dd] bg-white hover:border-black",
                                        )}
                                      >
                                        {s.label}
                                        {!/\(/.test(s.label) && ` (${s.qty})`}
                                      </button>
                                    ))}
                                  </div>
                                  {tip === "exact" && (
                                    <label className="mt-3 flex items-center gap-2.5 text-[14px]">
                                      Exact number of {item.unit}
                                      <input
                                        type="number"
                                        min={1}
                                        inputMode="numeric"
                                        value={qty}
                                        onChange={(e) => setQty(item.id, Number(e.target.value))}
                                        className="h-10 w-24 rounded-md border border-[#c9ced5] bg-white px-2.5 tabular-nums focus:border-(--se-blue) focus:outline-none focus:ring-3 focus:ring-(--se-blue)/25"
                                      />
                                    </label>
                                  )}
                                  {tip === "measure" && item.measure && (
                                    <p className="mt-3 text-[14px] leading-snug text-(--se-muted)">{item.measure}</p>
                                  )}
                                </>
                              )}
                              <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px]", item.sizes && "mt-3")}>
                                {item.measure && (
                                  <button
                                    type="button"
                                    onClick={() => setHelp((x) => ({ ...x, [item.id]: tip === "measure" ? undefined : "measure" }))}
                                    className="font-bold text-(--se-navy) underline underline-offset-4"
                                  >
                                    How do I measure this?
                                  </button>
                                )}
                                {item.sizes && (
                                  <button
                                    type="button"
                                    onClick={() => setHelp((x) => ({ ...x, [item.id]: tip === "exact" ? undefined : "exact" }))}
                                    className="font-bold text-(--se-navy) underline underline-offset-4"
                                  >
                                    Enter exact number
                                  </button>
                                )}
                                <span className="ml-auto flex items-center gap-1 font-bold text-[#1d7a45]">
                                  <Icon name="check" className="size-4" />
                                  Added to estimate
                                </span>
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- 3. The estimate, always in reach ---- */}
      <div className="sticky bottom-0 z-40 flex flex-col gap-2.5 rounded-b-lg border-t-4 border-(--se-blue) bg-white px-4 py-3 shadow-[0_-12px_30px_-16px_rgb(0_0_0/0.4)] @xl:flex-row @xl:items-center @xl:justify-between @xl:px-8 @xl:py-4">
        <div aria-live="polite" className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full text-[16px] font-bold text-white transition-colors",
              lines.length ? "bg-(--se-blue-ink)" : "bg-[#c4c9d0]",
            )}
          >
            {lines.length}
          </span>
          <p>
            <span className="block text-[12px] font-bold uppercase tracking-[0.08em] text-(--se-navy)">Your instant estimate</span>
            <span className="block text-[15px] font-bold">
              {lines.length
                ? `${lines.length} ${lines.length === 1 ? "repair" : "repairs"} added. Ready when you are.`
                : "Pick an area or check a symptom to start."}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={reset} disabled={!lines.length && !area} className={cn(pillLine, "h-12 whitespace-nowrap px-3.5 text-[13.5px] @xl:px-5 @xl:text-[14.5px]")}>
            Start Over
          </button>
          <button type="button" onClick={reveal} disabled={!lines.length} className={cn(pillBlack, "h-12 flex-1 whitespace-nowrap px-3.5 text-[13.5px] @xl:flex-none @xl:px-6 @xl:text-[15px]")}>
            See My Estimate
            <Icon name="arrowRight" className="size-4" />
          </button>
        </div>
      </div>

      {/* ---- Details, then the number ---- */}
      <dialog
        ref={dialog}
        aria-labelledby={`${uid}-dialog`}
        className="m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto rounded-lg border-t-[6px] border-(--se-blue) bg-white p-0 text-(--se-ink) shadow-2xl backdrop:bg-black/65"
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <NextImage src={southeast.logo.src} alt={southeast.logo.alt} width={southeast.logo.width} height={southeast.logo.height} className="h-16 w-auto" />
            <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="-mr-2 -mt-1 rounded-full p-2 hover:bg-(--se-gray)">
              <Icon name="close" className="size-5" />
            </button>
          </div>

          {step === "details" ? (
            <form onSubmit={submit} noValidate className="mt-5">
              <h2 id={`${uid}-dialog`} className={cn(head, "text-[1.65rem] leading-tight")}>
                Get Your Instant Estimate
              </h2>
              <span aria-hidden className="mt-3 block h-1 w-16 bg-(--se-blue)" />
              <p className="mt-4 text-[15px] leading-relaxed text-(--se-muted)">
                Tell us where your home is and how to reach you. Your ballpark shows right away, and we’ll email you a PDF copy.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {field("zip", "Your Zip Code", { inputMode: "numeric", autoComplete: "postal-code", maxLength: 5, placeholder: "e.g. 30084" }, true)}
                {field("first", "First Name", { autoComplete: "given-name" })}
                {field("last", "Last Name", { autoComplete: "family-name" })}
                {field("phone", "Phone Number", { type: "tel", inputMode: "tel", autoComplete: "tel" })}
                {field("email", "Email Address", { type: "email", inputMode: "email", autoComplete: "email" })}
              </div>
              <label className="mt-5 flex cursor-pointer items-start gap-3 text-[14px] leading-normal">
                <input
                  id={`${uid}-f-consent`}
                  type="checkbox"
                  checked={contact.consent}
                  onChange={(e) => {
                    setContact((c) => ({ ...c, consent: e.target.checked }));
                    if (errors.consent) setErrors((x) => ({ ...x, consent: undefined }));
                  }}
                  aria-invalid={Boolean(errors.consent)}
                  className="mt-0.5 size-5 shrink-0 cursor-pointer accent-(--se-blue-ink)"
                />
                <span>
                  Email me my estimate, and let Daybreak StructureWorks, which built this demo for Southeast Crawlspace
                  Consulting, contact me about it by email, phone or text, as set out in the{" "}
                  <a href="/demo/southeast/privacy" target="_blank" rel="noopener" className="font-bold text-(--se-navy) underline underline-offset-4">
                    Privacy Notice
                  </a>
                  .
                </span>
              </label>
              {errors.consent && <p className="mt-1 pl-8 text-[13px] text-[#c62828]">{errors.consent}</p>}

              {/* Hidden from people; bots fill it in, and the route drops those. */}
              <div aria-hidden className="absolute -left-[9999px]">
                <label>
                  Fax
                  <input type="text" name="fax" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <Turnstile action="tool-lead" ref={human} className="mt-4 empty:hidden" />

              <button type="submit" disabled={sending} className={cn(pillBlack, "mt-6 h-13 w-full text-[16px] disabled:cursor-progress")}>
                {sending ? (
                  <>
                    <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                    Preparing your estimate
                  </>
                ) : (
                  <>
                    Show My Estimate
                    <Icon name="arrowRight" className="size-4" />
                  </>
                )}
              </button>
              {failure && (
                <p role="alert" className="mt-3 text-[14px] text-[#c62828]">
                  {failure}
                </p>
              )}
            </form>
          ) : (
            <div className="mt-5">
              <h2 id={`${uid}-dialog`} className={cn(head, "text-[1.65rem] leading-tight")}>
                Your Ballpark Estimate
              </h2>
              <p className="mt-1 text-[14px] text-(--se-muted)">
                For {contact.first.trim()} · ZIP {contact.zip.trim()}
                {sent?.reference && <> · Ref. {sent.reference}</>}
              </p>
              <div className="mt-5 rounded-lg border-l-[5px] border-(--se-blue) bg-[#eef4fe] px-5 py-4">
                <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-(--se-navy)">Estimated range</p>
                <p className={cn(head, "mt-1 text-[2.3rem] leading-none text-(--se-blue-ink) tabular-nums sm:text-[2.6rem]")}>
                  {usd(low)} – {usd(high)}
                </p>
              </div>
              <ul className="mt-5">
                {lines.map((l) => {
                  const item = southeastItems[l.item.id];
                  return (
                    <li key={l.item.id} className="flex items-baseline justify-between gap-4 border-b border-(--se-line) py-2.5 text-[14.5px]">
                      <span>
                        <span className="font-bold">{item.fix}</span>
                        <span className="text-(--se-muted)">, {sizeText(item, l.qty)}</span>
                      </span>
                      <span className="shrink-0 tabular-nums">
                        {usd(l.low)} – {usd(l.high)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-[13.5px] leading-relaxed text-(--se-muted)">
                A ballpark from typical projects, not a quote. Every home is different: your exact price comes from a free
                crawlspace inspection, with 3D Lidar rendering to pinpoint the problem.
              </p>

              {sent && (
                <p role="status" className="mt-5 flex gap-2.5 rounded-lg bg-[#e8f5ee] p-4 text-[14.5px] leading-snug text-[#14532d]">
                  <Icon name="check" className="mt-0.5 size-5 shrink-0" />
                  <span>
                    {sent.emailed ? (
                      <>
                        Sent to <strong>{sent.email}</strong>. Check your inbox for the PDF.
                      </>
                    ) : (
                      "Saved. Your PDF is ready to download."
                    )}
                  </span>
                </p>
              )}

              {booked ? (
                <p role="status" className="mt-3 flex gap-2.5 rounded-lg bg-[#eef4fe] p-4 text-[14.5px] leading-snug text-(--se-ink)">
                  <Icon name="calendar" className="mt-0.5 size-5 shrink-0 text-(--se-blue-ink)" />
                  <span>
                    <strong>This is where the booking happens.</strong> On Southeast Crawlspace Consulting’s live site, this sends
                    your request to their team, who call to set up your free crawlspace inspection. This is a concept demo, so no
                    inspection is booked and they haven’t received your details; to book a real one, call {southeast.phone}.
                  </span>
                </p>
              ) : (
                <button type="button" onClick={() => setBooked(true)} className={cn(pillBlack, "mt-5 h-13 w-full text-[16px]")}>
                  <Icon name="calendar" className="size-5" />
                  Schedule My Free Inspection
                </button>
              )}
              {sent?.pdf && (
                <button type="button" onClick={download} className={cn(pillLine, "mt-2.5 h-12 w-full text-[15px]")}>
                  <Icon name="document" className="size-5" />
                  Download My Estimate (PDF)
                </button>
              )}
              <div className="mt-4 flex flex-wrap justify-between gap-2 text-[14px]">
                <button type="button" onClick={() => dialog.current?.close()} className="font-bold text-(--se-navy) underline underline-offset-4">
                  Back to my estimate
                </button>
                <span className="text-(--se-muted)">
                  Or call <strong className="text-(--se-ink)">{southeast.phone}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}

/** The middle size, or 1 for a fixed-price item: what "Add to my estimate" adds. */
function defaultQty(item: DemoItem) {
  return item.sizes?.[Math.floor(item.sizes.length / 2)].qty ?? 1;
}

/** An area's tag on the house photo: a black pill with its blue number. */
function AreaTag({ area, n }: { area: Area; n: number }) {
  const atEdge = area.zone.x + area.zone.w >= 99;
  return (
    <span
      className={cn(
        "absolute flex items-center gap-1 whitespace-nowrap rounded-full bg-black/85 p-0.5 text-white shadow-[0_4px_12px_-4px_rgb(0_0_0/0.6)] @lg:pr-1.5 @xl:gap-1.5 @xl:py-1 @xl:pl-1 @xl:pr-3",
        atEdge ? "right-0" : "left-1/2 -translate-x-1/2",
      )}
      style={area.chip === "above" ? { bottom: "calc(100% + 4px)" } : area.chip === "below" ? { top: "calc(100% + 4px)" } : { bottom: "4px" }}
    >
      <span className="flex size-3.5 shrink-0 items-center justify-center rounded-full bg-(--se-blue-ink) text-[8px] font-bold @xl:size-6 @xl:text-[12px]">
        {n}
      </span>
      {/* Narrow: the number alone. The list under the photo names each area. */}
      <span className="hidden text-[7.5px] font-bold uppercase tracking-[0.04em] @lg:inline @xl:text-[12px]">{area.label}</span>
    </span>
  );
}

function SpotCard({ h, added, onAdd, onClose }: { h: Hotspot; added: boolean; onAdd: () => void; onClose: () => void }) {
  return (
    <div className="rounded-lg border-t-4 border-(--se-blue) bg-white p-4 text-left shadow-[0_18px_40px_-14px_rgb(0_0_0/0.5)]">
      <div className="flex items-start justify-between gap-3">
        <p className={cn(head, "text-[17px] leading-snug")}>{h.title}</p>
        <button type="button" onClick={onClose} aria-label="Close" className="-mr-1.5 -mt-1 rounded-full p-1.5 hover:bg-(--se-gray)">
          <Icon name="close" className="size-4" />
        </button>
      </div>
      <p className="mt-1.5 text-[14px] leading-snug text-(--se-muted)">{h.body}</p>
      <p className="mt-2 text-[13px] font-bold text-(--se-navy)">The fix: {southeastItems[h.item].fix}</p>
      <button type="button" onClick={onAdd} className={cn(pillBlack, "mt-3.5 h-11 w-full text-[14px]")}>
        {added ? "Added: see it below" : "Add to my estimate"}
        <Icon name="arrowRight" className="size-4" />
      </button>
    </div>
  );
}
