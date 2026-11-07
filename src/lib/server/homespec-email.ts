import "server-only";
import { legal } from "@/lib/agency";
import { homespec } from "@/lib/demos/homespec";
import { escapeHtml } from "./email";

/* ==========================================================================
   The email a homeowner gets from the HomeSpec concept estimator
   (/demo/homespec). Same job as quote-email.ts, in HomeSpec's look: white
   header with the wordmark, a blue rule, black pill button, blue figures.

   The wordmark is type, not the logo image, so it reads the same with
   images off and before the page's logo is deployed anywhere.
   Tables and inline styles only, 600px wide, as email clients need.
   ========================================================================== */

const ink = "#222222";
const muted = "#5b5f66";
const rule = "#e3e5e8";
const gray = "#f6f6f6";
const blue = "#2A7AF3";
const blueInk = "#1F70E9";
const navy = "#005BAA";
const sans = "Arial,Helvetica,sans-serif";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const e = escapeHtml;

export type HomeSpecEmailInput = {
  name: string;
  zip: string;
  reference: string;
  date: Date;
  low: number;
  high: number;
  lines: { fix: string; size: string; low: number; high: number }[];
};

/** The greeting: a plain first name, or "there" when it isn't one. */
const greet = (name: string) => {
  const first = name.split(" ")[0] ?? "";
  return /^[\p{L}][\p{L}'’-]{0,29}$/u.test(first) ? first : "there";
};

export function homespecEmail(d: HomeSpecEmailInput) {
  const first = greet(d.name);
  const subject = `Your HomeSpec repair estimate: ${usd(d.low)} – ${usd(d.high)}`;
  const preheader = `Ballpark ${usd(d.low)} – ${usd(d.high)}. Your full estimate is attached as a PDF.`;
  const call = `tel:+1${homespec.phone.replace(/\D/g, "").slice(-10)}`;
  const date = d.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const label = (s: string) =>
    `<div style="font-family:${sans};font-size:12px;font-weight:bold;letter-spacing:.08em;text-transform:uppercase;color:${navy}">${e(s)}</div>`;
  const next = [
    "Open the PDF attached to this email: it has your full estimate and reference number.",
    "On HomeSpec's live site, their team would now call to book your free, no-obligation inspection. This is a concept demo, so HomeSpec hasn't received your details: to book a real inspection, call them.",
    "Every home is different, so the inspection gives you the exact price in writing, with lifetime warranties and financing available.",
  ];

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${e(subject)}</title></head>
<body style="margin:0;padding:0;background:${gray}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${e(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${gray}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff">

<tr><td style="height:6px;line-height:6px;font-size:0;background:${blue}">&nbsp;</td></tr>
<tr><td style="padding:22px 28px 18px;border-bottom:1px solid ${rule}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="font-family:${sans};line-height:1">
<div style="font-size:30px;font-weight:900;letter-spacing:-.02em;color:#000">Home<span style="color:${blue}">Spec</span></div>
<div style="font-size:10.5px;font-weight:bold;letter-spacing:.06em;color:#000;margin-top:4px">WATERPROOFING &amp; FOUNDATION REPAIR</div>
</td>
<td align="right" style="font-family:${sans};font-size:12px;color:${muted};vertical-align:top">Ref. ${e(d.reference)}<br>${e(date)}</td>
</tr></table>
</td></tr>

<tr><td style="padding:30px 28px 6px;font-family:${sans};font-size:16px;color:${ink}">Hi ${e(first)},</td></tr>
<tr><td style="padding:10px 28px 26px;font-family:${sans};font-size:15px;line-height:1.55;color:${ink}">Thanks for using our instant estimator. Here's your ballpark for ZIP ${e(d.zip)}, with the full breakdown attached as a PDF.</td></tr>

<tr><td style="padding:0 28px 26px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef4fe;border-left:5px solid ${blue}"><tr><td style="padding:18px 20px">
${label("Your ballpark estimate")}
<div style="font-family:${sans};font-size:36px;line-height:1.1;font-weight:bold;color:${blueInk};margin-top:8px;letter-spacing:-.01em">${usd(d.low)} – ${usd(d.high)}</div>
<div style="font-family:${sans};font-size:13.5px;color:${muted};margin-top:6px">${d.lines.length} repair${d.lines.length === 1 ? "" : "s"}</div>
</td></tr></table>
</td></tr>

<tr><td style="padding:0 28px 26px">
${label("The breakdown")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:6px">${d.lines
    .map(
      (l) => `<tr>
<td style="padding:13px 0;border-bottom:1px solid ${rule};font-family:${sans};font-size:15px;color:${ink};vertical-align:top"><strong>${e(l.fix)}</strong><div style="font-size:13px;color:${muted};margin-top:2px">${e(l.size)}</div></td>
<td align="right" style="padding:13px 0 13px 16px;border-bottom:1px solid ${rule};font-family:${sans};font-size:15px;color:${ink};white-space:nowrap;vertical-align:top">${usd(l.low)} – ${usd(l.high)}</td>
</tr>`,
    )
    .join("")}</table>
</td></tr>

<tr><td style="padding:0 28px 26px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${gray}"><tr><td style="padding:20px 20px 8px">
${label("What happens next")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px">${next
    .map(
      (s, i) => `<tr>
<td width="36" style="vertical-align:top;padding:0 0 12px"><div style="width:26px;height:26px;line-height:26px;border-radius:13px;text-align:center;background:${blueInk};color:#ffffff;font-family:${sans};font-size:13px;font-weight:bold">${i + 1}</div></td>
<td style="vertical-align:top;padding:3px 0 12px;font-family:${sans};font-size:15px;line-height:1.5;color:${ink}">${e(s)}</td>
</tr>`,
    )
    .join("")}</table>
</td></tr></table>
</td></tr>

<tr><td align="center" style="padding:0 28px 30px">
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:#000000;border-radius:999px">
<a href="${e(call)}" style="display:inline-block;padding:15px 32px;font-family:${sans};font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none">Call ${e(homespec.phone)} to Book</a>
</td></tr></table>
</td></tr>

<tr><td style="padding:0 28px 28px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px dashed #c9ced5"><tr><td style="padding:14px 16px;font-family:${sans};font-size:12.5px;line-height:1.55;color:${muted}">
<strong style="color:${ink}">Concept demo.</strong> This email comes from ${e(legal.tradingName)}, which built this estimator for HomeSpec Waterproofing &amp; Foundation Repair and runs the demo. HomeSpec has not received your details, and the prices are samples, not HomeSpec's. Questions about your data, or to have it deleted: <a href="mailto:${e(legal.privacyEmail)}" style="color:${ink}">${e(legal.privacyEmail)}</a>.
</td></tr></table>
</td></tr>

<tr><td style="background:#e5e5e5;padding:16px 28px;font-family:${sans};font-size:12px;line-height:1.6;color:${muted}">
Proudly serving ${e(homespec.areaLine)}<br>
You're getting this because you asked for your estimate. We only email you about it.
</td></tr>

</table>
</td></tr></table>
</body></html>`;

  const text = [
    `Hi ${first},`,
    `Your HomeSpec ballpark estimate for ZIP ${d.zip} is ${usd(d.low)} – ${usd(d.high)}.`,
    d.lines.map((l) => `- ${l.fix} (${l.size}): ${usd(l.low)} – ${usd(l.high)}`).join("\n"),
    `What happens next:\n${next.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
    `To book a real inspection, call HomeSpec at ${homespec.phone}.`,
    `Concept demo: this email comes from ${legal.tradingName}, which built this estimator for HomeSpec and runs the demo. HomeSpec has not received your details, and the prices are samples. Questions about your data, or to have it deleted: ${legal.privacyEmail}.`,
    `Ref. ${d.reference} · ${date}`,
  ].join("\n\n");

  return { subject, html, text };
}
