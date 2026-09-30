import { NextResponse } from "next/server";
import { isEmail, jobVolumes, normalizeDomain, type LeadRequest } from "@/lib/lead";

/**
 * Receives free homepage design requests from the site. (The path still says
 * growth-audit, from the offer this replaced, so existing webhook set-ups
 * keep working.)
 *
 * PROTOTYPE — this validates and normalizes the request, then forwards it to
 * whatever URL is in DAYBREAK_LEAD_WEBHOOK (a CRM inbound hook, Zapier, an
 * email relay). With no webhook configured it writes the lead to the server
 * log and still reports success, because the submission is genuinely captured
 * there. Before this site handles real traffic, set DAYBREAK_LEAD_WEBHOOK or
 * replace the forward below with a direct CRM client — a lead that only exists
 * in a log line is a lead nobody is going to call.
 */
export async function POST(request: Request) {
  let body: Partial<LeadRequest>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const rawDomain = (body.domain ?? "").trim();
  const domain = rawDomain ? normalizeDomain(rawDomain) : null;
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const company = (body.company ?? "").trim();
  const jobs = (jobVolumes as readonly string[]).includes(body.jobs ?? "") ? body.jobs! : null;

  const errors: Record<string, string> = {};
  if (company.length < 2) errors.company = "Enter your company name.";
  if (rawDomain && !domain) errors.domain = "Enter a website address, like yourfoundationcompany.com";
  if (name.length < 2) errors.name = "Enter your name.";
  if (!isEmail(email)) errors.email = "Enter an email address we can send your design to.";

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const lead = {
    offer: "free-homepage-design",
    company,
    domain,
    name,
    email,
    phone: phone || null,
    jobsPerMonth: jobs,
    receivedAt: new Date().toISOString(),
    source: request.headers.get("referer") ?? null,
  };

  const webhook = process.env.DAYBREAK_LEAD_WEBHOOK;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("[lead] webhook delivery failed", err, lead);
      return NextResponse.json(
        { ok: false, error: "We could not record that. Please email us directly." },
        { status: 502 },
      );
    }
  } else {
    console.warn(
      "[lead] DAYBREAK_LEAD_WEBHOOK is not set — lead captured to log only:",
      lead,
    );
  }

  return NextResponse.json({ ok: true });
}
