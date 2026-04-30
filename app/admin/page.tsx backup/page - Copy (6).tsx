"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    const res = await fetch("/api/contact", {
      cache: "no-store",
    });

    const data = await res.json();

    setAllLeads(data.leads || []);
    setLeads(data.leads || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSearch = (value: string) => {
    const v = value.toLowerCase();

    const filtered = allLeads.filter((lead) =>
      lead.name?.toLowerCase().includes(v) ||
      lead.email?.toLowerCase().includes(v) ||
      lead.phone?.includes(v)
    );

    setLeads(filtered);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Delete this lead?");
    if (!confirmDelete) return;

    await fetch("/api/contact", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    fetchLeads();
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">
        CINENTO Admin Panel
      </h1>

      {/* Dashboard */}
      <div className="flex gap-6 mb-6 text-sm">
        <div>Total: {allLeads.length}</div>

        <div>
          Hot: {allLeads.filter(l => l.lead_temperature === "Hot").length}
        </div>

        <div>
          Warm: {allLeads.filter(l => l.lead_temperature === "Warm").length}
        </div>

        <div>
          Cold: {allLeads.filter(l => l.lead_temperature === "Cold").length}
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email, phone..."
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-4 p-2 w-full bg-black border border-gray-600 rounded"
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-700 text-sm">
            <thead>
              <tr className="text-yellow-400 border-b border-gray-700">
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Category</th>
                <th>Temp</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-800 text-center">
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>

                  <td>
                    <span className="px-2 py-1 bg-gray-800 rounded">
                      {lead.status}
                    </span>
                  </td>

                  <td>{lead.category}</td>

                  <td>
                    <span className="px-2 py-1 bg-yellow-600 rounded">
                      {lead.lead_temperature || "-"}
                    </span>
                  </td>

                  <td>
                    {lead.created_at
                      ? new Date(lead.created_at).toLocaleString()
                      : "-"}
                  </td>

                  <td className="flex gap-2 justify-center py-2">
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${lead.phone}`}
                      target="_blank"
                      className="bg-green-500 px-3 py-1 rounded"
                    >
                      WhatsApp
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${lead.email}`}
                      className="bg-blue-500 px-3 py-1 rounded"
                    >
                      Email
                    </a>

                    {/* View */}
                    <a
                      href={`/admin/${lead.id}`}
                      className="bg-yellow-500 px-3 py-1 rounded text-black"
                    >
                      View
                    </a>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="bg-red-500 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}