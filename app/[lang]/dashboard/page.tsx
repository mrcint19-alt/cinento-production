/*
File: app/[lang]/dashboard/page.tsx
Version: v2.7.0 + Preview read-only access
Updated: 2026-05-01 [Europe/Istanbul]
Status: Existing dashboard preserved; Preview notice and logout added
*/

import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-16">
      <section className="mx-auto max-w-6xl">
        {process.env.VERCEL_ENV === "preview" && (
          <aside className="mb-8 rounded-xl border border-yellow-500/40 p-5 text-yellow-200">
            <p>Read-only Preview. Content and images are repository snapshots. Saving, uploads, deletion, CRM and account editing are disabled.</p>
            <form action="/api/auth/logout" method="post" className="mt-4">
              <button type="submit" className="rounded border border-yellow-500 px-4 py-2">Log out</button>
            </form>
          </aside>
        )}
        <div className="mb-14">
          <p className="mb-3 text-sm tracking-[0.35em] text-yellow-500">
            CINENTO
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            <span className="text-yellow-500">CINENTO</span> Control Panel
          </h1>

          <p className="mt-4 max-w-3xl text-gray-400">
            Manage website content, leads, gallery, and CINENTO ecosystem from one centralized dashboard.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/admin/content"
            className="rounded-2xl border border-yellow-500/20 bg-neutral-950/80 p-6 transition hover:border-yellow-500 hover:bg-neutral-900"
          >
            <h2 className="text-xl font-semibold text-yellow-500">
              Content Manager
            </h2>
            <p className="mt-3 text-gray-400">
              Edit homepage, hero, platforms, journal and footer content.
            </p>
          </Link>

          <Link
            href="/admin"
            className="rounded-2xl border border-yellow-500/20 bg-neutral-950/80 p-6 transition hover:border-yellow-500 hover:bg-neutral-900"
          >
            <h2 className="text-xl font-semibold text-yellow-500">
              CRM Panel
            </h2>
            <p className="mt-3 text-gray-400">
              Manage leads, clients, WhatsApp and email follow-ups.
            </p>
          </Link>

          <Link
            href="/en/admin/images"
            className="rounded-2xl border border-yellow-500/20 bg-neutral-950/80 p-6 transition hover:border-yellow-500 hover:bg-neutral-900"
          >
            <h2 className="text-xl font-semibold text-yellow-500">
              Image Manager
            </h2>
            <p className="mt-3 text-gray-400">
              Upload and manage hero, gallery and project visuals.
            </p>
          </Link>

          <Link
            href="/en/#contact"
            className="rounded-2xl border border-yellow-500/20 bg-neutral-950/80 p-6 transition hover:border-yellow-500 hover:bg-neutral-900"
          >
            <h2 className="text-xl font-semibold text-yellow-500">
              Start Project
            </h2>
            <p className="mt-3 text-gray-400">
              Jump directly to project submission flow.
            </p>
          </Link>

          <Link
            href="/en"
            className="rounded-2xl border border-yellow-500/20 bg-neutral-950/80 p-6 transition hover:border-yellow-500 hover:bg-neutral-900"
          >
            <h2 className="text-xl font-semibold text-yellow-500">
              Website Preview
            </h2>
            <p className="mt-3 text-gray-400">
              View public CINENTO website.
            </p>
          </Link>

          <div className="rounded-2xl border border-yellow-500/20 bg-neutral-950/80 p-6">
            <h2 className="text-xl font-semibold text-yellow-500">
              AI Studio
            </h2>
            <p className="mt-3 text-gray-400">
              Screenplay, pitch deck and cinematic AI tools.
            </p>
            <span className="mt-4 inline-block rounded-full border border-yellow-500/30 px-3 py-1 text-xs text-yellow-500">
              Coming Soon
            </span>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap gap-4">
          <Link
            href="/en"
            className="rounded-xl border border-gray-600 px-6 py-3 text-gray-300 transition hover:bg-gray-800"
          >
            Back to Website
          </Link>

          <Link
            href="/admin/content"
            className="rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:bg-yellow-400"
          >
            Edit Content
          </Link>

          <Link
            href="/admin"
            className="rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:bg-yellow-400"
          >
            CRM Panel
          </Link>

          <Link
            href="/en/admin/images"
            className="rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:bg-yellow-400"
          >
            Image Manager
          </Link>

          <Link
            href="/en/profile"
            className="rounded-xl border border-yellow-500/50 px-6 py-3 text-yellow-400 transition hover:bg-yellow-500 hover:text-black"
          >
            Edit Account
          </Link>
        </div>
      </section>
    </main>
  );
}
