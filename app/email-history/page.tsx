// File: app/email-history/page.tsx
// Version: v2.3
// Updated: 2026-04-15 [Europe/Istanbul]
// Status: EMAIL HISTORY PAGE

import { getEmailLogs } from "@/lib/email-logs";
import EmailHistoryTable from "@/components/email-history-table";

export default async function EmailHistoryPage() {
  const emails = await getEmailLogs();

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-semibold">Email History</h1>
        <EmailHistoryTable emails={emails} />
      </div>
    </main>
  );
}