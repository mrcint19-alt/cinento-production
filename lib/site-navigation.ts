export const SITE_LOCALES = ["en", "tr", "fa", "ar"] as const;
export type SiteLocale = (typeof SITE_LOCALES)[number];
export type NavigationItem = {
  id: string;
  labels: Record<SiteLocale, string>;
  href: string;
  icon: string;
  enabled: boolean;
  parentId?: string;
};
export type SiteNavigation = { menuIcon: string; items: NavigationItem[] };

const defaults: Array<[string, string, string, string, string, string]> = [
  ["home", "#home", "Home", "Ana Sayfa", "خانه", "الرئيسية"],
  ["about", "#about", "About", "Hakkımızda", "درباره ما", "من نحن"],
  ["gallery", "#gallery", "Gallery", "Galeri", "گالری", "المعرض"],
  ["journal", "#journal", "Journal", "Günlük", "مجله", "المقالات"],
  ["contact", "#contact", "Contact", "İletişim", "تماس", "تواصل معنا"],
  ["platforms", "/platforms", "Products & Platforms", "Ürünler ve Platformlar", "محصولات و پلتفرم‌ها", "المنتجات والمنصات"],
];

export const DEFAULT_NAVIGATION: SiteNavigation = {
  menuIcon: "menu",
  items: defaults.map(([id, href, en, tr, fa, ar]) => ({
    id, href, labels: { en, tr, fa, ar }, icon: id, enabled: true,
  })),
};

export const MENU_ICONS = ["menu", "grid", "film"] as const;
export const ITEM_ICONS = ["home", "about", "gallery", "journal", "contact", "platforms", "projects", "talent", "academy", "services", "investment", "star"] as const;

export function validNavigationIcon(value: string, main = false): boolean {
  if ((main ? MENU_ICONS : ITEM_ICONS).some(icon => icon === value)) return true;
  return /^\/images\/[a-zA-Z0-9/_-]+\.(?:png|jpg|jpeg|webp|svg)$/.test(value) || /^https:\/\/[^\s]+\.(?:png|jpg|jpeg|webp|svg)(?:\?[^\s]*)?$/.test(value);
}

export function validNavigationHref(value: string): boolean {
  if (/^#[a-z][a-z0-9-]*$/.test(value)) return true;
  if (/^\/(?:[a-z0-9-]+\/)*[a-z0-9-]+$/.test(value) && !value.startsWith("//")) return true;
  try { const url = new URL(value); return url.protocol === "https:" && Boolean(url.hostname); } catch { return false; }
}

export function siteNavigation(value: unknown): SiteNavigation {
  if (!value || typeof value !== "object") return DEFAULT_NAVIGATION;
  const input = value as Partial<SiteNavigation>;
  if (!Array.isArray(input.items)) return DEFAULT_NAVIGATION;
  const seen = new Set<string>();
  const items: NavigationItem[] = [];
  for (const raw of input.items.slice(0, 40)) {
    if (!raw || typeof raw !== "object" || typeof raw.id !== "string" || !/^[a-z][a-z0-9-]{0,49}$/.test(raw.id) || seen.has(raw.id)) continue;
    seen.add(raw.id);
    const labels = Object.fromEntries(SITE_LOCALES.map(locale => [locale, typeof raw.labels?.[locale] === "string" ? raw.labels[locale].slice(0, 80) : ""])) as Record<SiteLocale, string>;
    items.push({ id: raw.id, labels, href: typeof raw.href === "string" && validNavigationHref(raw.href) ? raw.href : "", icon: typeof raw.icon === "string" ? raw.icon.slice(0, 500) : "", enabled: raw.enabled === true, parentId: typeof raw.parentId === "string" ? raw.parentId : undefined });
  }
  return { menuIcon: typeof input.menuIcon === "string" ? input.menuIcon.slice(0, 500) : "menu", items };
}

export function navigationFromContent(content: unknown): SiteNavigation {
  if (!content || typeof content !== "object") return DEFAULT_NAVIGATION;
  const payload = content as Record<string, unknown>;
  if (payload.navigation && typeof payload.navigation === "object") return siteNavigation(payload.navigation);
  const en = payload.en && typeof payload.en === "object" ? payload.en as { nav?: unknown } : {};
  if (!Array.isArray(en.nav) || !en.nav.length) return DEFAULT_NAVIGATION;
  const previous = en.nav.filter((item): item is { label: string; href: string } =>
    item && typeof item.label === "string" && typeof item.href === "string" && validNavigationHref(item.href));
  const used = new Set<string>();
  const items = previous.map((item, index) => {
    const known = DEFAULT_NAVIGATION.items.find(candidate => candidate.href === item.href);
    const id = known?.id ?? `legacy-${index}`;
    used.add(id);
    const labels = Object.fromEntries(SITE_LOCALES.map(locale => {
      const section = payload[locale] && typeof payload[locale] === "object" ? payload[locale] as { nav?: unknown } : {};
      const localized = Array.isArray(section.nav) ? section.nav.find(entry => entry?.href === item.href) : null;
      return [locale, typeof localized?.label === "string" ? localized.label : known?.labels[locale] ?? item.label];
    })) as Record<SiteLocale, string>;
    return { id, labels, href: item.href, icon: known?.icon ?? "star", enabled: true };
  });
  for (const item of DEFAULT_NAVIGATION.items) if (!used.has(item.id)) items.push(item);
  return { menuIcon: "menu", items };
}

export function localeHref(href: string, locale: SiteLocale): string {
  if (href.startsWith("#")) return `/${locale}${href}`;
  if (href.startsWith("/") && !href.startsWith("//")) return `/${locale}${href}`;
  return href;
}

export function switchLocalePath(path: string, locale: SiteLocale): string {
  const [, , ...rest] = path.split("/");
  const suffix = rest.join("/");
  if ((locale === "fa" || locale === "ar") && /^(about|gallery|journal|contact)$/.test(suffix)) return `/${locale}#${suffix}`;
  return `/${locale}${suffix ? `/${suffix}` : ""}`;
}
