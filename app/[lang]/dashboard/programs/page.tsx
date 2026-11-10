"use client";
/* eslint-disable @next/next/no-img-element -- Dashboard previews owner-selected image URLs from arbitrary approved hosts. */

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Program, Language } from "../../../../lib/program-catalog";

const langs: Language[] = ["en", "tr", "fa", "ar"];
const mediaFields = [
  { field: "icon_url", title: "آیکن برنامه", hint: "تصویر مربعی؛ زمینه شفاف بهتر است", shape: "aspect-square max-w-36" },
  { field: "logo_url", title: "لوگوی برنامه", hint: "تصویر افقی؛ زمینه شفاف بهتر است", shape: "aspect-[3/1] w-full" },
  { field: "cover_url", title: "تصویر شاخص", hint: "تصویر افقی با نسبت ۱۶:۹", shape: "aspect-video w-full" },
] as const;
const blankCopy = () => ({ description: "", audience: "", scope: [] as string[], service: "", features: [] as string[], advantages: [] as string[] });
const blank = (): Program => ({
  id: "", name: "", mark: "", category: "business", status: "development",
  access_url: "", published: false, sort_order: 100,
  icon_url: null, logo_url: null, cover_url: null,
  copy: { en: blankCopy(), tr: blankCopy(), fa: blankCopy() },
});

export default function ProgramManager() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dirty, setDirty] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [form, setForm] = useState<Program>(blank());
  const [editing, setEditing] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/programs?scope=admin", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Cannot load programs");
    setPrograms(result.programs);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/programs/session", { cache: "no-store" })
      .then(response => response.json())
      .then(async result => {
        if (!active) return;
        setConfigured(result.configured !== false);
        setAuthenticated(result.authenticated === true);
        if (result.authenticated) await load();
      })
      .catch(() => { if (active) setError("Unable to check administrator access."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [load]);

  async function signIn(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setSuccess("");
    try {
      const response = await fetch("/api/programs/session", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Sign-in failed");
      setPassword(""); setAuthenticated(true); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Sign-in failed"); }
    finally { setBusy(false); }
  }

  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setSuccess("");
    try {
      const response = await fetch("/api/programs", { method: editing ? "PUT" : "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Save failed");
      setForm(result.program); setEditing(true); setDirty(false);
      setSuccess("تغییرات برنامه ذخیره شد. برای مشاهده در سایت، «View public catalog» را باز کنید.");
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Save failed"); }
    finally { setBusy(false); }
  }

  async function remove(id: string) {
    if (!window.confirm(`Delete ${id}? This removes the program from the public catalog.`)) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/programs", { method: "DELETE", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Delete failed");
      await load(); if (form.id === id) { setForm(blank()); setEditing(false); setDirty(false); setSuccess(""); }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Delete failed"); }
    finally { setBusy(false); }
  }

  const inputClass = "w-full rounded-lg border border-neutral-700 bg-neutral-900 p-3 text-white";
  const labelClass = "grid gap-2 text-sm text-neutral-300";
  const update = (field: keyof Program, value: unknown) => {
    setDirty(true); setSuccess(""); setForm(previous => ({ ...previous, [field]: value }));
  };
  const updateCopy = (field: "description" | "audience" | "service" | "scope" | "features" | "advantages", value: string) => {
    setDirty(true); setSuccess(""); setForm(previous => ({
      ...previous, copy: { ...previous.copy, [language]: { ...(previous.copy[language] ?? blankCopy()), [field]: ["scope", "features", "advantages"].includes(field) ? value.split("\n").map(item => item.trim()).filter(Boolean) : value } },
    }));
  };
  async function uploadMedia(field: "icon_url" | "logo_url" | "cover_url", file?: File) {
    if (!file || !form.id) return;
    if (file.size > 4 * 1024 * 1024 || !["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Use a PNG, JPG or WebP image up to 4 MB."); return;
    }
    const id = form.id;
    setBusy(true); setError(""); setSuccess("");
    try {
      const body = new FormData();
      body.set("id", id); body.set("kind", field.replace("_url", "")); body.set("file", file);
      const response = await fetch("/api/programs/media", { method: "POST", credentials: "same-origin", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Image upload failed");
      setForm(previous => previous.id === id ? { ...previous, [field]: result.url } : previous);
      setDirty(true);
      setSuccess("تصویر بارگذاری شد. برای ثبت آن روی «ذخیره تغییرات» بزنید.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Image upload failed"); }
    finally { setBusy(false); }
  }

  function updateGallery(gallery: string[]) {
    setDirty(true); setSuccess("");
    setForm(previous => ({ ...previous, copy: { ...previous.copy, media: { gallery } } }));
  }

  async function uploadGallery(file?: File) {
    if (!file || !form.id) return;
    if (file.size > 4 * 1024 * 1024 || !["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Use a PNG, JPG or WebP image up to 4 MB."); return;
    }
    if ((form.copy.media?.gallery.length ?? 0) >= 8) { setError("Maximum 8 gallery images per program."); return; }
    setBusy(true); setError(""); setSuccess("");
    try {
      const body = new FormData();
      body.set("id", form.id); body.set("kind", "gallery"); body.set("file", file);
      const response = await fetch("/api/programs/media", { method: "POST", credentials: "same-origin", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Image upload failed");
      setForm(previous => ({ ...previous, copy: { ...previous.copy, media: { gallery: [...(previous.copy.media?.gallery ?? []), result.url] } } }));
      setDirty(true); setSuccess("Gallery image uploaded. Save the program to publish it.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Image upload failed"); }
    finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-black px-5 py-12 text-white">
    <div className="mx-auto max-w-6xl">
      <Link href="/en/dashboard" className="text-yellow-400">← CINENTO Dashboard</Link>
      <h1 className="my-7 text-3xl font-bold text-yellow-400">Products &amp; Platforms Manager</h1>
      {error && <p role="alert" className="my-4 rounded-lg border border-red-500 p-4 text-red-200">{error}</p>}
      {success && <p role="status" className="my-4 rounded-lg border border-emerald-700 bg-emerald-950/40 p-4 text-emerald-200">{success}</p>}
      {loading ? <p>Loading…</p> : !configured ? <p>Catalog database is not configured yet.</p> : !authenticated ?
        <form onSubmit={signIn} className="grid max-w-md gap-4 rounded-xl border border-neutral-700 p-6">
          <h2 className="text-xl">Catalog administrator sign-in</h2>
          <label className={labelClass}>Email<input className={inputClass} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="username" /></label>
          <label className={labelClass}>Password<input className={inputClass} type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" /></label>
          <button disabled={busy} className="rounded-lg bg-yellow-500 p-3 font-semibold text-black disabled:opacity-50">Sign in</button>
        </form> : <>
          <div className="mb-6 flex flex-wrap gap-3">
            <button disabled={busy} onClick={() => { if (dirty && !window.confirm("تغییرات ذخیره نشده‌اند. ادامه می‌دهید؟")) return; setEditing(false); setForm(blank()); setDirty(false); setSuccess(""); }} className="rounded-lg bg-yellow-500 px-4 py-2 text-black disabled:opacity-50">Add program</button>
            <Link href="/en/platforms" className="rounded-lg border border-yellow-500 px-4 py-2">View public catalog</Link>
            <Link href="/en#ecosystem" className="rounded-lg border border-neutral-600 px-4 py-2">View homepage Ecosystem</Link>
            <button onClick={async () => { await fetch("/api/programs/session", { method: "DELETE" }); setAuthenticated(false); setPrograms([]); }} className="rounded-lg border border-neutral-600 px-4 py-2">Sign out</button>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
            <section aria-label="Programs" className="space-y-3">
              {programs.map(program => <div key={program.id} className="rounded-xl border border-neutral-700 p-4">
                <div className="flex justify-between gap-3"><strong>{program.name}</strong><span className="text-xs text-neutral-400">{program.published ? "Published" : "Draft"}</span></div>
                <p className="my-2 text-xs text-neutral-400">{program.id} · {program.category} · Order {program.sort_order}</p>
                <p className="mb-2 text-xs text-neutral-400">Translations: {langs.map(lang => <span key={lang} className={`mr-2 ${program.copy[lang]?.description && program.copy[lang]?.audience && program.copy[lang]?.service ? "text-emerald-300" : "text-amber-300"}`}>{lang.toUpperCase()} {program.copy[lang]?.description && program.copy[lang]?.audience && program.copy[lang]?.service ? "✓" : "needs translation"}</span>)}</p>
                <div className="flex gap-4 text-sm"><button disabled={busy} onClick={() => { if (dirty && !window.confirm("تغییرات ذخیره نشده‌اند. ادامه می‌دهید؟")) return; setForm(structuredClone(program)); setEditing(true); setDirty(false); setSuccess(""); }} className="text-yellow-400 disabled:opacity-50">Edit</button><button disabled={busy} onClick={() => remove(program.id)} className="text-red-300">Delete</button></div>
              </div>)}
              {!programs.length && <p className="text-neutral-400">No programs yet.</p>}
            </section>
            <form onSubmit={save} className="grid gap-4 rounded-xl border border-neutral-700 p-5">
              <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-700 bg-black/95 py-3 backdrop-blur">
                <h2 className="text-xl text-yellow-400">{editing ? `Edit ${form.name}` : "Add program"}</h2>
                <button disabled={busy || !dirty} className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-black disabled:opacity-50">{busy ? "در حال انجام…" : "ذخیره تغییرات"}</button>
              </div>
              <label className={labelClass}>ID (slug)<input className={inputClass} value={form.id} disabled={editing} pattern="[a-z0-9]+(-[a-z0-9]+)*" required maxLength={64} onChange={e => update("id", e.target.value)} /></label>
              <label className={labelClass}>Name<input className={inputClass} value={form.name} required maxLength={120} onChange={e => update("name", e.target.value)} /></label>
              <label className={labelClass}>Short mark<input className={inputClass} value={form.mark} required maxLength={24} onChange={e => update("mark", e.target.value)} /></label>
              <label className={labelClass}>Category<select className={inputClass} value={form.category} onChange={e => update("category", e.target.value)}>{["intelligence", "media", "business", "connectivity"].map(item => <option key={item}>{item}</option>)}</select></label>
              <label className={labelClass}>Status<select className={inputClass} value={form.status ?? ""} onChange={e => update("status", e.target.value || undefined)}><option value="">Unspecified</option><option value="development">In development</option><option value="desktop">Desktop</option></select></label>
              <label className={labelClass}>Application URL (stored for future use; not shown on public product pages)<input className={inputClass} type="url" value={form.access_url ?? ""} onChange={e => update("access_url", e.target.value)} /></label>
              <fieldset className="grid gap-4 rounded-lg border border-neutral-700 p-4" dir="rtl">
                <legend className="px-2 text-yellow-400">تصاویر برنامه</legend>
                <p className="text-sm text-neutral-300">برای هر بخش یک تصویر انتخاب کنید، پیش‌نمایش را ببینید و سپس «ذخیره تغییرات» را بزنید. فرمت PNG، JPG یا WebP؛ حداکثر ۴ مگابایت.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {mediaFields.map(({ field, title, hint, shape }) => <div key={field} className="grid content-start gap-3 rounded-xl border border-neutral-700 bg-neutral-950 p-4">
                    <div><strong className="text-white">{title}</strong><p className="mt-1 text-xs text-neutral-400">{hint}</p></div>
                    <div className={`grid place-items-center overflow-hidden rounded-lg border border-dashed border-neutral-600 bg-neutral-900 ${shape}`}>
                      {form[field] ? <img src={form[field]} alt={`پیش‌نمایش ${title}`} className="h-full w-full object-contain" /> : <span className="p-4 text-sm text-neutral-500">هنوز تصویری انتخاب نشده است</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className={`cursor-pointer rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-black focus-within:outline focus-within:outline-2 focus-within:outline-white ${busy || !form.id ? "opacity-50" : ""}`}>
                        {form[field] ? "تعویض تصویر" : "انتخاب تصویر"}
                        <input aria-label={`بارگذاری ${title}`} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" disabled={busy || !form.id} onChange={e => { void uploadMedia(field, e.target.files?.[0]); e.target.value = ""; }} />
                      </label>
                      {form[field] && <button type="button" disabled={busy} className="rounded-lg border border-neutral-600 px-3 py-2 text-sm" onClick={() => update(field, null)}>حذف تصویر</button>}
                    </div>
                    <details className="text-xs text-neutral-400"><summary className="cursor-pointer">درج نشانی تصویر به‌جای فایل</summary>
                      <input aria-label={`نشانی ${title}`} className={`${inputClass} mt-2 text-left`} dir="ltr" type="url" placeholder="https://..." maxLength={1000} value={form[field] ?? ""} onChange={e => update(field, e.target.value)} />
                    </details>
                  </div>)}
                </div>
                {!form.id && <p className="text-sm text-yellow-300">برای برنامهٔ جدید، ابتدا ID را در بالای فرم وارد کنید.</p>}
              </fieldset>
              <fieldset className="grid gap-3 rounded-lg border border-neutral-700 p-4">
                <legend className="px-2 text-yellow-400">Program gallery (shared across languages)</legend>
                <p className="text-sm text-neutral-400">Up to eight screenshots. Upload or paste HTTPS image URLs. The gallery appears on the public product profile after saving.</p>
                <label className="cursor-pointer rounded-lg border border-yellow-500 px-4 py-2 text-center text-sm text-yellow-400">Upload screenshot<input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" disabled={busy || !form.id} onChange={e => { void uploadGallery(e.target.files?.[0]); e.target.value = ""; }} /></label>
                <textarea className={inputClass} dir="ltr" rows={4} aria-label="Gallery image URLs, one per line" placeholder="https://… (one image per line)" value={(form.copy.media?.gallery ?? []).join("\n")} onChange={e => updateGallery(e.target.value.split("\n").map(item => item.trim()).filter(Boolean))} />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{(form.copy.media?.gallery ?? []).map((url, index) => <img key={`${url}-${index}`} src={url} alt={`Gallery preview ${index + 1}`} className="aspect-video w-full rounded-lg border border-neutral-700 object-contain" />)}</div>
              </fieldset>
              <label className={labelClass}>Order<input className={inputClass} type="number" min={0} max={9999} value={form.sort_order ?? 100} onChange={e => update("sort_order", Number(e.target.value))} /></label>
              <label className="flex gap-3"><input type="checkbox" checked={!!form.published} onChange={e => update("published", e.target.checked)} />Published</label>
              <div className="flex gap-3 border-b border-neutral-700 pb-3">{langs.map(lang => <button key={lang} type="button" onClick={() => setLanguage(lang)} aria-pressed={language === lang} className={`rounded px-3 py-2 ${language === lang ? "bg-yellow-500 text-black" : "border border-neutral-700"}`}>{lang.toUpperCase()}</button>)}</div>
              <label className={labelClass}>Description ({language})<textarea className={inputClass} dir={language === "fa" || language === "ar" ? "rtl" : "ltr"} rows={4} value={(form.copy[language] ?? blankCopy()).description} required={language !== "ar" || !!form.copy.ar} maxLength={1500} onChange={e => updateCopy("description", e.target.value)} /></label>
              <label className={labelClass}>Audience ({language})<input className={inputClass} dir={language === "fa" || language === "ar" ? "rtl" : "ltr"} value={(form.copy[language] ?? blankCopy()).audience} required={language !== "ar" || !!form.copy.ar} maxLength={500} onChange={e => updateCopy("audience", e.target.value)} /></label>
              <label className={labelClass}>Focus areas, one per line ({language})<textarea className={inputClass} dir={language === "fa" || language === "ar" ? "rtl" : "ltr"} rows={4} value={(form.copy[language] ?? blankCopy()).scope.join("\n")} onChange={e => updateCopy("scope", e.target.value)} /></label>
              <label className={labelClass}>Program features, one per line ({language})<textarea className={inputClass} dir={language === "fa" || language === "ar" ? "rtl" : "ltr"} rows={5} value={(form.copy[language]?.features ?? []).join("\n")} maxLength={3000} placeholder="Add confirmed features only; leave blank until verified" onChange={e => updateCopy("features", e.target.value)} /></label>
              <label className={labelClass}>Competitive advantages, one per line ({language})<textarea className={inputClass} dir={language === "fa" || language === "ar" ? "rtl" : "ltr"} rows={4} value={(form.copy[language]?.advantages ?? []).join("\n")} maxLength={3000} placeholder="Add verified advantages; leave blank if none" onChange={e => updateCopy("advantages", e.target.value)} /></label>
              <p className="text-xs text-neutral-400">امکانات تأییدشدهٔ همین برنامه را هر کدام در یک خط بنویسید. این بخش اختیاری است و فقط در صفحهٔ معرفی برنامه نمایش داده می‌شود.</p>
              <label className={labelClass}>Service ({language})<input className={inputClass} dir={language === "fa" || language === "ar" ? "rtl" : "ltr"} value={(form.copy[language] ?? blankCopy()).service} required={language !== "ar" || !!form.copy.ar} maxLength={500} onChange={e => updateCopy("service", e.target.value)} /></label>
              <p className="text-xs text-neutral-400">EN, TR و FA برای ذخیره لازم‌اند. ترجمهٔ AR اختیاری است؛ در صورت شروع، همهٔ فیلدهای متنی آن را کامل کنید. تا آن زمان متن انگلیسی در سایت نمایش داده می‌شود.</p>
              <button disabled={busy || !dirty} className="rounded-lg bg-yellow-500 p-3 font-semibold text-black disabled:opacity-50">{busy ? "در حال ذخیره…" : "ذخیره تغییرات"}</button>
            </form>
          </div>
        </>}
    </div>
  </main>;
}
