"use client";

import { useState } from "react";
import Link from "next/link";
import { DEFAULT_NAVIGATION, ITEM_ICONS, MENU_ICONS, SITE_LOCALES, validNavigationHref, validNavigationIcon, type NavigationItem, type SiteLocale, type SiteNavigation } from "../lib/site-navigation";
import { NavigationIcon } from "./SiteHeader";

const field = "w-full rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-2 text-white";
const button = "rounded-lg border border-yellow-500/50 px-3 py-2 text-sm text-yellow-300 disabled:opacity-40";

export default function NavigationEditor({ value, onChange }: { value: SiteNavigation; onChange: (value: SiteNavigation) => void }) {
  const [selected, setSelected] = useState(value.items[0]?.id ?? "");
  const [previewLocale, setPreviewLocale] = useState<SiteLocale>("en");
  const current = value.items.find(item => item.id === selected) ?? value.items[0];
  const update = (id: string, patch: Partial<NavigationItem>) => onChange({ ...value, items: value.items.map(item => item.id === id ? { ...item, ...patch } : item) });
  const move = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= value.items.length) return;
    const items = [...value.items];
    [items[index], items[next]] = [items[next], items[index]];
    onChange({ ...value, items });
  };
  const add = () => {
    const id = `nav-${crypto.randomUUID().slice(0, 8)}`;
    onChange({ ...value, items: [...value.items, { id, labels: { en: "", tr: "", fa: "", ar: "" }, href: "", icon: "star", enabled: false }] });
    setSelected(id);
  };
  const remove = () => {
    if (!current || !window.confirm(`Remove "${current.labels.en || current.id}" and its subitems from all languages?`)) return;
    const items = value.items.filter(item => item.id !== current.id && item.parentId !== current.id);
    onChange({ ...value, items });
    setSelected(items[0]?.id ?? "");
  };

  return <div className="space-y-5">
    <p className="text-sm text-neutral-300">One shared menu. Titles are edited separately for EN, TR, FA and AR. Preview below updates without saving; Preview server writes remain disabled.</p>
    <label className="block text-sm">Main menu icon
      <select className={field} value={MENU_ICONS.includes(value.menuIcon as typeof MENU_ICONS[number]) ? value.menuIcon : "custom"} onChange={event => onChange({ ...value, menuIcon: event.target.value })}>{MENU_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}<option value="custom">Custom image</option></select>
    </label>
    {!MENU_ICONS.includes(value.menuIcon as typeof MENU_ICONS[number]) && <label className="block text-sm">Main icon image URL<input className={field} value={value.menuIcon === "custom" ? "" : value.menuIcon} onChange={event => onChange({ ...value, menuIcon: event.target.value })} placeholder="/images/gallery/icon.png or HTTPS image" /></label>}
    {!validNavigationIcon(value.menuIcon, true) && <p role="alert" className="text-red-300">Choose a preset or a valid image URL for the main icon.</p>}
    <div className="flex flex-wrap gap-2"><button type="button" className={button} onClick={add} disabled={value.items.length >= 40}>Add item</button><Link className={button} href="/en/admin/images">Upload an icon in the existing Image Manager (Gallery)</Link></div>
    <div className="flex flex-wrap gap-2" role="list" aria-label="Menu order">
      {value.items.map((item, index) => <div key={item.id} role="listitem" className="flex items-center gap-1 rounded-lg border border-neutral-700 p-1"><button type="button" className={`rounded px-2 py-1 ${item.id === current?.id ? "bg-yellow-500 text-black" : "text-white"}`} onClick={() => setSelected(item.id)}>{item.labels.en || item.id}{item.enabled ? "" : " (hidden)"}</button><button type="button" aria-label={`Move ${item.id} up`} disabled={index === 0} onClick={() => move(index, -1)}>↑</button><button type="button" aria-label={`Move ${item.id} down`} disabled={index === value.items.length - 1} onClick={() => move(index, 1)}>↓</button></div>)}
    </div>
    {current && <div className="space-y-3 rounded-xl border border-neutral-700 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><strong>{current.id}</strong><button type="button" className="rounded border border-red-500 px-3 py-2 text-sm text-red-300" onClick={remove}>Remove item</button></div>
      <label className="flex items-center gap-2"><input type="checkbox" checked={current.enabled} onChange={event => update(current.id, { enabled: event.target.checked })} />Visible</label>
      {SITE_LOCALES.map(locale => <label key={locale} className="block text-sm">Title · {locale.toUpperCase()}<input dir={locale === "fa" || locale === "ar" ? "rtl" : "ltr"} className={field} value={current.labels[locale]} maxLength={80} onChange={event => update(current.id, { labels: { ...current.labels, [locale]: event.target.value } })} /></label>)}
      <label className="block text-sm">Destination · section #about, page /platforms, or HTTPS URL<input className={field} value={current.href} onChange={event => update(current.id, { href: event.target.value })} placeholder="#about" /></label>
      {current.href && !validNavigationHref(current.href) && <p role="alert" className="text-red-300">Enter a valid internal destination or HTTPS URL.</p>}
      <label className="block text-sm">Subitem of<select className={field} value={current.parentId ?? ""} onChange={event => update(current.id, { parentId: event.target.value || undefined })}><option value="">Main menu</option>{value.items.filter(item => item.id !== current.id && !item.parentId).map(item => <option key={item.id} value={item.id}>{item.labels.en || item.id}</option>)}</select></label>
      <label className="block text-sm">Icon preset<select className={field} value={ITEM_ICONS.includes(current.icon as typeof ITEM_ICONS[number]) ? current.icon : "custom"} onChange={event => update(current.id, { icon: event.target.value })}>{ITEM_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}<option value="custom">Custom image</option></select></label>
      {!ITEM_ICONS.includes(current.icon as typeof ITEM_ICONS[number]) && <label className="block text-sm">Icon image URL<input className={field} value={current.icon === "custom" ? "" : current.icon} onChange={event => update(current.id, { icon: event.target.value })} placeholder="/images/gallery/icon.png or HTTPS image" /></label>}
      {current.enabled && !validNavigationIcon(current.icon) && <p role="alert" className="text-red-300">Choose a preset or a valid image URL for this icon.</p>}
    </div>}
    <div className="rounded-xl border border-yellow-500/30 bg-[#1b2630] p-4"><strong className="flex items-center gap-2"><NavigationIcon value={value.menuIcon} /> Menu preview · {previewLocale.toUpperCase()}</strong><div className="my-3 flex gap-2">{SITE_LOCALES.map(locale => <button key={locale} type="button" aria-pressed={previewLocale === locale} className={`${button} ${previewLocale === locale ? "bg-yellow-500 text-black" : ""}`} onClick={() => setPreviewLocale(locale)}>{locale.toUpperCase()}</button>)}</div><div dir={previewLocale === "fa" || previewLocale === "ar" ? "rtl" : "ltr"} className="space-y-1">{value.items.filter(item => item.enabled).map(item => <div key={item.id} className={`flex gap-3 rounded bg-white/5 px-3 py-2 ${item.parentId ? "ms-6" : ""}`}><NavigationIcon value={item.icon} className="h-5 w-5 shrink-0 text-yellow-400" />{item.labels[previewLocale] || item.id}</div>)}</div></div>
    <button type="button" className={button} onClick={() => { if (window.confirm("Restore the original six menu items? Unsaved menu edits will be lost.")) { onChange(DEFAULT_NAVIGATION); setSelected("home"); } }}>Restore original menu</button>
  </div>;
}
