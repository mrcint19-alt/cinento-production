/*
File: app/api/auth/login/route.ts
Version: v2.0
Updated: 2026-04-30 [Europe/Istanbul]
Status: Login PRO (Hardened + Production Ready)
*/

import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email || "").trim();
    const password = String(body.password || "").trim();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@cinento.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "123456";

    // 🔐 بررسی اعتبار
    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid login credentials." },
        { status: 401 }
      );
    }

    // 🎟️ تولید Session Token
    const sessionToken = crypto.randomUUID();

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
    });

    // 🍪 تنظیم کوکی حرفه‌ای
    response.cookies.set("cinento_session", sessionToken, {
      httpOnly: true,
      sameSite: "strict",     // ⬅️ ارتقاء امنیت
      secure: process.env.NODE_ENV === "production", // ⬅️ هوشمند
      path: "/",
      maxAge: 60 * 60 * 8,    // 8 ساعت
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Login failed." },
      { status: 500 }
    );
  }
}