export type HeroSlide = { id: string; title: string; subtitle: string; image: string };
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

export function visibleHeroSlides(slides: HeroSlide[] | undefined): HeroSlide[] {
  return Array.isArray(slides) ? slides.filter(slide => typeof slide?.title === "string" && slide.title.trim()) : [];
}
