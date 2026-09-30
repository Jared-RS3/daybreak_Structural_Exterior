/** Shared shape and validation for lead requests (the free homepage design
 *  form), used by the form and by the route handler that receives them. */

export type LeadRequest = {
  /** Optional on the design form: plenty of contractors don't have a site yet. */
  domain?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  /** Roughly how many jobs a month, from `jobVolumes`. Optional. */
  jobs?: string;
};

/** The answers to "How many jobs do you do a month?" on the design form. */
export const jobVolumes = ["Under 5", "5 to 15", "15 to 30", "30+"] as const;

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

export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}
