// File: components/email-history-table.tsx
// Version: v3.2
// Updated: 2026-04-15 [Europe/Istanbul]
// Status: EMAIL HISTORY TABLE WITH VIEW ACTION

import Link from "next/link";
import type { EmailHistoryItem } from "@/lib/email-logs";

export default function EmailHistoryTable({
  emails,
}: {
  emails: EmailHistoryItem[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">To</th>
            <th className="p-3 text-left">Subject</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Lead ID</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {emails.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No emails found
              </td>
            </tr>
          ) : (
            emails.map((email) => (
              <tr key={email.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  {email.created_at
                    ? new Date(email.created_at).toLocaleString()
                    : "-"}
                </td>
                <td className="p-3">{email.to_email}</td>
                <td className="p-3">{email.subject}</td>
                <td className="p-3">{email.status}</td>
                <td className="p-3 break-all">{email.lead_id || "-"}</td>
                <td className="p-3">
                  <Link
                    href={`/email-history/${email.id}`}
                    className="inline-flex rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-gray-100"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}