"use client";

// File: app/admin/page.tsx
// Version: v2.1
// Updated: 2026-04-16 [Europe/Istanbul]
// Status: AUTO SALES CRM DASHBOARD (WHATSAPP + EMAIL + AUTO CONTACTED)

import Link from "next/link";
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
  lead_temperature?: LeadTemperature | null;
  created_at?: string;
};

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"All" | LeadTemperature>("All");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [sendingEmailId, setSendingEmailId] = useState<string | number | null>(
    null
  );
  const [openingWhatsappId, setOpeningWhatsappId] = useState<
    string | number | null
  >(null);

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

        let rawLeads: any[] = [];

        if (Array.isArray(data)) {
          rawLeads = data;
        } else if (Array.isArray(data?.leads)) {
          rawLeads = data.leads;
        } else if (Array.isArray(data?.data)) {
          rawLeads = data.data;
        } else {
          rawLeads = [];
        }

        const normalizedLeads: LeadItem[] = rawLeads.map((lead: any) => ({
          id: lead.id,
          name: lead.name || "",
          email: lead.email || "",
          phone: lead.phone || "",
          message: lead.message || "",
          status: (lead.status || "New") as LeadStatus,
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
          (lead.message || "").toLowerCase().includes(q)
      );
    }

    return result;
  }, [leads, filter, search]);

  const hotCount = leads.filter((lead) => lead.lead_temperature === "Hot").length;
  const warmCount = leads.filter((lead) => lead.lead_temperature === "Warm").length;
  const coldCount = leads.filter(
    (lead) => !lead.lead_temperature || lead.lead_temperature === "Cold"
  ).length;

  const getTemperatureBadgeClass = (temperature?: LeadTemperature | null) => {
    if (temperature === "Hot") {
      return "bg-red-500/20 text-red-300 border border-red-500/30";
    }

    if (temperature === "Warm") {
      return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
    }

    return "bg-neutral-500/20 text-neutral-300 border border-neutral-500/30";
  };

  const getStatusBadgeClass = (status: LeadStatus) => {
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
  };

  const formatDate = (value?: string) => {
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

      const response = await fetch("/api/leads/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: leadId,
          status: newStatus,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
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
    if (lead.status === "Closed" || lead.status === "Contacted") {
      return;
    }

    try {
      const response = await fetch("/api/leads/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: lead.id,
          status: "Contacted",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(leadId);
      setError("");

      const response = await fetch("/api/leads/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: leadId }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
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

  const buildSalesWhatsAppMessage = (lead: LeadItem) => {
    const temperature = lead.lead_temperature || "Cold";

    if (temperature === "Hot") {
      return `
Hello ${lead.name},

This is CINENTO.

We received your project request and it looks highly relevant for immediate discussion.

I would like to schedule a short call with you to understand the project and see how we can move it forward professionally.

When are you available today or tomorrow?

— CINENTO
From Idea to International Film Market
      `.trim();
    }

    if (temperature === "Warm") {
      return `
Hello ${lead.name},

This is CINENTO.

Thank you for contacting us through our platform.

Your project looks interesting and I’d like to understand it better.

Let’s arrange a short call and explore the best next step for your project.

When would be a good time for you?

— CINENTO
From Idea to International Film Market
      `.trim();
    }

    return `
Hello ${lead.name},

This is CINENTO.

Thank you for your project request.

I’d be happy to learn more about your idea and understand what kind of support you need.

When you are available, we can arrange a short introduction call.

— CINENTO
From Idea to International Film Market
    `.trim();
  };

  const buildWhatsAppUrl = (lead: LeadItem) => {
    const cleanPhone = (lead.phone || "").replace(/\D/g, "");
    const message = buildSalesWhatsAppMessage(lead);

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const handleWhatsAppClick = async (lead: LeadItem) => {
    try {
      if (!lead.phone || lead.phone.replace(/\D/g, "").length < 8) {
        throw new Error("This lead does not have a valid phone number.");
      }

      setOpeningWhatsappId(lead.id);
      setError("");

      const whatsappUrl = buildWhatsAppUrl(lead);
      window.open(whatsappUrl, "_blank");

      await silentlyMarkAsContacted(lead);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "WhatsApp action failed.";
      setError(message);
      alert(message);
    } finally {
      setOpeningWhatsappId(null);
    }
  };

  const buildSalesEmailContent = (lead: LeadItem) => {
    const temperature = lead.lead_temperature || "Cold";

    if (temperature === "Hot") {
      return {
        subject: "CINENTO | Project Discussion",
        body: `Hello ${lead.name},

Thank you for reaching out to CINENTO.

We reviewed your inquiry and your project appears highly relevant for professional development and positioning.

I would be glad to arrange a short call to better understand your goals and discuss the right development path.

Please let me know your availability.

Best regards,
CINENTO
From Idea to International Film Market`,
      };
    }

    if (temperature === "Warm") {
      return {
        subject: "CINENTO | Project Follow-Up",
        body: `Hello ${lead.name},

Thank you for contacting CINENTO.

We received your project request and would be pleased to learn more about it.

A short call would help us understand the project better and recommend the best next step.

Please share a suitable time for you.

Best regards,
CINENTO
From Idea to International Film Market`,
      };
    }

    return {
      subject: "CINENTO | Thank You for Your Inquiry",
      body: `Hello ${lead.name},

Thank you for contacting CINENTO.

We received your message and would be happy to understand your project in more detail.

When convenient for you, we can arrange a short introductory conversation.

Best regards,
CINENTO
From Idea to International Film Market`,
    };
  };

  const sendLeadEmail = async (lead: LeadItem) => {
    try {
      if (!lead.email) {
        throw new Error("This lead does not have an email address.");
      }

      setSendingEmailId(lead.id);
      setError("");

      const emailContent = buildSalesEmailContent(lead);

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: lead.email,
          name: lead.name,
          subject: emailContent.subject,
          message: emailContent.body,
          lead_id: lead.id,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "Failed to send email.");
      }

      await silentlyMarkAsContacted(lead);
      alert(data?.message || `Email sent successfully to ${lead.email}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Email sending failed.";
      setError(message);
      alert(message);
    } finally {
      setSendingEmailId(null);
    }
  };

  const escapeCsvValue = (value: unknown) => {
    const stringValue = String(value ?? "");
    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  const exportToCsv = () => {
    try {
      const headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Priority",
        "Status",
        "Message",
        "Created At",
      ];

      const rows = filteredLeads.map((lead) => [
        lead.id,
        lead.name,
        lead.email,
        lead.phone,
        lead.lead_temperature || "Cold",
        lead.status,
        lead.message,
        lead.created_at || "",
      ]);

      const csvContent = [
        headers.map(escapeCsvValue).join(","),
        ...rows.map((row) => row.map(escapeCsvValue).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const now = new Date();
      const fileName = `cinento_leads_${now
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-")}.csv`;

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "CSV export failed.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-8">
        <div className="rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6 md:p-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-yellow-600">
                  CINENTO
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mt-2">
                  CRM Dashboard
                </h1>
                <p className="text-neutral-400 mt-3 max-w-2xl leading-7">
                  Review incoming leads, monitor priority, and move directly into
                  WhatsApp or Email follow-up.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setFilter("All")}
                  className={`px-4 py-2 rounded-xl border transition ${
                    filter === "All"
                      ? "bg-yellow-600 text-black border-yellow-500"
                      : "bg-black/40 border-yellow-600/20 hover:border-yellow-500"
                  }`}
                >
                  All
                </button>

                <button
                  onClick={() => setFilter("Hot")}
                  className={`px-4 py-2 rounded-xl border transition ${
                    filter === "Hot"
                      ? "bg-red-500 text-white border-red-400"
                      : "bg-black/40 border-red-500/30 hover:border-red-400"
                  }`}
                >
                  Hot
                </button>

                <button
                  onClick={() => setFilter("Warm")}
                  className={`px-4 py-2 rounded-xl border transition ${
                    filter === "Warm"
                      ? "bg-yellow-500 text-black border-yellow-400"
                      : "bg-black/40 border-yellow-500/30 hover:border-yellow-400"
                  }`}
                >
                  Warm
                </button>

                <button
                  onClick={() => setFilter("Cold")}
                  className={`px-4 py-2 rounded-xl border transition ${
                    filter === "Cold"
                      ? "bg-neutral-500 text-white border-neutral-400"
                      : "bg-black/40 border-neutral-500/30 hover:border-neutral-400"
                  }`}
                >
                  Cold
                </button>

                <button
                  onClick={exportToCsv}
                  className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-500 transition"
                >
                  Export CSV
                </button>
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Search name, email, phone, message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-96 bg-black border border-yellow-600/30 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-yellow-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-neutral-950 border border-yellow-600/20 p-5">
            <div className="text-sm text-neutral-400">Total Leads</div>
            <div className="text-3xl font-bold mt-2">{leads.length}</div>
          </div>

          <div className="rounded-2xl bg-neutral-950 border border-red-500/20 p-5">
            <div className="text-sm text-neutral-400">Hot Leads</div>
            <div className="text-3xl font-bold mt-2">{hotCount}</div>
          </div>

          <div className="rounded-2xl bg-neutral-950 border border-yellow-500/20 p-5">
            <div className="text-sm text-neutral-400">Warm Leads</div>
            <div className="text-3xl font-bold mt-2">{warmCount}</div>
          </div>

          <div className="rounded-2xl bg-neutral-950 border border-neutral-500/20 p-5">
            <div className="text-sm text-neutral-400">Cold Leads</div>
            <div className="text-3xl font-bold mt-2">{coldCount}</div>
          </div>
        </div>

        <div className="rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6">
          {error ? <div className="text-red-400 mb-4">{error}</div> : null}

          {loading ? (
            <div className="text-neutral-400">Loading leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-neutral-400">No leads found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1520px] text-sm">
                <thead>
                  <tr className="text-left text-neutral-400 border-b border-yellow-600/10">
                    <th className="py-4 pr-4">Name</th>
                    <th className="py-4 pr-4">Email</th>
                    <th className="py-4 pr-4">Phone</th>
                    <th className="py-4 pr-4">Priority</th>
                    <th className="py-4 pr-4">Status</th>
                    <th className="py-4 pr-4">Message</th>
                    <th className="py-4 pr-4">Created</th>
                    <th className="py-4 pr-4">WhatsApp</th>
                    <th className="py-4 pr-4">Email</th>
                    <th className="py-4 pr-4">View Lead</th>
                    <th className="py-4 pr-4">Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-yellow-600/10 align-top"
                    >
                      <td className="py-4 pr-4 font-medium text-white">
                        <div className="whitespace-pre-wrap break-words">
                          {lead.name || "-"}
                        </div>
                      </td>

                      <td className="py-4 pr-4 text-neutral-300">
                        <div className="whitespace-pre-wrap break-words">
                          {lead.email || "-"}
                        </div>
                      </td>

                      <td className="py-4 pr-4 text-neutral-300">
                        {lead.phone || "-"}
                      </td>

                      <td className="py-4 pr-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getTemperatureBadgeClass(
                            lead.lead_temperature
                          )}`}
                        >
                          {lead.lead_temperature || "Cold"}
                        </span>
                      </td>

                      <td className="py-4 pr-4">
                        <div className="flex flex-col gap-2 min-w-[170px]">
                          <span
                            className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                              lead.status
                            )}`}
                          >
                            {lead.status}
                          </span>

                          <select
                            value={lead.status}
                            disabled={updatingId === lead.id}
                            onChange={(e) =>
                              updateLeadStatus(
                                lead.id,
                                e.target.value as LeadStatus
                              )
                            }
                            className="bg-black border border-yellow-600/30 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500 disabled:opacity-60 cursor-pointer"
                          >
                            <option value="New">New</option>
                            <option value="In Review">In Review</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                      </td>

                      <td className="py-4 pr-4 text-neutral-300 max-w-[320px]">
                        <div className="whitespace-pre-wrap break-words leading-6">
                          {lead.message || "-"}
                        </div>
                      </td>

                      <td className="py-4 pr-4 text-neutral-400">
                        {formatDate(lead.created_at)}
                      </td>

                      <td className="py-4 pr-4">
                        <button
                          onClick={() => handleWhatsAppClick(lead)}
                          disabled={openingWhatsappId === lead.id}
                          className="inline-flex px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-500 transition disabled:opacity-60"
                        >
                          {openingWhatsappId === lead.id
                            ? "Opening..."
                            : "WhatsApp"}
                        </button>
                      </td>

                      <td className="py-4 pr-4">
                        <button
                          onClick={() => sendLeadEmail(lead)}
                          disabled={sendingEmailId === lead.id}
                          className="inline-flex px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-60"
                        >
                          {sendingEmailId === lead.id ? "Sending..." : "Email"}
                        </button>
                      </td>

                      <td className="py-4 pr-4">
                        <Link
                          href={`/admin/${lead.id}`}
                          className="inline-flex px-4 py-2 rounded-xl bg-yellow-600 text-black hover:bg-yellow-500 transition"
                        >
                          View Lead
                        </Link>
                      </td>

                      <td className="py-4 pr-4">
                        <button
                          onClick={() => deleteLead(lead.id)}
                          disabled={deletingId === lead.id}
                          className="inline-flex px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition disabled:opacity-60"
                        >
                          {deletingId === lead.id ? "Deleting..." : "Delete"}
                        </button>
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