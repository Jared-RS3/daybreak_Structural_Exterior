import { assess, describeAnswers, readCrackAnswers } from "@/lib/crack-check";
import { priceEstimate, readPicks } from "@/lib/estimator";
import { readToolContact, validateToolContact, type ToolLeadResult } from "@/lib/tool-lead";
import {
  airtableConfigured,
  createAirtableRecord,
  noFormula,
  updateAirtableRecord,
  uploadAirtableAttachment,
} from "@/lib/server/airtable";
import { emailConfigured, sendEmail } from "@/lib/server/email";
import { quoteEmail } from "@/lib/server/quote-email";
import { checkFormToken, issueFormToken } from "@/lib/server/form-token";
import { renderQuotePdf, type QuoteDoc } from "@/lib/server/quote-pdf";
import { checkTurnstile } from "@/lib/server/turnstile";
import { clientIp, isSameOrigin, rateLimit } from "@/lib/server/rate-limit";
import { readCapped, sourcePage } from "@/lib/server/request";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * Receives a homeowner's details from the live tools (the house estimator
 * and the crack checker) and, in order:
 *
 *   1. checks the request the same way /api/growth-audit does (this site
 *      only, rate limits, a signed form token, bot checks, validation, and
 *      Cloudflare Turnstile when it's set up);
 *   2. rebuilds the estimate or report from the answers on the server, so
 *      the numbers are always the site's own;
 *   3. draws the PDF (lib/server/quote-pdf.ts), and in development saves a
 *      copy to ./quotes;
 *   4. saves the lead as a row in Airtable. Nothing is emailed for a lead
 *      that wasn't saved;
 *   5. emails the PDF to the homeowner (lib/server/email.ts) while putting
 *      it in the row's "Quote PDF" column, then records whether it went;
 *   6. hands the PDF back, so the visitor can download it there and then.
 *
 * With Airtable not configured (local development), the lead goes to the
 * server log instead, as with the concept form.
 */
const MAX_BODY_BYTES = 8_000;
const MIN_FILL_MS = 2_500;
const TABLE = () => process.env.AIRTABLE_TOOL_TABLE || "Homeowner Leads";
const PDF_FIELD = "Quote PDF";

const fail = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

const tools = { estimate: "House estimator", crack: "Crack checker" } as const;

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/** e.g. DB-261003-4F9A2C: the date, then enough randomness to never repeat. */
const newReference = (d: Date) =>
  `DB-${d.toISOString().slice(2, 10).replace(/-/g, "")}-${randomBytes(3).toString("hex").toUpperCase()}`;

/** The same token the concept form uses; the tools fetch one when they open. */
export function GET(request: Request) {
  if (!isSameOrigin(request)) return fail(403, "Forbidden.");
  if (!rateLimit(`tool-token:${clientIp(request)}`, 30, 10 * 60_000)) return fail(429, "Too many requests.");
  return NextResponse.json({ token: issueFormToken() });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail(403, "Forbidden.");
  if (!rateLimit(`tool-lead:${clientIp(request)}`, 6, 10 * 60_000)) {
    return fail(429, "Too many requests. Please wait a few minutes and try again.");
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) return fail(415, "Unsupported request.");
  const raw = await readCapped(request, MAX_BODY_BYTES);
  if (raw === null) return fail(413, "Request too large.");

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "Malformed request.");
  }

  const token = checkFormToken(body.token, MIN_FILL_MS);
  if (token === "invalid") return fail(400, "This form has expired. Refresh the page and try again.");
  // Bots: report success so they don't learn to adapt. No PDF, no email.
  if (String(body.fax ?? "").trim() || token === "fast") {
    return NextResponse.json({ ok: true, reference: "", emailed: false, pdf: "" } satisfies ToolLeadResult);
  }

  const contact = readToolContact((k) => body[k]);
  const errors = validateToolContact(contact);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  // ---- The answer, rebuilt here from the answers alone ----
  const tool = body.tool === "estimate" || body.tool === "crack" ? body.tool : null;
  if (!tool) return fail(400, "Malformed request.");
  const date = new Date();
  const reference = newReference(date);
  let doc: QuoteDoc;
  let summary: string;
  let extra: Record<string, string | number | null>;
  if (tool === "estimate") {
    const picks = readPicks(body.picks);
    if (!picks) return fail(400, "Pick at least one repair first.");
    const { lines, low, high } = priceEstimate(picks);
    const rows = lines.map((l) => ({
      label: l.item.fix,
      detail: [l.choice, l.item.unit ? `${l.qty.toLocaleString("en-US")} ${l.item.unit}` : ""].filter(Boolean).join(", "),
      low: l.low,
      high: l.high,
    }));
    doc = { kind: "estimate", reference, date, contact, low, high, lines: rows };
    summary = rows.map((r) => `${r.label}${r.detail ? ` (${r.detail})` : ""}: ${usd(r.low)} – ${usd(r.high)}`).join("\n");
    extra = { "Estimate low": low, "Estimate high": high, Severity: null };
  } else {
    const answers = readCrackAnswers(body.answers);
    if (!answers) return fail(400, "Answer the questions first.");
    const { level, cause, fixes } = assess(answers);
    const told = describeAnswers(answers);
    doc = { kind: "crack", reference, date, contact, level, cause, answers: told, fixes };
    summary = [
      ...told.map(([k, v]) => `${k}: ${v}`),
      `Likely cause: ${cause}`,
      ...fixes.map((f) => `${f.label}: ${f.range}`),
    ].join("\n");
    extra = { "Estimate low": null, "Estimate high": null, Severity: level.label };
  }

  // A person solved the check (lib/server/turnstile.ts). Last of the request
  // checks, as it's the only one that calls out; the form resets it on failure.
  if (!(await checkTurnstile(body.turnstile, clientIp(request), "tool-lead"))) {
    return fail(403, "We couldn't confirm you're a person. Please try again.");
  }

  // One address can't be used to send it a stream of emails from our domain.
  if (!rateLimit(`tool-email:${contact.email.toLowerCase()}`, 3, 60 * 60_000)) {
    return fail(429, "We've already sent a few to this address. Check your inbox, or try again in an hour.");
  }
  // However many addresses it comes from, a ceiling far above real use.
  if (!rateLimit("tool-lead:all", 60, 10 * 60_000)) {
    return fail(429, "We're getting a lot of requests right now. Please try again shortly.");
  }

  const pdf = await renderQuotePdf(doc);
  const filename = `${tool === "estimate" ? "Repair-estimate" : "Crack-check"}-${reference}.pdf`;

  // A local copy while developing, so you can open what was sent. Never in
  // production: the server's disk isn't kept, and it holds people's details.
  if (process.env.NODE_ENV !== "production") {
    try {
      const dir = path.join(process.cwd(), "quotes");
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, filename), pdf);
    } catch (err) {
      console.warn("[tool-lead] Couldn't save the local PDF copy", err);
    }
  }

  const fields = {
    Name: noFormula(contact.name),
    Email: contact.email,
    Phone: contact.phone,
    ZIP: contact.zip,
    Tool: tools[tool],
    Reference: reference,
    Summary: summary,
    ...extra,
    "Email status": "Sending",
    Consent: true,
    Status: "New",
    Page: sourcePage(request),
    "Received at": date.toISOString(),
  };

  // ---- 4. Saved first: no email for a lead we didn't keep ----
  let recordId: string | null = null;
  if (airtableConfigured()) {
    try {
      recordId = await createAirtableRecord(fields, TABLE());
    } catch (err) {
      console.error("[tool-lead] Airtable write failed", err, fields);
      return fail(502, "We couldn't save that. Please try again.");
    }
  } else {
    console.warn("[tool-lead] Airtable is not configured — lead captured to log only:", fields);
  }

  // ---- 5. The email, alongside the PDF upload to the row ----
  // Neither waits on the other, so the visitor waits for the slower of the two.
  const upload = recordId
    ? uploadAirtableAttachment(recordId, PDF_FIELD, { bytes: pdf, filename, contentType: "application/pdf" }).catch(
        // The lead is saved; the PDF can be made again from the row's answers.
        (err) => console.error("[tool-lead] PDF upload to Airtable failed", reference, err),
      )
    : null;
  let emailed = false;
  let status = "Not set up";
  if (emailConfigured()) {
    try {
      await sendEmail({ to: contact.email, ...quoteEmail(doc), attachments: [{ filename, bytes: pdf }] });
      emailed = true;
      status = "Sent";
    } catch (err) {
      console.error("[tool-lead] Email failed", reference, err);
      status = "Failed";
    }
  }
  if (recordId) {
    await Promise.all([
      upload,
      updateAirtableRecord(TABLE(), recordId, { "Email status": status }).catch((err) =>
        console.error("[tool-lead] Couldn't record the email status", reference, err),
      ),
    ]);
  }

  return NextResponse.json({
    ok: true,
    reference,
    emailed,
    pdf: Buffer.from(pdf).toString("base64"),
  } satisfies ToolLeadResult);
}
