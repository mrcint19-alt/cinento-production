/**
 * File: app/page.tsx
 * Version: v2.0 ROOT REDIRECT
 * Updated: 2026-04-17 [Europe/Istanbul]
 * Status: ACTIVE
 */

import { redirect } from "next/navigation";
import { defaultLanguage } from "@/lib/i18n";

export default function RootPage() {
  redirect(`/${defaultLanguage}`);
}