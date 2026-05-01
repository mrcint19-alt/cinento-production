/*
File: app/[lang]/dashboard/page.tsx
Version: v2.4.0
Updated: 2026-04-30 [Europe/Istanbul]
Status: Dashboard Links Fixed + Edit Account Disabled Safe
*/

import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-16">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-yellow-500">CINENTO</span> Control Panel
        </h1>

        <p className="text-gray-400 mb-12">
          Manage website content, leads, gallery, and CINENTO ecosystem from one centralized dashboard.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="space-y-6">
            <Link href="/admin/content" className="block hover:opacity-80">
              <h2 className="text-xl font-semibold text-yellow-500">
                Content Manager
              </h2>
              <p className="text-gray-400">
                Edit homepage, hero, platforms, journal and footer content.
              </p>
            </Link>

            <Link href="/en/#contact" className="block hover:opacity-80">
              <h2 className="text-xl font-semibold text-yellow-500">
                Start Project
              </h2>
              <p className="text-gray-400">
                Jump directly to project submission flow.
              </p>
            </Link>
          </div>

          <div className="space-y-6">
            <Link href="/admin" className="block hover:opacity-80">
              <h2 className="text-xl font-semibold text-yellow-500">
                CRM Panel (Active)
              </h2>
              <p className="text-gray-400">
                Manage leads, clients, WhatsApp and email follow-ups.
              </p>
            </Link>

            <Link href="/en/admin/images" className="block hover:opacity-80">
              <h2 className="text-xl font-semibold text-yellow-500">
                Image Manager
              </h2>
              <p className="text-gray-400">
                Upload and manage hero, gallery and project visuals.
              </p>
            </Link>
          </div>

          <div className="space-y-6">
            <Link href="/en" className="block hover:opacity-80">
              <h2 className="text-xl font-semibold text-yellow-500">
                Website Preview
              </h2>
              <p className="text-gray-400">
                View public CINENTO website.
              </p>
            </Link>

            <div>
              <h2 className="text-xl font-semibold text-yellow-500">
                AI Studio (Coming Soon)
              </h2>
              <p className="text-gray-400">
                Screenplay, pitch deck and cinematic AI tools.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link
            href="/en"
            className="px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 transition"
          >
            Back to Website
          </Link>

          <Link
            href="/admin/content"
            className="px-6 py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:opacity-90 transition"
          >
            Edit Content
          </Link>

          <Link
            href="/en/admin/images"
            className="px-6 py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:opacity-90 transition"
          >
            Image Manager
          </Link>

          <Link
            href="/admin"
            className="px-6 py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:opacity-90 transition"
          >
            CRM Panel
          </Link>

          <button
            disabled
            className="px-6 py-3 rounded-xl border border-yellow-500/40 text-yellow-500/60 cursor-not-allowed"
          >
            Edit Account Soon
          </button>
        </div>
      </section>
    </main>
  );
}