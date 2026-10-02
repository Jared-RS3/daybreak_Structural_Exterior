/**
 * Google Analytics, switched by one environment variable.
 *
 * NEXT_PUBLIC_GA_ID is the GA4 measurement ID ("G-XXXXXXXXXX"). It is not a
 * secret — Google's tag puts it in every page — which is why it can carry the
 * NEXT_PUBLIC_ prefix. Next inlines it at build time, so after setting or
 * changing it on the host, redeploy.
 *
 * Everything that depends on analytics reads `analyticsOn` from here, so they
 * can never disagree: the tag and the cookie banner (CookieConsent.tsx), the
 * Content-Security-Policy (next.config.ts reads the same variable), and the
 * privacy policy and PAIA manual, whose wording switches with it. Unset or
 * malformed, the site sets no analytics cookies and the policy says so.
 */
export const gaId = (process.env.NEXT_PUBLIC_GA_ID ?? "").trim();

export const analyticsOn = /^G-[A-Z0-9]{4,}$/.test(gaId);

/** The cookie that remembers the visitor's choice on the banner. */
export const consentCookie = "daybreak_consent";

/** How long that choice is remembered before we ask again. */
export const consentDays = 365;
