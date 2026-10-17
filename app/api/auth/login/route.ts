import { NextRequest, NextResponse } from "next/server";
import { boundedJson, previewAuth, privateResponse, sameOrigin } from "../../../../lib/site-admin-auth";

export async function POST(request: NextRequest) {
  const reply = (message: string, status: number) => privateResponse(NextResponse.json({ success: false, message }, { status }));
  if (!sameOrigin(request)) return reply("Request origin is not allowed.", 403);
  const auth = previewAuth(request);
  if (!auth) return reply("Preview administrator access is not configured. Contact the site owner.", 503);
  let email: string, password: string;
  try {
    const body = await boundedJson(request) as Record<string, unknown>;
    if (!body || typeof body.email !== "string" || typeof body.password !== "string" ||
        !body.email.trim() || body.email.length > 320 || !body.password || body.password.length > 1024) throw new Error();
    email = body.email.trim();
    password = body.password;
  } catch { return reply("Enter a valid email and password.", 400); }
  try {
    const { error } = await auth.client.auth.signInWithPassword({ email, password });
    if (error) {
      auth.clear();
      return auth.finish(reply(error.status === 429 ? "Too many attempts. Try again later." : "Unable to sign in with administrator access.", error.status === 429 ? 429 : 401));
    }
    const { data, error: userError } = await auth.client.auth.getUser();
    if (userError || !data.user || !auth.allowed(data.user.id)) {
      await auth.client.auth.signOut({ scope: "local" });
      auth.clear();
      return auth.finish(reply("Unable to sign in with administrator access.", 401));
    }
    return auth.finish(NextResponse.json({ success: true }));
  } catch {
    auth.clear();
    return auth.finish(reply("Sign-in is temporarily unavailable.", 503));
  }
}
