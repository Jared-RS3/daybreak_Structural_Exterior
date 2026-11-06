import { priceEstimate, type Pick } from "@/lib/estimator";
import type { Answer, ContractorEstimatorConfig, Question } from "./config";

export type Answers = Record<string, Record<string, Answer>>;
export type DemoAssessment = {
  status: "range" | "partial" | "inspection";
  low: number;
  high: number;
  urgency: "prompt inspection" | "standard inspection";
  lines: { id: string; symptom: string; category: string; qty: number; unit?: string; pricing: "illustrative" | "inspection"; responses: { label: string; answer: string }[] }[];
};

export function visibleQuestions(questions: Question[], answers: Record<string, Answer> = {}): Question[] {
  return questions.filter((q) => !q.showIf || answers[q.showIf.question] === q.showIf.value);
}

export function questionRequired(q: Question): boolean {
  return q.required ?? q.type === "choice";
}

export function validAnswer(q: Question, value: Answer | undefined): boolean {
  if (value === undefined || value === "") return !questionRequired(q);
  if (q.type === "choice") return typeof value === "string" && Boolean(q.options?.some((o) => o.value === value));
  return typeof value === "number" && Number.isFinite(value) && value >= (q.min ?? 0) && value <= (q.max ?? 100000);
}

export function validateAnswers(config: ContractorEstimatorConfig, picks: Pick[], answers: Answers): string | null {
  if (!picks.length) return "Select at least one concern.";
  const available = new Map(config.categories.flatMap((c) => c.items.map((i) => [i.id, i] as const)));
  if (picks.length > available.size || new Set(picks.map((p) => p.id)).size !== picks.length) return "Select each concern once.";
  for (const pick of picks) {
    const item = available.get(pick.id);
    if (!item || !Number.isInteger(pick.qty) || pick.qty < 1 || pick.qty > (config.measurements[pick.id]?.max ?? 10000)) return "Choose a valid approximate size.";
    if (!item.sizes && pick.qty !== 1) return "Choose a valid approximate size.";
    if (!Number.isInteger(pick.variant) || pick.variant < 0 || pick.variant >= (item.options?.choices.length ?? 1)) return "Choose a valid option.";
    for (const q of visibleQuestions(config.questions[pick.id] ?? [], answers[pick.id])) {
      if (!validAnswer(q, answers[pick.id]?.[q.id])) return `Answer: ${q.label}`;
    }
  }
  return null;
}

/** Reuses the Daybreak sample price engine only for concerns with a defensible
 * illustrative quantity. Uncertain or structural work remains inspection-only. */
export function assessDemo(config: ContractorEstimatorConfig, picks: Pick[], answers: Answers): DemoAssessment {
  if (config.mode !== "demo") throw new Error("Demo assessment requires a demo configuration.");
  const invalid = validateAnswers(config, picks, answers);
  if (invalid) throw new Error(invalid);
  const entries = config.categories.flatMap((c) => c.items.map((i) => ({ item: i, category: c.name })));
  const lines = picks.map((p) => {
    const found = entries.find(({ item }) => item.id === p.id)!;
    const responses = visibleQuestions(config.questions[p.id] ?? [], answers[p.id]).map((q) => ({
      label: q.label,
      answer: q.type === "choice" ? q.options?.find((o) => o.value === answers[p.id]?.[q.id])?.label ?? "Not provided" : answers[p.id]?.[q.id] === undefined ? "Not provided" : `${answers[p.id][q.id]} ${q.unit ?? ""}`.trim(),
    }));
    const needsInspection = config.pricing.guidance[p.id] !== "illustrative" || (p.id === "joint-seal" && answers[p.id]?.settled === "yes");
    return { id: p.id, symptom: found.item.symptom, category: found.category, qty: p.qty, unit: found.item.unit, pricing: needsInspection ? "inspection" as const : "illustrative" as const, responses };
  });
  const priced = picks.filter((p) => lines.find((l) => l.id === p.id)?.pricing === "illustrative");
  const { low, high } = priceEstimate(priced);
  const inspection = lines.some((l) => l.pricing === "inspection");
  const urgent = lines.some((l) => ["wall-anchors", "support-posts", "helical-piers", "push-piers", "sump-pump", "crawl-drain"].includes(l.id)) || answers["interior-drain"]?.standing === "yes";
  return {
    status: !priced.length ? "inspection" : inspection ? "partial" : "range",
    low,
    high,
    urgency: urgent ? "prompt inspection" : "standard inspection",
    lines,
  };
}
