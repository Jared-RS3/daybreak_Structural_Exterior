import { normalizeDomain, readLead, validateLead } from "@/lib/lead";
import {
  airtableConfigured,
  createAirtableRecord,
  noFormula,
} from "@/lib/server/airtable";
import { checkFormToken, issueFormToken } from "@/lib/server/form-token";
import { clientIp, isSameOrigin, rateLimit } from "@/lib/server/rate-limit";
import { checkTurnstile } from "@/lib/server/turnstile";
import { readCapped, sourcePage } from "@/lib/server/request";
import { NextResponse } from "next/server";

/**
 * Receives free homepage concept requests from the site and writes each one
 * to Airtable (lib/server/airtable.ts). (The path still says growth-audit,
 * from the offer this replaced.)
 *
 * In order, before anything is stored: the request must come from this site,
 * stay under the rate limit, be small JSON, carry a form token we signed
 * (GET below), pass the bot checks, pass the same validation the form runs
 * (lib/lead.ts), and fit under a site-wide ceiling that keeps a flood from
 * filling the Airtable base. Errors the visitor sees never include what went
 * wrong on our side.
 *
 * With Airtable not configured (local development), the lead is written to
 * the server log instead and the visitor still sees success.
 */
const MAX_BODY_BYTES = 8_000;
/** Faster than this from page load to submit is a script, not a person. */
const MIN_FILL_MS = 2_500;

const fail = (status: number, error: string) =>
  NextResponse.json({ ok: false, error }, { status });

/** Hands the form a fresh signed token when it appears (lib/server/form-token.ts). */
export function GET(request: Request) {
  if (!isSameOrigin(request)) return fail(403, "Forbidden.");
  if (!rateLimit(`lead-token:${clientIp(request)}`, 30, 10 * 60_000)) {
    return fail(429, "Too many requests.");
  }
  return NextResponse.json({ token: issueFormToken() });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail(403, "Forbidden.");

  if (!rateLimit(`lead:${clientIp(request)}`, 5, 10 * 60_000)) {
    return fail(
      429,
      "Too many requests. Please wait a few minutes, or email us directly.",
    );
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return fail(415, "Unsupported request.");
  }
  const raw = await readCapped(request, MAX_BODY_BYTES);
  if (raw === null) return fail(413, "Request too large.");

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "Malformed request.");
  }

  // No token, a forged one or an expired one: say so, since a person with a
  // tab left open overnight can fix it by refreshing.
  const token = checkFormToken(body.token, MIN_FILL_MS);
  if (token === "invalid") {
    return fail(400, "This form has expired. Refresh the page and try again.");
  }

  // Bots: the hidden field only they fill in, or a form sent faster than a
  // person could fill it. Report success so they don't learn to adapt.
  if (String(body.fax ?? "").trim() || token === "fast") {
    return NextResponse.json({ ok: true });
  }

  const l = readLead((k) => body[k]);
  const errors = validateLead(l);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // A person solved the check (lib/server/turnstile.ts), when it's set up.
  if (!(await checkTurnstile(body.turnstile, clientIp(request), "growth-audit"))) {
    return fail(403, "We couldn't confirm you're a person. Please try again.");
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
    // Only sent with "Other", so leads without it don't need the column.
    ...(l.trade === "Other" && l.services
      ? { Services: noFormula(l.services) }
      : {}),
    // Optional questions: empty cells rather than blank options when skipped.
    "Jobs per month": l.jobs || null,
    "Average job size": l.jobValue || null,
    Timeline: l.timeline || null,
    // A checkbox column. Validation above already refuses a lead without the
    // box ticked, so every saved lead carries its agreement, and "Received
    // at" records when it was given (POPIA puts the proof of consent on us).
    "POPIA Agreement": l.consent === "yes",
    Offer: "Free web concept",
    Page: sourcePage(request),
    "Received at": new Date().toISOString(),
  };

  // However many addresses it comes from, this instance writes at most this
  // many leads in ten minutes. Far above real demand; it caps a flood.
  if (!rateLimit("lead:all", 30, 10 * 60_000)) {
    console.error("[lead] Site-wide limit reached — lead not saved:", fields);
    return fail(
      429,
      "We're getting a lot of requests right now. Please email us directly.",
    );
  }

  if (!airtableConfigured()) {
    console.warn(
      "[lead] Airtable is not configured — lead captured to log only:",
      fields,
    );
    return NextResponse.json({ ok: true });
  }

  try {
    await createAirtableRecord(fields);
  } catch (err) {
    // Logged in full so the lead can be recovered by hand.
    console.error("[lead] Airtable write failed", err, fields);
    return fail(
      502,
      "We couldn't save that. Please try again, or email us directly.",
    );
  }

  return NextResponse.json({ ok: true });
}
