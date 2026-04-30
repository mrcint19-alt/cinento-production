import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email || "").trim();
    const password = String(body.password || "").trim();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@cinento.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "123456";

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid login credentials." },
        { status: 401 }
      );
    }

    const sessionToken = crypto.randomUUID();

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
    });

    response.cookies.set("cinento_session", sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Login failed." },
      { status: 500 }
    );
  }
}