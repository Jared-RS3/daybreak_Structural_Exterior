/**
 * A per-visitor rate limit on the form endpoints, enforced by Netlify at the
 * edge before a request reaches the site. The routes' own limits
 * (lib/server/rate-limit.ts) live in each server instance's memory, so
 * requests spread across instances can get past them; this one is shared.
 *
 * Generous for a person (a form fetches a token when it appears, then sends
 * once or twice) and far too low to flood anything. Over the limit, Netlify
 * answers 429 itself. The function does nothing else: returning nothing
 * passes the request on to the site.
 *
 * Netlify only; other hosts ignore this folder. Rules in code work on every
 * Netlify plan: https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/
 */
export default async function formRateLimit() {}

export const config = {
  path: ["/api/tool-lead", "/api/growth-audit"],
  rateLimit: {
    windowLimit: 20,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
