"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    const res = await fetch("/api/contact", {
      cache: "no-store",
    });
    const data = await res.json();
    setLeads(data.leads || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();

    const interval = setInterval(() => {
      fetchLeads();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">
        CINENTO Admin Panel
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-700">
            <thead>
              <tr className="bg-black text-yellow-400">
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
                <tr key={lead.id} className="border-t border-gray-700 text-center">
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
                    {new Date(lead.created_at).toLocaleString()}
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
                    <button className="bg-red-500 px-3 py-1 rounded">
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