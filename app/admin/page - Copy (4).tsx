// File: app/admin/page.tsx
// Version: v5.0 AUTO REFRESH
// Updated: 2026-04-18
// Status: AUTO REFRESH ENABLED (NO CACHE)

"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/contact", {
        cache: "no-store", // 🔥 مهم: حذف کش
      });

      const data = await res.json();

      if (!data.success) throw new Error("Failed to fetch");

      setLeads(data.leads);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();

    // 🔥 Auto Refresh هر 3 ثانیه
    const interval = setInterval(() => {
      fetchLeads();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">CINENTO Admin Panel</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <table className="w-full mt-6 border">
        <thead>
          <tr className="text-yellow-400 border-b">
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Temperature</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b text-center">
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.status}</td>
              <td>{lead.lead_temperature || "-"}</td>

              <td>
                <a
                  href={`/admin/${lead.id}`}
                  className="bg-yellow-500 px-3 py-1 rounded text-black"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}