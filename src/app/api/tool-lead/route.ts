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
import { homespecEmail } from "@/lib/server/homespec-email";
import { quoteEmail } from "@/lib/server/quote-email";
import { createHomeSpecPdf } from "@/lib/demos/homespec-pdf";
import { homespecAsk, homespecItems } from "@/lib/demos/homespec";
import { homespecLogoPng } from "@/lib/demos/homespec-logo";
import { PHOTO_BODY_BYTES } from "@/lib/lead-photos";
import { readPhotos, type LeadPhoto } from "@/lib/server/lead-photos";
import { checkFormToken, issueBookingToken, issueFormToken } from "@/lib/server/form-token";
import { renderQuotePdf, type QuoteDoc } from "@/lib/server/quote-pdf";
import { checkTurnstile } from "@/lib/server/turnstile";
import { clientIp, isSameOrigin, rateLimit } from "@/lib/server/rate-limit";
import { readCapped, sourcePage } from "@/lib/server/request";
import { cleanText } from "@/lib/lead";
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
 *
 * `brand: "homespec"` comes from the HomeSpec concept page (/demo/homespec).
 * Same checks, same table, same email account; the estimate is told in
 * HomeSpec's words (lib/demos/homespec.ts), the reference starts HS-, and the
 * PDF and email wear HomeSpec's look. Prices are the same sample figures.
 *
 * The HomeSpec estimator can also send photos of the problems (up to six,
 * shrunk in the browser: lib/lead-photos.ts). They go into the row's
 * "Photos" column, named after the reference and the repair they show, and
 * on a second page of the PDF. Its requests may be that much larger;
 * everyone else's stay small. It also sends whether the problem is urgent
 * and an optional note, and gets back a signed token for asking for the
 * inspection afterwards (app/api/tool-lead/booking).
 *
 * Columns added after the table was first made (Urgent, Notes) are written
 * in a second, separate update, so a base that doesn't have them yet still
 * keeps the lead. The Summary carries the same facts either way.
 */
const MAX_BODY_BYTES = 8_000;
const MIN_FILL_MS = 2_500;
const TABLE = () => process.env.AIRTABLE_TOOL_TABLE || "Homeowner Leads";
const PDF_FIELD = "Quote PDF";
const PHOTO_FIELD = "Photos";

const fail = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

const tools = { estimate: "House estimator", crack: "Crack checker" } as const;

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/** e.g. DB-261003-4F9A2C: the brand, the date, then enough randomness to never repeat. */
const newReference = (d: Date, prefix = "DB") =>
  `${prefix}-${d.toISOString().slice(2, 10).replace(/-/g, "")}-${randomBytes(3).toString("hex").toUpperCase()}`;

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
  const raw = await readCapped(request, PHOTO_BODY_BYTES);
  if (raw === null) return fail(413, "Those photos are too large to send. Remove one and try again.");

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
    return NextResponse.json({ ok: true, reference: "", emailed: false, pdf: "", photos: 0 } satisfies ToolLeadResult);
  }

  const contact = readToolContact((k) => body[k]);
  const errors = validateToolContact(contact);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  // ---- The answer, rebuilt here from the answers alone ----
  const tool = body.tool === "estimate" || body.tool === "crack" ? body.tool : null;
  if (!tool) return fail(400, "Malformed request.");
  const homespec = body.brand === "homespec";
  // Only the HomeSpec estimator sends photos; any other request stays small.
  if (!homespec && Buffer.byteLength(raw) > MAX_BODY_BYTES) return fail(413, "Request too large.");
  // The HomeSpec page only has the estimator, and only HomeSpec's services.
  if (homespec && tool !== "estimate") return fail(400, "Malformed request.");
  // The name goes into an email to whatever address was typed: no links in
  // it, so the form can't be used to mail someone a URL in HomeSpec's name.
  if (homespec && /:\/\/|www\.|@|\.(com|net|org|io|co|ru|xyz|info|biz|link|top)\b/i.test(contact.name)) {
    return NextResponse.json({ ok: false, errors: { name: "Enter your name." } }, { status: 422 });
  }
  const date = new Date();
  const reference = newReference(date, homespec ? "HS" : "DB");
  let doc: QuoteDoc;
  let summary: string;
  let extra: Record<string, string | number | null>;
  let photos: LeadPhoto[] = [];
  // HomeSpec's details form: "is it urgent?" and "anything else?".
  const urgent = homespec && body.urgent === true;
  const notes = homespec ? cleanText(body.notes).slice(0, homespecAsk.notesMax) : "";
  if (tool === "estimate") {
    const picks = readPicks(body.picks);
    if (!picks) return fail(400, "Pick at least one repair first.");
    if (homespec && !picks.every((p) => Object.hasOwn(homespecItems, p.id))) return fail(400, "Pick at least one repair first.");
    if (homespec) {
      const checked = readPhotos(body.photos, picks.map((p) => p.id));
      if (!checked) return fail(400, "One of your photos couldn't be sent. Remove it and try again.");
      photos = checked;
    }
    const { lines, low, high } = priceEstimate(picks);
    const rows = lines.map((l) => {
      const item = homespec ? homespecItems[l.item.id] : l.item;
      return {
        id: l.item.id,
        label: item.fix,
        detail: [l.choice, item.unit ? `${l.qty.toLocaleString("en-US")} ${item.unit}` : homespec ? "Complete install" : ""].filter(Boolean).join(", "),
        low: l.low,
        high: l.high,
      };
    });
    doc = { kind: "estimate", reference, date, contact, low, high, lines: rows };
    const shots = (id: string) => {
      const n = photos.filter((p) => p.item === id).length;
      return n ? ` · ${n} photo${n === 1 ? "" : "s"}` : "";
    };
    summary = [
      ...(urgent ? ["URGENT: water is coming in now, or it's getting worse fast"] : []),
      ...(homespec ? ["HomeSpec demo (/demo/homespec)"] : []),
      ...rows.map((r) => `${r.label}${r.detail ? ` (${r.detail})` : ""}: ${usd(r.low)} – ${usd(r.high)}${shots(r.id)}`),
      ...(notes ? [`Notes: ${notes}`] : []),
    ].join("\n");
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

  const pdf =
    homespec && doc.kind === "estimate"
      ? await createHomeSpecPdf({
          name: contact.name,
          zip: contact.zip,
          phone: contact.phone,
          email: contact.email,
          reference,
          date,
          low: doc.low,
          high: doc.high,
          lines: doc.lines.map((l) => ({ fix: l.label, size: l.detail, low: l.low, high: l.high })),
          logo: Buffer.from(homespecLogoPng, "base64"),
          photos: photos.map((p) => ({ fix: homespecItems[p.item].fix, bytes: p.bytes })),
        })
      : await renderQuotePdf(doc);
  const filename = homespec
    ? `HomeSpec-estimate-${reference}.pdf`
    : `${tool === "estimate" ? "Repair-estimate" : "Crack-check"}-${reference}.pdf`;
  // e.g. HS-261117-4F9A2C-sump-pump-1.jpg: whose, and which repair it shows.
  const photoFiles = photos.map((p, i) => ({
    ...p,
    filename: `${reference}-${p.item}-${photos.slice(0, i + 1).filter((x) => x.item === p.item).length}.jpg`,
  }));

  // A local copy while developing, so you can open what was sent. Never in
  // production: the server's disk isn't kept, and it holds people's details.
  if (process.env.NODE_ENV !== "production") {
    try {
      const dir = path.join(process.cwd(), "quotes");
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, filename), pdf);
      for (const p of photoFiles) await writeFile(path.join(dir, p.filename), p.bytes);
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
  // One at a time, so they stay inside Airtable's five requests a second
  // alongside the PDF. The first failure (most likely a missing "Photos"
  // column) stops the rest; the visitor is told how many were kept.
  const keepPhotos = async () => {
    if (!recordId) return photoFiles.length;
    let kept = 0;
    for (const p of photoFiles) {
      try {
        await uploadAirtableAttachment(recordId, PHOTO_FIELD, { bytes: p.bytes, filename: p.filename, contentType: "image/jpeg" });
        kept++;
      } catch (err) {
        console.error("[tool-lead] Photo upload to Airtable failed", reference, err);
        break;
      }
    }
    return kept;
  };
  const photosKept = photoFiles.length ? keepPhotos() : Promise.resolve(0);
  let emailed = false;
  let status = "Not set up";
  if (emailConfigured()) {
    try {
      const message =
        homespec && doc.kind === "estimate"
          ? {
              ...homespecEmail({
                name: contact.name,
                zip: contact.zip,
                reference,
                date,
                low: doc.low,
                high: doc.high,
                lines: doc.lines.map((l) => ({ fix: l.label, size: l.detail, low: l.low, high: l.high })),
                photos: photos.length,
              }),
              fromName: "HomeSpec Estimates (Daybreak demo)",
            }
          : quoteEmail(doc);
      await sendEmail({ to: contact.email, ...message, attachments: [{ filename, bytes: pdf }] });
      emailed = true;
      status = "Sent";
    } catch (err) {
      console.error("[tool-lead] Email failed", reference, err);
      status = "Failed";
    }
  }
  const kept = await photosKept;
  if (recordId) {
    await Promise.all([
      upload,
      // Their own update: a base without these columns yet still keeps the lead.
      homespec
        ? updateAirtableRecord(TABLE(), recordId, { Urgent: urgent, Notes: notes ? noFormula(notes) : null }).catch((err) =>
            console.error("[tool-lead] Couldn't record urgency and notes (are the Urgent and Notes columns there?)", reference, err),
          )
        : null,
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
    photos: kept,
    ...(homespec ? { booking: issueBookingToken(recordId, reference) } : {}),
  } satisfies ToolLeadResult);
}
