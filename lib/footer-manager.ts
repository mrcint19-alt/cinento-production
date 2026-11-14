/* File: lib/footer-manager.ts | CINENTO Footer Manager PRO v1.1
 * Updated: 2026-11-14 | Status: review build, baseline 5d4af80
 */
export const FOOTER_CHANNELS = ["email", "phone", "whatsapp", "instagram", "linkedin", "website"] as const;
export type FooterChannel = typeof FOOTER_CHANNELS[number];
export const FOOTER_LOCALES = ["en", "tr", "fa", "ar"] as const;
export type FooterLocale = typeof FOOTER_LOCALES[number];
export type FooterLinkCopy = { label: string; href: string; approved: boolean; approvalRef: string; reviewedOn: string; revision: string };
export type FooterGuideLink = { id: string; kind: "guide" | "privacy" | "terms"; enabled: boolean; translations: Record<FooterLocale, FooterLinkCopy> };
export type FooterShared = {
  enabled: boolean; brandName: string; legalOwner: string; country: string;
  officialAddress: string; linksTitle: Record<FooterLocale, string>; guideLinks: FooterGuideLink[];
  email: string; phone: string; whatsapp: string; instagram: string; linkedin: string; website: string;
  visible: Record<FooterChannel, boolean>;
};
const record = (v: unknown): Record<string, unknown> => v && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : {};
const text = (v: unknown) => typeof v === "string" ? v.trim() : "";
export function footerGuideLink(value: unknown, index = 0): FooterGuideLink {
  const v = record(value), copies = record(v.translations);
  return { id: text(v.id) || `footer-link-${index}`, kind: v.kind === "privacy" || v.kind === "terms" ? v.kind : "guide", enabled: v.enabled === true,
    translations: Object.fromEntries(FOOTER_LOCALES.map(locale => { const c = record(copies[locale]); return [locale, { label: text(c.label), href: text(c.href), approved: c.approved === true, approvalRef: text(c.approvalRef), reviewedOn: text(c.reviewedOn), revision: text(c.revision) }]; })) as FooterGuideLink["translations"] };
}
export function footerGuideHref(value: string): string | null {
  const href = value.trim();
  if (/^\/(?!\/)[a-zA-Z0-9/_-]*(?:#[a-zA-Z0-9_-]+)?$/.test(href)) return href;
  const safe = footerHref("website", href);
  return safe?.startsWith("https://") ? safe : null;
}
export function approvedFooterCopy(link: FooterGuideLink, locale: FooterLocale): FooterLinkCopy | null {
  const copy = link.translations[locale];
  if (!link.enabled || !copy.label || !footerGuideHref(copy.href)) return null;
  if (link.kind !== "guide" && (!copy.approved || !copy.approvalRef || !copy.revision || !/^\d{4}-\d{2}-\d{2}$/.test(copy.reviewedOn) || !Number.isFinite(Date.parse(copy.reviewedOn)))) return null;
  return copy;
}
export function footerShared(value: unknown): FooterShared {
  const v = record(value), visible = record(v.visible);
  const str = (key: string) => typeof v[key] === "string" ? (v[key] as string).trim() : "";
  return { enabled: v.enabled === true, brandName: str("brandName"), legalOwner: str("legalOwner"), country: str("country"),
    officialAddress: str("officialAddress"), linksTitle: Object.fromEntries(FOOTER_LOCALES.map(locale => [locale, text(record(v.linksTitle)[locale])])) as FooterShared["linksTitle"],
    guideLinks: Array.isArray(v.guideLinks) ? v.guideLinks.slice(0, 12).map(footerGuideLink) : [],
    email: str("email"), phone: str("phone"), whatsapp: str("whatsapp"), instagram: str("instagram"), linkedin: str("linkedin"), website: str("website"),
    visible: Object.fromEntries(FOOTER_CHANNELS.map(key => [key, visible[key] !== false])) as FooterShared["visible"] };
}
export function footerHref(channel: FooterChannel, value: string): string | null {
  const text = value.trim();
  if (!text) return null;
  if (channel === "email") return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(text) && !/[?&#\r\n]/.test(text) ? `mailto:${text}` : null;
  if (channel === "whatsapp" || channel === "phone") {
    if (!/^\+?[\d ()-]+$/.test(text)) return null;
    const digits = text.replace(/\D/g, "");
    return /^[1-9]\d{6,14}$/.test(digits) ? channel === "phone" ? `tel:+${digits}` : `https://wa.me/${digits}` : null;
  }
  try { const url = new URL(text); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export function footerErrors(value: unknown): string[] {
  const settings = footerShared(value);
  if (!settings.enabled) return [];
  return FOOTER_CHANNELS.filter(key => settings[key] && !footerHref(key, settings[key])).map(key => `Invalid footer ${key}`);
}

