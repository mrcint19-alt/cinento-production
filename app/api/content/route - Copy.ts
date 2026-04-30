/* 
File: app/api/contact/route.ts
Version: v1.0
Updated: 2026-04-20
Status: CONTACT API READY
*/

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type ContactLead = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const dataDir = path.join(process.cwd(), "app", "data");
    const filePath = path.join(dataDir, "contacts.json");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let contacts: ContactLead[] = [];

    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8").trim();
      contacts = raw ? JSON.parse(raw) : [];
    }

    const newLead: ContactLead = {
      id: Date.now().toString(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };

    contacts.unshift(newLead);

    fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Lead saved successfully.",
      lead: newLead,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error while saving lead." },
      { status: 500 }
    );
  }
}