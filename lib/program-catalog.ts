import { createClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import initialPrograms from "../app/data/programs.json";

export type Language = "en" | "tr" | "fa";
export type ProgramCopy = { description: string; audience: string; scope: string[]; service: string };
export type Program = {
  id: string; name: string; mark: string;
  category: "intelligence" | "media" | "business" | "connectivity";
  status?: "desktop" | "development";
  copy: Record<Language, ProgramCopy>;
  access_url?: string | null;
  icon_url?: string | null;
  logo_url?: string | null;
  cover_url?: string | null;
  published?: boolean;
  sort_order?: number;
};

const COOKIE = "cinento-catalog-admin";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function catalogConfig() {
  const url = process.env.CINENTO_CATALOG_SUPABASE_URL?.trim();
  const key = process.env.CINENTO_CATALOG_SUPABASE_KEY?.trim();
  const ids = process.env.CINENTO_CATALOG_ADMIN_IDS?.split(",").map(id => id.trim().toLowerCase()).filter(Boolean);
  if (!url || !key || !ids?.length || ids.some(id => !UUID.test(id))) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || !/^[a-z0-9-]+\.supabase\.co$/.test(parsed.hostname) ||
      parsed.pathname !== "/" || parsed.search || parsed.hash || parsed.username || parsed.password) return null;
    // The catalog belongs to the dedicated CINENTO SITE project, not the older site database.
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && parsed.origin === new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin) return null;
    if (!key.startsWith("sb_publishable_")) {
      const payload = JSON.parse(Buffer.from(key.split(".")[1] ?? "", "base64url").toString());
      if (payload.role !== "anon") return null;
    }
    return { url: parsed.origin, key, ids: new Set(ids) };
  } catch { return null; }
}

export function publicCatalogClient() {
  const config = catalogConfig();
  return config ? createClient(config.url, config.key, { auth: { persistSession: false } }) : null;
}

export function catalogSession(request: NextRequest) {
  const config = catalogConfig();
  if (!config) return null;
  const pending = new Map<string, { name: string; value: string; options: CookieOptions }>();
  const secure = request.nextUrl.protocol === "https:";
  const client = createServerClient(config.url, config.key, {
    cookieOptions: { name: COOKIE, path: "/", httpOnly: true, secure, sameSite: "lax" },
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
          request.cookies.delete(cookie.name);
          pending.set(cookie.name, { name: cookie.name, value: "", options: { path: "/", maxAge: 0 } });
        }
      }
    },
    finish: (response: NextResponse) => {
      for (const { name, value, options } of pending.values()) {
        response.cookies.set(name, value, { ...options, path: "/", httpOnly: true, secure, sameSite: "lax" });
      }
      response.headers.set("Cache-Control", "private, no-store");
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    },
  };
}

export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return !!origin && origin === request.nextUrl.origin && request.headers.get("sec-fetch-site") !== "cross-site";
}

export async function readBoundedJson(request: NextRequest, limit: number): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new Error("Invalid content type");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing body");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) { await reader.cancel(); throw new Error("Payload too large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid body");
  return parsed as Record<string, unknown>;
}

export function validateProgram(input: unknown): Program | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const value = input as Record<string, unknown>;
  const str = (item: unknown, max: number) => typeof item === "string" && item.trim().length > 0 && item.length <= max;
  if (!str(value.id, 64) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.id as string) ||
      !str(value.name, 120) || !str(value.mark, 24) ||
      !["intelligence", "media", "business", "connectivity"].includes(value.category as string) ||
      (value.status != null && !["desktop", "development"].includes(value.status as string)) ||
      typeof value.published !== "boolean" || !Number.isInteger(value.sort_order) ||
      (value.sort_order as number) < 0 || (value.sort_order as number) > 9999) return null;
  if (value.access_url != null && value.access_url !== "") {
    if (!str(value.access_url, 500)) return null;
    try { if (new URL(value.access_url as string).protocol !== "https:") return null; } catch { return null; }
  }
  for (const field of ["icon_url", "logo_url", "cover_url"]) {
    const image = value[field];
    if (image == null || image === "") continue;
    if (!str(image, 1000)) return null;
    try {
      const url = new URL(image as string);
      if (url.protocol !== "https:" || url.username || url.password) return null;
    } catch { return null; }
  }
  const copy = value.copy as Record<string, Record<string, unknown>> | null;
  if (!copy || typeof copy !== "object" || Array.isArray(copy)) return null;
  for (const lang of ["en", "tr", "fa"]) {
    const text = copy[lang];
    if (!text || typeof text !== "object" || !str(text.description, 1500) ||
        !str(text.audience, 500) || !str(text.service, 500) ||
        !Array.isArray(text.scope) || text.scope.length > 12 ||
        text.scope.some(item => !str(item, 250))) return null;
  }
  return {
    id: (value.id as string).trim(), name: (value.name as string).trim(), mark: (value.mark as string).trim(),
    category: value.category as Program["category"], status: value.status as Program["status"],
    published: value.published as boolean, sort_order: value.sort_order as number,
    access_url: (value.access_url as string) || null, copy: value.copy as Program["copy"],
    icon_url: (value.icon_url as string) || null, logo_url: (value.logo_url as string) || null,
    cover_url: (value.cover_url as string) || null,
  };
}

export const staticPrograms: Program[] = (initialPrograms as Program[]).map(program => ({
  ...program,
  icon_url: `/images/programs/${program.id}-icon.svg`,
  logo_url: `/images/programs/${program.id}-logo.svg`,
  cover_url: `/images/programs/${program.id}-cover.svg`,
}));
