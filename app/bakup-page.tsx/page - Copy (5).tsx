"use client";

import { useEffect, useMemo, useState } from "react";
import { homepageContent, type SiteLanguage } from "@/content/homepage";

type LeadStatus = "New" | "In Review" | "Contacted" | "Closed";
type LeadTemperature = "Hot" | "Warm" | "Cold";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  status: LeadStatus;
};

export default function HomePage() {
  const [language, setLanguage] = useState<SiteLanguage>("en");

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
    status: "New",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("cinento_language");
    if (savedLanguage === "en" || savedLanguage === "tr") {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("cinento_language", language);
    document.documentElement.lang = language;
  }, [language]);

  const content = useMemo(() => homepageContent[language], [language]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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

  const goToPath = (href: string) => {
    window.location.href = href;
  };

  const getLeadTemperature = (
    message: string,
    phone: string
  ): LeadTemperature => {
    const text = message.toLowerCase().trim();

    const hotKeywords = [
      "investor",
      "investment",
      "budget",
      "funding",
      "finance",
      "financing",
      "partner",
      "partnership",
      "co-production",
      "coproduction",
      "distribution",
      "platform",
      "netflix",
      "urgent",
      "festival",
      "sales",
      "producer",
      "production",
      "yatırımcı",
      "yatırım",
      "bütçe",
      "fon",
      "ortak",
      "ortak yapım",
      "dağıtım",
      "platform",
      "festival",
      "yapımcı",
      "finansman",
    ];

    const hasHotKeyword = hotKeywords.some((word) => text.includes(word));
    const hasPhone = phone.trim().length >= 8;
    const isDetailed = text.length >= 80;

    if ((hasHotKeyword && hasPhone) || (hasHotKeyword && isDetailed)) {
      return "Hot";
    }

    if (text.length >= 30 || hasPhone) {
      return "Warm";
    }

    return "Cold";
  };

  const handleSubmit = async () => {
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();
    const status = form.status;
    const leadTemperature = getLeadTemperature(message, phone);

    if (!name || !email || !phone || !message) {
      setError(content.contact.errorRequired);
      setSuccess("");
      return;
    }

    const whatsappWindow = window.open("", "_blank");

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          status,
          lead_temperature: leadTemperature,
          language,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (whatsappWindow && !whatsappWindow.closed) {
          whatsappWindow.close();
        }
        throw new Error(data?.detail || data?.error || "Submission failed.");
      }

      const whatsappMessage = `
🎬 CINENTO — New Project Submission

Language: ${language.toUpperCase()}

━━━━━━━━━━━━━━━━━━
👤 Client Information
Name: ${name}
Email: ${email}
Phone: ${phone}

📌 Project Details
${message}

📊 Status: ${status}
🔥 Lead Priority: ${leadTemperature}
━━━━━━━━━━━━━━━━━━

— CINENTO
${content.hero.title}
      `.trim();

      const whatsappUrl = `https://wa.me/905461232134?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      setSuccess(content.contact.successMessage);

      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
        status: "New",
      });
    } catch (err: unknown) {
      if (whatsappWindow && !whatsappWindow.closed) {
        whatsappWindow.close();
      }

      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(errorMessage);
      setSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white" id="home">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 md:py-8 space-y-14">
        <header className="rounded-3xl bg-black/60 backdrop-blur border border-yellow-600/30 p-5 sticky top-4 z-50">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => goToSection("home")}
                className="text-left text-xl font-semibold tracking-wide text-yellow-500"
              >
                {content.nav.brand}
              </button>

              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 rounded-lg border text-xs ${
                    language === "en"
                      ? "bg-yellow-600 text-black border-yellow-500"
                      : "bg-black/40 text-white border-yellow-600/20"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("tr")}
                  className={`px-3 py-1 rounded-lg border text-xs ${
                    language === "tr"
                      ? "bg-yellow-600 text-black border-yellow-500"
                      : "bg-black/40 text-white border-yellow-600/20"
                  }`}
                >
                  TR
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              {content.nav.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => goToSection(item.target)}
                  className="px-4 py-2 rounded-xl bg-black/40 border border-yellow-600/20 hover:border-yellow-500 transition"
                >
                  {item.label}
                </button>
              ))}

              <div className="hidden lg:flex items-center gap-2 ml-2">
                <span className="text-xs text-neutral-400">
                  {content.nav.languageLabel}
                </span>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-2 rounded-xl border ${
                    language === "en"
                      ? "bg-yellow-600 text-black border-yellow-500"
                      : "bg-black/40 text-white border-yellow-600/20"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("tr")}
                  className={`px-3 py-2 rounded-xl border ${
                    language === "tr"
                      ? "bg-yellow-600 text-black border-yellow-500"
                      : "bg-black/40 text-white border-yellow-600/20"
                  }`}
                >
                  TR
                </button>
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
                onClick={() => goToSection("contact")}
                className="px-6 py-3 border border-yellow-600/40 rounded-xl hover:border-yellow-500 transition"
              >
                {content.hero.cta2}
              </button>
            </div>
          </div>

          <div className="relative h-[360px] rounded-3xl overflow-hidden border border-yellow-600/20">
            <img
              src={content.hero.image}
              alt="CINENTO Cinematic Hero"
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
                onClick={() => goToPath(item.href)}
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

        {content.teaser.enabled ? (
          <section className="space-y-6 rounded-3xl border border-yellow-600/20 bg-neutral-950 p-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-yellow-500">
                {content.teaser.title}
              </h2>
              <p className="text-neutral-400 leading-7">
                {content.teaser.subtitle}
              </p>
            </div>

            <video
              controls
              poster={content.teaser.poster}
              className="w-full rounded-2xl border border-yellow-600/20 bg-black"
            >
              <source src={content.teaser.videoSrc} type="video/mp4" />
            </video>
          </section>
        ) : null}

        <section className="grid lg:grid-cols-3 gap-5">
          {content.highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-neutral-900 border border-yellow-600/20 p-6 space-y-3"
            >
              <div className="text-lg font-medium text-yellow-500">
                {item.title}
              </div>
              <div className="text-sm text-neutral-400 leading-7">
                {item.desc}
              </div>
            </div>
          ))}
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
                name="name"
                placeholder={content.contact.namePlaceholder}
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl outline-none focus:border-yellow-500"
              />

              <input
                name="email"
                placeholder={content.contact.emailPlaceholder}
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl outline-none focus:border-yellow-500"
              />

              <input
                name="phone"
                placeholder={content.contact.phonePlaceholder}
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl outline-none focus:border-yellow-500"
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl outline-none focus:border-yellow-500"
              >
                {content.contact.statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <textarea
                name="message"
                placeholder={content.contact.messagePlaceholder}
                value={form.message}
                onChange={handleChange}
                className="w-full p-3 bg-black border border-yellow-600/20 rounded-xl h-32 outline-none focus:border-yellow-500"
              />

              {error ? <div className="text-sm text-red-400">{error}</div> : null}
              {success ? (
                <div className="text-sm text-green-400">{success}</div>
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
    </div>
  );
}