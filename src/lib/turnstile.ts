/**
 * Cloudflare Turnstile, the "are you a person?" check on the site's forms,
 * switched on by two environment variables (see .env.example).
 *
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY is public by design: Cloudflare's widget
 * puts it in every page. Next inlines it at build time, so redeploy after
 * setting it. TURNSTILE_SECRET_KEY stays on the server
 * (lib/server/turnstile.ts).
 *
 * Everything that depends on it reads `turnstileOn` from here, so they can't
 * disagree: the widget (components/ui/Turnstile.tsx), the routes that verify
 * it, the Content-Security-Policy (next.config.ts reads the same variable),
 * and the privacy policy's wording.
 */
export const turnstileSiteKey = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "").trim();

export const turnstileOn = turnstileSiteKey.length > 0;
