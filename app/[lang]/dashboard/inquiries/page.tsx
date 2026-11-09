"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Inquiry = { id: string; name: string; email: string; message: string; language: string; status: string; created_at: string };

export default function ProjectInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/project-inquiries", { cache: "no-store" })
      .then(async response => { if (!response.ok) throw new Error("Could not load inquiries. Sign in as a site administrator or complete the database setup."); return response.json(); })
      .then(data => setInquiries(Array.isArray(data.inquiries) ? data.inquiries : []))
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  return <main className="min-h-screen bg-black px-6 py-12 text-white"><div className="mx-auto max-w-5xl">
    <Link href="/en/dashboard" className="text-sm text-[#d4af37]">← Dashboard</Link>
    <h1 className="mt-8 text-3xl font-semibold">Project inquiries</h1>
    <p className="mt-2 text-neutral-400">Recent requests from the homepage form. This list is separate from the existing CRM.</p>
    {loading && <p className="mt-8">Loading…</p>}
    {error && <p role="alert" className="mt-8 rounded-xl border border-red-500/40 p-5 text-red-300">{error}</p>}
    {!loading && !error && inquiries.length === 0 && <p className="mt-8 rounded-xl border border-white/10 p-5 text-neutral-400">No inquiries yet.</p>}
    <div className="mt-8 space-y-4">{inquiries.map(item => <article key={item.id} className="rounded-xl border border-white/10 bg-neutral-900 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">{item.name}</h2><span className="text-xs text-neutral-400">{new Date(item.created_at).toLocaleString()} · {item.language.toUpperCase()} · {item.status}</span></div>
      <a href={`mailto:${item.email}`} className="mt-2 inline-block text-[#d4af37] hover:underline">{item.email}</a>
      <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-neutral-200">{item.message}</p>
    </article>)}</div>
  </div></main>;
}
