"use client";

// File: app/page.tsx
// Version: v1.0
// Updated: 2026-04-16 20:00 Europe/Istanbul
// Status: ACTIVE

import { useEffect, useState } from "react";
import { getMessages, Language } from "@/lib/i18n";

export default function HomePage() {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("cinento_lang") as Language | null;
    if (savedLang === "en" || savedLang === "tr") {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cinento_lang", lang);
  }, [lang]);

  const t = getMessages(lang);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <header className="mb-10 rounded-full border border-amber-500/30 bg-zinc-950/80 px-6 py-4 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-2xl font-extrabold tracking-[0.2em] text-amber-400">
              CINENTO
            </div>

            <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
              <a className="rounded-full border border-amber-500/25 px-4 py-2 hover:border-amber-400 hover:text-amber-300" href="#home">
                {t.nav.home}
              </a>
              <a className="rounded-full border border-amber-500/25 px-4 py-2 hover:border-amber-400 hover:text-amber-300" href="#about">
                {t.nav.about}
              </a>
              <a className="rounded-full border border-amber-500/25 px-4 py-2 hover:border-amber-400 hover:text-amber-300" href="#platforms">
                {t.nav.platforms}
              </a>
              <a className="rounded-full border border-amber-500/25 px-4 py-2 hover:border-amber-400 hover:text-amber-300" href="#gallery">
                {t.nav.gallery}
              </a>
              <a className="rounded-full border border-amber-500/25 px-4 py-2 hover:border-amber-400 hover:text-amber-300" href="#journal">
                {t.nav.journal}
              </a>
              <a className="rounded-full border border-amber-500/25 px-4 py-2 hover:border-amber-400 hover:text-amber-300" href="#contact">
                {t.nav.contact}
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang("en")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  lang === "en"
                    ? "bg-amber-400 text-black"
                    : "border border-amber-500/25 text-white hover:border-amber-400 hover:text-amber-300"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("tr")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  lang === "tr"
                    ? "bg-amber-400 text-black"
                    : "border border-amber-500/25 text-white hover:border-amber-400 hover:text-amber-300"
                }`}
              >
                TR
              </button>
            </div>
          </div>
        </header>

        <section
          id="home"
          className="grid items-center gap-10 border-t border-amber-500/20 pt-10 lg:grid-cols-2"
        >
          <div>
            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400/80">
              {t.hero.eyebrow}
            </div>

            <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
              {t.hero.title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              {t.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
              >
                {t.hero.primaryButton}
              </a>

              <a
                href="#platforms"
                className="rounded-full border border-amber-500/30 px-6 py-3 text-sm font-bold text-white transition hover:border-amber-400 hover:text-amber-300"
              >
                {t.hero.secondaryButton}
              </a>
            </div>
          </div>

          <div>
            <div className="overflow-hidden rounded-[28px] border border-amber-500/20 bg-gradient-to-br from-zinc-900 to-black p-4 shadow-2xl">
              <div
                className="flex min-h-[420px] items-end rounded-[22px] border border-white/5 bg-cover bg-center p-8"
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.25)), url('/hero-cinento.jpg')",
                }}
              >
                <div>
                  <div className="mb-3 inline-block rounded-full border border-amber-400/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.25em] text-amber-300">
                    CINENTO
                  </div>
                  <h2 className="max-w-xl text-3xl font-bold leading-tight">
                    Cinematic Development for the International Market
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-24">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-amber-400">{t.about.title}</h2>
            <p className="mt-6 text-lg leading-8 text-zinc-300">{t.about.text}</p>
          </div>
        </section>

        <section id="platforms" className="py-10">
          <h2 className="mb-8 text-3xl font-bold text-amber-400">{t.platforms.title}</h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {t.platforms.items.map((item, index) => (
              <div
                key={index}
                className="rounded-3xl border border-amber-500/15 bg-zinc-950 p-6 transition hover:-translate-y-1 hover:border-amber-400/40"
              >
                <h3 className="mb-4 text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-7 text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24">
          <h2 className="mb-8 text-3xl font-bold text-amber-400">{t.why.title}</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {t.why.items.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-amber-500/15 bg-zinc-950 px-5 py-4 text-zinc-200"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="journal" className="py-10">
          <h2 className="mb-8 text-3xl font-bold text-amber-400">{t.journal.title}</h2>

          <div className="grid gap-6 md:grid-cols-3">
            {t.journal.items.map((item, index) => (
              <article
                key={index}
                className="rounded-3xl border border-amber-500/15 bg-zinc-950 p-6"
              >
                <h3 className="mb-4 text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-7 text-zinc-400">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="py-24">
          <div className="rounded-[32px] border border-amber-500/20 bg-zinc-950 p-8 md:p-10">
            <h2 className="mb-8 text-3xl font-bold text-amber-400">{t.contact.title}</h2>

            <form className="grid gap-5 md:grid-cols-2">
              <input
                type="text"
                placeholder={t.contact.name}
                className="rounded-2xl border border-amber-500/15 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500"
              />
              <input
                type="email"
                placeholder={t.contact.email}
                className="rounded-2xl border border-amber-500/15 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500"
              />
              <input
                type="text"
                placeholder={t.contact.projectType}
                className="rounded-2xl border border-amber-500/15 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500 md:col-span-2"
              />
              <textarea
                placeholder={t.contact.message}
                rows={5}
                className="rounded-2xl border border-amber-500/15 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500 md:col-span-2"
              />
              <button
                type="submit"
                className="w-fit rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
              >
                {t.contact.submit}
              </button>
            </form>
          </div>
        </section>

        <footer className="border-t border-amber-500/15 py-8 text-sm text-zinc-500">
          {t.footer.text}
        </footer>
      </div>
    </main>
  );
}