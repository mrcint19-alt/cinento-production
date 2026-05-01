/*
File: app/sitemap.ts
Version: v1.2.0 BUILD SAFE
Updated: 2026-05-01 [Europe/Istanbul]
Status: STABLE
*/

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://cinento.net";
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/en`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tr`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}