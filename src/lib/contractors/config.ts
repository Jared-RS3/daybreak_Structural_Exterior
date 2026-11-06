import { areas, categories, type Area, type RepairCategory } from "@/lib/estimator";

export type Answer = string | number;
export type Question = {
  id: string;
  label: string;
  type: "choice" | "number";
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  unit?: string;
  required?: boolean;
  showIf?: { question: string; value: string };
};
export type ContractorEstimatorConfig = {
  slug: string;
  company: string;
  mode: "production" | "demo";
  brand: { text: string; logo?: string; ink: string; accent: string; pale: string };
  categories: RepairCategory[];
  areas: Area[];
  questions: Record<string, Question[]>;
  measurements: Record<string, { max: number }>;
  pricing: { status: "approved" | "illustrative"; guidance: Record<string, "illustrative" | "inspection">; disclaimer: string };
  serviceArea: { label: string; zipPolicy: "confirm" | "verified"; cities: string[] };
  lead: { heading: string; submitLabel: string; sampleOnly: boolean; fields: { name: string; email: string; phone: string; city: string; zip: string } };
  cta: { label: string; note: string };
  pdf: { enabled: boolean; watermark: string };
  features: { photos: boolean; localPreview: boolean; analytics: boolean };
  notifications: { email: boolean; sms: boolean; crm: boolean; webhooks: boolean; booking: boolean };
};

export const daybreakEstimatorConfig: ContractorEstimatorConfig = {
  slug: "daybreak",
  company: "Daybreak StructureWorks",
  mode: "production",
  brand: { text: "Daybreak StructureWorks", ink: "#1c1c1c", accent: "#fcc600", pale: "#f2f2f2" },
  categories,
  areas,
  questions: {},
  measurements: {},
  pricing: { status: "illustrative", guidance: {}, disclaimer: "A ballpark only, from typical projects and what you told us." },
  serviceArea: { label: "United States", zipPolicy: "confirm", cities: [] },
  lead: { heading: "See your instant estimate", submitLabel: "Show my instant estimate", sampleOnly: false, fields: { name: "Full name", email: "Email", phone: "Phone", city: "City", zip: "Property ZIP" } },
  cta: { label: "Get this on your site", note: "Final pricing follows an inspection." },
  pdf: { enabled: true, watermark: "" },
  features: { photos: true, localPreview: false, analytics: true },
  notifications: { email: true, sms: false, crm: true, webhooks: false, booking: false },
};

const source = Object.fromEntries(categories.map((c) => [c.id, c]));
const item = (id: string) => categories.flatMap((c) => c.items).find((i) => i.id === id)!;
const withSymptom = (id: string, symptom: string, note: string) => ({ ...item(id), symptom, fix: "", note });
const category = (id: string, changes: Partial<RepairCategory>, items: RepairCategory["items"]): RepairCategory => ({
  ...source[id], ...changes, items,
});
const area = (id: Area["id"], changes: Partial<Area>, hotspots: Area["hotspots"]): Area => ({
  ...areas.find((a) => a.id === id)!, ...changes, hotspots,
});
const hotspot = (id: Area["id"], index: number, label: string, body: string, itemId?: string) => {
  const h = areas.find((a) => a.id === id)!.hotspots[index];
  return { ...h, label, title: label, body, item: itemId ?? h.item };
};

/** Official service mix checked against basementfix.com and its Ypsilanti page.
 * The prices below remain Daybreak sample data, never HomeSpec-approved rates. */
export const homespecEstimatorConfig: ContractorEstimatorConfig = {
  slug: "homespec",
  company: "HomeSpec Waterproofing & Foundation Repair",
  mode: "demo",
  brand: { text: "HomeSpec", ink: "#071721", accent: "#0647E8", pale: "#EEF3FF" },
  categories: [
    category("waterproofing", { name: "Basement waterproofing", sub: "Leaks · damp walls · standing water", intro: "Select what you can see. An inspection determines the source and repair." }, [
      withSymptom("interior-drain", "Water at the floor and wall joint", "Where and when does water appear?"),
      withSymptom("foam-injection", "Water leaking through a wall crack", "Crack location and pattern matter."),
      withSymptom("wall-liner", "Damp or stained basement walls", "Moisture can have more than one cause."),
      withSymptom("sump-pump", "Standing water or basement flooding", "Tell us whether a pump is already present."),
      withSymptom("battery-backup", "Sump pump stops during outages", "An inspection checks the pump and discharge."),
    ]),
    category("foundation", { name: "Foundation repair", sub: "Cracks · bowing · settlement", intro: "Choose visible signs, not a repair method. Structural issues need a qualified inspection." }, [
      withSymptom("push-piers", "Stair-step cracks, uneven floors or sticking doors", "Movement may have several causes."),
      withSymptom("wall-anchors", "Horizontal crack or bowing foundation wall", "Please arrange a qualified inspection promptly."),
      withSymptom("helical-piers", "A sinking corner or visible settlement", "An inspection determines the appropriate support."),
    ]),
    category("crawl", { name: "Crawl space repair", sub: "Moisture · barriers · support", intro: "Select the signs you have noticed beneath the home." }, [
      withSymptom("encapsulation", "Musty crawl space or damaged vapor barrier", "Tell us about moisture and any existing barrier."),
      withSymptom("crawl-drain", "Standing water in the crawl space", "Water entry and drainage need an inspection."),
      withSymptom("dehumidifier", "Damp air or damaged insulation", "An inspection checks moisture sources."),
      withSymptom("support-posts", "Sagging floor or crawl space support concern", "Structural support needs a qualified inspection."),
    ]),
    category("concrete", { name: "Concrete leveling", sub: "Sunken slabs · trip hazards", intro: "Select the surface that has settled. This sample range uses Daybreak assumptions." }, [
      withSymptom("slab-lift", "Sunken driveway, walkway or patio", "Approximate slab sections help plan the scope."),
    ]),
    category("concrete", { id: "concrete-repair", name: "Concrete repair & sealing", sub: "Cracks · joints · surface damage", intro: "Select visible cracking or open joints. A professional checks whether repair is appropriate." }, [
      withSymptom("joint-seal", "Open concrete cracks or joints", "Approximate length helps plan the scope."),
    ]),
  ],
  areas: [
    area("foundation", { title: "Foundation signs visible from outside" }, [
      hotspot("foundation", 0, "Stair-step cracks", "Cracks following mortar joints can be a sign of movement. An inspection identifies the cause."),
      hotspot("foundation", 1, "Leaking wall crack", "Tell us where water enters and when it happens."),
      hotspot("foundation", 2, "Horizontal crack or bowing", "A qualified inspector should assess visible bowing or horizontal cracks."),
      hotspot("foundation", 3, "Sinking corner", "A drop at one corner needs an on-site assessment."),
    ]),
    area("basement", { title: "Inside the basement" }, [
      hotspot("basement", 0, "Water through a crack", "A wall crack can admit water; the cause and repair need an inspection."),
      hotspot("basement", 1, "Damp basement wall", "Moisture marks have several possible causes."),
      hotspot("basement", 2, "Water at the wall and floor", "Tell us whether water appears after rain."),
      hotspot("basement", 3, "Standing water", "Tell us how often water collects and whether a sump pump is installed."),
      hotspot("basement", 4, "Sump pump concern", "Tell us whether the pump stops during power outages."),
    ]),
    area("crawl", { title: "Inside the crawl space" }, [
      hotspot("crawl", 0, "Musty smell", "A musty smell may point to moisture below the home."),
      hotspot("crawl", 1, "Damp air or insulation", "Tell us whether insulation is wet or damaged." , "dehumidifier"),
      hotspot("crawl", 2, "Sagging floor above", "An inspection should check the supporting structure.", "support-posts"),
      hotspot("crawl", 3, "Standing water", "Tell us whether water appears after rain."),
      hotspot("crawl", 4, "Damaged vapor barrier", "Tell us whether an existing barrier is torn or missing."),
    ]),
    area("driveway", { label: "Concrete", title: "Driveways, walks and patios" }, [
      hotspot("driveway", 0, "Open concrete joints", "Tell us the approximate length of open joints."),
      hotspot("driveway", 1, "Sunken slab", "Tell us which surface has settled and how many sections are affected."),
      hotspot("driveway", 2, "Trip hazard", "A settled edge can create a trip hazard; an inspection checks the cause."),
    ]),
  ],
  questions: {
    "interior-drain": [
      { id: "when", label: "When does water appear?", type: "choice", options: [{ value: "rain", label: "After rainfall" }, { value: "often", label: "Often, even without rain" }, { value: "unsure", label: "Not sure" }] },
      { id: "standing", label: "Is there standing water?", type: "choice", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }] },
      { id: "depth", label: "Approximate deepest water (inches)", type: "number", min: 0, max: 24, unit: "in", showIf: { question: "standing", value: "yes" } },
    ],
    "foam-injection": [{ id: "location", label: "Where is the leaking crack?", type: "choice", options: [{ value: "wall", label: "Basement wall" }, { value: "floor", label: "Floor" }, { value: "unsure", label: "Not sure" }] }],
    "wall-liner": [{ id: "when", label: "When do walls feel damp?", type: "choice", options: [{ value: "rain", label: "After rainfall" }, { value: "often", label: "Often" }, { value: "unsure", label: "Not sure" }] }],
    "sump-pump": [{ id: "pump", label: "Is there an existing sump pump?", type: "choice", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not sure" }] }, { id: "frequency", label: "How often does flooding occur?", type: "choice", options: [{ value: "once", label: "Once" }, { value: "repeat", label: "More than once" }, { value: "unsure", label: "Not sure" }] }],
    "battery-backup": [{ id: "outage", label: "Does the pump stop when power goes out?", type: "choice", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not sure" }] }],
    "push-piers": [{ id: "worsening", label: "Have these signs worsened?", type: "choice", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not sure" }] }],
    "wall-anchors": [{ id: "bowing", label: "Is the wall visibly bowing?", type: "choice", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not sure" }] }],
    "helical-piers": [{ id: "worsening", label: "Has the settling worsened?", type: "choice", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not sure" }] }],
    "encapsulation": [{ id: "barrier", label: "Is a vapor barrier already installed?", type: "choice", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not sure" }] }, { id: "access", label: "Can you safely access the crawl space?", type: "choice", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not sure" }] }],
    "crawl-drain": [{ id: "when", label: "When does water collect?", type: "choice", options: [{ value: "rain", label: "After rainfall" }, { value: "often", label: "Often" }, { value: "unsure", label: "Not sure" }] }],
    "dehumidifier": [{ id: "insulation", label: "Is insulation wet or damaged?", type: "choice", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not sure" }] }],
    "support-posts": [{ id: "sagging", label: "Is the floor above visibly sagging?", type: "choice", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not sure" }] }],
    "slab-lift": [{ id: "surface", label: "Which surface is affected?", type: "choice", options: [{ value: "driveway", label: "Driveway" }, { value: "walk", label: "Walkway" }, { value: "patio", label: "Patio" }, { value: "other", label: "Other" }] }, { id: "trip", label: "Is there a trip-height difference?", type: "choice", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not sure" }] }],
    "joint-seal": [{ id: "surface", label: "Which surface is affected?", type: "choice", options: [{ value: "driveway", label: "Driveway" }, { value: "walk", label: "Walkway" }, { value: "patio", label: "Patio" }, { value: "other", label: "Other" }] }, { id: "settled", label: "Has the slab also settled?", type: "choice", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not sure" }] }],
  },
  measurements: { "interior-drain": { max: 360 }, "foam-injection": { max: 15 }, "wall-liner": { max: 2700 }, "push-piers": { max: 42 }, "wall-anchors": { max: 27 }, "helical-piers": { max: 42 }, encapsulation: { max: 5400 }, "support-posts": { max: 18 }, "slab-lift": { max: 18 }, "joint-seal": { max: 300 } },
  pricing: {
    status: "illustrative",
    guidance: Object.fromEntries(categories.flatMap((c) => c.items.map((i) => [i.id, "inspection" as const])).concat([["slab-lift", "illustrative"], ["joint-seal", "illustrative"]])),
    disclaimer: "Illustrative cost guidance only. This is an independent Daybreak concept and not an official HomeSpec quotation. Actual repairs, scope and pricing require a professional inspection.",
  },
  serviceArea: { label: "Southeast Michigan, including Ann Arbor, Westland, Metro Detroit and Ypsilanti", zipPolicy: "confirm", cities: ["Ann Arbor", "Westland", "Detroit", "Ypsilanti"] },
  lead: { heading: "See an example project lead", submitLabel: "Preview sample lead", sampleOnly: true, fields: { name: "Fictional customer name", email: "Example email", phone: "Example phone", city: "Example city, state", zip: "Example ZIP" } },
  cta: { label: "Free inspection — illustration only", note: "No appointment is booked in this concept demo." },
  pdf: { enabled: true, watermark: "CONCEPT DEMO — NOT AN OFFICIAL HOMESPEC ESTIMATE" },
  features: { photos: false, localPreview: true, analytics: false },
  notifications: { email: false, sms: false, crm: false, webhooks: false, booking: false },
};

const demos: Record<string, ContractorEstimatorConfig> = { homespec: homespecEstimatorConfig };
export const demoSlugs = Object.keys(demos);
export function getDemoContractor(slug: string): ContractorEstimatorConfig | null {
  return Object.hasOwn(demos, slug) ? demos[slug] : null;
}
