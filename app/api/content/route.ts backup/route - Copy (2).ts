import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type LeadStatus = "New" | "In Review" | "Contacted" | "Closed";
type LeadTemperature = "Hot" | "Warm" | "Cold";

type LeadPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  category?: unknown;
  status?: unknown;
  lead_temperature?: unknown;
};

const VALID_STATUSES: LeadStatus[] = ["New", "In Review", "Contacted", "Closed"];
const VALID_TEMPERATURES: LeadTemperature[] = ["Hot", "Warm", "Cold"];

function normalizeString(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeStatus(value: unknown): LeadStatus {
  const normalized = normalizeString(value) as LeadStatus;
  return VALID_STATUSES.includes(normalized) ? normalized : "New";
}

function normalizeTemperature(value: unknown): LeadTemperature {
  const normalized = normalizeString(value) as LeadTemperature;
  return VALID_TEMPERATURES.includes(normalized) ? normalized : "Cold";
}

export async function POST(req: Request) {
  try {
    const body: LeadPayload = await req.json();

    const name = normalizeString(body.name);
    const email = normalizeString(body.email);
    const phone = normalizeString(body.phone);
    const message = normalizeString(body.message);
    const category = normalizeString(body.category) || "Film";
    const status = normalizeStatus(body.status);
    const lead_temperature = normalizeTemperature(body.lead_temperature);

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        {
          error: "Name, email, phone, and message are required.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          name,
          email,
          phone,
          message,
          category,
          status,
          lead_temperature,
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("SUPABASE INSERT ERROR:", error);
      return NextResponse.json(
        { error: error.message || "Failed to save lead." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Lead submitted successfully.",
        lead: data,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";

    console.error("CONTACT POST ERROR:", err);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("SUPABASE FETCH ERROR:", error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch leads." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        leads: data ?? [],
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";

    console.error("CONTACT GET ERROR:", err);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}