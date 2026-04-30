/*
File: app/[lang]/dashboard/page.tsx
Version: CINENTO Control Panel v2.1
Updated: 2026-04-30 [Europe/Istanbul]
Status: FIXED params warning WITHOUT breaking existing UI
*/

"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function DashboardPage() {
  const params = useParams();
  const lang = params?.lang === "tr" ? "tr" : "en";
 
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">

      {/* 🔥 CONTROL PANEL HEADER */}
      <section className="mb-12">
        <p className="text-yellow-500 tracking-[0.3em] text-sm mb-3">
          CINENTO
        </p>

        <h1 className="text-4xl md:text-6xl font-bold">
          Control Panel
        </h1>

        <p className="mt-4 max-w-2xl text-neutral-400 leading-7">
          Manage website content, leads, gallery, and CINENTO ecosystem from one centralized dashboard.
        </p>
      </section>

      {/* 🔥 CONTROL CARDS */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">

        <Link href="/admin/content" className="card">
          <h2>Content Manager</h2>
          <p>Edit homepage, hero, platforms, journal and footer content.</p>
        </Link>

        <Link href="/admin" className="card">
          <h2>CRM Panel</h2>
          <p>Manage leads, clients, WhatsApp and email follow-ups.</p>
        </Link>

        <Link href={`/${lang}`} className="card">
          <h2>Website Preview</h2>
          <p>View public CINENTO website.</p>
        </Link>

        <Link href={`/${lang}/#contact`} className="card">
          <h2>Start Project</h2>
          <p>Jump directly to project submission flow.</p>
        </Link>

        <Link href={`/${lang}/#gallery`} className="card">
          <h2>Gallery</h2>
          <p>View and manage visual presentation.</p>
        </Link>

        <Link href="#" className="card">
          <h2>AI Studio (Coming Soon)</h2>
          <p>Screenplay, pitch deck and cinematic AI tools.</p>
        </Link>

      </section>

      {/* 🔥 QUICK ACTIONS */}
      <section className="flex flex-wrap gap-4">
        <Link
          href={`/${lang}`}
          className="rounded-xl border border-yellow-500 px-5 py-3 text-yellow-500 hover:bg-yellow-500 hover:text-black transition"
        >
          Back to Website
        </Link>

        <Link
          href="/admin/content"
          className="rounded-xl bg-yellow-500 px-5 py-3 text-black font-bold hover:opacity-90 transition"
        >
          Edit Content
        </Link>
      </section>

      {/* 🎨 CARD STYLE */}
      <style jsx>{`
        .card {
          display: block;
          padding: 20px;
          border-radius: 20px;
          border: 1px solid rgba(255, 200, 0, 0.2);
          background: rgba(20, 20, 20, 0.7);
          transition: 0.3s;
        }

        .card:hover {
          border-color: #facc15;
          background: rgba(30, 30, 30, 0.9);
          transform: translateY(-4px);
        }

        .card h2 {
          color: #facc15;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .card p {
          color: #aaa;
          font-size: 14px;
        }
      `}</style>

    </main>
  );
}