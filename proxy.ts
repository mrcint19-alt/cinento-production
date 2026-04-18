/**
 * File: proxy.ts
 * Version: v2.0 FINAL STABLE
 * Updated: 2026-04-17 [Europe/Istanbul]
 * Status: ACTIVE
 */

import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/en";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};