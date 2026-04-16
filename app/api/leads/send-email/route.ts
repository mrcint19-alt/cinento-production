import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";
const resendFromEmail = process.env.RESEND_FROM_EMAIL || "";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: Request) {
  try {
    if (!resendApiKey) {
      return NextResponse.json(
        { error: "RESEND_API_KEY is missing in .env.local" },
        { status: 500 }
      );
    }

    if (!resendFromEmail) {
      return NextResponse.json(
        { error: "RESEND_FROM_EMAIL is missing in .env.local" },
        { status: 500 }
      );
    }

    if (!resend) {
      return NextResponse.json(
        { error: "Resend client could not be initialized." },
        { status: 500 }
      );
    }

    const body = await req.json();

    const email = String(body?.email || "").trim();
    const name = String(body?.name || "").trim();
    const status = String(body?.status || "New").trim();
    const leadTemperature = String(body?.lead_temperature || "Cold").trim();

    if (!email) {
      return NextResponse.json(
        { error: "Lead email is required." },
        { status: 400 }
      );
    }

    const subject = `CINENTO Follow-Up — ${name || "Project Inquiry"}`;

    const text = `
Hello ${name || "there"},

Thank you for contacting CINENTO.

We received your project inquiry and reviewed your submission.

Current Lead Priority: ${leadTemperature}
Current Status: ${status}

We would be glad to continue the conversation and explore the next step for your project.

Best regards,
CINENTO
From Idea to International Film Market
    `.trim();

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.7; color: #111111;">
        <h2 style="margin-bottom: 16px;">CINENTO Follow-Up</h2>
        <p>Hello ${name || "there"},</p>
        <p>Thank you for contacting <strong>CINENTO</strong>.</p>
        <p>We received your project inquiry and reviewed your submission.</p>
        <p>
          <strong>Current Lead Priority:</strong> ${leadTemperature}<br />
          <strong>Current Status:</strong> ${status}
        </p>
        <p>
          We would be glad to continue the conversation and explore the next step for your project.
        </p>
        <p>
          Best regards,<br />
          <strong>CINENTO</strong><br />
          From Idea to International Film Market
        </p>
      </div>
    `;

    const result = await resend.emails.send({
      from: resendFromEmail,
      to: email,
      subject,
      text,
      html,
    });

    if (result.error) {
      return NextResponse.json(
        {
          error: result.error.message || "Resend returned an unknown error.",
          details: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Email sent successfully to ${email}`,
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}