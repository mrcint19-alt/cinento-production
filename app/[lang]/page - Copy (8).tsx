"use client";

/**
 * File: app/[lang]/page.tsx
 * Version: v5.1 CRM CONNECTED HOME
 * Updated: 2026-04-18 [Europe/Istanbul]
 * Status: ACTIVE
 */

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { homepageContent } from "../../content/homepage";
import { defaultLanguage, isValidLanguage, type SiteLanguage } from "@/lib/i18n";

export default function HomePage() {
  const params = useParams();
  const router = useRouter();

  const routeLang = Array.isArray(params.lang) ? params.lang[0] : params.lang;

  const currentLang: SiteLanguage =
    typeof routeLang === "string" && isValidLanguage(routeLang)
      ? routeLang
      : defaultLanguage;

  const content = useMemo(() => homepageContent[currentLang], [currentLang]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goToSection = (id: string) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const changeLanguage = (lang: SiteLanguage) => {
    if (lang === currentLang) return;
    router.push(`/${lang}`);
  };

  const handleNavClick = (target: string) => {
    if (target === "about") {
      window.location.href = `/${currentLang}/about`;
      return;
    }

    if (target === "gallery") {
      window.location.href = `/${currentLang}/gallery`;
      return;
    }

    if (target === "journal") {
      window.location.href = `/${currentLang}/journal`;
      return;
    }

    if (target === "contact") {
      window.location.href = `/${currentLang}/contact`;
      return;
    }

    if (target === "platforms") {
      goToSection("platforms");
      return;
    }

    goToSection(target);
  };

  const openPlatform = (href: string) => {
    if (!href || href === "#") return;
    window.location.href = href;
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setFeedback(content.contact.errorRequired);
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback("");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Request failed");
      }

      setFeedback(content.contact.successMessage);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      setFeedback("Error sending request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white" id="home">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 md:py-8 space-y-14">
        <header className="sticky top-4 z-50">
          <div className="rounded-3xl border border-yellow-600/25 bg-black/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
              <button
                onClick={() => goToSection("home")}
                className="text-left text-xl font-semibold tracking-[0.18em] text-yellow-500 transition hover:text-yellow-400"
              >
                {content.brand}
              </button>

              <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                {content.nav.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.target)}
                    className="rounded-full border border-yellow-600/15 bg-white/[0.02] px-4 py-2 text-sm text-neutral-200 transition hover:border-yellow-500/50 hover:bg-yellow-500/10 hover:text-white"
                  >
                    {item.label}
                  </button>
                ))}

                <div className="ml-2 hidden items-center gap-2 rounded-full border border-yellow-600/20 bg-black/40 px-2 py-1 lg:flex">
                  <span className="px-2 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                    {content.languageLabel}
                  </span>

                  <button
                    onClick={() => changeLanguage("en")}
                    className={`min-w-[54px] rounded-full px-3 py-2 text-xs font-semibold tracking-wide transition ${
                      currentLang === "en"
                        ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.25)]"
                        : "text-yellow-100 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    EN
                  </button>

                  <button
                    onClick={() => changeLanguage("tr")}
                    className={`min-w-[54px] rounded-full px-3 py-2 text-xs font-semibold tracking-wide transition ${
                      currentLang === "tr"
                        ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.25)]"
                        : "text-yellow-100 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    TR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid lg:grid-cols-2 gap-12 items-center min-h-[78vh]">
          <div className="space-y-6">
            <div className="text-xs uppercase tracking-[0.3em] text-yellow-600">
              {content.hero.eyebrow}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {content.hero.title}
            </h1>

            <p className="text-lg text-neutral-300 leading-8 max-w-xl">
              {content.hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => goToSection("platforms")}
                className="px-6 py-3 bg-yellow-600 text-black font-medium rounded-xl hover:bg-yellow-500 transition"
              >
                {content.hero.cta1}
              </button>

              <button
                onClick={() => handleNavClick("contact")}
                className="px-6 py-3 border border-yellow-600/40 rounded-xl hover:border-yellow-500 transition"
              >
                {content.hero.cta2}
              </button>
            </div>
          </div>

          <div className="relative h-[360px] rounded-3xl overflow-hidden border border-yellow-600/20">
            <img
              src={content.hero.image}
              alt={content.hero.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-xs uppercase tracking-[0.3em] text-yellow-500 mb-3">
                {content.hero.overlayEyebrow}
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-white leading-tight max-w-xl">
                {content.hero.overlayTitle}
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="grid md:grid-cols-2 gap-8 rounded-3xl border border-yellow-600/20 bg-neutral-950 p-8"
        >
          <div className="space-y-4">
            <h2 className="text-2xl text-yellow-500 font-semibold">
              {content.about.titleLeft}
            </h2>
            <div className="space-y-3 text-neutral-300 leading-7">
              {content.about.whatWeDo.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl text-yellow-500 font-semibold">
              {content.about.titleRight}
            </h2>
            <div className="space-y-3 text-neutral-300 leading-7">
              {content.about.whyCinento.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="platforms"
          className="space-y-8 rounded-3xl border border-yellow-600/20 bg-neutral-950 p-8"
        >
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-yellow-500">
              {content.platformsSection.title}
            </h2>
            <p className="text-neutral-400 max-w-3xl leading-7">
              {content.platformsSection.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {content.platforms.map((item) => (
              <button
                key={item.title}
                onClick={() => openPlatform(item.href)}
                className="text-left p-6 rounded-2xl bg-black border border-yellow-600/20 hover:border-yellow-500 transition space-y-3"
              >
                <div className="text-lg font-medium text-yellow-500">
                  {item.title}
                </div>
                <div className="text-sm text-neutral-400 leading-7">
                  {item.description}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section
          id="gallery"
          className="space-y-8 rounded-3xl border border-yellow-600/20 bg-neutral-950 p-8"
        >
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-yellow-500">
              {content.gallerySection.title}
            </h2>
            <p className="text-neutral-400 max-w-3xl leading-7">
              {content.gallerySection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {content.gallery.map((item) => (
              <img
                key={item.src}
                src={item.src}
                alt={item.alt}
                className="w-full h-[300px] object-cover rounded-2xl border border-yellow-600/20 hover:scale-[1.02] transition duration-300"
              />
            ))}
          </div>
        </section>

        <section
          id="journal"
          className="space-y-6 rounded-3xl border border-yellow-600/20 bg-neutral-950 p-8"
        >
          <h2 className="text-2xl font-semibold text-yellow-500">
            {content.journalSection.title}
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {content.journal.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-black border border-yellow-600/20 space-y-3"
              >
                <div className="text-lg font-medium text-white leading-7">
                  {item.title}
                </div>
                <div className="text-sm text-neutral-400 leading-7">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="rounded-3xl bg-neutral-900 p-8 border border-yellow-600/20"
        >
          <h2 className="text-2xl text-yellow-500 mb-6 font-semibold">
            {content.contact.title}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={content.contact.namePlaceholder}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl outline-none focus:border-yellow-500"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={content.contact.emailPlaceholder}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl outline-none focus:border-yellow-500"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={content.contact.phonePlaceholder}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl outline-none focus:border-yellow-500"
              />

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={content.contact.messagePlaceholder}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl h-32 outline-none focus:border-yellow-500"
              />

              {feedback ? (
                <div className="text-sm text-yellow-300">{feedback}</div>
              ) : null}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-yellow-600 text-black rounded-xl hover:bg-yellow-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? content.contact.submittingLabel
                  : content.contact.submitLabel}
              </button>
            </div>

            <div className="text-neutral-400 leading-8 whitespace-pre-line">
              {content.contact.sideText}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}