export const HERO_DESTINATIONS = ["watch", "#contact", "#about", "#gallery", "/platforms", "/about", "/gallery", "/journal", "/contact"] as const;
export const HERO_ICONS = ["none", "arrow", "play", "sparkle"] as const;
export const HERO_DESTINATION_LABELS: Record<(typeof HERO_DESTINATIONS)[number], string> = {
  watch: "CINENTO WATCH",
  "#contact": "Contact section",
  "#about": "About section",
  "#gallery": "Gallery section",
  "/platforms": "Products & Platforms page",
  "/about": "About page",
  "/gallery": "Gallery page",
  "/journal": "Journal page",
  "/contact": "Contact page",
};

export type HeroIcon = (typeof HERO_ICONS)[number];

export function heroDestination(value: string | undefined, fallback: "watch" | "/platforms") {
  return HERO_DESTINATIONS.includes(value as (typeof HERO_DESTINATIONS)[number]) ? value! : fallback;
}

export function heroLink(value: string | undefined, lang: string, fallback: "watch" | "/platforms") {
  const destination = heroDestination(value, fallback);
  return destination === "watch"
    ? { href: "https://watch.cinento.net", external: true }
    : { href: destination.startsWith("/") ? `/${lang}${destination}` : destination, external: false };
}

export function heroIcon(value: string | undefined): HeroIcon {
  return HERO_ICONS.includes(value as HeroIcon) ? value as HeroIcon : "none";
}

export const HERO_ICON_SYMBOL: Record<Exclude<HeroIcon, "none">, string> = {
  arrow: "↗",
  play: "▶",
  sparkle: "✦",
};
