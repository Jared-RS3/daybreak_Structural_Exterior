import "server-only";

/**
 * Sends an email through Resend's HTTP API (resend.com), with attachments.
 * Server-only, like the Airtable token.
 *
 * Environment:
 *   RESEND_API_KEY   an API key with "Sending access" only
 *   EMAIL_FROM       who it's from, e.g.
 *                    "Daybreak Structure-Works <quotes@daybreakstructureworks.com>".
 *                    The domain has to be verified in Resend first (three DNS
 *                    records). Until it is, Resend only delivers to the
 *                    address that owns the Resend account.
 *   EMAIL_REPLY_TO   optional: where replies go
 */
export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail(message: {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: { filename: string; bytes: Uint8Array }[];
}): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [message.to],
      ...(process.env.EMAIL_REPLY_TO ? { reply_to: process.env.EMAIL_REPLY_TO } : {}),
      subject: message.subject,
      html: message.html,
      text: message.text,
      attachments: message.attachments?.map((a) => ({
        filename: a.filename,
        content: Buffer.from(a.bytes).toString("base64"),
      })),
    }),
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
}

/** For putting a visitor's own words into an HTML email. */
export function escapeHtml(v: string): string {
  return v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
