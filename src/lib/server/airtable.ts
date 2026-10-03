import "server-only";

/**
 * Writes a lead into Airtable as a new row. Server-only: the token never
 * reaches the browser, and the browser never talks to Airtable directly.
 *
 * Environment (set in the host's dashboard and in .env.local, never in code):
 *   AIRTABLE_TOKEN    a personal access token with only the
 *                     `data.records:write` scope, on only this base
 *   AIRTABLE_BASE_ID  the base, "app…"
 *   AIRTABLE_TABLE    the table name or id (defaults to "Leads")
 *   AIRTABLE_TOOL_TABLE  the live tools' homeowner leads (defaults to
 *                     "Homeowner Leads"; see app/api/tool-lead)
 *
 * The table needs a column for each key in `fields` below, named exactly.
 */
export function airtableConfigured(): boolean {
  return Boolean(process.env.AIRTABLE_TOKEN && process.env.AIRTABLE_BASE_ID);
}

type Fields = Record<string, string | number | boolean | null>;

const headers = () => ({
  authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
  "content-type": "application/json",
});

const tableUrl = (table: string) =>
  `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(table)}`;

/**
 * Airtable's error names the problem (a missing column, a bad token) without
 * echoing the token. It goes to the server log, never the visitor.
 */
async function check(res: Response): Promise<Response> {
  if (!res.ok) throw new Error(`Airtable responded ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res;
}

/**
 * Adds a row and returns its record id. `table` defaults to AIRTABLE_TABLE
 * (the contractor leads); the live tools pass their own.
 */
export async function createAirtableRecord(
  fields: Fields,
  table = process.env.AIRTABLE_TABLE || "Leads",
): Promise<string> {
  const res = await fetch(tableUrl(table), {
    method: "POST",
    headers: headers(),
    // typecast lets a single-select column accept the answer text. Answers
    // are already checked against fixed lists (lib/lead.ts), so this can't be
    // used to create arbitrary options.
    body: JSON.stringify({ records: [{ fields }], typecast: true }),
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  }).then(check);
  const json = (await res.json()) as { records: { id: string }[] };
  return json.records[0].id;
}

/** Changes some cells on a row made by createAirtableRecord. */
export async function updateAirtableRecord(table: string, id: string, fields: Fields): Promise<void> {
  await fetch(tableUrl(table), {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ records: [{ id, fields }], typecast: true }),
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  }).then(check);
}

/**
 * Puts a file straight into an attachment column, without hosting it
 * anywhere first (Airtable's upload endpoint, files up to 5 MB). Needs only
 * the data.records:write scope the token already has.
 */
export async function uploadAirtableAttachment(
  id: string,
  field: string,
  file: { bytes: Uint8Array; filename: string; contentType: string },
): Promise<void> {
  const base = process.env.AIRTABLE_BASE_ID;
  await fetch(`https://content.airtable.com/v0/${base}/${id}/${encodeURIComponent(field)}/uploadAttachment`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      contentType: file.contentType,
      filename: file.filename,
      file: Buffer.from(file.bytes).toString("base64"),
    }),
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  }).then(check);
}

/**
 * Spreadsheet apps run a cell that starts with = + - or @ as a formula when a
 * table is exported to CSV and opened. Prefixing an apostrophe keeps a typed
 * "=HYPERLINK(...)" as plain text. Phone numbers are left alone (+1…).
 */
export function noFormula(v: string): string {
  return /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
}
