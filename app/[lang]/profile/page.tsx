/*
File: app/[lang]/profile/page.tsx
Version: v1.0.0
Updated: 2026-05-01 [Europe/Istanbul]
Status: CINENTO Admin Profile Page - Safe Initial Version
*/

import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-16">
      <section className="max-w-4xl mx-auto">
        <p className="text-yellow-500 tracking-[0.3em] text-sm mb-4">
          CINENTO
        </p>

        <h1 className="text-4xl font-bold mb-4">
          Admin Profile
        </h1>

        <p className="text-gray-400 mb-10">
          Manage your CINENTO admin account information.
        </p>

        <div className="rounded-2xl border border-yellow-500/20 bg-neutral-950 p-6 space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Admin Email
            </label>
            <div className="rounded-xl border border-gray-700 bg-black px-4 py-3">
              admin@cinento.com
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Role
            </label>
            <div className="rounded-xl border border-gray-700 bg-black px-4 py-3">
              CINENTO Administrator
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Status
            </label>
            <div className="rounded-xl border border-green-700/40 bg-green-950/20 px-4 py-3 text-green-400">
              Active
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/en/dashboard"
              className="px-6 py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:opacity-90 transition"
            >
              Back to Dashboard
            </Link>

            <Link
              href="/en"
              className="px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 transition"
            >
              Back to Website
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}