"use client";

/**
 * File: app/[lang]/journal/page.tsx
 * Version: v1.0 JOURNAL PAGE
 * Updated: 2026-04-17 [Europe/Istanbul]
 * Status: ACTIVE
 */

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { homepageContent } from "../../../content/homepage";
import {
  defaultLanguage,
  isValidLanguage,
  type SiteLanguage,
} from "@/lib/i18n";

export default function JournalPage() {
  const params = useParams();

  const routeLang = Array.isArray(params.lang)
    ? params.lang[0]
    : params.lang;

  const language: SiteLanguage =
    typeof routeLang === "string" && isValidLanguage(routeLang)
      ? routeLang
      : defaultLanguage;

  const content = useMemo(() => homepageContent[language], [language]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <div className="flex justify-between items-center">
          <Link
            href={`/${language}`}
            className="text-yellow-500 text-xl font-bold tracking-widest"
          >
            CINENTO
          </Link>

          <Link
            href={`/${language}`}
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg"
          >
            Home
          </Link>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-yellow-500">
            {content.journalSection.title}
          </h1>

          <p className="text-gray-400 mt-3 max-w-3xl">
            {language === "tr"
              ? "CINENTO’nun düşünce yapısını, sektör bakışını ve proje geliştirme yaklaşımını yansıtan içerikler."
              : "Insights, positioning ideas, and development-oriented content reflecting CINENTO’s vision and industry perspective."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.journal.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-yellow-600/20 bg-neutral-950 p-6 space-y-4"
            >
              <div className="text-xl font-semibold text-yellow-500 leading-8">
                {item.title}
              </div>

              <div className="text-sm leading-7 text-neutral-300">
                {item.description}
              </div>

              <button className="inline-flex items-center rounded-lg border border-yellow-500/30 px-4 py-2 text-sm text-white hover:bg-yellow-500/10 transition">
                {language === "tr" ? "Devamını Oku" : "Read More"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}