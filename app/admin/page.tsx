"use client";

/**
 * File: app/admin/page.tsx
 * Version: v7.0 FOLLOW-UP DASHBOARD PRO
 * Updated: 2026-04-18 [Europe/Istanbul]
 * Status: ACTIVE
 */

import { useEffect, useMemo, useState } from "react";

type LeadItem = {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  category?: string | null;
  lead_temperature?: string | null;
  created_at?: string | null;
  follow_up_date?: string | null;
};

function safePhone(phone?: string | null) {
  if (!phone) return "";
  return String(phone).replace(/[^\d]/g, "");
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function isTodayDate(value?: string | null) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isFutureDate(value?: string | null) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();

  if (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  ) {
    return false;
  }

  return date.getTime() > now.getTime();
}

function isOverdueDate(value?: string | null) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();

  if (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  ) {
    return false;
  }

  return date.getTime() < now.getTime();
}

export default function AdminPage() {
  const [allLeads, setAllLeads] = useState<LeadItem[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/contact", {
        cache: "no-store",
      });

      const data = await res.json();

      setAllLeads(data?.leads || []);
      setLoading(false);
    } catch (error) {
      console.error("FETCH LEADS ERROR:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      setLeads(allLeads);
      return;
    }

    const filtered = allLeads.filter((lead) => {
      const name = String(lead.name || "").toLowerCase();
      const email = String(lead.email || "").toLowerCase();
      const phone = String(lead.phone || "");
      const status = String(lead.status || "").toLowerCase();

      return (
        name.includes(value) ||
        email.includes(value) ||
        phone.includes(value) ||
        status.includes(value)
      );
    });

    setLeads(filtered);
  }, [search, allLeads]);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Delete this lead?");
    if (!confirmDelete) return;

    try {
      await fetch("/api/contact", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      await fetchLeads();
    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };

  const totalCount = allLeads.length;
  const hotCount = allLeads.filter((l) => l.lead_temperature === "Hot").length;
  const warmCount = allLeads.filter((l) => l.lead_temperature === "Warm").length;
  const coldCount = allLeads.filter(
    (l) => !l.lead_temperature || l.lead_temperature === "Cold"
  ).length;

  const todayFollowUps = useMemo(
    () => allLeads.filter((lead) => isTodayDate(lead.follow_up_date)),
    [allLeads]
  );

  const upcomingFollowUps = useMemo(
    () => allLeads.filter((lead) => isFutureDate(lead.follow_up_date)),
    [allLeads]
  );

  const overdueFollowUps = useMemo(
    () => allLeads.filter((lead) => isOverdueDate(lead.follow_up_date)),
    [allLeads]
  );

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <h1 className="text-2xl font-bold text-yellow-400">
          CINENTO Admin Panel
        </h1>

        {/* MAIN DASHBOARD */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-yellow-600/20 bg-neutral-950 p-4">
            <div className="text-sm text-neutral-400">Total</div>
            <div className="mt-2 text-2xl font-semibold text-white">{totalCount}</div>
          </div>

          <div className="rounded-xl border border-red-500/20 bg-neutral-950 p-4">
            <div className="text-sm text-neutral-400">Hot</div>
            <div className="mt-2 text-2xl font-semibold text-red-300">{hotCount}</div>
          </div>

          <div className="rounded-xl border border-yellow-500/20 bg-neutral-950 p-4">
            <div className="text-sm text-neutral-400">Warm</div>
            <div className="mt-2 text-2xl font-semibold text-yellow-200">{warmCount}</div>
          </div>

          <div className="rounded-xl border border-neutral-500/20 bg-neutral-950 p-4">
            <div className="text-sm text-neutral-400">Cold</div>
            <div className="mt-2 text-2xl font-semibold text-neutral-200">{coldCount}</div>
          </div>
        </div>

        {/* FOLLOW-UP DASHBOARD */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-blue-500/20 bg-neutral-950 p-4">
            <div className="text-sm text-neutral-400">Today Follow-ups</div>
            <div className="mt-2 text-2xl font-semibold text-blue-300">
              {todayFollowUps.length}
            </div>
          </div>

          <div className="rounded-xl border border-green-500/20 bg-neutral-950 p-4">
            <div className="text-sm text-neutral-400">Upcoming Follow-ups</div>
            <div className="mt-2 text-2xl font-semibold text-green-300">
              {upcomingFollowUps.length}
            </div>
          </div>

          <div className="rounded-xl border border-orange-500/20 bg-neutral-950 p-4">
            <div className="text-sm text-neutral-400">Overdue Follow-ups</div>
            <div className="mt-2 text-2xl font-semibold text-orange-300">
              {overdueFollowUps.length}
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by name, email, phone, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-700 bg-black p-3 text-white outline-none focus:border-yellow-500"
        />

        {/* TABLE */}
        {loading ? (
          <div className="text-neutral-300">Loading...</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full min-w-[1400px] text-sm">
              <thead className="bg-neutral-950 text-yellow-400">
                <tr>
                  <th className="px-3 py-3 text-left">Name</th>
                  <th className="px-3 py-3 text-left">Email</th>
                  <th className="px-3 py-3 text-left">Phone</th>
                  <th className="px-3 py-3 text-left">Status</th>
                  <th className="px-3 py-3 text-left">Category</th>
                  <th className="px-3 py-3 text-left">Temp</th>
                  <th className="px-3 py-3 text-left">Follow-up</th>
                  <th className="px-3 py-3 text-left">Created</th>
                  <th className="px-3 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => {
                  const phone = safePhone(lead.phone);

                  return (
                    <tr key={lead.id} className="border-t border-gray-800">
                      <td className="px-3 py-3">{lead.name || "-"}</td>
                      <td className="px-3 py-3">{lead.email || "-"}</td>
                      <td className="px-3 py-3">{lead.phone || "-"}</td>

                      <td className="px-3 py-3">
                        <span className="rounded bg-neutral-800 px-2 py-1 text-xs">
                          {lead.status || "-"}
                        </span>
                      </td>

                      <td className="px-3 py-3">{lead.category || "-"}</td>

                      <td className="px-3 py-3">
                        <span className="rounded bg-yellow-600 px-2 py-1 text-xs text-black">
                          {lead.lead_temperature || "-"}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        {lead.follow_up_date ? formatDate(lead.follow_up_date) : "-"}
                      </td>

                      <td className="px-3 py-3">
                        {lead.created_at ? formatDate(lead.created_at) : "-"}
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          {phone ? (
                            <a
                              href={`https://wa.me/${phone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded bg-green-500 px-3 py-1 text-xs text-white"
                            >
                              WhatsApp
                            </a>
                          ) : null}

                          {lead.email ? (
                            <a
                              href={`mailto:${lead.email}`}
                              className="rounded bg-blue-500 px-3 py-1 text-xs text-white"
                            >
                              Email
                            </a>
                          ) : null}

                          <a
                            href={`/admin/${lead.id}`}
                            className="rounded bg-yellow-500 px-3 py-1 text-xs text-black"
                          >
                            View
                          </a>

                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="rounded bg-red-500 px-3 py-1 text-xs text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {leads.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-3 py-6 text-center text-neutral-400"
                    >
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* FOLLOW-UP LISTS */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-blue-500/20 bg-neutral-950 p-4">
            <h2 className="mb-3 text-lg font-semibold text-blue-300">
              Today Follow-ups
            </h2>
            <div className="space-y-2">
              {todayFollowUps.length === 0 ? (
                <div className="text-sm text-neutral-500">No follow-ups today.</div>
              ) : (
                todayFollowUps.map((lead) => (
                  <a
                    key={`today-${lead.id}`}
                    href={`/admin/${lead.id}`}
                    className="block rounded border border-blue-500/10 bg-black p-3 text-sm hover:border-blue-400"
                  >
                    <div className="font-medium text-white">{lead.name || "-"}</div>
                    <div className="text-neutral-400">{formatDate(lead.follow_up_date)}</div>
                  </a>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-green-500/20 bg-neutral-950 p-4">
            <h2 className="mb-3 text-lg font-semibold text-green-300">
              Upcoming Follow-ups
            </h2>
            <div className="space-y-2">
              {upcomingFollowUps.length === 0 ? (
                <div className="text-sm text-neutral-500">No upcoming follow-ups.</div>
              ) : (
                upcomingFollowUps.map((lead) => (
                  <a
                    key={`upcoming-${lead.id}`}
                    href={`/admin/${lead.id}`}
                    className="block rounded border border-green-500/10 bg-black p-3 text-sm hover:border-green-400"
                  >
                    <div className="font-medium text-white">{lead.name || "-"}</div>
                    <div className="text-neutral-400">{formatDate(lead.follow_up_date)}</div>
                  </a>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-orange-500/20 bg-neutral-950 p-4">
            <h2 className="mb-3 text-lg font-semibold text-orange-300">
              Overdue Follow-ups
            </h2>
            <div className="space-y-2">
              {overdueFollowUps.length === 0 ? (
                <div className="text-sm text-neutral-500">No overdue follow-ups.</div>
              ) : (
                overdueFollowUps.map((lead) => (
                  <a
                    key={`overdue-${lead.id}`}
                    href={`/admin/${lead.id}`}
                    className="block rounded border border-orange-500/10 bg-black p-3 text-sm hover:border-orange-400"
                  >
                    <div className="font-medium text-white">{lead.name || "-"}</div>
                    <div className="text-neutral-400">{formatDate(lead.follow_up_date)}</div>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}