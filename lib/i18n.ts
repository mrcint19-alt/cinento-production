/**
 * File: lib/i18n.ts
 * Version: v2.0 FINAL STABLE
 * Updated: 2026-04-17 [Europe/Istanbul]
 * Status: ACTIVE
 */

export const languages = ["en", "tr"] as const;
export type SiteLanguage = (typeof languages)[number];

export const defaultLanguage: SiteLanguage = "en";

export function isValidLanguage(value: string): value is SiteLanguage {
  return languages.includes(value as SiteLanguage);
}