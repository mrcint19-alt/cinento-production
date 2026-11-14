"use client";
/* eslint-disable @next/next/no-img-element -- Navigation images are selected from the existing media library. */

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DEFAULT_NAVIGATION, localeHref, navigationFromContent, SITE_LOCALES, switchLocalePath, type NavigationItem, type SiteLocale, type SiteNavigation } from "../lib/site-navigation";

const LABELS = {
  en: { menu: "Menu", language: "Language", choose: "Choose your language", watch: "Watch Now" },
  tr: { menu: "Menü", language: "Dil", choose: "Dilinizi seçin", watch: "İzlemeye Başla" },
  fa: { menu: "منو", language: "زبان", choose: "زبان خود را انتخاب کنید", watch: "تماشای فیلم" },
  ar: { menu: "القائمة", language: "اللغة", choose: "اختر لغتك", watch: "شاهد الآن" },
} as const;
const LANGUAGE_NAMES: Record<SiteLocale, string> = { en: "English", tr: "Türkçe", fa: "فارسی", ar: "العربية" };

export function NavigationIcon({ value, className = "h-5 w-5" }: { value: string; className?: string }) {
  if (/^\/images\/[a-zA-Z0-9/_-]+\.(?:png|jpg|jpeg|webp|svg)$/.test(value) || /^https:\/\/[^\s]+\.(?:png|jpg|jpeg|webp|svg)(?:\?[^\s]*)?$/.test(value)) {
    return <img src={value} alt="" className={`${className} object-contain`} />;
  }
  const shapes: Record<string, React.ReactNode> = {
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    grid: <><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></>,
    film: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 5v14M17 5v14M3 10h4m-4 4h4m10-4h4m-4 4h4" /></>,
    home: <><path d="m3 11 9-8 9 8v9H3zM9 20v-6h6v6" /></>,
    about: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10v1" /></>,
    gallery: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8" cy="9" r="1" /><path d="m4 17 5-5 4 3 3-4 5 6" /></>,
    journal: <><path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5" /></>,
    contact: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    platforms: <><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></>,
    projects: <><rect x="3" y="5" width="18" height="15" rx="2" /><path d="m10 9 6 3-6 3z" /></>,
    talent: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-5 3-8 8-8s8 3 8 8" /></>,
    academy: <><path d="m2 9 10-5 10 5-10 5zM5 11v6c4 3 10 3 14 0v-6" /></>,
    services: <><path d="M4 7h16M4 12h16M4 17h16M8 5v4m8 1v4m-8 1v4" /></>,
    investment: <><path d="M4 20h16M6 17V9m6 8V5m6 12v-6" /></>,
    star: <><path d="m12 2 3 7 7 .6-5.5 4.5 1.8 7L12 17l-6.3 4.1 1.8-7L2 9.6 9 9z" /></>,
  };
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{shapes[value] || shapes.star}</svg>;
}

function getLocalePreference(): SiteLocale | null {
  const value = document.cookie.match(/(?:^|;\s*)cinento_language=(en|tr|fa|ar)(?:;|$)/)?.[1];
  return SITE_LOCALES.find(locale => locale === value) ?? null;
}

function rememberLanguage(locale: SiteLocale) {
  document.cookie = `cinento_language=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}

export default function SiteHeader({ brand = "CINENTO", showWatch = true }: { brand?: string; showWatch?: boolean }) {
  const pathname = usePathname() || "/en";
  const router = useRouter();
  const locale = (SITE_LOCALES.find(value => pathname === `/${value}` || pathname.startsWith(`/${value}/`)) ?? "en") as SiteLocale;
  const [navigation, setNavigation] = useState<SiteNavigation>(DEFAULT_NAVIGATION);
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [firstVisit, setFirstVisit] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const languageDialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/content/homepage", { cache: "no-store", signal: controller.signal })
      .then(response => response.ok ? response.json() : null)
      .then(content => { if (content) setNavigation(navigationFromContent(content)); })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setFirstVisit(!getLocalePreference()), 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
      if (!languageRef.current?.contains(event.target as Node)) setLanguageOpen(false);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { if (menuOpen) menuButtonRef.current?.focus(); if (languageOpen) languageButtonRef.current?.focus(); setMenuOpen(false); setLanguageOpen(false); } };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, [menuOpen, languageOpen]);
  useEffect(() => { if (menuOpen) firstItemRef.current?.focus(); }, [menuOpen]);
  useEffect(() => {
    if (!firstVisit) return;
    languageDialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const buttons = Array.from(languageDialogRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
      if (!buttons.length) return;
      const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); buttons.at(-1)?.focus(); }
      else if (!event.shiftKey && index === buttons.length - 1) { event.preventDefault(); buttons[0].focus(); }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [firstVisit]);

  function chooseLanguage(next: SiteLocale) {
    rememberLanguage(next);
    setFirstVisit(false);
    setLanguageOpen(false);
    setMenuOpen(false);
    if (next !== locale) router.push(switchLocalePath(pathname, next) + location.hash);
  }

  const visible = navigation.items.filter(item => item.enabled && item.href && item.labels[locale]?.trim());
  const top = visible.filter(item => !item.parentId || !visible.some(parent => parent.id === item.parentId));
  const text = LABELS[locale];
  const link = (item: NavigationItem, first = false) => <a key={item.id} ref={first ? firstItemRef : undefined} href={localeHref(item.href, locale)} onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[var(--site-accent)]" target={item.href.startsWith("https://") ? "_blank" : undefined} rel={item.href.startsWith("https://") ? "noopener noreferrer" : undefined}><NavigationIcon value={item.icon} className="h-5 w-5 shrink-0 text-[var(--site-accent)]" /><span>{item.labels[locale]}</span></a>;

  return <>
    <header className="site-header sticky top-0 z-50 w-full border-b border-white/15 bg-[#111820]/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a href={`/${locale}`} className="text-lg font-bold tracking-[.13em] text-white" aria-label="CINENTO — Home">{brand}</a>
        <div className="flex flex-wrap items-center gap-2">
          <div ref={menuRef} className="relative">
            <button ref={menuButtonRef} type="button" aria-label={text.menu} aria-expanded={menuOpen} aria-controls="cinento-main-menu" onClick={() => { setMenuOpen(value => !value); setLanguageOpen(false); }} className="flex min-h-11 items-center gap-2 rounded-lg border border-[var(--site-accent)]/50 px-3 text-sm font-semibold text-[var(--site-accent)] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[var(--site-accent)]"><NavigationIcon value={navigation.menuIcon} />{text.menu}</button>
            {menuOpen && <nav id="cinento-main-menu" aria-label={text.menu} className="absolute start-0 top-full mt-2 max-h-[70vh] w-[min(85vw,330px)] overflow-y-auto rounded-xl border border-[var(--site-accent)]/30 bg-[#1b2630] p-2 shadow-2xl">{top.map((item, index) => <div key={item.id}>{link(item, index === 0)}{visible.filter(child => child.parentId === item.id).map(child => <div key={child.id} className="ms-7 border-s border-white/15 ps-2">{link(child)}</div>)}</div>)}</nav>}
          </div>
          <div ref={languageRef} className="relative">
            <button ref={languageButtonRef} type="button" aria-label={`${text.language}: ${LANGUAGE_NAMES[locale]}`} aria-expanded={languageOpen} aria-controls="cinento-language-menu" onClick={() => { setLanguageOpen(value => !value); setMenuOpen(false); }} className="flex min-h-11 items-center gap-2 rounded-lg border border-white/25 px-3 text-sm font-semibold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[var(--site-accent)]">{locale.toUpperCase()} <span aria-hidden="true">⌄</span></button>
            {languageOpen && <div id="cinento-language-menu" role="group" aria-label={text.language} className="absolute end-0 top-full mt-2 w-44 rounded-xl border border-[var(--site-accent)]/30 bg-[#1b2630] p-2 shadow-2xl">{SITE_LOCALES.map(option => <button key={option} type="button" lang={option} onClick={() => chooseLanguage(option)} aria-current={locale === option ? "true" : undefined} className="block min-h-11 w-full rounded-lg px-3 text-start text-sm hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[var(--site-accent)]">{LANGUAGE_NAMES[option]} {locale === option ? "✓" : ""}</button>)}</div>}
          </div>
          {showWatch && <a href="https://watch.cinento.net" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center rounded-lg bg-[var(--site-accent)] px-3 text-sm font-semibold text-black hover:opacity-90">{text.watch}</a>}
        </div>
      </div>
    </header>
    {firstVisit && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5" role="presentation"><div ref={languageDialogRef} role="dialog" aria-modal="true" aria-labelledby="cinento-choose-language" className="w-full max-w-md rounded-2xl border border-[var(--site-accent)]/50 bg-[#1b2630] p-6 text-white shadow-2xl"><h2 id="cinento-choose-language" className="text-xl font-semibold">Choose your language · زبان خود را انتخاب کنید</h2><div className="mt-5 grid grid-cols-2 gap-3">{SITE_LOCALES.map(option => <button key={option} type="button" lang={option} onClick={() => chooseLanguage(option)} className="min-h-12 rounded-lg border border-yellow-500/40 px-3 text-center hover:bg-[var(--site-accent)] hover:text-black focus-visible:outline-2 focus-visible:outline-[var(--site-accent)]">{LANGUAGE_NAMES[option]}</button>)}</div></div></div>}
  </>;
}
