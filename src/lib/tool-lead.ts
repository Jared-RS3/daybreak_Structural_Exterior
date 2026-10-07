/* ==========================================================================
   A homeowner's details from the live tools (the crack checker and the house
   estimator): what the form asks for, and the rules the form and the route
   handler (app/api/tool-lead) both enforce. The report or estimate itself is
   rebuilt on the server from the answers, never taken from the browser.
   ========================================================================== */

import { cleanText, isEmail, isPhone } from "./lead";

export type ToolContact = {
  name: string;
  email: string;
  phone: string;
  zip: string;
  /** "yes" when they ticked the box agreeing to be contacted. */
  consent: string;
};

export type ToolContactField = keyof ToolContact;

/** In the order the form shows them, for focusing the first error. */
export const toolContactFields: ToolContactField[] = ["name", "email", "phone", "zip", "consent"];

export function readToolContact(get: (k: ToolContactField) => unknown): ToolContact {
  return Object.fromEntries(toolContactFields.map((k) => [k, cleanText(get(k))])) as ToolContact;
}

export function validateToolContact(c: ToolContact): Partial<Record<ToolContactField, string>> {
  const errors: Partial<Record<ToolContactField, string>> = {};
  if (c.name.length < 2 || c.name.length > 100) errors.name = "Enter your name.";
  if (!isEmail(c.email) || c.email.length > 254) errors.email = "Enter an email address so we can send it to you.";
  if (!isPhone(c.phone) || c.phone.length > 30) errors.phone = "Enter a phone number, area code first.";
  // A US ZIP (5 digits, or ZIP+4), or a 4-digit postal code.
  if (!/^(\d{4}|\d{5}(-\d{4})?)$/.test(c.zip)) errors.zip = "Enter a 4- or 5-digit ZIP or postal code.";
  if (c.consent !== "yes") errors.consent = "Tick the box to agree before sending.";
  return errors;
}

/** What the route sends back on success. */
export type ToolLeadResult = {
  ok: true;
  /** The quote number printed on the PDF. */
  reference: string;
  /** True only when the email provider accepted the message. */
  emailed: boolean;
  /** The PDF itself, base64, so it can be downloaded straight away. */
  pdf: string;
};
