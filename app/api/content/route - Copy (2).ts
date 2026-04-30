import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Lead = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "New" | "In Review" | "Contacted" | "Closed";
  lead_temperature: "Hot" | "Warm" | "Cold";
  created_at: string;
};

const filePath = path.join(process.cwd(), "app/data/contacts.json");

function readLeads(): Lead[] {
  if (!fs.existsSync(filePath)) return [];

  const file = fs.readFileSync(filePath, "utf-8");
  return file ? JSON.parse(file) : [];
}

function writeLeads(data: Lead[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ✅ GET (برای dashboard)
export async function GET() {
  try {
    const leads = readLeads();
    return NextResponse.json({ leads });
  } catch {
    return NextResponse.json({ error: "Read error" }, { status: 500 });
  }
}

// ✅ POST (برای فرم سایت)
export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const leads = readLeads();

    const newLead: Lead = {
      id: Date.now(),
      name,
      email,
      phone: "",
      message,
      status: "New",
      lead_temperature: "Cold",
      created_at: new Date().toISOString(),
    };

    leads.unshift(newLead);

    writeLeads(leads);

    return NextResponse.json({ success: true, lead: newLead });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}