export type SiteTheme = { background: string; surface: string; accent: string };

export const DEFAULT_SITE_THEME: SiteTheme = {
  background: "#111820",
  surface: "#1B2630",
  accent: "#D4AF37",
};

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function luminance(color: string): number {
  const channels = [1, 3, 5].map(index => {
    const value = parseInt(color.slice(index, index + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function safeThemeColor(value: unknown, fallback: string, role: "dark" | "accent"): string {
  if (typeof value !== "string" || !HEX_COLOR.test(value)) return fallback;
  const lightness = luminance(value);
  // White page text and black primary-button text must keep at least 4.5:1 contrast.
  return role === "dark" ? (lightness <= 1.05 / 4.5 - 0.05 ? value : fallback)
    : (lightness >= 4.5 * 0.05 - 0.05 ? value : fallback);
}

export function siteTheme(value: unknown): SiteTheme {
  const candidate = value && typeof value === "object" ? value as Partial<SiteTheme> : {};
  return {
    background: safeThemeColor(candidate.background, DEFAULT_SITE_THEME.background, "dark"),
    surface: safeThemeColor(candidate.surface, DEFAULT_SITE_THEME.surface, "dark"),
    accent: safeThemeColor(candidate.accent, DEFAULT_SITE_THEME.accent, "accent"),
  };
}
