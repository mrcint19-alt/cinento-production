// File: app/email-history/[id]/page.tsx
// Version: v1.2
// Updated: 2026-04-15 [Europe/Istanbul]
// Status: EMAIL DETAIL PAGE

import Link from "next/link";
import { notFound } from "next/navigation";
import { getEmailLogById } from "@/lib/email-logs";

export default async function EmailDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const email = await getEmailLogById(id);

  if (!email) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">View Email</h1>

          <Link
            href="/email-history"
            className="inline-flex rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Back to Email History
          </Link>
        </div>

        <div className="mb-6 rounded-xl border bg-gray-50 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                Date
              </div>
              <div className="text-sm">
                {email.created_at
                  ? new Date(email.created_at).toLocaleString()
                  : "-"}
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                Status
              </div>
              <div className="text-sm">{email.status}</div>
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                To
              </div>
              <div className="text-sm break-all">{email.to_email}</div>
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                Subject
              </div>
              <div className="text-sm">{email.subject}</div>
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                Lead ID
              </div>
              <div className="text-sm break-all">{email.lead_id || "-"}</div>
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                ID
              </div>
              <div className="text-sm break-all">{email.id}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border">
          <div className="border-b bg-gray-100 px-4 py-3 text-sm font-semibold">
            Email Body
          </div>

          <div className="whitespace-pre-wrap p-4 text-sm leading-7">
            {email.body || "-"}
          </div>
        </div>
      </div>
    </main>
  );
}