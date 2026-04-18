"use client";

/**
 * File: app/admin/page.tsx
 * Version: v5.1 ADMIN PRO WITH VIEW LEAD
 * Updated: 2026-04-18 [Europe/Istanbul]
 * Status: ACTIVE
 */

import { useEffect, useMemo, useState } from "react";

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

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"All" | LeadTemperature>("All");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [openingWhatsappId, setOpeningWhatsappId] = useState<string | number | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/contact", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load leads.");
        }

        const rawLeads = Array.isArray(data?.leads) ? data.leads : [];

        const normalizedLeads: LeadItem[] = rawLeads.map((lead: any) => ({
          id: lead.id,
          name: lead.name || "",
          email: lead.email || "",
          phone: lead.phone || "",
          message: lead.message || "",
          status: (lead.status || "New") as LeadStatus,
          category: lead.category || "Film",
          follow_up_date: lead.follow_up_date || "",
          notes: lead.notes || "",
          lead_temperature: (lead.lead_temperature || "Cold") as LeadTemperature,
          created_at: lead.created_at || "",
        }));

        setLeads(normalizedLeads);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    let result = leads;

    if (filter !== "All") {
      result = result.filter(
        (lead) => (lead.lead_temperature || "Cold") === filter
      );
    }

    if (search.trim() !== "") {
      const q = search.toLowerCase();

      result = result.filter(
        (lead) =>
          (lead.name || "").toLowerCase().includes(q) ||
          (lead.email || "").toLowerCase().includes(q) ||
          (lead.phone || "").toLowerCase().includes(q) ||
          (lead.message || "").toLowerCase().includes(q) ||
          (lead.status || "").toLowerCase().includes(q) ||
          (lead.category || "").toLowerCase().includes(q)
      );
    }

    return result;
  }, [leads, filter, search]);

  const hotCount = leads.filter((lead) => lead.lead_temperature === "Hot").length;
  const warmCount = leads.filter((lead) => lead.lead_temperature === "Warm").length;
  const coldCount = leads.filter(
    (lead) => !lead.lead_temperature || lead.lead_temperature === "Cold"
  ).length;
  const contactedCount = leads.filter((lead) => lead.status === "Contacted").length;

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

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  const updateLeadStatus = async (
    leadId: string | number,
    newStatus: LeadStatus
  ) => {
    try {
      setUpdatingId(leadId);
      setError("");

      const response = await fetch("/api/contact", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: leadId,
          status: newStatus,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Failed to update status.");
      }

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Status update failed.";
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const silentlyMarkAsContacted = async (lead: LeadItem) => {
    if (lead.status === "Closed" || lead.status === "Contacted") return;

    try {
      const response = await fetch("/api/contact", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: lead.id,
          status: "Contacted",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Failed to update status.");
      }

      setLeads((prev) =>
        prev.map((item) =>
          item.id === lead.id ? { ...item, status: "Contacted" } : item
        )
      );
    } catch (err) {
      console.error("AUTO CONTACTED STATUS ERROR:", err);
    }
  };

  const deleteLead = async (leadId: string | number) => {
    const confirmed = window.confirm("Are you sure you want to delete this lead?");
    if (!confirmed) return;

    try {
      setDeletingId(leadId);
      setError("");

      const response = await fetch("/api/contact", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: leadId }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Failed to delete lead.");
      }

      setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Delete failed.";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  const openWhatsApp = async (lead: LeadItem) => {
    const phone = safePhone(lead.phone);
    if (!phone) {
      setError("Phone number is missing.");
      return;
    }

    try {
      setOpeningWhatsappId(lead.id);

      const message = `Hello ${lead.name || ""}, this is CINENTO regarding your project inquiry.`;
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      window.open(waUrl, "_blank");

      await silentlyMarkAsContacted(lead);
    } finally {
      setOpeningWhatsappId(null);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-red-500 text-2xl font-bold">ADMIN V5 LIVE</div>

        <section className="rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-yellow-500">
              CINENTO Admin Panel
            </h1>
            <p className="text-neutral-400 mt-2">
              Website leads connected to CRM
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            <div className="rounded-2xl border border-yellow-600/20 bg-black p-4">
              <div className="text-sm text-neutral-400">Total Leads</div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {leads.length}
              </div>
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-black p-4">
              <div className="text-sm text-neutral-400">Hot Leads</div>
              <div className="mt-2 text-2xl font-semibold text-red-300">
                {hotCount}
              </div>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-black p-4">
              <div className="text-sm text-neutral-400">Warm Leads</div>
              <div className="mt-2 text-2xl font-semibold text-yellow-200">
                {warmCount}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-500/20 bg-black p-4">
              <div className="text-sm text-neutral-400">Cold Leads</div>
              <div className="mt-2 text-2xl font-semibold text-neutral-200">
                {coldCount}
              </div>
            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-black p-4">
              <div className="text-sm text-neutral-400">Contacted</div>
              <div className="mt-2 text-2xl font-semibold text-blue-300">
                {contactedCount}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, status..."
              className="w-full md:max-w-md rounded-xl border border-yellow-600/20 bg-black px-4 py-3 text-white outline-none focus:border-yellow-500"
            />

            <div className="flex flex-wrap gap-2">
              {(["All", "Hot", "Warm", "Cold"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-xl px-4 py-2 text-sm transition ${
                    filter === item
                      ? "bg-yellow-500 text-black"
                      : "border border-yellow-600/20 bg-black text-neutral-300 hover:border-yellow-500"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6">
          {loading ? (
            <div className="text-neutral-300">Loading leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-neutral-400">No leads found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1600px] border-collapse">
                <thead>
                  <tr className="border-b border-yellow-600/20 text-left text-sm text-yellow-500">
                    <th className="py-3 pr-4">Name</th>
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">Phone</th>
                    <th className="py-3 pr-4">Message</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Category</th>
                    <th className="py-3 pr-4">Temperature</th>
                    <th className="py-3 pr-4">Created At</th>
                    <th className="py-3 pr-4">Actions</th>
                    <th className="py-3 pr-4">Manage</th>
                    <th className="py-3 pr-4">View</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={String(lead.id)}
                      className="border-b border-white/5 align-top text-sm text-neutral-300"
                    >
                      <td className="py-4 pr-4 whitespace-nowrap">{lead.name || "-"}</td>
                      <td className="py-4 pr-4 whitespace-nowrap">{lead.email || "-"}</td>
                      <td className="py-4 pr-4 whitespace-nowrap">{lead.phone || "-"}</td>

                      <td className="py-4 pr-4 min-w-[320px] whitespace-pre-wrap break-words leading-6">
                        {lead.message || "-"}
                      </td>

                      <td className="py-4 pr-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(
                            lead.status || "New"
                          )}`}
                        >
                          {lead.status || "-"}
                        </span>
                      </td>

                      <td className="py-4 pr-4 whitespace-nowrap">{lead.category || "-"}</td>

                      <td className="py-4 pr-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getTemperatureBadgeClass(
                            lead.lead_temperature
                          )}`}
                        >
                          {lead.lead_temperature || "Cold"}
                        </span>
                      </td>

                      <td className="py-4 pr-4 whitespace-nowrap">
                        {formatDate(lead.created_at)}
                      </td>

                      <td className="py-4 pr-4">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => openWhatsApp(lead)}
                            disabled={openingWhatsappId === lead.id}
                            className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
                          >
                            {openingWhatsappId === lead.id ? "Opening..." : "WhatsApp"}
                          </button>

                          {lead.email ? (
                            <a
                              href={`mailto:${lead.email}`}
                              className="rounded-lg bg-blue-600 px-3 py-1.5 text-center text-xs font-medium text-white transition hover:bg-blue-700"
                            >
                              Email
                            </a>
                          ) : (
                            <span className="rounded-lg bg-neutral-800 px-3 py-1.5 text-center text-xs text-neutral-400">
                              No Email
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 pr-4">
                        <div className="flex flex-col gap-2 min-w-[140px]">
                          <select
                            value={lead.status || "New"}
                            onChange={(e) =>
                              updateLeadStatus(lead.id, e.target.value as LeadStatus)
                            }
                            disabled={updatingId === lead.id}
                            className="rounded-lg border border-yellow-600/20 bg-black px-3 py-2 text-xs text-white outline-none focus:border-yellow-500 disabled:opacity-60"
                          >
                            <option value="New">New</option>
                            <option value="In Review">In Review</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Closed">Closed</option>
                          </select>

                          <button
                            onClick={() => deleteLead(lead.id)}
                            disabled={deletingId === lead.id}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                          >
                            {deletingId === lead.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>

                      <td className="py-4 pr-4">
                        <a
                          href={`/admin/${lead.id}`}
                          className="inline-flex rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-medium text-black transition hover:bg-yellow-400"
                        >
                          View Lead
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}