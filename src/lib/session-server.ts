import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./session";

/** Throws when the request has no valid dashboard session. */
export async function requireSession(): Promise<void> {
  const jar = await cookies();
  if (!verifySessionToken(jar.get(SESSION_COOKIE)?.value)) {
    throw new Error("Unauthorized");
  }
}
