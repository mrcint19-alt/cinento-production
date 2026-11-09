import { NextRequest, NextResponse } from "next/server";
import { catalogSession, publicCatalogClient, readBoundedJson, sameOrigin } from "../../../lib/program-catalog";

const headers = { "Cache-Control": "no-store" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  if (process.env.VERCEL_ENV === "preview") return NextResponse.json({ error: "Preview is read-only" }, { status: 403, headers });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers });
  const client = publicCatalogClient();
  if (!client) return NextResponse.json({ error: "Inquiry storage unavailable" }, { status: 503, headers });
  try {
    const body = await readBoundedJson(request, 6000);
    if (body.website) return NextResponse.json({ success: true }, { headers }); // honeypot
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const language = body.language;
    if (name.length < 2 || name.length > 120 || email.length > 254 || !emailPattern.test(email) ||
        message.length < 20 || message.length > 4000 || !["en", "tr", "fa", "ar"].includes(language as string))
      return NextResponse.json({ error: "Invalid inquiry" }, { status: 400, headers });
    const result = await client.from("site_project_inquiries").insert({ name, email, message, language });
    if (result.error) {
      // Existing deployments may still have the EN/TR database constraint. Preserve the
      // inquiry and its original language until the additive migration is applied.
      if (result.error.code !== "23514" || !["fa", "ar"].includes(language as string))
        return NextResponse.json({ error: "Inquiry storage unavailable" }, { status: 503, headers });
      const fallbackMessage = `[Language: ${language}] ${message}`.slice(0, 4000);
      const fallback = await client.from("site_project_inquiries").insert({ name, email, message: fallbackMessage, language: "en" });
      if (fallback.error) return NextResponse.json({ error: "Inquiry storage unavailable" }, { status: 503, headers });
    }
    return NextResponse.json({ success: true }, { headers });
  } catch {
    return NextResponse.json({ error: "Invalid inquiry" }, { status: 400, headers });
  }
}

export async function GET(request: NextRequest) {
  if (process.env.VERCEL_ENV === "preview") return NextResponse.json({ error: "Preview is read-only" }, { status: 403, headers });
  const session = catalogSession(request);
  if (!session) return NextResponse.json({ error: "Unavailable" }, { status: 503, headers });
  const { data, error } = await session.client.auth.getUser();
  if (error || !data.user || !session.allowed(data.user.id)) return session.finish(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  const result = await session.client.from("site_project_inquiries").select("id,name,email,message,language,status,created_at").order("created_at", { ascending: false }).limit(100);
  return session.finish(NextResponse.json(result.error ? { error: "Inquiry storage unavailable" } : { inquiries: result.data }, { status: result.error ? 503 : 200 }));
}
