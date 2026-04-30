"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "New" | "In Review" | "Contacted" | "Closed";
  lead_temperature: "Hot" | "Warm" | "Cold";
  created_at: string;
};

function formatDateSafe(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

function makeLeadKey(lead: Lead, index: number) {
  return `${lead.id ?? "no-id"}-${lead.email ?? "no-email"}-${
    lead.created_at ?? "no-date"
  }-${index}`;
}

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Hot" | "Warm" | "Cold">("All");

  useEffect(() => {
    async function loadLeads() {
      try {
        const res = await fetch("/api/contact", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();
        setLeads(data || []);
      } catch (err) {
        console.error("Load Leads Error:", err);
      }
    }

    loadLeads();
  }, []);

  const filtered = leads.filter((lead) => {
    const matchSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.message.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All" || lead.lead_temperature === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6">
        CINENTO CRM Dashboard
      </h1>

      {/* FILTERS */}
      <div className="flex gap-3 mb-6">
        {["All", "Hot", "Warm", "Cold"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-xl ${
              filter === f
                ? "bg-yellow-500 text-black"
                : "bg-neutral-800 text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search..."
        className="w-full p-3 bg-neutral-900 rounded-xl mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LEADS */}
      <div className="space-y-4">
        {filtered.map((lead, index) => (
          <div
            key={makeLeadKey(lead, index)}  // ✅ FIXED HERE
            className="bg-neutral-900 p-6 rounded-2xl border border-yellow-500/20"
          >
            <div className="flex justify-between gap-4">
              <div>
                <div className="text-yellow-400 text-lg">
                  {lead.name}
                </div>
                <div className="text-sm text-neutral-400">
                  {lead.email}
                </div>
              </div>

              <div className="text-xs text-neutral-500">
                {formatDateSafe(lead.created_at)}
              </div>
            </div>

            <div className="mt-3 text-sm whitespace-pre-line">
              {lead.message}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-4">
              <button className="bg-green-500 px-3 py-1 rounded">
                Contacted
              </button>

              <button className="bg-red-500 px-3 py-1 rounded">
                Delete
              </button>

              <button className="bg-yellow-500 text-black px-3 py-1 rounded">
                Email
              </button>

              <button className="bg-green-600 px-3 py-1 rounded">
                WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}