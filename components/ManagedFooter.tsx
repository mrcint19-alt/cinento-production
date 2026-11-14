/* CINENTO Footer Manager PRO v1.0 | 2026-11-14 | baseline 5d4af80 */
import { FOOTER_CHANNELS, footerHref, type FooterShared } from "../lib/footer-manager";
type Copy = { brandLine: string; contactTitle: string; followTitle: string; rights: string; location?: string; whatsappText?: string };
export default function ManagedFooter({ settings, copy, brand, whatsappLabel }: { settings: FooterShared; copy: Copy; brand: string; whatsappLabel: string }) {
  const link = (key: typeof FOOTER_CHANNELS[number]) => {
    const href = settings.visible[key] ? footerHref(key, settings[key]) : null;
    if (!href) return null;
    const label = key === "email" ? settings.email : key === "whatsapp" ? copy.whatsappText?.trim() || whatsappLabel : { instagram: "Instagram", linkedin: "LinkedIn", website: "Website" }[key];
    return <a key={key} href={href} target={key === "email" ? undefined : "_blank"} rel="noopener noreferrer" className="block break-words hover:text-[var(--site-accent)] focus-visible:outline focus-visible:outline-2">{label}</a>;
  };
  return <footer className="border-t border-white/10 site-band">
    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
      <div><div className="mb-3 text-lg font-bold text-white">{settings.brandName || brand}</div><div className="text-sm leading-7 text-neutral-400">{copy.brandLine}</div>{settings.legalOwner && <div className="mt-4 break-words text-sm text-neutral-400">{settings.legalOwner}</div>}{settings.country && <div className="mt-1 text-sm text-neutral-400">{settings.country}</div>}</div>
      <div><div className="mb-3 font-semibold text-white">{copy.contactTitle}</div><div className="space-y-2 text-sm text-neutral-400">{copy.location && <div>{copy.location}</div>}{link("email")}{link("whatsapp")}</div></div>
      <div><div className="mb-3 font-semibold text-white">{copy.followTitle}</div><div className="space-y-2 text-sm text-neutral-400">{link("instagram")}{link("linkedin")}{link("website")}</div></div>
    </div><div className="border-t border-white/10 py-4 text-center text-xs text-neutral-500">{copy.rights}</div>
  </footer>;
}
