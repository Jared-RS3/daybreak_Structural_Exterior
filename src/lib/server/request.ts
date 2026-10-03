import "server-only";

/* Helpers for the routes that take form submissions (growth-audit, tool-lead). */

/**
 * Reads the body, but stops as soon as it passes `max` bytes, so a huge
 * upload is cut off instead of held in memory. Null means too large.
 */
export async function readCapped(
  request: Request,
  max: number,
): Promise<string | null> {
  const declared = Number(request.headers.get("content-length"));
  if (declared > max) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

/**
 * The page the form was sent from, kept only if it really is a page on this
 * site (the Referer header is whatever the sender says). No query string:
 * it can carry tracking ids or someone's details.
 */
export function sourcePage(request: Request): string | null {
  try {
    const ref = new URL(request.headers.get("referer") ?? "");
    const host =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (ref.host !== host || !/^https?:$/.test(ref.protocol)) return null;
    return `${ref.origin}${ref.pathname}`.slice(0, 500);
  } catch {
    return null;
  }
}
