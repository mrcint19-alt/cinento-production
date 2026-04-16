import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = createClient();

    const body = await req.json();

    const { email, name, message, lead_id } = body; // 👈 مهم

    // 👉 ارسال ایمیل (Resend یا هر چی داری)
    // این قسمت همون قبلی بمونه

    // ✅ ثبت در email_logs
    await supabase.from("email_logs").insert([
      {
        email,
        name,
        subject: "CINENTO Contact",
        message,
        status: "sent",
        lead_id: lead_id, // 🔥 این خط کل بازیه
      },
    ]);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      { error: "Email sending failed" },
      { status: 500 }
    );
  }
}