/**
 * File: app/api/contact/route.ts
 * Version: v2.1 CONTACT API TO CRM JSON
 * Updated: 2026-04-29 [Europe/Istanbul]
 * Status: STABLE
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  language?: string;
  status: "New" | "In Review" | "Contacted" | "Closed";
  lead_temperature: "Hot" | "Warm" | "Cold";
  created_at: string;
};

const dataDir = path.join(process.cwd(), "app/data");
const filePath = path.join(dataDir, "contacts.json");

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
  }
}

function readLeads(): Lead[] {
  ensureDataFile();

  const file = fs.readFileSync(filePath, "utf-8");

  if (!file.trim()) {
    return [];
  }

  try {
    return JSON.parse(file);
  } catch {
    return [];
  }
}

function writeLeads(data: Lead[]) {
  ensureDataFile();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  try {
    const leads = readLeads();
    return NextResponse.json({ leads });
  } catch {
    return NextResponse.json({ error: "Read error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const message = String(body.message || "").trim();
    const language = String(body.language || "").trim();

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const leads = readLeads();

    const newLead: Lead = {
      id: Date.now(),
      name,
      email,
      phone,
      message,
      language,
      status: "New",
      lead_temperature: "Warm",
      created_at: new Date().toISOString(),
    };

    leads.unshift(newLead);
    writeLeads(leads);

    return NextResponse.json({ success: true, lead: newLead });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}