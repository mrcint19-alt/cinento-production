import { NextRequest, NextResponse } from "next/server";
import snapshot from "../../../data/homepage.json";
import { catalogSession, publicCatalogClient, readBoundedJson, sameOrigin } from "../../../../lib/program-catalog";

export const dynamic = "force-dynamic";
const TABLE = "site_homepage_content";
const headers = { "Cache-Control": "no-store" };

export async function GET() {
  if (process.env.VERCEL_ENV === "preview") return NextResponse.json(snapshot, { headers });
  const client = publicCatalogClient();
  if (!client) return NextResponse.json(snapshot, { headers });
  const { data, error } = await client.from(TABLE).select("content").eq("id", "main").maybeSingle();
  // The repository snapshot keeps the public page intact until the migration runs.
  if (error) return NextResponse.json(snapshot, { headers: { ...headers, "X-CINENTO-Source": "snapshot" } });
  return NextResponse.json(data?.content ?? snapshot, { headers });
}

export async function POST(req: NextRequest) {
  if (process.env.VERCEL_ENV === "preview" || !sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const session = catalogSession(req);
  if (!session) return NextResponse.json({ error: "Administrator access is not configured" }, { status: 503 });
  try {
    const { data, error } = await session.client.auth.getUser();
    if (error || !data.user || !session.allowed(data.user.id)) return session.finish(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    const body = await readBoundedJson(req, 131072);
    if (!body.en || typeof body.en !== "object" || Array.isArray(body.en) ||
        !body.tr || typeof body.tr !== "object" || Array.isArray(body.tr) ||
        ["fa", "ar"].some(locale => body[locale] != null && (typeof body[locale] !== "object" || Array.isArray(body[locale]))))
      return session.finish(NextResponse.json({ error: "Invalid content" }, { status: 400 }));
    const saved = await session.client.from(TABLE).upsert({ id: "main", content: body }, { onConflict: "id" });
    if (saved.error) return session.finish(NextResponse.json({ error: "Persistent content storage is unavailable" }, { status: 503 }));
    return session.finish(NextResponse.json({ success: true }));
  } catch {
    return session.finish(NextResponse.json({ error: "Failed to save content" }, { status: 500 }));
  }
}
