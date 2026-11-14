// Navigation Custom Icons PRO v1.0 | 2026-11-14 | Backward-compatible library bindings.
export const SITE_LOCALES = ["en", "tr", "fa", "ar"] as const;
export type SiteLocale = (typeof SITE_LOCALES)[number];
export type NavigationItem = {
  id: string;
  labels: Record<SiteLocale, string>;
  href: string;
  icon: string;
  enabled: boolean;
  parentId?: string;
  iconLibraryId?: string;
};
export type NavigationIconAsset = { id: string; name: string; url: string };
export type SiteNavigation = { menuIcon: string; items: NavigationItem[]; iconLibrary?: NavigationIconAsset[]; menuIconLibraryId?: string };
export const MAX_NAVIGATION_ICONS = 48;
export const NAVIGATION_ICON_STARTERS = ["Films & Projects", "Actors & Talent", "Acting Academy", "Film Production", "AI Studio", "CINENTO WATCH", "Investment", "International Co-Production", "Products & Platforms", "Journal & News", "Gallery", "Contact"] as const;

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
  return isNavigationImage(value);
}

// Existing SVG image URLs stay compatible; new library entries use raster assets.
export function isNavigationImage(value: string, rasterOnly = false): boolean {
  if (!value || value.length > 1000 || /\s/.test(value)) return false;
  const extension = rasterOnly ? /\.(?:png|jpe?g|webp)$/i : /\.(?:png|jpe?g|webp|svg)$/i;
  if (/^\/images\/[a-zA-Z0-9/_-]+\.[a-zA-Z]+$/.test(value)) return extension.test(value);
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.hash && extension.test(url.pathname);
  } catch { return false; }
}

export function navigationIconLibrary(value: unknown): NavigationIconAsset[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.slice(0, MAX_NAVIGATION_ICONS).flatMap(raw => {
    if (!raw || typeof raw !== "object" || typeof raw.id !== "string" || !/^[a-z][a-z0-9-]{0,49}$/.test(raw.id) || seen.has(raw.id)) return [];
    seen.add(raw.id);
    return [{ id: raw.id, name: typeof raw.name === "string" ? raw.name.slice(0, 80) : "", url: typeof raw.url === "string" ? raw.url.trim().slice(0, 1000) : "" }];
  });
}

export function defaultNavigationItemIcon(id: string): string {
  return DEFAULT_NAVIGATION.items.find(item => item.id === id)?.icon ?? "star";
}

export function editNavigationIcon(nav: SiteNavigation, id: string, patch: Partial<Pick<NavigationIconAsset, "name" | "url">>): SiteNavigation {
  const previous = nav.iconLibrary?.find(icon => icon.id === id);
  if (!previous) return nav;
  const updated = { ...previous, ...patch };
  const usable = isNavigationImage(updated.url, true);
  return { ...nav,
    iconLibrary: nav.iconLibrary?.map(icon => icon.id === id ? updated : icon),
    menuIcon: nav.menuIconLibraryId === id ? usable ? updated.url : "menu" : nav.menuIcon,
    items: nav.items.map(item => item.iconLibraryId === id ? { ...item, icon: usable ? updated.url : defaultNavigationItemIcon(item.id) } : item),
  };
}

export function removeNavigationIcon(nav: SiteNavigation, id: string): SiteNavigation {
  const { menuIconLibraryId, ...rest } = nav;
  return { ...rest,
    ...(menuIconLibraryId && menuIconLibraryId !== id ? { menuIconLibraryId } : {}),
    menuIcon: menuIconLibraryId === id ? "menu" : nav.menuIcon,
    iconLibrary: (nav.iconLibrary ?? []).filter(icon => icon.id !== id),
    items: nav.items.map(item => {
      if (item.iconLibraryId !== id) return item;
      const { iconLibraryId: removed, ...remaining } = item;
      void removed;
      return { ...remaining, icon: defaultNavigationItemIcon(item.id) };
    }),
  };
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
  const iconLibrary = navigationIconLibrary(input.iconLibrary);
  const items: NavigationItem[] = [];
  for (const raw of input.items.slice(0, 40)) {
    if (!raw || typeof raw !== "object" || typeof raw.id !== "string" || !/^[a-z][a-z0-9-]{0,49}$/.test(raw.id) || seen.has(raw.id)) continue;
    seen.add(raw.id);
    const labels = Object.fromEntries(SITE_LOCALES.map(locale => [locale, typeof raw.labels?.[locale] === "string" ? raw.labels[locale].slice(0, 80) : ""])) as Record<SiteLocale, string>;
    const asset = iconLibrary.find(icon => icon.id === raw.iconLibraryId);
    const icon = asset ? isNavigationImage(asset.url, true) ? asset.url : defaultNavigationItemIcon(raw.id) : typeof raw.icon === "string" ? raw.icon.slice(0, 1000) : "";
    items.push({ id: raw.id, labels, href: typeof raw.href === "string" && validNavigationHref(raw.href) ? raw.href : "", icon, enabled: raw.enabled === true, parentId: typeof raw.parentId === "string" ? raw.parentId : undefined, ...(asset ? { iconLibraryId: asset.id } : {}) });
  }
  const mainAsset = iconLibrary.find(icon => icon.id === input.menuIconLibraryId);
  const menuIcon = mainAsset ? isNavigationImage(mainAsset.url, true) ? mainAsset.url : "menu" : typeof input.menuIcon === "string" ? input.menuIcon.slice(0, 1000) : "menu";
  return { menuIcon, items, ...(Array.isArray(input.iconLibrary) ? { iconLibrary } : {}), ...(mainAsset ? { menuIconLibraryId: mainAsset.id } : {}) };
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

