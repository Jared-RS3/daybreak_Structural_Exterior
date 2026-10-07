import "server-only";
import { turnstileOn } from "@/lib/turnstile";

/**
 * Checks a form's Turnstile token with Cloudflare. Each token works once and
 * only for the action it was issued for, so a solved check can't be replayed
 * or carried from one form to the other.
 *
 * Off (always passes) until both keys are set: the site key alone would show
 * a check nothing verifies, the secret alone would refuse every form. In
 * production a missing half is logged, once.
 *
 * If Cloudflare can't be reached the check fails: the visitor is told to try
 * again, rather than the forms quietly opening up to bots.
 */
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const secret = () => (process.env.TURNSTILE_SECRET_KEY ?? "").trim();

let warned = false;

export function turnstileActive(): boolean {
  const on = turnstileOn && secret().length > 0;
  if (!on && !warned && process.env.NODE_ENV === "production" && (turnstileOn || secret())) {
    warned = true;
    console.warn(
      "[turnstile] Only one of NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY is set; the check is off until both are.",
    );
  }
  return on;
}

export async function checkTurnstile(token: unknown, ip: string, action: string): Promise<boolean> {
  if (!turnstileActive()) return true;
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body: new URLSearchParams({
        secret: secret(),
        response: token,
        ...(ip !== "unknown" ? { remoteip: ip } : {}),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    const json = (await res.json()) as {
      success?: boolean;
      action?: string;
      metadata?: { result_with_testing_key?: boolean };
    };
    // Cloudflare's testing keys (for local development) report no action.
    const testing = json.metadata?.result_with_testing_key === true;
    return json.success === true && (json.action === action || testing);
  } catch (err) {
    console.error("[turnstile] Verification request failed", err);
    return false;
  }
}
