/*
File: app/api/crm/contacts/route.ts
Version: CINENTO CRM API v1.0
Updated: 2026-04-30 [Europe/Istanbul]
Status: Local JSON CRM API - GET/POST/PATCH/DELETE
*/

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "app", "data", "contacts.json");

function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

function readContacts() {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeContacts(data: any[]) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  return NextResponse.json(readContacts());
}

export async function POST(req: Request) {
  const body = await req.json();
  const contacts = readContacts();

  const newContact = {
    id: Date.now().toString(),
    name: body.name || "",
    company: body.company || "",
    email: body.email || "",
    phone: body.phone || "",
    project: body.project || "",
    status: body.status || "new",
    priority: body.priority || "warm",
    createdAt: new Date().toISOString(),
  };

  contacts.unshift(newContact);
  writeContacts(contacts);

  return NextResponse.json(newContact);
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const contacts = readContacts();

  const updated = contacts.map((item: any) =>
    item.id === body.id ? { ...item, ...body } : item
  );

  writeContacts(updated);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const contacts = readContacts().filter((item: any) => item.id !== id);
  writeContacts(contacts);

  return NextResponse.json({ success: true });
}