// File: lib/i18n.ts
// Version: v1.0
// Updated: 2026-04-16 20:00 Europe/Istanbul
// Status: ACTIVE

import en from "@/messages/en.json";
import tr from "@/messages/tr.json";

export type Language = "en" | "tr";

export const messages = {
  en,
  tr,
};

export function getMessages(lang: Language) {
  return messages[lang];
}