"use client";

/**
 * File: app/[lang]/journal/page.tsx
 * Version: v3.0 UNIFIED JOURNAL
 * Updated: 2026-04-17 [Europe/Istanbul]
 * Status: ACTIVE
 */

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { homepageContent } from "../../../content/homepage";
import { defaultLanguage, isValidLanguage, type SiteLanguage } from "@/lib/i18n";

export default function JournalPage() {
  const params = useParams();
  const routeLang = Array.isArray(params.lang) ? params.lang[0] : params.lang;

  const language: SiteLanguage =
    typeof routeLang === "string" && isValidLanguage(routeLang)
      ? routeLang
      : defaultLanguage;

  const content = useMemo(() => homepageContent[language], [language]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 md:py-8 space-y-12">
        <header className="sticky top-4 z-50">
          <div className="rounded-3xl border border-yellow-600/25 bg-black/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
              <Link
                href={`/${language}`}
                className="text-left text-xl font-semibold tracking-[0.18em] text-yellow-500 transition hover:text-yellow-400"
              >
                {content.brand}
              </Link>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <Link
                  href={`/${language}`}
                  className="rounded-full border border-yellow-600/15 bg-white/[0.02] px-4 py-2 text-neutral-200 transition hover:border-yellow-500/50 hover:bg-yellow-500/10 hover:text-white"
                >
                  {content.nav[0]?.label || "Home"}
                </Link>

                <span className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-4 py-2 text-white">
                  {content.journalSection.title}
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-yellow-600/20 bg-neutral-950 p-8 md:p-10 space-y-8">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.3em] text-yellow-600">
              CINENTO
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-yellow-500">
              {content.journalSection.title}
            </h1>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {content.journal.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-yellow-600/20 bg-black p-6 space-y-4"
              >
                <h2 className="text-xl font-semibold text-white leading-7">
                  {item.title}
                </h2>
                <p className="text-neutral-400 leading-7">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link
              href={`/${language}`}
              className="inline-flex items-center rounded-xl bg-yellow-600 px-6 py-3 font-medium text-black transition hover:bg-yellow-500"
            >
              {content.nav[0]?.label || "Home"}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}