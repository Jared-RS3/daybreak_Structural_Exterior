"use client";

import { useId, useState } from "react";
import type { Pick } from "@/lib/estimator";
import { assessDemo, questionRequired, validAnswer, validateAnswers, visibleQuestions, type Answers } from "@/lib/contractors/assessment";
import type { Answer, ContractorEstimatorConfig } from "@/lib/contractors/config";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const sample = { name: "Alex Morgan", email: "alex.morgan@example.com", phone: "(555) 010-0142", city: "Ypsilanti, MI", zip: "48197" };
type Contact = typeof sample;

export function ContractorDemoFlow({ config, picks, onBack }: { config: ContractorEstimatorConfig; picks: Pick[]; onBack: () => void }) {
  const uid = useId();
  const [step, setStep] = useState<"questions" | "result" | "form" | "lead">("questions");
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState<Contact>({ name: "", email: "", phone: "", city: "", zip: "" });
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [ctaNote, setCtaNote] = useState(false);
  const assessment = step === "questions" ? null : assessDemo(config, picks, answers);
  const setAnswer = (item: string, question: string, answer: Answer) => {
    setAnswers((current) => ({ ...current, [item]: { ...current[item], [question]: answer } }));
    setError("");
  };
  const next = () => {
    const problem = validateAnswers(config, picks, answers);
    if (problem) { setError(problem); return; }
    setStep("result");
    setError("");
  };
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contact.name.trim() || !contact.email.includes("@") || !contact.city.trim() || !/^\d{5}$/.test(contact.zip)) {
      setError("Use fictional sample details, including a five-digit example ZIP.");
      return;
    }
    setError("");
    setStep("lead");
  };
  const download = async () => {
    if (!assessment) return;
    setDownloading(true);
    setDownloadError("");
    try {
      const { createDemoPdf } = await import("@/lib/contractors/demo-pdf");
      const bytes = await createDemoPdf(config, assessment, contact);
      const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
      const anchor = Object.assign(document.createElement("a"), { href: url, download: `${config.slug}-concept-demo.pdf` });
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      setDownloadError("The sample PDF could not be prepared. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return <div className="mt-4 text-[#172430]">
    {step === "questions" && <>
      <p className="text-sm leading-relaxed text-[#405260]">A few details help prepare an example project summary. Choose what you have observed; a professional inspection determines the cause and repair.</p>
      <div className="mt-5 max-h-[55vh] space-y-5 overflow-y-auto pr-1">
        {picks.map((pick) => {
          const item = config.categories.flatMap((c) => c.items).find((i) => i.id === pick.id)!;
          return <section key={pick.id} className="border-t border-[#CDD6DC] pt-4" aria-label={item.symptom}>
            <h3 className="text-base font-semibold">{item.symptom}</h3>
            <p className="mt-1 text-xs text-[#405260]">Approximate size: {item.unit ? `${pick.qty} ${item.unit}` : "one project"}</p>
            {visibleQuestions(config.questions[pick.id] ?? [], answers[pick.id]).map((q) => <fieldset key={q.id} className="mt-4">
              <legend className="text-sm font-medium">{q.label}{questionRequired(q) ? " *" : ""}</legend>
              {q.type === "choice" ? <div className="mt-2 flex flex-wrap gap-2">
                {q.options?.map((option) => <label key={option.value} className="cursor-pointer">
                  <input className="peer sr-only" type="radio" name={`${uid}-${pick.id}-${q.id}`} checked={answers[pick.id]?.[q.id] === option.value} onChange={() => setAnswer(pick.id, q.id, option.value)} />
                  <span className="inline-flex min-h-11 items-center border border-[#CDD6DC] px-3 text-sm peer-checked:border-[#0647E8] peer-checked:bg-[#EEF3FF] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#0647E8]">{option.label}</span>
                </label>)}
              </div> : <div className="mt-2 flex items-center gap-2">
                <input type="number" min={q.min} max={q.max} inputMode="decimal" value={answers[pick.id]?.[q.id] ?? ""} onChange={(event) => setAnswer(pick.id, q.id, event.target.value === "" ? "" : Number(event.target.value))} aria-invalid={!validAnswer(q, answers[pick.id]?.[q.id])} className="h-11 w-28 border border-[#CDD6DC] px-3 text-sm focus:outline-2 focus:outline-[#0647E8]" />
                <span className="text-sm text-[#405260]">{q.unit}</span>
              </div>}
            </fieldset>)}
          </section>;
        })}
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-[#B42332]">{error}</p>}
      <button type="button" onClick={next} className="mt-5 min-h-11 w-full bg-[#0647E8] px-4 text-sm font-semibold text-white hover:bg-[#003CC7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0647E8]">View planning result</button>
    </>}

    {step === "result" && assessment && <>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#405260]">Independent concept guidance</p>
      <h3 className="mt-2 text-2xl font-semibold">{assessment.status === "inspection" ? "Inspection required" : `${usd(assessment.low)} – ${usd(assessment.high)}`}</h3>
      {assessment.status === "partial" && <p className="mt-2 text-sm font-semibold text-[#B42332]">Some selected concerns require an inspection and are excluded from this range.</p>}
      {assessment.status === "range" && <p className="mt-2 text-sm text-[#405260]">An illustrative planning range using Daybreak sample assumptions, not HomeSpec pricing.</p>}
      <p className="mt-3 border-l-2 border-[#0647E8] bg-[#EEF3FF] p-3 text-sm leading-relaxed">{assessment.urgency === "prompt inspection" ? "Please arrange a qualified inspection promptly for the structural or water concern described." : "A qualified inspection is the next step to confirm the cause, scope and cost."}</p>
      <ul className="mt-4 space-y-2 text-sm">{assessment.lines.map((line) => <li key={line.id} className="border-b border-[#EDF1F4] pb-2"><strong className="font-medium">{line.symptom}</strong><span className="block text-[#405260]">{line.pricing === "inspection" ? "Inspection required" : `Approx. ${line.qty} ${line.unit ?? "project"}`}</span></li>)}</ul>
      <p className="mt-4 text-xs leading-relaxed text-[#405260]">{config.pricing.disclaimer}</p>
      <button type="button" onClick={() => setStep("form")} className="mt-5 min-h-11 w-full bg-[#0647E8] px-4 text-sm font-semibold text-white hover:bg-[#003CC7]">{config.lead.submitLabel}</button>
      <button type="button" onClick={() => setCtaNote(true)} className="mt-2 min-h-11 w-full border border-[#0647E8] px-4 text-sm font-semibold text-[#0647E8]">{config.cta.label}</button>
      {ctaNote && <p role="status" className="mt-2 text-sm text-[#405260]">{config.cta.note} A paid version could provide a secure inspection request after HomeSpec approval.</p>}
      <button type="button" onClick={() => setStep("questions")} className="mt-2 min-h-11 w-full border border-[#CDD6DC] px-4 text-sm">Edit answers</button>
    </>}

    {step === "form" && <form onSubmit={submit} noValidate>
      <p className="text-sm leading-relaxed text-[#405260]">This is a local simulation. Enter fictional details only. Nothing is sent, saved, emailed or booked.</p>
      <button type="button" onClick={() => setContact(sample)} className="mt-4 min-h-11 border border-[#0647E8] px-4 text-sm font-semibold text-[#0647E8]">Use sample details</button>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{(["name", "email", "phone", "city", "zip"] as const).map((key) => <label key={key} className="block text-xs font-medium text-[#405260]">{config.lead.fields[key]}
        <input value={contact[key]} onChange={(e) => { setContact((c) => ({ ...c, [key]: e.target.value.slice(0, 80) })); setError(""); }} autoComplete="off" maxLength={80} className="mt-1 block h-11 w-full border border-[#CDD6DC] px-3 text-sm text-[#172430] focus:outline-2 focus:outline-[#0647E8]" />
      </label>)}</div>
      {error && <p role="alert" className="mt-4 text-sm text-[#B42332]">{error}</p>}
      <button type="submit" className="mt-5 min-h-11 w-full bg-[#0647E8] px-4 text-sm font-semibold text-white hover:bg-[#003CC7]">Simulate submission</button>
      <button type="button" onClick={() => setStep("result")} className="mt-2 min-h-11 w-full border border-[#CDD6DC] px-4 text-sm">Back to result</button>
    </form>}

    {step === "lead" && assessment && <>
      <p role="status" className="bg-[#EEF3FF] p-3 text-sm font-semibold">Example lead prepared locally. No request was delivered to HomeSpec.</p>
      <div className="mt-4 border border-[#CDD6DC] p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#405260]">Example lead preview · fictional details</p>
        <h3 className="mt-2 text-lg font-semibold">{contact.name}</h3>
        <p className="text-sm text-[#405260]">{contact.email} · {contact.phone || "No example phone"}<br />{contact.city}, {contact.zip} · Coverage to confirm</p>
        <p className="mt-3 text-sm"><strong>Priority:</strong> {assessment.urgency}</p>
        <p className="mt-1 text-sm"><strong>Estimate status:</strong> {assessment.status === "inspection" ? "Inspection required" : assessment.status === "partial" ? `Partial illustrative range ${usd(assessment.low)} – ${usd(assessment.high)}` : `Illustrative range ${usd(assessment.low)} – ${usd(assessment.high)}`}</p>
        <p className="mt-1 text-sm"><strong>Potential photo attachment:</strong> None in this demo</p>
        <div className="mt-4 border-t border-[#EDF1F4] pt-3"><h4 className="text-sm font-semibold">Project summary</h4>
          {assessment.lines.map((line) => <div key={line.id} className="mt-3 text-sm"><p className="font-medium">{line.category}: {line.symptom}</p><p className="text-[#405260]">{line.unit ? `Approx. ${line.qty} ${line.unit}` : "Size to confirm"}</p><ul className="ml-4 list-disc text-[#405260]">{line.responses.map((r) => <li key={r.label}>{r.label} {r.answer}</li>)}</ul></div>)}
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-[#405260]">A paid version could securely deliver these details to HomeSpec’s preferred CRM or email after integration and consent. {config.cta.note} {config.pricing.disclaimer}</p>
      {config.pdf.enabled && <button type="button" disabled={downloading} onClick={download} className="mt-4 min-h-11 w-full bg-[#0647E8] px-4 text-sm font-semibold text-white hover:bg-[#003CC7] disabled:opacity-60">{downloading ? "Preparing sample PDF…" : "Download sample PDF"}</button>}
      {downloadError && <p role="alert" className="mt-2 text-sm text-[#B42332]">{downloadError}</p>}
      <button type="button" onClick={onBack} className="mt-2 min-h-11 w-full border border-[#CDD6DC] px-4 text-sm">Explore more concerns</button>
    </>}
  </div>;
}
