import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import "server-only";

/**
 * A signed timestamp the form fetches when it appears and sends back with the
 * lead. The server signed it, so a script can't claim it waited: the fill time
 * is measured from when we issued the token, not from a number the browser
 * reports. It's stateless, so it works across serverless instances.
 *
 * Signed with LEAD_FORM_SECRET, or failing that the Airtable token (HMAC
 * output reveals nothing about its key). Local development without either
 * uses a fixed key; leads there only go to the server log anyway.
 *
 * A LEAD_FORM_SECRET shorter than MIN_SECRET_LENGTH is ignored: a short
 * value like "test" lets anyone forge tokens, and Netlify's secret scanner
 * matches it all over the bundle and fails the deploy.
 */
const MAX_AGE_MS = 12 * 60 * 60_000;
const MIN_SECRET_LENGTH = 32;

let warnedWeakSecret = false;

const formSecret = () => {
  const secret = process.env.LEAD_FORM_SECRET;
  if (!secret) return undefined;
  if (secret.length >= MIN_SECRET_LENGTH) return secret;
  if (!warnedWeakSecret) {
    warnedWeakSecret = true;
    console.warn(
      `LEAD_FORM_SECRET is shorter than ${MIN_SECRET_LENGTH} characters and is being ignored. Generate one with: openssl rand -base64 32`,
    );
  }
  return undefined;
};

const key = () =>
  formSecret() || process.env.AIRTABLE_TOKEN || "development-only";

const sign = (payload: string) =>
  createHmac("sha256", key())
    .update(`lead-form:${payload}`)
    .digest("base64url");

export function issueFormToken(): string {
  const payload = `${Date.now()}.${randomBytes(9).toString("base64url")}`;
  return `${payload}.${sign(payload)}`;
}

/**
 * "ok", "fast" (genuine, but sent sooner than a person could fill the form),
 * or "invalid" (missing, forged, or older than MAX_AGE_MS).
 */
export function checkFormToken(
  token: unknown,
  minFillMs: number,
): "ok" | "fast" | "invalid" {
  if (typeof token !== "string" || token.length > 200) return "invalid";
  const cut = token.lastIndexOf(".");
  if (cut < 0) return "invalid";
  const payload = token.slice(0, cut);
  const given = Buffer.from(token.slice(cut + 1));
  const expected = Buffer.from(sign(payload));
  if (given.length !== expected.length || !timingSafeEqual(given, expected))
    return "invalid";

  const age = Date.now() - Number(payload.split(".")[0]);
  if (!Number.isFinite(age) || age < 0 || age > MAX_AGE_MS) return "invalid";
  return age < minFillMs ? "fast" : "ok";
}
