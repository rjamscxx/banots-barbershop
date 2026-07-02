import { put } from "@vercel/blob";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return NextResponse.json({ error: "No file" }, { status: 400 });
  const BLOCKED_TYPES = ["image/svg+xml", "image/svg", "image/xml"];
  if (BLOCKED_TYPES.includes(file.type) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 5 MB" }, { status: 413 });
  }

  const type = request.nextUrl.searchParams.get("type");
  const method = request.nextUrl.searchParams.get("method");

  if (type === "qr" && method) {
    // Dashboard-only: replacing the shop's payment QR requires a session.
    const jar = await cookies();
    if (!verifySessionToken(jar.get(SESSION_COOKIE)?.value)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!/^[a-z0-9-]{1,32}$/.test(method)) {
      return NextResponse.json({ error: "Invalid method" }, { status: 400 });
    }
    try {
      const blob = await put(`qr/${method}.png`, file, { access: "public", allowOverwrite: true });
      return NextResponse.json({ url: blob.url });
    } catch (err) {
      console.error("[upload] qr blob put failed", err);
      return NextResponse.json({ error: "Upload failed, please try again" }, { status: 502 });
    }
  }

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const name = `proofs/${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  try {
    const blob = await put(name, file, { access: "public" });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("[upload] proof blob put failed", err);
    return NextResponse.json({ error: "Upload failed, please try again" }, { status: 502 });
  }
}
