import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const COOKIE = "cinento-site-admin-preview";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Deliberately no fallback to the website's shared database credentials.
export function previewAuthConfig() {
  if (process.env.VERCEL_ENV !== "preview") return null;
  const url = process.env.CINENTO_SITE_PREVIEW_AUTH_URL?.trim();
  const key = process.env.CINENTO_SITE_PREVIEW_AUTH_KEY?.trim();
  const baseline = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const ids = process.env.CINENTO_SITE_PREVIEW_ADMIN_IDS?.split(",").map(id => id.trim().toLowerCase());
  if (!url || !key || !baseline || !ids?.length || ids.some(id => !UUID.test(id))) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || !/^[a-z0-9-]+\.supabase\.co$/.test(parsed.hostname) ||
        parsed.username || parsed.password || parsed.search || parsed.hash ||
        parsed.pathname !== "/" || parsed.origin === new URL(baseline).origin) return null;
    // Only a public project key is permitted. Never accept a service-role key.
    if (!key.startsWith("sb_publishable_")) {
      const payload = JSON.parse(Buffer.from(key.split(".")[1] ?? "", "base64url").toString());
      if (payload.role !== "anon") return null;
    }
    return { url: parsed.origin, key, ids: new Set(ids) };
  } catch { return null; }
}

export function privateResponse(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return !!origin && origin === request.nextUrl.origin && request.headers.get("sec-fetch-site") !== "cross-site";
}

export async function boundedJson(request: NextRequest): Promise<unknown> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new Error("Invalid body");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) { await reader.cancel(); throw new Error("Body too large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function previewAuth(request: NextRequest) {
  const config = previewAuthConfig();
  if (!config) return null;
  const pending = new Map<string, { name: string; value: string; options: CookieOptions }>();
  const secure = request.nextUrl.protocol === "https:";
  const client = createServerClient(config.url, config.key, {
    cookieOptions: { name: COOKIE, path: "/", httpOnly: true, secure, sameSite: "lax" },
    global: { fetch: (input, init) => fetch(input, {
      ...init, signal: init?.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(10000)]) : AbortSignal.timeout(10000),
    }) },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: cookies => {
        for (const cookie of cookies) {
          request.cookies.set(cookie.name, cookie.value);
          pending.set(cookie.name, cookie);
        }
      },
    },
  });
  return {
    client,
    allowed: (id: string) => config.ids.has(id.toLowerCase()),
    clear: () => {
      for (const cookie of request.cookies.getAll()) {
        if (cookie.name === COOKIE || cookie.name.startsWith(COOKIE + ".") || cookie.name.startsWith(COOKIE + "-")) {
          pending.set(cookie.name, { name: cookie.name, value: "", options: { path: "/", maxAge: 0 } });
          request.cookies.delete(cookie.name);
        }
      }
    },
    finish: (response: NextResponse) => {
      for (const { name, value, options } of pending.values()) {
        response.cookies.set(name, value, { ...options, path: "/", httpOnly: true, secure, sameSite: "lax" });
      }
      return privateResponse(response);
    },
  };
}
