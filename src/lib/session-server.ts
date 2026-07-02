import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "./session";

/** Redirects to /login when the request has no valid dashboard session. */
export async function requireSession(): Promise<void> {
  const jar = await cookies();
  if (!verifySessionToken(jar.get(SESSION_COOKIE)?.value)) {
    redirect("/login");
  }
}
