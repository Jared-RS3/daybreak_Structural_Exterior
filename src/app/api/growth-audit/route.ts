import { NextResponse } from "next/server";
import { normalizeDomain, readLead, validateLead } from "@/lib/lead";
import { airtableConfigured, createAirtableRecord, noFormula } from "@/lib/server/airtable";
import { clientIp, isSameOrigin, rateLimit } from "@/lib/server/rate-limit";

/**
 * Receives free homepage concept requests from the site and writes each one
 * to Airtable (lib/server/airtable.ts). (The path still says growth-audit,
 * from the offer this replaced.)
 *
 * In order, before anything is stored: the request must come from this site,
 * stay under the rate limit, be small JSON, pass the bot checks, and pass the
 * same validation the form runs (lib/lead.ts). Errors the visitor sees never
 * include what went wrong on our side.
 *
 * With Airtable not configured (local development), the lead is written to
 * the server log instead and the visitor still sees success.
 */
const MAX_BODY_BYTES = 8_000;
/** Faster than this from page load to submit is a script, not a person. */
const MIN_FILL_MS = 2_500;

const fail = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail(403, "Forbidden.");

  if (!rateLimit(`lead:${clientIp(request)}`, 5, 10 * 60_000)) {
    return fail(429, "Too many requests. Please wait a few minutes, or email us directly.");
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return fail(415, "Unsupported request.");
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return fail(413, "Request too large.");

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "Malformed request.");
  }

  // Bots: the hidden field only they fill in, or a form sent faster than a
  // person could fill it. Report success so they don't learn to adapt.
  const elapsed = Number(body.elapsed);
  if (String(body.fax ?? "").trim() || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  const l = readLead((k) => body[k]);
  const errors = validateLead(l);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Column names in the Airtable table. Typed answers are guarded against
  // spreadsheet formulas; the one-tap answers come from fixed lists.
  const fields = {
    Company: noFormula(l.company),
    Name: noFormula(l.name),
    Email: l.email,
    Phone: l.phone,
    Area: noFormula(l.area),
    Website: l.domain ? normalizeDomain(l.domain) : null,
    Trade: l.trade,
    "Jobs per month": l.jobs,
    "Average job size": l.jobValue,
    Timeline: l.timeline,
    Offer: "Free homepage concept",
    Page: request.headers.get("referer")?.slice(0, 500) ?? null,
    "Received at": new Date().toISOString(),
  };

  if (!airtableConfigured()) {
    console.warn("[lead] Airtable is not configured — lead captured to log only:", fields);
    return NextResponse.json({ ok: true });
  }

  try {
    await createAirtableRecord(fields);
  } catch (err) {
    // Logged in full so the lead can be recovered by hand.
    console.error("[lead] Airtable write failed", err, fields);
    return fail(502, "We couldn't save that. Please try again, or email us directly.");
  }

  return NextResponse.json({ ok: true });
}
