/**
 * File: app/api/contact/route.ts
 * Version: v5.0 LEADS API PRO
 * Updated: 2026-04-18 [Europe/Istanbul]
 * Status: ACTIVE
 */

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      leads: data ?? [],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load leads",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
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
          status: "New",
          category: "Film",
          notes: "Website form submission",
          lead_temperature: "Cold",
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      lead: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to save lead",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const {
      id,
      status,
      notes,
      follow_up_date,
    }: {
      id?: string | number;
      status?: string;
      notes?: string;
      follow_up_date?: string;
    } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing id",
        },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, any> = {};

    if (typeof status === "string" && status.trim()) {
      updatePayload.status = status.trim();
    }

    if (typeof notes === "string") {
      updatePayload.notes = notes;
    }

    if (typeof follow_up_date === "string") {
      updatePayload.follow_up_date = follow_up_date || null;
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No fields provided to update",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("leads")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      lead: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update lead",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing id",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete lead",
      },
      { status: 500 }
    );
  }
}