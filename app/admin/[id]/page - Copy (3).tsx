"use client";

/**
 * File: app/admin/[id]/page.tsx
 * Version: v1.0 LEAD DETAIL PRO
 * Updated: 2026-04-18 [Europe/Istanbul]
 * Status: ACTIVE
 */

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type LeadStatus = "New" | "In Review" | "Contacted" | "Closed";
type LeadTemperature = "Hot" | "Warm" | "Cold";

type LeadItem = {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: LeadStatus;
  category?: string | null;
  follow_up_date?: string | null;
  notes?: string | null;
  lead_temperature?: LeadTemperature | null;
  created_at?: string | null;
};

function safePhone(phone?: string | null) {
  if (!phone) return "";
  return String(phone).replace(/[^\d]/g, "");
}

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [lead, setLead] = useState<LeadItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/contact", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load lead.");
        }

        const rawLeads = Array.isArray(data?.leads) ? data.leads : [];
        const found = rawLeads.find((item: any) => String(item.id) === String(leadId));

        if (!found) {
          throw new Error("Lead not found.");
        }

        setLead({
          id: found.id,
          name: found.name || "",
          email: found.email || "",
          phone: found.phone || "",
          message: found.message || "",
          status: (found.status || "New") as LeadStatus,
          category: found.category || "Film",
          follow_up_date: found.follow_up_date || "",
          notes: found.notes || "",
          lead_temperature: (found.lead_temperature || "Cold") as LeadTemperature,
          created_at: found.created_at || "",
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (leadId) {
      fetchLead();
    }
  }, [leadId]);

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  const getTemperatureBadgeClass = (temperature?: LeadTemperature | null) => {
    if (temperature === "Hot") {
      return "border border-red-500/40 bg-red-500/15 text-red-300";
    }

    if (temperature === "Warm") {
      return "border border-yellow-500/40 bg-yellow-500/15 text-yellow-200";
    }

    return "border border-neutral-500/40 bg-neutral-500/10 text-neutral-300";
  };

  const getStatusBadgeClass = (status: LeadStatus) => {
    if (status === "Closed") {
      return "border border-green-500/40 bg-green-500/15 text-green-300";
    }

    if (status === "Contacted") {
      return "border border-blue-500/40 bg-blue-500/15 text-blue-300";
    }

    if (status === "In Review") {
      return "border border-purple-500/40 bg-purple-500/15 text-purple-300";
    }

    return "border border-neutral-500/40 bg-neutral-500/10 text-neutral-300";
  };

  const updateStatus = async (newStatus: LeadStatus) => {
    if (!lead) return;

    try {
      setUpdating(true);
      setError("");

      const response = await fetch("/api/contact", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: lead.id,
          status: newStatus,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Failed to update status.");
      }

      setLead((prev) => (prev ? { ...prev, status: newStatus } : prev));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Status update failed.";
      setError(message);
    } finally {
      setUpdating(false);
    }
  };

  const deleteLead = async () => {
    if (!lead) return;

    const confirmed = window.confirm("Are you sure you want to delete this lead?");
    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      const response = await fetch("/api/contact", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: lead.id }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Failed to delete lead.");
      }

      window.location.href = "/admin";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Delete failed.";
      setError(message);
    } finally {
      setDeleting(false);
    }
  };

  const whatsappUrl = useMemo(() => {
    if (!lead) return "";
    const phone = safePhone(lead.phone);
    if (!phone) return "";
    const text = `Hello ${lead.name || ""}, this is CINENTO regarding your project inquiry.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }, [lead]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-red-500 text-2xl font-bold">LEAD DETAIL LIVE</div>

          <div className="flex gap-3">
            <a
              href="/admin"
              className="rounded-xl border border-yellow-600/20 bg-black px-4 py-2 text-sm text-white transition hover:border-yellow-500"
            >
              Back to Admin
            </a>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6 text-neutral-300">
            Loading lead...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
            {error}
          </div>
        ) : !lead ? (
          <div className="rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6 text-neutral-300">
            Lead not found.
          </div>
        ) : (
          <>
            <section className="rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold text-yellow-500">
                    {lead.name || "Unnamed Lead"}
                  </h1>

                  <div className="flex flex-wrap gap-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(
                        lead.status || "New"
                      )}`}
                    >
                      {lead.status || "-"}
                    </span>

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getTemperatureBadgeClass(
                        lead.lead_temperature
                      )}`}
                    >
                      {lead.lead_temperature || "Cold"}
                    </span>

                    <span className="inline-flex rounded-full border border-yellow-600/20 bg-black px-3 py-1 text-xs text-neutral-300">
                      {lead.category || "Film"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                    >
                      WhatsApp
                    </a>
                  ) : null}

                  {lead.email ? (
                    <a
                      href={`mailto:${lead.email}`}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Email
                    </a>
                  ) : null}

                  <button
                    onClick={deleteLead}
                    disabled={deleting}
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                  >
                    {deleting ? "Deleting..." : "Delete Lead"}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6 lg:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold text-yellow-500">Project Message</h2>
                <div className="rounded-2xl border border-yellow-600/10 bg-black p-5 text-neutral-300 whitespace-pre-wrap leading-7">
                  {lead.message || "-"}
                </div>
              </div>

              <div className="rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6 space-y-5">
                <h2 className="text-xl font-semibold text-yellow-500">Lead Info</h2>

                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-neutral-500">Email</div>
                    <div className="text-white break-all">{lead.email || "-"}</div>
                  </div>

                  <div>
                    <div className="text-neutral-500">Phone</div>
                    <div className="text-white">{lead.phone || "-"}</div>
                  </div>

                  <div>
                    <div className="text-neutral-500">Created At</div>
                    <div className="text-white">{formatDate(lead.created_at)}</div>
                  </div>

                  <div>
                    <div className="text-neutral-500">Follow Up Date</div>
                    <div className="text-white">{lead.follow_up_date || "-"}</div>
                  </div>

                  <div>
                    <div className="text-neutral-500">Notes</div>
                    <div className="text-white whitespace-pre-wrap">
                      {lead.notes || "-"}
                    </div>
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <label className="block text-sm text-neutral-400">
                    Change Status
                  </label>

                  <select
                    value={lead.status || "New"}
                    onChange={(e) => updateStatus(e.target.value as LeadStatus)}
                    disabled={updating}
                    className="w-full rounded-xl border border-yellow-600/20 bg-black px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 disabled:opacity-60"
                  >
                    <option value="New">New</option>
                    <option value="In Review">In Review</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}