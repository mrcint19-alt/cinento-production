"use client";

/**
 * File: app/[lang]/gallery/page.tsx
 * Version: v2.0 FINAL FIX
 * Updated: 2026-04-17
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

export default function GalleryPage() {
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

        {/* Header */}
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

        {/* Title */}
        <div>
          <h1 className="text-4xl font-bold text-yellow-500">
            {content.gallerySection.title}
          </h1>

          <p className="text-gray-400 mt-3">
            {content.gallerySection.subtitle}
          </p>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.gallery.map((item) => (
            <img
              key={item.src}
              src={item.src}
              alt={item.alt}
              className="rounded-xl object-cover h-[300px] w-full"
            />
          ))}
        </div>

      </div>
    </div>
  );
}