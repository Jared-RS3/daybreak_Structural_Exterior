/** Shared shape and validation for lead requests (the free homepage concept
 *  form), used by the form and by the route handler that receives them. */

/**
 * The qualifying questions, one tap each. Every answer tells us something we
 * need before the call: what to design for, whether the business is big
 * enough for a site to pay back, and how soon they mean it.
 */
export const trades = [
  "Foundation repair",
  "Crawl space & waterproofing",
  "Siding",
  "A mix of these",
  "Other",
] as const;
export const jobVolumes = ["Under 5", "5 to 15", "15 to 30", "30+"] as const;
export const jobValues = [
  "Under $5k",
  "$5k to $15k",
  "$15k to $30k",
  "$30k+",
] as const;
export const timelines = [
  "As soon as possible",
  "In the next 3 months",
  "Just looking for now",
] as const;

export type LeadRequest = {
  company: string;
  name: string;
  email: string;
  phone: string;
  /** The main town or city they work in, so the concept shows their area. */
  area: string;
  /** Optional: plenty of contractors don't have a site yet. */
  domain?: string;
  trade: string;
  /** What they sell, in their words: asked only when the trade is "Other". */
  services?: string;
  jobs: string;
  jobValue: string;
  timeline: string;
  /**
   * "yes" when they ticked the box agreeing to the privacy policy and to being
   * contacted about the request. A string like every other field, so it goes
   * through the same reading and validation; saved as the "POPIA Agreement"
   * checkbox in Airtable.
   */
  consent: string;
};

export type LeadField = keyof LeadRequest;

/** The fields in the order the form shows them, for focusing the first error. */
export const leadFields: LeadField[] = [
  "company",
  "name",
  "email",
  "phone",
  "area",
  "domain",
  "trade",
  "services",
  "jobs",
  "jobValue",
  "timeline",
  "consent",
];

const pick = (options: readonly string[], v: string) =>
  options.includes(v) ? null : "Choose one.";

/** The longest each typed answer may be. Generous for people, useless for stuffing. */
const maxLength: Partial<Record<LeadField, number>> = {
  company: 120,
  name: 100,
  email: 254,
  phone: 30,
  area: 100,
  domain: 253,
  services: 200,
};

/**
 * Reads the form's fields out of untrusted input (FormData or a JSON body):
 * strings only, control characters removed, invisible and text-direction
 * characters removed (they can disguise what a value says), whitespace
 * collapsed, trimmed.
 */
export function readLead(get: (k: LeadField) => unknown): LeadRequest {
  return Object.fromEntries(
    leadFields.map((k) => {
      const v = get(k);
      const text = typeof v === "string" ? v : "";
      return [
        k,
        text
          .replace(/[\u0000-\u001f\u007f-\u009f]/g, " ")
          .replace(/[\u00ad\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff]/g, "")
          .replace(/\s+/g, " ")
          .trim(),
      ];
    }),
  ) as LeadRequest;
}

/** Every rule the form and the route both enforce. Returns only the fields with a problem. */
export function validateLead(
  l: LeadRequest,
): Partial<Record<LeadField, string>> {
  const errors: Partial<Record<LeadField, string>> = {};
  const set = (k: LeadField, msg: string | null) => {
    if (msg && !errors[k]) errors[k] = msg;
  };
  for (const [k, max] of Object.entries(maxLength) as [LeadField, number][]) {
    if ((l[k] ?? "").length > max)
      errors[k] = `Keep this under ${max} characters.`;
  }
  set("company", l.company.length < 2 ? "Enter your company name." : null);
  set("name", l.name.length < 2 ? "Enter your name." : null);
  set(
    "email",
    isEmail(l.email) ? null : "Enter an email address we can reach you on.",
  );
  set(
    "phone",
    isPhone(l.phone) ? null : "Enter a phone number, area code first.",
  );
  set(
    "area",
    l.area.length < 2 ? "Enter the main town or city you work in." : null,
  );
  set(
    "domain",
    l.domain && !normalizeDomain(l.domain)
      ? "Enter your website, like yourcompany.com"
      : null,
  );
  set("trade", pick(trades, l.trade));
  set(
    "services",
    l.trade === "Other" && (l.services ?? "").length < 3
      ? "Tell us what services you offer."
      : null,
  );
  // Optional: they can skip these, but an answer must be one of the options.
  set("jobs", l.jobs && pick(jobVolumes, l.jobs));
  set("jobValue", l.jobValue && pick(jobValues, l.jobValue));
  set("timeline", l.timeline && pick(timelines, l.timeline));
  set(
    "consent",
    l.consent === "yes" ? null : "Tick the box to agree before sending.",
  );
  return errors;
}

/**
 * Accepts what people actually type — "https://acme.com/", "www.acme.com",
 * "ACME.com " — and returns the bare hostname, or null if it could not be a
 * domain at all. Deliberately permissive about TLDs: new ones appear faster
 * than any allowlist is maintained.
 */
export function normalizeDomain(input: string): string | null {
  let v = input.trim().toLowerCase();
  if (!v) return null;
  v = v.replace(/^[a-z][a-z0-9+.-]*:\/\//, "");
  v = v.split(/[/?#]/)[0];
  v = v.replace(/^www\./, "").replace(/\.$/, "");
  if (v.includes("@") || v.includes(" ")) return null;
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(v)) return null;
  if (v.split(".").pop()!.length < 2) return null;
  return v;
}

/**
 * Letters (any language), digits and the punctuation real addresses use.
 * Starting with a letter, digit or underscore also means a typed address can
 * never begin with = + - or @ and run as a spreadsheet formula.
 */
export function isEmail(v: string): boolean {
  const t = v.trim();
  return (
    /^[\p{L}\p{N}_][\p{L}\p{N}._%+'-]*@[\p{L}\p{N}][\p{L}\p{N}.-]*\.\p{L}[\p{L}\p{N}-]+$/u.test(t) &&
    !t.includes("..")
  );
}

/** Digits with the usual separators, an optional leading + and extension. */
export function isPhone(v: string): boolean {
  const digits = v.replace(/\D/g, "").length;
  return (
    digits >= 10 &&
    digits <= 20 &&
    /^\+?[\d\s().-]+(\s?(x|ext\.?)\s?\d{1,6})?$/i.test(v.trim())
  );
}
