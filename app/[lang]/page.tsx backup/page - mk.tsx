"use client";

/**
 * File: app/[lang]/page.tsx
 * Version: v5.2 HOME NO DUPLICATE HEADER
 * Updated: 2026-04-18 [Europe/Istanbul]
 * Status: ACTIVE
 */

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { homepageContent } from "../../content/homepage";
import { defaultLanguage, isValidLanguage, type SiteLanguage } from "@/lib/i18n";

type LeadStatus = "New" | "In Review" | "Contacted" | "Closed";

export default function HomePage() {
  const params = useParams();

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
  const [status] = useState<LeadStatus>("New");
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

      const whatsappText = `
🎬 CINENTO — New Project Request

Language: ${currentLang.toUpperCase()}
Status: ${status}

Name: ${name}
Email: ${email}
Phone: ${phone}

Project:
${message}
      `.trim();

      window.open(
        `https://wa.me/905461232134?text=${encodeURIComponent(whatsappText)}`,
        "_blank"
      );

      setFeedback(content.contact.successMessage);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white" id="home">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 md:py-8 space-y-14">
        <section className="grid lg:grid-cols-2 gap-12 items-center min-h-[78vh] pt-4 md:pt-8">
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
          className="rounded-3xl bg-neutral-900 p-8 border border-yellow-600/20"
        >
          <h1 className="text-4xl md:text-6xl text-yellow-500 mb-8 font-bold">
            {content.contact.title}
          </h1>

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