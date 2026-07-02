import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "banot-session";
const DEFAULT_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const SESSION_MAX_AGE_S = DEFAULT_MAX_AGE_MS / 1000;

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/** Returns `"<expiryMs>.<hmac>"`, or null if SESSION_SECRET is unset (fail closed). */
export function createSessionToken(now = Date.now(), maxAgeMs = DEFAULT_MAX_AGE_MS): string | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    console.error("[session] SESSION_SECRET is not set — all logins will fail");
    return null;
  }
  const exp = String(now + maxAgeMs);
  return `${exp}.${sign(exp, secret)}`;
}

export function verifySessionToken(token: string | undefined | null, now = Date.now()): boolean {
  const secret = process.env.SESSION_SECRET;
  if (!secret || !token) return false;
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d{13,14}$/.test(exp) || Number(exp) < now) return false;
  const expected = sign(exp, secret);
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
