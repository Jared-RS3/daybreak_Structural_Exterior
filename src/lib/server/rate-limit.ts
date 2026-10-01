import "server-only";

/**
 * A fixed-window rate limit kept in memory, keyed by whatever the caller
 * passes (usually route + IP). It's a first line of defence: on serverless
 * hosting each instance keeps its own counts, so a determined attacker spread
 * across instances gets through more. For hard limits, put the host's
 * firewall rate limiting (Vercel WAF, Cloudflare) in front as well.
 */
const windows = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  // Drop expired windows now and then, so the map can't grow without bound.
  if (windows.size > 5000) {
    for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
  }
  const w = windows.get(key);
  if (!w || w.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  w.count += 1;
  return w.count <= limit;
}

/**
 * The visitor's IP as the host's proxy reports it. x-real-ip first: Vercel
 * and most proxies set it themselves, whereas the first x-forwarded-for entry
 * can be whatever the client sent when a host only appends to it.
 */
export function clientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

/**
 * True when a browser request came from a page on this site. Browsers always
 * send Origin on a cross-site POST, so another site can't submit the form on
 * a visitor's behalf; tools that send no Origin at all still face the rate
 * limit and validation.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
