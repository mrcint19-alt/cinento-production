// File: app/admin/[id]/page.tsx
// Version: v2.2
// Updated: 2026-04-15 [Europe/Istanbul]
// Status: STEP 2 - VIEW LEAD WITH EMAIL HISTORY

import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEmailsByLeadId } from "@/lib/email-logs";

type LeadStatus = "New" | "In Review" | "Contacted" | "Closed";
type LeadTemperature = "Hot" | "Warm" | "Cold";

type LeadItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: LeadStatus;
  lead_temperature?: LeadTemperature | null;
  created_at?: string;
};

async function getLeadById(id: string): Promise<LeadItem | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.log("Lead Detail Supabase Error:", error.message || error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: String(data.id),
      name: String(data.name ?? ""),
      email: String(data.email ?? ""),
      phone: String(data.phone ?? ""),
      message: String(data.message ?? ""),
      status: (data.status ?? "New") as LeadStatus,
      lead_temperature: (data.lead_temperature ?? "Cold") as LeadTemperature,
      created_at: String(data.created_at ?? ""),
    };
  } catch (err: any) {
    console.log("Lead Detail Catch Error:", err?.message || err);
    return null;
  }
}

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function getTemperatureBadgeClass(temperature?: LeadTemperature | null) {
  if (temperature === "Hot") {
    return "bg-red-500/20 text-red-300 border border-red-500/30";
  }

  if (temperature === "Warm") {
    return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
  }

  return "bg-neutral-500/20 text-neutral-300 border border-neutral-500/30";
}

function getStatusBadgeClass(status: LeadStatus) {
  if (status === "Closed") {
    return "bg-green-500/20 text-green-300 border border-green-500/30";
  }

  if (status === "Contacted") {
    return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
  }

  if (status === "In Review") {
    return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
  }

  return "bg-neutral-500/20 text-neutral-300 border border-neutral-500/30";
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [lead, emails] = await Promise.all([
    getLeadById(id),
    getEmailsByLeadId(id),
  ]);

  if (!lead) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-8">
        <div className="rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-yellow-600">
                CINENTO
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mt-2">
                View Lead
              </h1>

              <p className="text-neutral-400 mt-3 max-w-2xl leading-7">
                Lead profile, communication summary, and email history in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin"
                className="inline-flex px-4 py-2 rounded-xl border border-yellow-600/30 text-white hover:border-yellow-500 transition"
              >
                Back to Admin
              </Link>

              <Link
                href="/email-history"
                className="inline-flex px-4 py-2 rounded-xl bg-yellow-600 text-black hover:bg-yellow-500 transition"
              >
                Email History
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-yellow-600">
                Lead Profile
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mt-2 break-words">
                {lead.name || "Unnamed Lead"}
              </h2>

              <div className="mt-4 space-y-2 text-neutral-300">
                <div className="break-all">
                  <span className="text-neutral-500">Email:</span> {lead.email || "-"}
                </div>
                <div>
                  <span className="text-neutral-500">Phone:</span> {lead.phone || "-"}
                </div>
                <div>
                  <span className="text-neutral-500">Created:</span>{" "}
                  {formatDate(lead.created_at)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <span
                className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${getTemperatureBadgeClass(
                  lead.lead_temperature
                )}`}
              >
                {lead.lead_temperature || "Cold"}
              </span>

              <span
                className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${getStatusBadgeClass(
                  lead.status
                )}`}
              >
                {lead.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-neutral-950 border border-yellow-600/20 p-5">
            <div className="text-sm text-neutral-400">Lead ID</div>
            <div className="text-sm font-medium mt-2 break-all">{lead.id}</div>
          </div>

          <div className="rounded-2xl bg-neutral-950 border border-yellow-600/20 p-5">
            <div className="text-sm text-neutral-400">Total Emails</div>
            <div className="text-3xl font-bold mt-2">{emails.length}</div>
          </div>

          <div className="rounded-2xl bg-neutral-950 border border-yellow-600/20 p-5">
            <div className="text-sm text-neutral-400">Current Status</div>
            <div className="text-xl font-semibold mt-2">{lead.status}</div>
          </div>
        </div>

        <div className="rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6">
          <h3 className="text-xl font-semibold mb-4">Lead Message</h3>

          <div className="rounded-2xl border border-yellow-600/10 bg-black/40 p-4 text-neutral-300 leading-7 whitespace-pre-wrap break-words">
            {lead.message || "-"}
          </div>
        </div>

        <div className="rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-semibold">Email History</h3>
              <p className="text-neutral-400 text-sm mt-2">
                Emails linked to this lead through <code>lead_id</code>.
              </p>
            </div>
          </div>

          {emails.length === 0 ? (
            <div className="rounded-2xl border border-yellow-600/10 bg-black/40 p-6 text-neutral-400">
              No emails found for this lead.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="text-left text-neutral-400 border-b border-yellow-600/10">
                    <th className="py-4 pr-4">Date</th>
                    <th className="py-4 pr-4">To</th>
                    <th className="py-4 pr-4">Subject</th>
                    <th className="py-4 pr-4">Status</th>
                    <th className="py-4 pr-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {emails.map((email) => (
                    <tr
                      key={email.id}
                      className="border-b border-yellow-600/10 align-top"
                    >
                      <td className="py-4 pr-4 text-neutral-300">
                        {email.created_at
                          ? new Date(email.created_at).toLocaleString()
                          : "-"}
                      </td>

                      <td className="py-4 pr-4 text-neutral-300 break-all">
                        {email.to_email}
                      </td>

                      <td className="py-4 pr-4 text-white">
                        {email.subject}
                      </td>

                      <td className="py-4 pr-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {email.status}
                        </span>
                      </td>

                      <td className="py-4 pr-4">
                        <Link
                          href={`/email-history/${email.id}`}
                          className="inline-flex px-4 py-2 rounded-xl border border-yellow-600/30 text-white hover:border-yellow-500 transition"
                        >
                          View Email
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}