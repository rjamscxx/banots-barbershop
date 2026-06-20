import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const type = request.nextUrl.searchParams.get("type");
  const method = request.nextUrl.searchParams.get("method");
  const buffer = Buffer.from(await file.arrayBuffer());

  let relPath: string;

  if (type === "qr" && method) {
    const dir = path.join(process.cwd(), "public", "qr");
    await mkdir(dir, { recursive: true });
    // Always save as .png so client can predict the URL without a manifest
    await writeFile(path.join(dir, `${method}.png`), buffer);
    relPath = `/qr/${method}.png`;
  } else {
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    await writeFile(path.join(dir, filename), buffer);
    relPath = `/uploads/${filename}`;
  }

  return NextResponse.json({ url: relPath });
}
