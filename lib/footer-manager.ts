/* File: lib/footer-manager.ts | CINENTO Footer Manager PRO v1.0
 * Updated: 2026-11-14 | Status: review build, baseline 5d4af80
 */
export const FOOTER_CHANNELS = ["email", "whatsapp", "instagram", "linkedin", "website"] as const;
export type FooterChannel = typeof FOOTER_CHANNELS[number];
export type FooterShared = {
  enabled: boolean; brandName: string; legalOwner: string; country: string;
  email: string; whatsapp: string; instagram: string; linkedin: string; website: string;
  visible: Record<FooterChannel, boolean>;
};
const record = (v: unknown): Record<string, unknown> => v && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : {};
export function footerShared(value: unknown): FooterShared {
  const v = record(value), visible = record(v.visible);
  const str = (key: string) => typeof v[key] === "string" ? (v[key] as string).trim() : "";
  return { enabled: v.enabled === true, brandName: str("brandName"), legalOwner: str("legalOwner"), country: str("country"),
    email: str("email"), whatsapp: str("whatsapp"), instagram: str("instagram"), linkedin: str("linkedin"), website: str("website"),
    visible: Object.fromEntries(FOOTER_CHANNELS.map(key => [key, visible[key] !== false])) as FooterShared["visible"] };
}
export function footerHref(channel: FooterChannel, value: string): string | null {
  const text = value.trim();
  if (!text) return null;
  if (channel === "email") return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(text) && !/[?&#\r\n]/.test(text) ? `mailto:${text}` : null;
  if (channel === "whatsapp") {
    if (!/^\+?[\d ()-]+$/.test(text)) return null;
    const digits = text.replace(/\D/g, "");
    return /^[1-9]\d{6,14}$/.test(digits) ? `https://wa.me/${digits}` : null;
  }
  try { const url = new URL(text); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export function footerErrors(value: unknown): string[] {
  const settings = footerShared(value);
  if (!settings.enabled) return [];
  return FOOTER_CHANNELS.filter(key => settings[key] && !footerHref(key, settings[key])).map(key => `Invalid footer ${key}`);
}
