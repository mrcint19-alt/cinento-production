/**
 * File: app/sitemap.ts
 * Version: v1.0 LOCALIZED SITEMAP
 * Updated: 2026-04-17 [Europe/Istanbul]
 * Status: ACTIVE
 */

import type { MetadataRoute } from "next";
//import { getLocalizedPath, getSiteUrl, languages } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const localizedHomeEntries = languages.map((lang) => ({
    url: `${siteUrl}${getLocalizedPath(lang)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 1,
  }));

  return [
    ...localizedHomeEntries,
    {
      url: `${siteUrl}/admin`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    },
    {
      url: `${siteUrl}/email-history`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.3,
    },
  ];
}