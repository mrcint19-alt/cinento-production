// File: lib/email-logs.ts
// Version: v3.2
// Updated: 2026-04-15 [Europe/Istanbul]
// Status: EMAIL LOGS LIST + DETAIL + LEAD FILTER

import { createClient } from "@/lib/supabase/server";

export type EmailHistoryItem = {
  id: string;
  created_at: string;
  to_email: string;
  subject: string;
  status: string;
  lead_id: string | null;
};

export type EmailDetailItem = {
  id: string;
  created_at: string;
  to_email: string;
  subject: string;
  status: string;
  body: string;
  lead_id: string | null;
  raw: Record<string, any>;
};

function mapEmailRow(row: any, index = 0): EmailHistoryItem {
  return {
    id: String(row?.id ?? index),
    created_at: String(
      row?.created_at ??
        row?.sent_at ??
        row?.timestamp ??
        new Date().toISOString()
    ),
    to_email: String(
      row?.to_email ??
        row?.recipient_email ??
        row?.recipient ??
        row?.to ??
        row?.email ??
        "-"
    ),
    subject: String(row?.subject ?? row?.email_subject ?? row?.title ?? "-"),
    status: String(
      row?.status ?? row?.send_status ?? row?.delivery_status ?? "sent"
    ),
    lead_id: row?.lead_id ? String(row.lead_id) : null,
  };
}

function mapEmailDetailRow(row: any): EmailDetailItem {
  return {
    id: String(row?.id ?? ""),
    created_at: String(
      row?.created_at ??
        row?.sent_at ??
        row?.timestamp ??
        new Date().toISOString()
    ),
    to_email: String(
      row?.to_email ??
        row?.recipient_email ??
        row?.recipient ??
        row?.to ??
        row?.email ??
        "-"
    ),
    subject: String(row?.subject ?? row?.email_subject ?? row?.title ?? "-"),
    status: String(
      row?.status ?? row?.send_status ?? row?.delivery_status ?? "sent"
    ),
    body: String(
      row?.body ??
        row?.html ??
        row?.text ??
        row?.message ??
        row?.content ??
        "-"
    ),
    lead_id: row?.lead_id ? String(row.lead_id) : null,
    raw: row ?? {},
  };
}

export async function getEmailLogs(): Promise<EmailHistoryItem[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("email_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.log("Email Logs Supabase Error:", error.message || error);
      return [];
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((row: any, index: number) => mapEmailRow(row, index));
  } catch (err: any) {
    console.log("Email Logs Catch Error:", err?.message || err);
    return [];
  }
}

export async function getEmailLogById(
  id: string
): Promise<EmailDetailItem | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("email_logs")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.log("Email Detail Supabase Error:", error.message || error);
      return null;
    }

    if (!data) {
      return null;
    }

    return mapEmailDetailRow(data);
  } catch (err: any) {
    console.log("Email Detail Catch Error:", err?.message || err);
    return null;
  }
}

export async function getEmailsByLeadId(
  leadId: string
): Promise<EmailHistoryItem[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("email_logs")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Lead Emails Error:", error.message || error);
      return [];
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((row: any, index: number) => mapEmailRow(row, index));
  } catch (err: any) {
    console.log("Lead Emails Catch Error:", err?.message || err);
    return [];
  }
}