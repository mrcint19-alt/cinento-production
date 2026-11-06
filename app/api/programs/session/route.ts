import { NextRequest, NextResponse } from "next/server";
import { catalogSession, readBoundedJson, sameOrigin } from "../../../../lib/program-catalog";

export async function GET(request: NextRequest) {
  if (process.env.VERCEL_ENV === "preview") return NextResponse.json({ authenticated: false }, { headers: { "Cache-Control": "no-store" } });
  const session = catalogSession(request);
  if (!session) return NextResponse.json({ authenticated: false, configured: false }, { headers: { "Cache-Control": "no-store" } });
  const { data, error } = await session.client.auth.getUser();
  return session.finish(NextResponse.json({ authenticated: !error && !!data.user && session.allowed(data.user.id), configured: true }));
}

export async function POST(request: NextRequest) {
  if (process.env.VERCEL_ENV === "preview") return NextResponse.json({ error: "Preview is read-only" }, { status: 403 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const session = catalogSession(request);
  if (!session) return NextResponse.json({ error: "Catalog is not configured" }, { status: 503 });
  try {
    const { email, password } = await readBoundedJson(request, 2048);
    if (typeof email !== "string" || email.length > 320 || typeof password !== "string" || password.length > 1024) throw new Error();
    const { error } = await session.client.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return session.finish(NextResponse.json({ error: "Unable to sign in" }, { status: 401 }));
    const user = await session.client.auth.getUser();
    if (user.error || !user.data.user || !session.allowed(user.data.user.id)) {
      await session.client.auth.signOut({ scope: "local" });
      session.clear();
      return session.finish(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    }
    return session.finish(NextResponse.json({ authenticated: true }));
  } catch { return session.finish(NextResponse.json({ error: "Invalid request" }, { status: 400 })); }
}

export async function DELETE(request: NextRequest) {
  if (process.env.VERCEL_ENV === "preview" || !sameOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const session = catalogSession(request);
  if (!session) return NextResponse.json({ error: "Catalog is not configured" }, { status: 503 });
  await session.client.auth.signOut({ scope: "local" });
  session.clear();
  return session.finish(NextResponse.json({ authenticated: false }));
}
