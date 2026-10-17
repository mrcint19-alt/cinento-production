/** Preview public-site gate. Temporary; not admin authentication or DB isolation. */
import { NextRequest, NextResponse } from "next/server";
import homepage from "./app/data/homepage.json";
import imageMetadata from "./app/data/images.json";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (process.env.VERCEL_ENV === "preview") {
    const headers = {
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "Cache-Control": "no-store",
    };
    if (request.method !== "GET" && request.method !== "HEAD") {
      return NextResponse.json({ error: "Mutations are disabled in the UI-only preview." }, { status: 403, headers });
    }
    // Reply from repository snapshots; do not execute the live CMS handlers.
    if (pathname === "/api/content/homepage") {
      return NextResponse.json(homepage, { headers });
    }
    if (pathname === "/api/admin/images") {
      return NextResponse.json({
        success: true,
        images: {
          hero: [imageMetadata.active.hero, "/images/hero/1777547550890-cinento-app-icon-design.png"],
          gallery: ["/images/gallery/gallery-1.JPG", "/images/gallery/gallery-2.jpg", "/images/gallery/gallery-3.jpg", "/images/gallery/gallery-4.jpg"],
          projects: [],
        },
        active: { ...imageMetadata.active, projects: "" },
      }, { headers });
    }
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/en";
      const response = NextResponse.redirect(url);
      Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      return response;
    }
    const allowed =
      /^\/(en|tr)(\/(about|gallery|journal|contact|platforms))?\/?$/.test(pathname) ||
      pathname.startsWith("/_next/static/") ||
      pathname.startsWith("/images/") ||
      pathname === "/favicon.ico";
    if (!allowed) {
      return NextResponse.json({ error: "This route is disabled in the UI-only preview." }, { status: 403, headers });
    }
    const response = NextResponse.next();
    Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
    return response;
  }
  // Preserve the baseline behavior outside Preview.
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/en";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };
