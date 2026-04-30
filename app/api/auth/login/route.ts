/*
File: app/api/auth/logout/route.ts
Version: v1.1
Updated: 2026-04-30 [Europe/Istanbul]
Status: Stable Logout PRO API
*/

import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("cinento_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  return response;
}