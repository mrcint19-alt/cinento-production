/* CINENTO Footer Manager PRO v1.1 | 2026-11-14 | Four locales, shared identity */
import { FOOTER_CHANNELS, footerHref, footerGuideHref, approvedFooterCopy, type FooterShared, type FooterLocale } from "../lib/footer-manager";
type Copy = { brandLine: string; contactTitle: string; followTitle: string; rights: string; location?: string; whatsappText?: string; websiteLabel?: string };
export default function ManagedFooter({ settings, copy, brand, whatsappLabel, locale = "en" }: { settings: FooterShared; copy: Copy; brand: string; whatsappLabel: string; locale?: FooterLocale }) {
  const link = (key: typeof FOOTER_CHANNELS[number]) => {
    const href = settings.visible[key] ? footerHref(key, settings[key]) : null;
    if (!href) return null;
    const directContact = key === "email" || key === "phone";
    const label = directContact ? settings[key] : key === "whatsapp" ? copy.whatsappText?.trim() || whatsappLabel : key === "website" ? copy.websiteLabel?.trim() || { en: "Website", tr: "Web sitesi", fa: "وب‌سایت", ar: "الموقع الإلكتروني" }[locale] : { instagram: "Instagram", linkedin: "LinkedIn" }[key];
    return <a key={key} href={href} target={directContact ? undefined : "_blank"} rel="noopener noreferrer" className="block break-words hover:text-[var(--site-accent)] focus-visible:outline focus-visible:outline-2">{directContact ? <bdi dir="ltr">{label}</bdi> : label}</a>;
  };
  return <footer lang={locale} dir={locale === "fa" || locale === "ar" ? "rtl" : "ltr"} className="border-t border-white/10 site-band">
    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
      <div><div className="mb-3 text-lg font-bold text-white"><bdi dir="auto">{settings.brandName || brand}</bdi></div><div className="text-sm leading-7 text-neutral-400">{copy.brandLine}</div>{settings.legalOwner && <div className="mt-4 break-words text-sm text-neutral-400"><bdi dir="auto">{settings.legalOwner}</bdi></div>}{settings.country && <div className="mt-1 text-sm text-neutral-400"><bdi dir="auto">{settings.country}</bdi></div>}</div>
      <div><div className="mb-3 font-semibold text-white">{copy.contactTitle}</div><div className="space-y-2 text-sm text-neutral-400">{(settings.officialAddress || copy.location) && <div className="whitespace-pre-line"><bdi dir="auto">{settings.officialAddress || copy.location}</bdi></div>}{link("email")}{link("phone")}{link("whatsapp")}</div></div>
      <div><div className="mb-3 font-semibold text-white">{copy.followTitle}</div><div className="space-y-2 text-sm text-neutral-400">{link("instagram")}{link("linkedin")}{link("website")}</div>{settings.guideLinks.some(item => approvedFooterCopy(item, locale)) && <nav aria-label={settings.linksTitle[locale] || undefined} className="mt-6 space-y-2 text-sm text-neutral-400">{settings.linksTitle[locale] && <div className="font-semibold text-white">{settings.linksTitle[locale]}</div>}{settings.guideLinks.map(item => { const translation = approvedFooterCopy(item, locale); return translation ? <a key={item.id} href={footerGuideHref(translation.href)!} className="block hover:text-[var(--site-accent)]">{translation.label}</a> : null; })}</nav>}</div>
    </div><div className="border-t border-white/10 py-4 text-center text-xs text-neutral-500">{copy.rights}</div>
  </footer>;
}

