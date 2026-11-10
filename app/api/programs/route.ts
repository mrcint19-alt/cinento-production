import { NextRequest, NextResponse } from "next/server";
import { catalogSession, publicCatalogClient, readBoundedJson, sameOrigin, staticPrograms, validateProgram } from "../../../lib/program-catalog";

export const dynamic = "force-dynamic";
const columns = "id,name,mark,category,status,copy,access_url,icon_url,logo_url,cover_url,published,sort_order";
const noStore = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  // The UI-only preview must never query or display private records.
  if (process.env.VERCEL_ENV === "preview") return NextResponse.json({ programs: staticPrograms }, { headers: noStore });
  const client = publicCatalogClient();
  if (!client) return NextResponse.json({ programs: staticPrograms }, { headers: noStore });

  if (request.nextUrl.searchParams.get("scope") === "admin") {
    const session = catalogSession(request);
    if (!session) return NextResponse.json({ error: "Catalog is not configured" }, { status: 503, headers: noStore });
    const { data, error } = await session.client.auth.getUser();
    if (error || !data.user || !session.allowed(data.user.id)) return session.finish(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    const result = await session.client.from("site_programs").select(columns).order("sort_order").order("name");
    return session.finish(NextResponse.json(result.error ? { error: "Catalog read failed" } : { programs: result.data }, { status: result.error ? 503 : 200 }));
  }
  const result = await client.from("site_programs").select(columns).eq("published", true).order("sort_order").order("name");
  return NextResponse.json(result.error ? { error: "Catalog read failed" } : { programs: result.data }, { status: result.error ? 503 : 200, headers: noStore });
}

async function mutate(request: NextRequest, method: "POST" | "PUT" | "DELETE") {
  if (process.env.VERCEL_ENV === "preview") return NextResponse.json({ error: "Preview is read-only" }, { status: 403 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const session = catalogSession(request);
  if (!session) return NextResponse.json({ error: "Catalog is not configured" }, { status: 503 });
  try {
    const { data, error } = await session.client.auth.getUser();
    if (error || !data.user || !session.allowed(data.user.id)) return session.finish(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    const parsed = await readBoundedJson(request, 24000);
    if (method === "DELETE") {
      if (typeof parsed.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(parsed.id)) return session.finish(NextResponse.json({ error: "Invalid ID" }, { status: 400 }));
      const result = await session.client.from("site_programs").delete().eq("id", parsed.id).select("id").single();
      return session.finish(NextResponse.json(result.error ? { error: "Delete failed" } : { program: result.data }, { status: result.error ? 409 : 200 }));
    }
    const program = validateProgram(parsed);
    if (!program) return session.finish(NextResponse.json({ error: "Invalid program fields" }, { status: 400 }));
    const query = method === "POST"
      ? session.client.from("site_programs").insert(program).select(columns).single()
      : session.client.from("site_programs").update(program).eq("id", program.id).select(columns).single();
    const result = await query;
    return session.finish(NextResponse.json(result.error ? { error: "Save failed" } : { program: result.data }, { status: result.error ? 409 : 200 }));
  } catch {
    return session.finish(NextResponse.json({ error: "Invalid request" }, { status: 400 }));
  }
}

export async function POST(request: NextRequest) { return mutate(request, "POST"); }
export async function PUT(request: NextRequest) { return mutate(request, "PUT"); }
export async function DELETE(request: NextRequest) { return mutate(request, "DELETE"); }
