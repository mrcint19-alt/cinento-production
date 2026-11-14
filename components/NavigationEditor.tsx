"use client";
// Navigation Custom Icons PRO v1.0 | 2026-11-14 | Local review, baseline ae94b7a.

import { useState } from "react";
import Link from "next/link";
import { DEFAULT_NAVIGATION, ITEM_ICONS, MENU_ICONS, SITE_LOCALES, MAX_NAVIGATION_ICONS, NAVIGATION_ICON_STARTERS, defaultNavigationItemIcon, editNavigationIcon, isNavigationImage, removeNavigationIcon, validNavigationHref, validNavigationIcon, type NavigationItem, type SiteLocale, type SiteNavigation } from "../lib/site-navigation";
import { NavigationIcon } from "./SiteHeader";

const field = "w-full rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-2 text-white";
const button = "rounded-lg border border-yellow-500/50 px-3 py-2 text-sm text-yellow-300 disabled:opacity-40";

type IconImages = { gallery: string[]; icons: string[] };
const NO_IMAGES: IconImages = { gallery: [], icons: [] };

function ImageChoices({ images, value, onSelect }: { images: IconImages; value: string; onSelect: (url: string) => void }) {
  const [folder, setFolder] = useState<"gallery" | "icons">("icons");
  const choices = [...new Set(images[folder])].filter(url => isNavigationImage(url, true));
  return <div className="space-y-3">
    <div className="flex gap-2">{(["icons", "gallery"] as const).map(name => <button key={name} type="button" className={button} aria-pressed={folder === name} onClick={() => setFolder(name)}>{name === "icons" ? "Icon uploads" : "Gallery images"}</button>)}</div>
    <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
      {choices.map((url, index) => <button key={url} type="button" aria-label={`Choose ${folder} image ${index + 1}`} aria-pressed={value === url} onClick={() => onSelect(url)} className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-lg border p-2 ${value === url ? "border-yellow-400 bg-yellow-500/10" : "border-neutral-600 bg-neutral-950"}`}>
        <NavigationIcon value={url} className="h-12 w-12" /><span className="text-xs">{index + 1}{value === url ? " · Selected" : ""}</span>
      </button>)}
    </div>
    {!choices.length && <p className="text-sm text-neutral-400">No raster images in this folder. Choose Gallery images or upload a new icon below.</p>}
  </div>;
}

function IconChooser({ value, libraryId, main = false, defaultIcon = "star", images, navigation, onSelect }: {
  value: string; libraryId?: string; main?: boolean; defaultIcon?: string; images: IconImages; navigation: SiteNavigation; onSelect: (value: string, libraryId?: string) => void;
}) {
  const presets: readonly string[] = main ? MENU_ICONS : ITEM_ICONS;
  const fallback = main ? "menu" : defaultIcon;
  const asset = navigation.iconLibrary?.find(icon => icon.id === libraryId);
  return <div className="space-y-3 rounded-lg border border-neutral-600 p-3">
    <div className="flex flex-wrap items-center gap-3"><NavigationIcon value={value} fallback={fallback} showStatus className="h-7 w-7 shrink-0 text-yellow-400" /><span className="break-all text-xs text-neutral-300">{asset ? `Library: ${asset.name}` : presets.includes(value) ? `Preset: ${value}` : "Custom image URL"}</span><button type="button" className={button} onClick={() => onSelect(fallback)}>Reset icon</button></div>
    <details><summary className="cursor-pointer py-2 text-sm text-yellow-300">Choose a ready icon</summary><div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">{presets.map(icon => <button key={icon} type="button" aria-label={`Use preset ${icon}`} aria-pressed={!libraryId && value === icon} className={`${button} flex min-h-16 flex-col items-center justify-center gap-2`} onClick={() => onSelect(icon)}><NavigationIcon value={icon} /><span className="text-xs">{icon}</span></button>)}</div></details>
    <details><summary className="cursor-pointer py-2 text-sm text-yellow-300">Choose from Gallery or icon uploads</summary><ImageChoices images={images} value={value} onSelect={url => onSelect(url)} /></details>
    {!!navigation.iconLibrary?.length && <details><summary className="cursor-pointer py-2 text-sm text-yellow-300">Choose from saved icon collection</summary><div className="mt-2 grid grid-cols-2 gap-2">{navigation.iconLibrary.map(icon => <button key={icon.id} type="button" disabled={!isNavigationImage(icon.url, true)} className={`${button} flex min-h-16 items-center gap-2 text-start`} aria-pressed={libraryId === icon.id} onClick={() => onSelect(icon.url, icon.id)}><NavigationIcon value={icon.url} className="h-7 w-7 shrink-0" /><span className="break-words">{icon.name}{!icon.url ? " · Add image" : ""}</span></button>)}</div></details>}
    <details><summary className="cursor-pointer py-2 text-xs text-neutral-400">Existing image URL (advanced)</summary><label className="mt-2 block text-sm">Icon image URL<input dir="ltr" className={field} value={presets.includes(value) ? "" : value} maxLength={1000} onChange={event => onSelect(event.target.value || fallback)} placeholder="HTTPS image URL" /></label></details>
    {!validNavigationIcon(value, main) && <p role="alert" className="text-sm text-red-300">Choose a preset or a valid image URL.</p>}
  </div>;
}

export default function NavigationEditor({ value, onChange, images = NO_IMAGES, mediaWritable = false, onMediaChanged, onUploadBusyChange }: { value: SiteNavigation; onChange: (value: SiteNavigation) => void; images?: IconImages; mediaWritable?: boolean; onMediaChanged?: () => void; onUploadBusyChange?: (busy: boolean) => void }) {
  const [selected, setSelected] = useState(value.items[0]?.id ?? "");
  const [previewLocale, setPreviewLocale] = useState<SiteLocale>("en");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [uploading, setUploading] = useState(false);
  const [mediaMessage, setMediaMessage] = useState("");
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
  const addIcon = () => {
    if ((value.iconLibrary?.length ?? 0) >= MAX_NAVIGATION_ICONS) return;
    onChange({ ...value, iconLibrary: [...(value.iconLibrary ?? []), { id: `icon-${crypto.randomUUID().slice(0, 8)}`, name: "New icon", url: "" }] });
  };
  const addCollection = () => {
    const existing = value.iconLibrary ?? [];
    const missing = NAVIGATION_ICON_STARTERS.filter(name => !existing.some(icon => icon.name === name));
    onChange({ ...value, iconLibrary: [...existing, ...missing.slice(0, MAX_NAVIGATION_ICONS - existing.length).map(name => ({ id: `icon-${crypto.randomUUID().slice(0, 8)}`, name, url: "" }))] });
  };
  const deleteIcon = (id: string) => {
    const icon = value.iconLibrary?.find(item => item.id === id);
    if (!icon || !window.confirm(`Remove icon "${icon.name}" from this collection? Linked menu icons return to their defaults. The image file stays in Image Manager.`)) return;
    onChange(removeNavigationIcon(value, id));
  };
  async function uploadIcon(file: File | undefined, id?: string) {
    if (!file || !mediaWritable || uploading) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size === 0 || file.size > 4 * 1024 * 1024) {
      setMediaMessage("Choose a PNG, JPG or WebP image under 4 MB. SVG upload is not enabled.");
      return;
    }
    if (!id && (value.iconLibrary?.length ?? 0) >= MAX_NAVIGATION_ICONS) return;
    setUploading(true); onUploadBusyChange?.(true); setMediaMessage("");
    try {
      const body = new FormData(); body.append("folder", "icons"); body.append("file", file);
      const response = await fetch("/api/admin/images", { method: "POST", body });
      const result = await response.json();
      if (!response.ok || !result.success || !isNavigationImage(result.url, true)) throw new Error(result.message || "Icon upload failed.");
      if (id) onChange(editNavigationIcon(value, id, { url: result.url }));
      else onChange({ ...value, iconLibrary: [...(value.iconLibrary ?? []), { id: `icon-${crypto.randomUUID().slice(0, 8)}`, name: file.name.replace(/\.[^.]+$/, "").slice(0, 80) || "New icon", url: result.url }] });
      onMediaChanged?.();
      setMediaMessage("Image uploaded. Use the page Save button to save the collection and menu assignments.");
    } catch (error) { setMediaMessage(error instanceof Error ? error.message : "Icon upload failed."); }
    finally { setUploading(false); onUploadBusyChange?.(false); }
  }

  return <fieldset disabled={uploading} className="min-w-0 space-y-5">
    <p className="text-sm text-neutral-300">One shared menu. Titles are edited separately for EN, TR, FA and AR. Preview below updates without saving; Preview server writes remain disabled.</p>
    <h3 className="font-semibold text-yellow-300">Main menu icon</h3>
    <IconChooser value={value.menuIcon} libraryId={value.menuIconLibraryId} main images={images} navigation={value} onSelect={(icon, id) => onChange({ ...value, menuIcon: icon, menuIconLibraryId: id })} />
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
      <h3 className="font-semibold text-yellow-300">Icon for {current.labels.en || current.id}</h3>
      <IconChooser key={current.id} value={current.icon} libraryId={current.iconLibraryId} defaultIcon={defaultNavigationItemIcon(current.id)} images={images} navigation={value} onSelect={(icon, id) => update(current.id, { icon, iconLibraryId: id })} />
    </div>}
    <details className="rounded-xl border border-neutral-600 p-4">
      <summary className="cursor-pointer font-semibold text-yellow-300">Icon collection · add, edit or remove</summary>
      <p className="mt-3 text-sm text-neutral-300">Collection names and images are editable here. New uploads are separate from the public Gallery. Uploading saves the image file immediately; menu changes are saved only with the page Save button.</p>
      <div className="my-3 flex flex-wrap gap-2">
        <button type="button" className={button} disabled={(value.iconLibrary?.length ?? 0) >= MAX_NAVIGATION_ICONS} onClick={addIcon}>Add icon</button>
        <button type="button" className={button} disabled={(value.iconLibrary?.length ?? 0) >= MAX_NAVIGATION_ICONS} onClick={addCollection}>Add 12 starter entries</button>
        <label className={`${button} inline-flex cursor-pointer items-center ${!mediaWritable ? "opacity-40" : ""}`}>Upload new icon<input className="sr-only" aria-label="Upload new navigation icon" type="file" accept="image/png,image/jpeg,image/webp" disabled={!mediaWritable || uploading || (value.iconLibrary?.length ?? 0) >= MAX_NAVIGATION_ICONS} onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; void uploadIcon(file); }} /></label>
      </div>
      {!mediaWritable && <p className="text-sm text-neutral-400">Uploads are unavailable in this preview or while media is loading. You can still preview menu edits without saving.</p>}
      <p role="status" className="break-words text-sm text-yellow-200">{mediaMessage || (uploading ? "Uploading icon…" : "")}</p>
      <div className="mt-4 space-y-4">{(value.iconLibrary ?? []).map(icon => <div key={icon.id} className="space-y-3 rounded-lg border border-neutral-700 p-3">
        <div className="flex flex-wrap items-center justify-between gap-3"><NavigationIcon key={icon.url} value={icon.url} showStatus className="h-12 w-12 text-yellow-400" /><button type="button" className="rounded border border-red-500 px-3 py-2 text-sm text-red-300" onClick={() => deleteIcon(icon.id)}>Remove icon</button></div>
        <label className="block text-sm">Icon name<input className={field} value={icon.name} maxLength={80} onChange={event => onChange(editNavigationIcon(value, icon.id, { name: event.target.value }))} /></label>
        <label className="block text-sm">Collection image URL<input dir="ltr" className={field} value={icon.url} maxLength={1000} onChange={event => onChange(editNavigationIcon(value, icon.id, { url: event.target.value }))} placeholder="Choose an image below or upload one" /></label>
        {icon.url && !isNavigationImage(icon.url, true) && <p role="alert" className="text-sm text-red-300">Use a PNG, JPG or WebP image URL for this collection entry.</p>}
        {!icon.url && <p className="text-xs text-neutral-400">No image selected. This entry cannot be assigned yet.</p>}
        <details><summary className="cursor-pointer text-sm text-yellow-300">Choose or replace image</summary><ImageChoices images={images} value={icon.url} onSelect={url => onChange(editNavigationIcon(value, icon.id, { url }))} /></details>
        <div className="flex flex-wrap gap-2">
          <label className={`${button} cursor-pointer`}>Upload replacement<input className="sr-only" aria-label={`Upload image for ${icon.name || icon.id}`} type="file" accept="image/png,image/jpeg,image/webp" disabled={!mediaWritable || uploading} onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; void uploadIcon(file, icon.id); }} /></label>
          <button type="button" className={button} disabled={!current || !isNavigationImage(icon.url, true)} onClick={() => { if (current) update(current.id, { icon: icon.url, iconLibraryId: icon.id }); }}>Use for selected menu item</button>
          <button type="button" className={button} disabled={!isNavigationImage(icon.url, true)} onClick={() => onChange({ ...value, menuIcon: icon.url, menuIconLibraryId: icon.id })}>Use for main menu</button>
        </div>
      </div>)}</div>
      <p className="mt-3 text-xs text-neutral-400">Removing an entry resets its linked menu icons; it does not delete the image file. Delete unused uploads in the existing Image Manager. Empty named entries may be saved for later completion.</p>
    </details>
    <div className="rounded-xl border border-yellow-500/30 bg-[#1b2630] p-4"><strong className="flex flex-wrap items-center gap-2"><NavigationIcon value={value.menuIcon} fallback="menu" showStatus /> Menu preview · {previewLocale.toUpperCase()}</strong><div className="my-3 flex flex-wrap gap-2">{SITE_LOCALES.map(locale => <button key={locale} type="button" aria-pressed={previewLocale === locale} className={`${button} ${previewLocale === locale ? "bg-yellow-500 text-black" : ""}`} onClick={() => setPreviewLocale(locale)}>{locale.toUpperCase()}</button>)}</div><div className="mb-3 flex gap-2">{(["desktop", "mobile"] as const).map(device => <button type="button" key={device} className={button} aria-pressed={previewDevice === device} onClick={() => setPreviewDevice(device)}>{device === "mobile" ? "Mobile preview · 320px" : "Desktop preview"}</button>)}</div><div dir={previewLocale === "fa" || previewLocale === "ar" ? "rtl" : "ltr"} className={`space-y-1 ${previewDevice === "mobile" ? "mx-auto w-80 max-w-full border border-neutral-500 p-2" : ""}`}>{value.items.filter(item => item.enabled).map(item => <div key={item.id} className={`flex min-h-11 items-center gap-3 rounded bg-white/5 px-3 py-2 ${item.parentId ? "ms-6" : ""}`}><NavigationIcon value={item.icon} fallback={defaultNavigationItemIcon(item.id)} showStatus className="h-5 w-5 shrink-0 text-yellow-400" /><span className="min-w-0 break-words">{item.labels[previewLocale] || item.id}</span></div>)}</div><p className="mt-3 text-xs text-neutral-400">Preview does not save changes. Use the page Save button when ready.</p></div>
    <button type="button" className={button} onClick={() => { if (window.confirm("Restore the original six menu items? Unsaved menu edits will be lost.")) { onChange(DEFAULT_NAVIGATION); setSelected("home"); } }}>Restore original menu</button>
  </fieldset>;
}

