import { NextRequest, NextResponse } from "next/server";
import { previewAuth, privateResponse, sameOrigin } from "../../../../lib/site-admin-auth";
import { catalogSession } from "../../../../lib/program-catalog";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return privateResponse(NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 }));
  const auth = process.env.VERCEL_ENV === "preview" ? previewAuth(request) : catalogSession(request);
  if (!auth) return privateResponse(NextResponse.json({ error: "Administrator access is not configured." }, { status: 503 }));
  try { await auth.client.auth.signOut({ scope: "local" }); } catch { /* Still remove this browser's cookie. */ }
  auth.clear();
  return auth.finish(NextResponse.redirect(new URL("/login", request.url), 303));
}
