import { homespecAsk } from "@/lib/demos/homespec";
import { airtableConfigured, updateAirtableRecord } from "@/lib/server/airtable";
import { readBookingToken } from "@/lib/server/form-token";
import { clientIp, isSameOrigin, rateLimit } from "@/lib/server/rate-limit";
import { readCapped } from "@/lib/server/request";
import { NextResponse } from "next/server";

/**
 * The HomeSpec estimator's "Schedule My Free Inspection": after the estimate
 * is saved, the visitor picks the times that suit them and how to confirm.
 * That goes into the same Airtable row's "Booking request" column, so the
 * lead arrives ready to book.
 *
 * The row comes only from the signed token /api/tool-lead handed back with
 * the estimate (lib/server/form-token.ts), never from the browser, so a
 * request can only ever add to its own lead. Asking again replaces the
 * answer. Nothing is emailed and nothing is booked: it's a concept demo,
 * and the page says so.
 */
const TABLE = () => process.env.AIRTABLE_TOOL_TABLE || "Homeowner Leads";

const fail = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail(403, "Forbidden.");
  if (!rateLimit(`tool-booking:${clientIp(request)}`, 10, 10 * 60_000)) {
    return fail(429, "Too many requests. Please wait a few minutes and try again.");
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) return fail(415, "Unsupported request.");
  const raw = await readCapped(request, 2_000);
  if (raw === null) return fail(413, "Request too large.");

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "Malformed request.");
  }

  const lead = readBookingToken(body.booking);
  if (!lead) return fail(400, "This estimate has expired. Refresh the page to start a new one.");

  const allowed: readonly string[] = homespecAsk.times;
  const times = Array.isArray(body.times) ? body.times : [];
  if (!times.length || times.length > allowed.length || !times.every((t) => allowed.includes(t)) || new Set(times).size !== times.length) {
    return NextResponse.json({ ok: false, errors: { times: "Pick at least one time that suits you." } }, { status: 422 });
  }
  const reach = homespecAsk.reach.find((r) => r === body.reach);
  if (!reach) return NextResponse.json({ ok: false, errors: { reach: "Pick how we should confirm." } }, { status: 422 });

  // In the order the page lists them, whatever order they were clicked.
  const when = allowed.filter((t) => times.includes(t)).join(", ");
  const text = `${when} · ${reach} · asked ${new Date().toISOString()}`;

  if (!lead.recordId || !airtableConfigured()) {
    console.warn("[tool-lead/booking] Airtable is not configured — booking request captured to log only:", lead.reference, text);
  } else {
    try {
      await updateAirtableRecord(TABLE(), lead.recordId, { "Booking request": text });
    } catch (err) {
      console.error("[tool-lead/booking] Airtable update failed (is the Booking request column there?)", lead.reference, err);
      return fail(502, "We couldn't save that. Please try again, or call instead.");
    }
  }
  return NextResponse.json({ ok: true, when, reach });
}
