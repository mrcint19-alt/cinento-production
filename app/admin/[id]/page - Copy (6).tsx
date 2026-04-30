"use client";

/**
 * File: app/admin/[id]/page.tsx
 * Version: v2.1 LEAD DETAIL PRO PLUS
 * Updated: 2026-04-20 [Europe/Istanbul]
 * Status: ACTIVE
 */

import Link from "next/link";
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

type ActivityItem = {
  id: string;
  time: string;
  action: string;
  detail: string;
};

function safePhone(phone?: string | null) {
  if (!phone) return "";
  return String(phone).replace(/[^\d]/g, "");
}

function toDatetimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromDatetimeLocal(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [lead, setLead] = useState<LeadItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [statusValue, setStatusValue] = useState<LeadStatus>("New");
  const [notesValue, setNotesValue] = useState("");
  const [followUpValue, setFollowUpValue] = useState("");

  const [activities, setActivities] = useState<ActivityItem[]>([]);

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

        const rawLeads = Array.isArray(data?.leads)
          ? data.leads
          : Array.isArray(data)
          ? data
          : [];
        const found = rawLeads.find(
          (item: any) => String(item.id) === String(leadId)
        );

        if (!found) {
          throw new Error("Lead not found.");
        }

        const normalizedLead: LeadItem = {
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
          created_at: found.created_at || found.createdAt || "",
        };

        setLead(normalizedLead);
        setStatusValue(normalizedLead.status || "New");
        setNotesValue(normalizedLead.notes || "");
        setFollowUpValue(toDatetimeLocal(normalizedLead.follow_up_date || ""));

        const initialActivities: ActivityItem[] = [
          {
            id: "activity-created",
            time: normalizedLead.created_at || new Date().toISOString(),
            action: "Lead Created",
            detail: "Lead record loaded successfully.",
          },
        ];

        if (normalizedLead.status) {
          initialActivities.push({
            id: "activity-status",
            time: new Date().toISOString(),
            action: "Current Status",
            detail: normalizedLead.status,
          });
        }

        if (normalizedLead.follow_up_date) {
          initialActivities.push({
            id: "activity-followup",
            time: new Date().toISOString(),
            action: "Follow-up Scheduled",
            detail: normalizedLead.follow_up_date,
          });
        }

        if (normalizedLead.notes) {
          initialActivities.push({
            id: "activity-notes",
            time: new Date().toISOString(),
            action: "Notes Loaded",
            detail: normalizedLead.notes,
          });
        }

        setActivities(initialActivities);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
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

  const addActivity = (action: string, detail: string) => {
    setActivities((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        time: new Date().toISOString(),
        action,
        detail,
      },
      ...prev,
    ]);
  };

  const updateLead = async () => {
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
          status: statusValue,
          notes: notesValue,
          follow_up_date: fromDatetimeLocal(followUpValue),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Failed to update lead.");
      }

      const updatedLead = data?.lead;

      const nextLead: LeadItem = {
        ...lead,
        status: (updatedLead?.status || statusValue) as LeadStatus,
        notes: updatedLead?.notes ?? notesValue,
        follow_up_date:
          updatedLead?.follow_up_date ?? fromDatetimeLocal(followUpValue),
      };

      setLead(nextLead);
      setStatusValue(nextLead.status || "New");
      setNotesValue(nextLead.notes || "");
      setFollowUpValue(toDatetimeLocal(nextLead.follow_up_date || ""));

      addActivity("Lead Updated", "Status / Notes / Follow-up updated successfully.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Update failed.";
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

      const response = await fetch("/api/leads/delete", {
        method: "POST",
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
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-2xl font-bold text-yellow-500">
            Lead Detail
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin"
              className="rounded-xl border border-yellow-600/20 bg-black px-4 py-2 text-sm text-white transition hover:border-yellow-500"
            >
              Back to Admin
            </Link>
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
            <section className="space-y-6 rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6">
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
              <div className="space-y-6 rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6 lg:col-span-2">
                <div>
                  <h2 className="mb-4 text-xl font-semibold text-yellow-500">
                    Project Message
                  </h2>
                  <div className="whitespace-pre-wrap rounded-2xl border border-yellow-600/10 bg-black p-5 leading-7 text-neutral-300">
                    {lead.message || "-"}
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 text-xl font-semibold text-yellow-500">
                    CRM Activity Log
                  </h2>

                  <div className="space-y-3">
                    {activities.length === 0 ? (
                      <div className="rounded-2xl border border-yellow-600/10 bg-black p-4 text-neutral-400">
                        No activity yet.
                      </div>
                    ) : (
                      activities.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-yellow-600/10 bg-black p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="text-sm font-semibold text-yellow-400">
                              {item.action}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {formatDate(item.time)}
                            </div>
                          </div>

                          <div className="mt-2 whitespace-pre-wrap break-words text-sm text-neutral-300">
                            {item.detail}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-5 rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6">
                <h2 className="text-xl font-semibold text-yellow-500">
                  Lead Info
                </h2>

                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-neutral-500">Email</div>
                    <div className="break-all text-white">{lead.email || "-"}</div>
                  </div>

                  <div>
                    <div className="text-neutral-500">Phone</div>
                    <div className="text-white">{lead.phone || "-"}</div>
                  </div>

                  <div>
                    <div className="text-neutral-500">Created At</div>
                    <div className="text-white">{formatDate(lead.created_at)}</div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-sm text-neutral-400">
                    Change Status
                  </label>
                  <select
                    value={statusValue}
                    onChange={(e) => setStatusValue(e.target.value as LeadStatus)}
                    className="w-full rounded-xl border border-yellow-600/20 bg-black px-4 py-3 text-sm text-white outline-none focus:border-yellow-500"
                  >
                    <option value="New">New</option>
                    <option value="In Review">In Review</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-sm text-neutral-400">
                    Follow-up Date
                  </label>
                  <input
                    type="datetime-local"
                    value={followUpValue}
                    onChange={(e) => setFollowUpValue(e.target.value)}
                    className="w-full rounded-xl border border-yellow-600/20 bg-black px-4 py-3 text-sm text-white outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-sm text-neutral-400">Notes</label>
                  <textarea
                    value={notesValue}
                    onChange={(e) => setNotesValue(e.target.value)}
                    className="min-h-[180px] w-full rounded-xl border border-yellow-600/20 bg-black px-4 py-3 text-sm text-white outline-none focus:border-yellow-500"
                    placeholder="Write notes, follow-up results, call outcomes..."
                  />
                </div>

                <button
                  onClick={updateLead}
                  disabled={updating}
                  className="w-full rounded-xl bg-yellow-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400 disabled:opacity-60"
                >
                  {updating ? "Saving..." : "Save Lead Updates"}
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}