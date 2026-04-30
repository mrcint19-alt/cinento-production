/*
File: app/api/leads/update-status/route.ts
Version: CINENTO CRM Status Save PRO v1.0
Updated: 2026-04-30 [Europe/Istanbul]
Status: Saves lead status into app/data/contacts.json
*/

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "app", "data", "contacts.json");

function readContacts() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }

  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw || "[]");
}

function writeContacts(data: any[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 }
      );
    }

    const contacts = readContacts();

    const updatedContacts = contacts.map((lead: any, index: number) => {
      const leadId = lead.id ?? `${lead.email || "lead"}-${index}`;

      if (String(leadId) === String(id)) {
        return {
          ...lead,
          id: leadId,
          status,
          updatedAt: new Date().toISOString(),
        };
      }

      return lead;
    });

    writeContacts(updatedContacts);

    return NextResponse.json({
      success: true,
      message: "Lead status updated successfully",
    });
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update lead status" },
      { status: 500 }
    );
  }
}