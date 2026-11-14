"use client";

/**
 * File: app/[lang]/journal/page.tsx
 * Version: v3.0 UNIFIED JOURNAL
 * Updated: 2026-04-17 [Europe/Istanbul]
 * Status: ACTIVE
 */

import Link from "next/link";
import SiteHeader from "../../../components/SiteHeader";
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
      <SiteHeader />
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 md:py-8 space-y-12">


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