import "server-only";
import { agency } from "@/lib/agency";
import { siteUrl } from "@/lib/seo";
import { escapeHtml } from "./email";
import type { QuoteDoc } from "./quote-pdf";

/* ==========================================================================
   The email that carries the live tools' PDF. Same language as the PDF and
   the site: black header with a sunrise rule, mono labels, hairline tables.

   Email clients ignore <style> blocks and flexbox, so it's tables and inline
   styles throughout, 600px wide, and it reads fine with images off.
   ========================================================================== */

const ink = "#1c1c1c";
const muted = "#68686d";
const rule = "#dcdcdc";
const panel = "#f3f3f4";
const sun = "#fcc600";
const sans = "Helvetica,Arial,sans-serif";
const mono = "'SFMono-Regular',Menlo,Consolas,'Courier New',monospace";

const tones = {
  watch: { bg: "#e3f4ea", fg: "#1d6b3f" },
  inspect: { bg: "#fff4d6", fg: "#8a5a00" },
  soon: { bg: "#fde7e4", fg: "#a8321f" },
};

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const e = escapeHtml;

const label = (s: string) =>
  `<div style="font-family:${mono};font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:${muted}">${e(s)}</div>`;

/** A hairline table of label / detail / amount rows. */
const rows = (items: { label: string; detail?: string; amount: string }[]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${items
    .map(
      (r) => `<tr>
<td style="padding:14px 0;border-bottom:1px solid ${rule};font-family:${sans};font-size:15px;color:${ink};vertical-align:top">
<strong>${e(r.label)}</strong>${r.detail ? `<div style="font-size:13px;color:${muted};margin-top:2px">${e(r.detail)}</div>` : ""}
</td>
<td align="right" style="padding:14px 0 14px 16px;border-bottom:1px solid ${rule};font-family:${mono};font-size:14px;color:${ink};white-space:nowrap;vertical-align:top">${e(r.amount)}</td>
</tr>`,
    )
    .join("")}</table>`;

const steps = (items: string[]) =>
  items
    .map(
      (s, i) => `<tr>
<td width="34" style="vertical-align:top;padding:0 0 12px">
<div style="width:24px;height:24px;line-height:24px;text-align:center;background:${ink};color:${sun};font-family:${mono};font-size:12px;font-weight:bold">${i + 1}</div>
</td>
<td style="vertical-align:top;padding:2px 0 12px;font-family:${sans};font-size:15px;line-height:1.5;color:${ink}">${e(s)}</td>
</tr>`,
    )
    .join("");

export function quoteEmail(doc: QuoteDoc) {
  const first = doc.contact.name.split(" ")[0];
  const isEstimate = doc.kind === "estimate";
  const what = isEstimate ? "estimate" : "report";
  const subject = isEstimate
    ? `Your repair estimate: ${usd(doc.low)} – ${usd(doc.high)}`
    : `Your crack check report: ${doc.level.label}`;
  const preheader = isEstimate
    ? `Ballpark ${usd(doc.low)} – ${usd(doc.high)}. Your full breakdown is attached as a PDF.`
    : `${doc.level.label}. ${doc.level.line}`;
  const replyTo = process.env.EMAIL_REPLY_TO || agency.email;
  const book = `mailto:${replyTo}?subject=${encodeURIComponent(`Book my free inspection (${doc.reference})`)}`;
  const date = doc.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const hero = isEstimate
    ? `${label("Ballpark repair estimate")}
<div style="font-family:${sans};font-size:40px;line-height:1.1;font-weight:bold;color:${ink};margin:10px 0 6px;letter-spacing:-.02em">${usd(doc.low)}<span style="color:${muted};font-weight:normal"> – </span>${usd(doc.high)}</div>
<div style="font-family:${sans};font-size:14px;color:${muted}">For ZIP ${e(doc.contact.zip)}, across ${doc.lines.length} repair${doc.lines.length === 1 ? "" : "s"}.</div>`
    : `${label("Crack check result")}
<div style="margin:12px 0 10px"><span style="display:inline-block;padding:6px 12px;background:${tones[doc.level.id].bg};color:${tones[doc.level.id].fg};font-family:${sans};font-size:18px;font-weight:bold">${e(doc.level.label)}</span></div>
<div style="font-family:${sans};font-size:16px;line-height:1.5;color:${ink}">${e(doc.level.line)}</div>
<div style="font-family:${sans};font-size:14px;line-height:1.5;color:${muted};margin-top:8px">Likely cause: ${e(doc.cause)}</div>`;

  const breakdown = isEstimate
    ? rows(doc.lines.map((l) => ({ label: l.label, detail: l.detail, amount: `${usd(l.low)} – ${usd(l.high)}` })))
    : rows(doc.fixes.map((f) => ({ label: f.label, amount: f.range })));

  const next = [
    `Open the PDF attached to this email: it has the full ${what} and reference ${doc.reference}.`,
    "A specialist will be in touch to book a free, no-obligation inspection.",
    "Soil, access and depth all change the price, so the inspection gives you the real number, in writing.",
  ];

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${e(subject)}</title></head>
<body style="margin:0;padding:0;background:${panel}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${e(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${panel}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff">

<tr><td style="background:${ink};padding:22px 28px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="font-family:${sans};font-size:17px;font-weight:bold;color:#ffffff;letter-spacing:.01em">Daybreak <span style="color:${sun}">Structure-Works</span></td>
<td align="right" style="font-family:${mono};font-size:11px;color:#a5a5aa;letter-spacing:.08em">${e(doc.reference)}</td>
</tr></table>
</td></tr>
<tr><td style="height:4px;line-height:4px;font-size:0;background:${sun};background-image:linear-gradient(90deg,#ff7a1a,${sun} 45%,#ffe27a)">&nbsp;</td></tr>

<tr><td style="padding:32px 28px 8px;font-family:${sans};font-size:15px;color:${ink}">Hi ${e(first)},</td></tr>
<tr><td style="padding:12px 28px 28px">${hero}</td></tr>

<tr><td style="padding:0 28px 28px">
${label(isEstimate ? "The breakdown" : "What fixing it usually costs")}
<div style="height:4px"></div>
${breakdown}
</td></tr>

<tr><td style="padding:0 28px 28px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${panel}"><tr><td style="padding:22px 22px 10px">
${label("What happens next")}
<div style="height:14px"></div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps(next)}</table>
</td></tr></table>
</td></tr>

<tr><td align="center" style="padding:0 28px 32px">
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${sun}">
<a href="${e(book)}" style="display:inline-block;padding:15px 30px;font-family:${sans};font-size:15px;font-weight:bold;color:${ink};text-decoration:none">Book my free inspection &rarr;</a>
</td></tr></table>
</td></tr>

<tr><td style="padding:0 28px 28px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px dashed ${rule}"><tr><td style="padding:16px 18px;font-family:${sans};font-size:13px;line-height:1.55;color:${muted}">
<strong style="color:${ink}">This is a live demo.</strong> It came from a tool on a Daybreak Structure-Works demo site, so the prices are samples. On a contractor's own site, it carries their logo, prices and phone number. <a href="${e(`${siteUrl}/#free-design`)}" style="color:${ink};font-weight:bold">See it for your company &rarr;</a>
</td></tr></table>
</td></tr>

<tr><td style="background:${ink};padding:18px 28px;font-family:${mono};font-size:11px;line-height:1.6;color:#a5a5aa;letter-spacing:.04em">
${e(date)} · Ref ${e(doc.reference)}<br>
You're getting this because you asked for your ${what} on <a href="${e(siteUrl)}" style="color:#ffffff">${e(siteUrl.replace(/^https?:\/\//, ""))}</a>. We only email you about it.
</td></tr>

</table>
</td></tr></table>
</body></html>`;

  const text = [
    `Hi ${first},`,
    isEstimate
      ? `Your ballpark estimate is ${usd(doc.low)} – ${usd(doc.high)}.`
      : `Our read on your crack: ${doc.level.label}. ${doc.level.line}\nLikely cause: ${doc.cause}`,
    isEstimate
      ? doc.lines.map((l) => `- ${l.label}${l.detail ? ` (${l.detail})` : ""}: ${usd(l.low)} – ${usd(l.high)}`).join("\n")
      : doc.fixes.map((f) => `- ${f.label}: ${f.range}`).join("\n"),
    `What happens next:\n${next.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
    `Book your free inspection: reply to this email, or write to ${replyTo}.`,
    "This came from a live tool on a Daybreak Structure-Works demo site, so the prices are samples. On a contractor's own site, it carries their logo, prices and phone number.",
    `Ref ${doc.reference} · ${date}`,
  ].join("\n\n");

  return { subject, html, text };
}
