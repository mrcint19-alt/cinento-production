/**
 * CINENTO SITE — UI-only Preview gate
 * Baseline: ff4fe2c | 2026-10-17
 * Temporary routing restriction, not admin authentication or DB isolation.
 */
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.VERCEL_ENV === "preview") {
    const headers = {
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "Cache-Control": "no-store",
    };

    // Block mutations, including Server Action POST requests.
    if (request.method !== "GET" && request.method !== "HEAD") {
      return NextResponse.json(
        { error: "Mutations are disabled in the UI-only preview." },
        { status: 403, headers }
      );
    }

    if (pathname === "/" || /^\/(en|tr)\/?$/.test(pathname)) {
      const language = pathname.startsWith("/tr") ? "tr" : "en";
      const url = request.nextUrl.clone();
      url.pathname = `/${language}/platforms`;
      url.search = "";
      const response = NextResponse.redirect(url);
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    const allowed =
      /^\/(en|tr)\/platforms\/?$/.test(pathname) ||
      pathname.startsWith("/_next/static/") ||
      pathname.startsWith("/images/") ||
      pathname === "/favicon.ico";

    if (!allowed) {
      return NextResponse.json(
        { error: "This route is disabled in the UI-only preview." },
        { status: 403, headers }
      );
    }

    const response = NextResponse.next();
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Preserve baseline routing outside Vercel Preview.
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/en";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Include API routes and paths containing dots; do not use the old exclusion.
export const config = {
  matcher: ["/:path*"],
};

