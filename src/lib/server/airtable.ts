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
 *
 * The table needs a column for each key in `fields` below, named exactly.
 */
export function airtableConfigured(): boolean {
  return Boolean(process.env.AIRTABLE_TOKEN && process.env.AIRTABLE_BASE_ID);
}

export async function createAirtableRecord(
  fields: Record<string, string | boolean | null>,
): Promise<void> {
  const base = process.env.AIRTABLE_BASE_ID!;
  const table = encodeURIComponent(process.env.AIRTABLE_TABLE || "Leads");
  const res = await fetch(`https://api.airtable.com/v0/${base}/${table}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      "content-type": "application/json",
    },
    // typecast lets a single-select column accept the answer text. Answers
    // are already checked against fixed lists (lib/lead.ts), so this can't be
    // used to create arbitrary options.
    body: JSON.stringify({ records: [{ fields }], typecast: true }),
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) {
    // Airtable's error names the problem (a missing column, a bad token)
    // without echoing the token. It goes to the server log, never the visitor.
    throw new Error(`Airtable responded ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
}

/**
 * Spreadsheet apps run a cell that starts with = + - or @ as a formula when a
 * table is exported to CSV and opened. Prefixing an apostrophe keeps a typed
 * "=HYPERLINK(...)" as plain text. Phone numbers are left alone (+1…).
 */
export function noFormula(v: string): string {
  return /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
}
