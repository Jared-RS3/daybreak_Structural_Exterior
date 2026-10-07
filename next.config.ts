import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/** Google Analytics' domains, allowed only when it's switched on (lib/analytics.ts). */
const ga = /^G-[A-Z0-9]{4,}$/.test((process.env.NEXT_PUBLIC_GA_ID ?? "").trim());
const gaScript = ga ? " https://www.googletagmanager.com" : "";
const gaData = ga ? " https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com" : "";
/** Cloudflare Turnstile's script and frame, allowed only when it's switched on (lib/turnstile.ts). */
const turnstile = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "").trim() ? " https://challenges.cloudflare.com" : "";

/**
 * Content Security Policy: the browser only runs scripts, loads styles and
 * fonts, and sends requests to this site. Everything the site uses is
 * self-hosted (fonts via next/font, images, video), so nothing else is
 * needed — except Google Analytics when NEXT_PUBLIC_GA_ID is set, and
 * Cloudflare Turnstile when NEXT_PUBLIC_TURNSTILE_SITE_KEY is, whose domains
 * are added below. If you add a chat widget or an embed, add its
 * domain to the matching line or the browser will block it.
 *
 * 'unsafe-inline' on scripts is what Next needs without per-request nonces
 * (see node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md);
 * the rest of the policy still stops scripts from other sites, framing,
 * plugins and form posts elsewhere. Development adds what hot reload needs.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${gaScript}${turnstile}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data:${gaData}`,
  "font-src 'self'",
  "media-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}${gaData}`,
  `frame-src 'self'${turnstile}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // HTTPS only, for two years, including subdomains.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Older browsers' version of frame-ancestors: no one can frame the site.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework in every response.
  poweredByHeader: false,
  experimental: {
    // Turbopack's build cache (on by default since 16.3) records the env
    // values the build read, and Netlify's secrets scan reads that cache and
    // fails the deploy on AIRTABLE_TOKEN and LEAD_FORM_SECRET. The build is
    // quick enough without it.
    turbopackFileSystemCacheForBuild: false,
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // Form submissions and their answers are never cached anywhere.
      { source: "/api/growth-audit", headers: [{ key: "Cache-Control", value: "no-store" }] },
      { source: "/api/tool-lead", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
  images: {
    // Next 16 made `images.qualities` an allowlist that defaults to [75], and
    // silently coerces anything else to the nearest allowed value. `Img`
    // (components/ui/Img.tsx) asks for 82 — without this every photo on both
    // properties was being served at 75 instead. 92 is the hero photograph
    // alone: it is the LCP image on the agency site and the one place where
    // shingle texture and a graded sky are worth the extra kilobytes.
    qualities: [75, 82, 92],
    // The hero photograph is 1536px wide. Without a 1536 bucket the browser
    // asks for 1920 on a wide screen and Next upscales — a bigger LCP file
    // carrying no extra detail. This adds the bucket the asset actually has.
    deviceSizes: [640, 750, 828, 1080, 1200, 1536, 1920, 2048, 3840],
  },
};

export default nextConfig;
