"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "crypto";
import { SESSION_COOKIE, SESSION_MAX_AGE_S, createSessionToken } from "@/lib/session";

function passwordsMatch(input: string, expected: string) {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.DASHBOARD_PASSWORD;
  const ok = Boolean(expected) && passwordsMatch(password, expected!);
  const token = ok ? createSessionToken() : null;

  if (!token) {
    await new Promise((r) => setTimeout(r, 500));
    redirect("/login?error=1");
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_S,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/login");
}
