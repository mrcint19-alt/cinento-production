"use client";
/* eslint-disable @next/next/no-img-element -- Dashboard previews owner-selected image URLs from arbitrary approved hosts. */

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Program, Language } from "../../../../lib/program-catalog";

const langs: Language[] = ["en", "tr", "fa"];
const blankCopy = () => ({ description: "", audience: "", scope: [] as string[], service: "" });
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
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch("/api/programs/session", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Sign-in failed");
      setPassword(""); setAuthenticated(true); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Sign-in failed"); }
    finally { setBusy(false); }
  }

  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch("/api/programs", { method: editing ? "PUT" : "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Save failed");
      await load(); setForm(blank()); setEditing(false);
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
      await load(); if (form.id === id) { setForm(blank()); setEditing(false); }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Delete failed"); }
    finally { setBusy(false); }
  }

  const inputClass = "w-full rounded-lg border border-neutral-700 bg-neutral-900 p-3 text-white";
  const labelClass = "grid gap-2 text-sm text-neutral-300";
  const update = (field: keyof Program, value: unknown) => setForm(previous => ({ ...previous, [field]: value }));
  const updateCopy = (field: "description" | "audience" | "service" | "scope", value: string) => setForm(previous => ({
    ...previous, copy: { ...previous.copy, [language]: { ...previous.copy[language], [field]: field === "scope" ? value.split("\n").map(item => item.trim()).filter(Boolean) : value } },
  }));
  async function uploadMedia(field: "icon_url" | "logo_url" | "cover_url", file?: File) {
    if (!file || !form.id) return;
    if (file.size > 4 * 1024 * 1024 || !["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Use a PNG, JPG or WebP image up to 4 MB."); return;
    }
    const id = form.id;
    setBusy(true); setError("");
    try {
      const body = new FormData();
      body.set("id", id); body.set("kind", field.replace("_url", "")); body.set("file", file);
      const response = await fetch("/api/programs/media", { method: "POST", credentials: "same-origin", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Image upload failed");
      setForm(previous => previous.id === id ? { ...previous, [field]: result.url } : previous);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Image upload failed"); }
    finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-black px-5 py-12 text-white">
    <div className="mx-auto max-w-6xl">
      <Link href="/en/dashboard" className="text-yellow-400">← CINENTO Dashboard</Link>
      <h1 className="my-7 text-3xl font-bold text-yellow-400">Products &amp; Platforms Manager</h1>
      {error && <p role="alert" className="my-4 rounded-lg border border-red-500 p-4 text-red-200">{error}</p>}
      {loading ? <p>Loading…</p> : !configured ? <p>Catalog database is not configured yet.</p> : !authenticated ?
        <form onSubmit={signIn} className="grid max-w-md gap-4 rounded-xl border border-neutral-700 p-6">
          <h2 className="text-xl">Catalog administrator sign-in</h2>
          <label className={labelClass}>Email<input className={inputClass} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="username" /></label>
          <label className={labelClass}>Password<input className={inputClass} type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" /></label>
          <button disabled={busy} className="rounded-lg bg-yellow-500 p-3 font-semibold text-black disabled:opacity-50">Sign in</button>
        </form> : <>
          <div className="mb-6 flex flex-wrap gap-3">
            <button onClick={() => { setEditing(false); setForm(blank()); }} className="rounded-lg bg-yellow-500 px-4 py-2 text-black">Add program</button>
            <Link href="/en/platforms" className="rounded-lg border border-yellow-500 px-4 py-2">View public catalog</Link>
            <button onClick={async () => { await fetch("/api/programs/session", { method: "DELETE" }); setAuthenticated(false); setPrograms([]); }} className="rounded-lg border border-neutral-600 px-4 py-2">Sign out</button>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
            <section aria-label="Programs" className="space-y-3">
              {programs.map(program => <div key={program.id} className="rounded-xl border border-neutral-700 p-4">
                <div className="flex justify-between gap-3"><strong>{program.name}</strong><span className="text-xs text-neutral-400">{program.published ? "Published" : "Draft"}</span></div>
                <p className="my-2 text-xs text-neutral-400">{program.id} · {program.category}</p>
                <div className="flex gap-4 text-sm"><button onClick={() => { setForm(structuredClone(program)); setEditing(true); }} className="text-yellow-400">Edit</button><button disabled={busy} onClick={() => remove(program.id)} className="text-red-300">Delete</button></div>
              </div>)}
              {!programs.length && <p className="text-neutral-400">No programs yet.</p>}
            </section>
            <form onSubmit={save} className="grid gap-4 rounded-xl border border-neutral-700 p-5">
              <h2 className="text-xl text-yellow-400">{editing ? `Edit ${form.name}` : "Add program"}</h2>
              <label className={labelClass}>ID (slug)<input className={inputClass} value={form.id} disabled={editing} pattern="[a-z0-9]+(-[a-z0-9]+)*" required maxLength={64} onChange={e => update("id", e.target.value)} /></label>
              <label className={labelClass}>Name<input className={inputClass} value={form.name} required maxLength={120} onChange={e => update("name", e.target.value)} /></label>
              <label className={labelClass}>Short mark<input className={inputClass} value={form.mark} required maxLength={24} onChange={e => update("mark", e.target.value)} /></label>
              <label className={labelClass}>Category<select className={inputClass} value={form.category} onChange={e => update("category", e.target.value)}>{["intelligence", "media", "business", "connectivity"].map(item => <option key={item}>{item}</option>)}</select></label>
              <label className={labelClass}>Status<select className={inputClass} value={form.status ?? ""} onChange={e => update("status", e.target.value || undefined)}><option value="">Unspecified</option><option value="development">In development</option><option value="desktop">Desktop</option></select></label>
              <label className={labelClass}>Public link (HTTPS only)<input className={inputClass} type="url" value={form.access_url ?? ""} onChange={e => update("access_url", e.target.value)} /></label>
              <fieldset className="grid gap-4 rounded-lg border border-neutral-700 p-4">
                <legend className="px-2 text-yellow-400">Program visuals</legend>
                <p className="text-xs text-neutral-400">Upload images, then click Save program. PNG, JPG or WebP, up to 4 MB each. For a new program, enter its ID first.</p>
                {([[
                  "icon_url", "Icon · square image, transparent background preferred"
                ], ["logo_url", "Logo · horizontal, transparent background preferred"], ["cover_url", "Cover · landscape image, 16:9 recommended"]] as const).map(([field, label]) => <div key={field} className="grid gap-2">
                  <label className={labelClass}>{label}
                    <input className={inputClass} type="url" placeholder="https://..." maxLength={1000} value={form[field] ?? ""} onChange={e => update(field, e.target.value)} />
                  </label>
                  <input aria-label={`Upload ${label}`} type="file" accept="image/png,image/jpeg,image/webp" disabled={busy || !form.id} onChange={e => { void uploadMedia(field, e.target.files?.[0]); e.target.value = ""; }} className="text-sm text-neutral-300 file:mr-3 file:rounded file:border-0 file:bg-yellow-500 file:px-3 file:py-2 file:text-black disabled:opacity-50" />
                  {form[field] && <img src={form[field]} alt={`${form.name || "Program"} ${label}`} className={`rounded border border-neutral-700 object-contain ${field === "cover_url" ? "aspect-video w-full" : "h-24 max-w-52"}`} />}
                </div>)}
              </fieldset>
              <label className={labelClass}>Order<input className={inputClass} type="number" min={0} max={9999} value={form.sort_order ?? 100} onChange={e => update("sort_order", Number(e.target.value))} /></label>
              <label className="flex gap-3"><input type="checkbox" checked={!!form.published} onChange={e => update("published", e.target.checked)} />Published</label>
              <div className="flex gap-3 border-b border-neutral-700 pb-3">{langs.map(lang => <button key={lang} type="button" onClick={() => setLanguage(lang)} aria-pressed={language === lang} className={`rounded px-3 py-2 ${language === lang ? "bg-yellow-500 text-black" : "border border-neutral-700"}`}>{lang.toUpperCase()}</button>)}</div>
              <label className={labelClass}>Description ({language})<textarea className={inputClass} dir={language === "fa" ? "rtl" : "ltr"} rows={4} value={form.copy[language].description} required maxLength={1500} onChange={e => updateCopy("description", e.target.value)} /></label>
              <label className={labelClass}>Audience ({language})<input className={inputClass} dir={language === "fa" ? "rtl" : "ltr"} value={form.copy[language].audience} required maxLength={500} onChange={e => updateCopy("audience", e.target.value)} /></label>
              <label className={labelClass}>Focus areas, one per line ({language})<textarea className={inputClass} dir={language === "fa" ? "rtl" : "ltr"} rows={4} value={form.copy[language].scope.join("\n")} onChange={e => updateCopy("scope", e.target.value)} /></label>
              <label className={labelClass}>Service ({language})<input className={inputClass} dir={language === "fa" ? "rtl" : "ltr"} value={form.copy[language].service} required maxLength={500} onChange={e => updateCopy("service", e.target.value)} /></label>
              <p className="text-xs text-neutral-400">Complete all three languages before saving. Drafts are hidden from the public catalog.</p>
              <button disabled={busy} className="rounded-lg bg-yellow-500 p-3 font-semibold text-black disabled:opacity-50">{busy ? "Saving…" : "Save program"}</button>
            </form>
          </div>
        </>}
    </div>
  </main>;
}
