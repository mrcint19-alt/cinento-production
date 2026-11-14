"use client";
/* CINENTO Footer PRO v1.1 | 2026-11-14 | No automatic legal approval */
import { footerGuideLink, type FooterShared, type FooterLocale, type FooterLinkCopy } from "../lib/footer-manager";
export default function FooterGuideEditor({ value, locale, onChange }: { value: FooterShared; locale: FooterLocale; onChange: (next: FooterShared) => void }) {
  const field = "mt-2 block w-full rounded-lg border border-neutral-700 bg-neutral-900 p-3";
  const update = (id: string, patch: Partial<FooterLinkCopy>) => onChange({ ...value, guideLinks: value.guideLinks.map(item => item.id === id ? { ...item, translations: { ...item.translations, [locale]: { ...item.translations[locale], ...patch, ...(("href" in patch || "revision" in patch) ? { approved: false, approvalRef: "", reviewedOn: "" } : {}) } } } : item) });
  return <fieldset className="space-y-4 rounded-xl border border-neutral-700 p-4">
    <legend>Footer guide & legal links · {locale.toUpperCase()}</legend>
    <p className="text-sm text-neutral-300">Edit the selected language only; no translation is generated or copied from another language. Legal links require a reviewed destination, revision, approval reference and date for each language. This records your confirmation of qualified legal review; it does not perform that review. Changing the URL or revision clears approval. Enter no private details in the approval reference.</p>
    <label className="block text-sm">{locale.toUpperCase()} guide section heading<input className={field} value={value.linksTitle[locale]} onChange={event => onChange({ ...value, linksTitle: { ...value.linksTitle, [locale]: event.target.value } })} /></label>
    {value.guideLinks.map(item => { const copy = item.translations[locale]; return <fieldset key={item.id} className="space-y-3 border border-neutral-700 p-3"><legend>{item.kind} · {locale.toUpperCase()}</legend>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={item.enabled} onChange={event => onChange({ ...value, guideLinks: value.guideLinks.map(link => link.id === item.id ? { ...link, enabled: event.target.checked } : link) })} />Enable link (all languages with complete, eligible copy)</label>
      <label className="block text-sm">Translated link title<input className={field} value={copy.label} onChange={event => update(item.id, { label: event.target.value })} /></label>
      <label className="block text-sm">{locale.toUpperCase()} destination · HTTPS URL or existing site path<input className={field} value={copy.href} onChange={event => update(item.id, { href: event.target.value })} /></label>
      {item.kind !== "guide" && <>
        <label className="block text-sm">Reviewed document revision<input className={field} value={copy.revision} onChange={event => update(item.id, { revision: event.target.value })} /></label>
        <label className="block text-sm">Legal approval reference<input className={field} value={copy.approvalRef} onChange={event => update(item.id, { approvalRef: event.target.value })} /></label>
        <label className="block text-sm">Review date<input type="date" className={field} value={copy.reviewedOn} onChange={event => update(item.id, { reviewedOn: event.target.value })} /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={copy.approved} onChange={event => update(item.id, { approved: event.target.checked })} />This language version has been legally reviewed and approved</label>
        <p className="text-sm text-yellow-400">{copy.approved && copy.approvalRef && copy.reviewedOn && copy.revision ? "Approval recorded; valid title and destination are also required to display." : "Pending legal review — hidden from the public footer."}</p>
      </>}
      <button type="button" className="rounded border border-neutral-600 px-3 py-2 text-sm" onClick={() => { if (window.confirm("Remove this footer link and its four translations?")) onChange({ ...value, guideLinks: value.guideLinks.filter(link => link.id !== item.id) }); }}>Remove link</button>
    </fieldset>; })}
    <div className="flex flex-wrap gap-2">{(["guide", "privacy", "terms"] as const).map(kind => <button key={kind} type="button" disabled={value.guideLinks.length >= 12} className="rounded border border-yellow-600 px-3 py-2 text-sm disabled:opacity-40" onClick={() => onChange({ ...value, guideLinks: [...value.guideLinks, footerGuideLink({ id: crypto.randomUUID(), kind })] })}>Add {kind} link</button>)}</div>
    <p className="text-sm text-neutral-400">Save using the page Save button. This editor manages translated labels and reviewed document destinations; it does not create or translate the legal document itself.</p>
  </fieldset>;
}
