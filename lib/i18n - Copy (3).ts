/**
 * File: lib/i18n.ts
 * Version: v1.0 SEO-FRIENDLY MULTILINGUAL
 * Updated: 2026-04-17 [Europe/Istanbul]
 * Status: ACTIVE
 */

export const languages = ["en", "tr"] as const;
export type SiteLanguage = (typeof languages)[number];

export const defaultLanguage: SiteLanguage = "en";

export function isValidLanguage(value: string): value is SiteLanguage {
  return languages.includes(value as SiteLanguage);
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://cinento.net";
}

export function getLocalizedPath(lang: SiteLanguage, path: string = ""): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${normalizedPath === "/" ? "" : normalizedPath}`;
}