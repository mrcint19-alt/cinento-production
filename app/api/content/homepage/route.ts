import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { catalogSession, sameOrigin } from "../../../../lib/program-catalog";

const filePath = path.join(process.cwd(), "app/data/homepage.json");

export async function GET() {
  try {
    const file = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(JSON.parse(file));
  } catch {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (process.env.VERCEL_ENV === "preview" || !sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const session = catalogSession(req);
  if (!session) return NextResponse.json({ error: "Administrator access is not configured" }, { status: 503 });
  try {
    const { data, error } = await session.client.auth.getUser();
    if (error || !data.user || !session.allowed(data.user.id)) return session.finish(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    if ((Number(req.headers.get("content-length")) || 0) > 131072) return session.finish(NextResponse.json({ error: "Content too large" }, { status: 413 }));
    const raw = await req.text();
    if (raw.length > 131072) return session.finish(NextResponse.json({ error: "Content too large" }, { status: 413 }));
    const body = JSON.parse(raw);
    if (!body || typeof body !== "object" || !body.en || !body.tr) return session.finish(NextResponse.json({ error: "Invalid content" }, { status: 400 }));
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
    return session.finish(NextResponse.json({ success: true }));
  } catch {
    return session.finish(NextResponse.json({ error: "Failed to save content" }, { status: 500 }));
  }
}
