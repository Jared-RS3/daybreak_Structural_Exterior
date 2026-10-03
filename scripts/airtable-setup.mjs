/**
 * Creates the "Homeowner Leads" table the live tools write to
 * (app/api/tool-lead), in the base named by AIRTABLE_BASE_ID in .env, with
 * every column the route sends, named and typed exactly.
 *
 * The site's own token can only write rows, so this uses a separate one:
 *   1. https://airtable.com/create/tokens → scopes schema.bases:read and
 *      schema.bases:write, access: this base only.
 *   2. AIRTABLE_SETUP_TOKEN=pat... node scripts/airtable-setup.mjs
 *   3. Delete that token afterwards. The site never needs it.
 *
 * Safe to run twice: it stops if the table already exists.
 */
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split("\n")
    .map((l) => l.match(/^([A-Z_]+)=(.*)$/))
    .filter(Boolean)
    .map(([, k, v]) => [k, v.trim().replace(/^"|"$/g, "")]),
);
const token = process.env.AIRTABLE_SETUP_TOKEN;
const base = process.env.AIRTABLE_BASE_ID || env.AIRTABLE_BASE_ID;
const name = process.env.AIRTABLE_TOOL_TABLE || env.AIRTABLE_TOOL_TABLE || "Homeowner Leads";
if (!token || !base) {
  console.error("Set AIRTABLE_SETUP_TOKEN (and AIRTABLE_BASE_ID in .env). See the top of this file.");
  process.exit(1);
}

const select = (...names) => ({ type: "singleSelect", options: { choices: names.map((n) => ({ name: n })) } });
const money = { type: "currency", options: { precision: 0, symbol: "$" } };

// Order matters: the first column is the table's primary field.
const fields = [
  { name: "Name", type: "singleLineText" },
  { name: "Email", type: "email" },
  { name: "Phone", type: "phoneNumber" },
  { name: "ZIP", type: "singleLineText" },
  { name: "Tool", ...select("House estimator", "Crack checker") },
  { name: "Status", ...select("New", "Contacted", "Inspection booked", "Won", "Lost") },
  { name: "Estimate low", ...money },
  { name: "Estimate high", ...money },
  { name: "Severity", ...select("Keep an eye on it", "Worth an inspection", "Book an inspection soon") },
  { name: "Summary", type: "multilineText" },
  { name: "Quote PDF", type: "multipleAttachments" },
  { name: "Reference", type: "singleLineText" },
  { name: "Email status", ...select("Sending", "Sent", "Failed", "Not set up") },
  { name: "Consent", type: "checkbox", options: { icon: "check", color: "greenBright" } },
  { name: "Page", type: "url" },
  {
    name: "Received at",
    type: "dateTime",
    options: { dateFormat: { name: "us" }, timeFormat: { name: "12hour" }, timeZone: "America/Chicago" },
  },
];

const api = async (path, init = {}) => {
  const res = await fetch(`https://api.airtable.com/v0/meta/bases/${base}${path}`, {
    ...init,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${JSON.stringify(body)}`);
  return body;
};

const { tables } = await api("/tables");
if (tables.some((t) => t.name === name)) {
  console.log(`"${name}" already exists in ${base}. Nothing to do.`);
  process.exit(0);
}
const made = await api("/tables", {
  method: "POST",
  body: JSON.stringify({
    name,
    description: "Homeowners who used the crack checker or house estimator. Written by the website; the PDF is the one they were emailed.",
    fields,
  }),
});
console.log(`Created "${made.name}" (${made.id}) with ${made.fields.length} columns in ${base}.`);
console.log("You can delete the setup token now.");
