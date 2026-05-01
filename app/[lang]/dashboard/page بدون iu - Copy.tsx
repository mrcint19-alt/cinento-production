/*
File: app/[lang]/dashboard/page.tsx
Version: v2.6.0
Status: FULLY FIXED - React Component Valid
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
          Manage website content, leads, gallery, and CINENTO ecosystem.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          <Link href="/admin/content" className="block">
            Content Manager
          </Link>

          <Link href="/admin" className="block">
            CRM Panel
          </Link>

          <Link href="/en/admin/images" className="block">
            Image Manager
          </Link>
        </div>

        <div className="mt-10 flex gap-4">
          <Link href="/en/profile">Edit Account</Link>
        </div>
      </section>
    </main>
  );
}