export type HeroSlide = {
  id: string; title: string; subtitle: string; image: string;
  durationMs?: number;
  primaryCta?: string; primaryCtaHref?: string; primaryCtaVisible?: boolean;
  secondaryCta?: string; secondaryCtaHref?: string; secondaryCtaVisible?: boolean;
};
export type HeroSliderSettings = { autoplay: boolean; intervalMs: number; transitionMs: number; transition: "fade" | "slide" };
export const DEFAULT_HERO_SLIDER: HeroSliderSettings = { autoplay: true, intervalMs: 7000, transitionMs: 650, transition: "fade" };

export function heroDuration(value: unknown, fallback = DEFAULT_HERO_SLIDER.intervalMs): number {
  return typeof value === "number" && Number.isInteger(value) && value >= 3000 && value <= 20000 ? value : fallback;
}

export function heroSliderSettings(value: unknown): HeroSliderSettings {
  const settings = value && typeof value === "object" ? value as Partial<HeroSliderSettings> : {};
  return {
    autoplay: settings.autoplay !== false,
    intervalMs: heroDuration(settings.intervalMs),
    transitionMs: typeof settings.transitionMs === "number" && Number.isInteger(settings.transitionMs) && settings.transitionMs >= 150 && settings.transitionMs <= 1500 ? settings.transitionMs : DEFAULT_HERO_SLIDER.transitionMs,
    transition: settings.transition === "slide" ? "slide" : "fade",
  };
}
type Locale = "en" | "tr" | "fa" | "ar";
type Section = { hero?: { slides?: HeroSlide[]; [key: string]: unknown }; [key: string]: unknown };
export type HomepageSlides = Partial<Record<Locale, Section>> & Record<string, unknown>;
const locales: Locale[] = ["en", "tr", "fa", "ar"];

function updateLocales(current: HomepageSlides, update: (slides: HeroSlide[]) => HeroSlide[]): HomepageSlides {
  const result = { ...current };
  for (const locale of locales) {
    const section = current[locale] ?? {};
    const hero = section.hero ?? {};
    result[locale] = { ...section, hero: { ...hero, slides: update(Array.isArray(hero.slides) ? hero.slides : []) } };
  }
  return result;
}

export function addHeroSlide(current: HomepageSlides, id: string): HomepageSlides {
  return updateLocales(current, slides => [...slides, { id, title: "", subtitle: "", image: "" }]);
}

export function reorderHeroSlides(slides: HeroSlide[], id: string, direction: -1 | 1): HeroSlide[] {
  const index = slides.findIndex(slide => slide.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= slides.length) return slides;
  const reordered = [...slides];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
  return reordered;
}

export function moveHeroSlide(current: HomepageSlides, id: string, direction: -1 | 1): HomepageSlides {
  return updateLocales(current, slides => reorderHeroSlides(slides, id, direction));
}

export function removeHeroSlide(current: HomepageSlides, id: string): HomepageSlides {
  return updateLocales(current, slides => slides.filter(slide => slide.id !== id));
}

export function setHeroSlideImage(current: HomepageSlides, id: string, image: string): HomepageSlides {
  return updateLocales(current, slides => slides.map(slide => slide.id === id ? { ...slide, image } : slide));
}

export function setHeroSlideShared(current: HomepageSlides, id: string, patch: Partial<Pick<HeroSlide, "durationMs" | "primaryCtaHref" | "secondaryCtaHref" | "primaryCtaVisible" | "secondaryCtaVisible">>): HomepageSlides {
  return updateLocales(current, slides => slides.map(slide => slide.id === id ? { ...slide, ...patch } : slide));
}

export function visibleHeroSlides(slides: HeroSlide[] | undefined): HeroSlide[] {
  return Array.isArray(slides) ? slides.filter(slide => typeof slide?.title === "string" && slide.title.trim()) : [];
}
