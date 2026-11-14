"use client";
/* CINENTO Footer Manager PRO v1.0 | 2026-11-14 | baseline 5d4af80 */
import { FOOTER_CHANNELS, footerErrors, type FooterShared } from "../lib/footer-manager";
export default function FooterSharedEditor({ value, onChange }: { value: FooterShared; onChange: (next: FooterShared) => void }) {
  return <fieldset className="space-y-4 rounded-xl border border-yellow-600/40 p-4">
    <legend className="px-2 text-yellow-400">Footer Manager PRO · shared identity & links</legend>
    <label className="flex items-center gap-2"><input type="checkbox" checked={value.enabled} onChange={event => onChange({ ...value, enabled: event.target.checked })} />Use shared identity and links in all four languages</label>
    <p className="text-sm text-neutral-300">Review and enter the approved links before enabling. Existing language-specific links stay unchanged until enabled. Blank shared channels stay hidden. Use the page Save button.</p>
    {([ ["brandName", "Brand name"], ["legalOwner", "Legal owner"], ["country", "Country of registration"] ] as const).map(([key, label]) => <label key={key} className="block text-sm">{label}<input type="text" value={value[key]} onChange={event => onChange({ ...value, [key]: event.target.value })} className="mt-2 block w-full rounded-lg border border-neutral-700 bg-neutral-900 p-3" /></label>)}
    {FOOTER_CHANNELS.map(key => <div key={key} className="space-y-2"><label className="block text-sm">{key === "whatsapp" ? "WhatsApp number with country code" : key}<input type="text" value={value[key]} onChange={event => onChange({ ...value, [key]: event.target.value })} className="mt-2 block w-full rounded-lg border border-neutral-700 bg-neutral-900 p-3" /></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={value.visible[key]} onChange={event => onChange({ ...value, visible: { ...value.visible, [key]: event.target.checked } })} />Show {key}</label></div>)}
    {footerErrors(value).map(error => <p role="alert" key={error} className="text-sm text-red-400">{error}</p>)}
    <p className="text-sm text-neutral-300">The fields below keep introduction, location, headings, WhatsApp label and rights separate for EN/TR/FA/AR. When shared mode is enabled, the shared channels above replace the legacy contact links below in the public footer only.</p>
  </fieldset>;
}
