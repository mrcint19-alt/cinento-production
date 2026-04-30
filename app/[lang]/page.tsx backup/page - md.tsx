"use client";

/**
 * File: app/[lang]/page.tsx
 * Version: v4.3 HOME + ABOUT + GALLERY ROUTE
 * Updated: 2026-04-17 [Europe/Istanbul]
 * Status: ACTIVE
 */

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Lang = "en" | "tr";

type NavItem = {
  label: string;
  target: string;
};

type PlatformItem = {
  title: string;
  description: string;
  href: string;
};

type JournalItem = {
  title: string;
  description: string;
};

type SiteContent = {
  brand: string;
  nav: NavItem[];
  languageLabel: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta1: string;
    cta2: string;
    visualTitle: string;
    visualSubtitle: string;
  };
  about: {
    titleLeft: string;
    titleRight: string;
    whatWeDo: string[];
    whyCinento: string[];
  };
  platformsSection: {
    title: string;
    subtitle: string;
  };
  platforms: PlatformItem[];
  gallerySection: {
    title: string;
    subtitle: string;
  };
  journalSection: {
    title: string;
  };
  journal: JournalItem[];
  contact: {
    title: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    messagePlaceholder: string;
    submitLabel: string;
    submittingLabel: string;
    successMessage: string;
    errorRequired: string;
  };
};

const contentByLang: Record<Lang, SiteContent> = {
  en: {
    brand: "CINENTO",
    languageLabel: "LANGUAGE",
    nav: [
      { label: "Home", target: "home" },
      { label: "About", target: "about" },
      { label: "Platforms", target: "platforms" },
      { label: "Gallery", target: "gallery" },
      { label: "Journal", target: "journal" },
      { label: "Contact", target: "contact" },
    ],
    hero: {
      eyebrow: "CINENTO",
      title: "From Idea to International Film Market",
      subtitle:
        "CINENTO is a next-generation film development platform connecting storytelling, financing, and distribution into one unified cinematic ecosystem.",
      cta1: "Explore Platform",
      cta2: "Start Project",
      visualTitle: "Cinematic Development for the International Market",
      visualSubtitle: "Story • Packaging • Positioning • Distribution",
    },
    about: {
      titleLeft: "What We Do",
      titleRight: "Why CINENTO",
      whatWeDo: [
        "Film & Series Development",
        "Co-Production Strategy",
        "Investor Packaging",
        "Distribution Strategy",
      ],
      whyCinento: [
        "Turkey–GCC Bridge",
        "Creative + Financial Integration",
        "Scalable Media System",
        "Investor-Ready Output",
      ],
    },
    platformsSection: {
      title: "CINENTO Ecosystem",
      subtitle:
        "A connected structure designed to combine creative development, project intake, business growth, and future-facing distribution under one brand ecosystem.",
    },
    platforms: [
      {
        title: "CINENTO AI Studio",
        description:
          "Professional cinematic development system for screenplay generation, story architecture, and investor-ready packaging.",
        href: "https://studio.cinento.net",
      },
      {
        title: "Outreach CRM",
        description:
          "Lead management, project tracking, and business development system for CINENTO partnerships and growth.",
        href: "https://crm.cinento.net",
      },
      {
        title: "CINENTO Academy",
        description:
          "Training programs, workshops, and structured learning for creators and industry professionals.",
        href: "https://academy.cinento.net",
      },
      {
        title: "CINENTO TV",
        description:
          "Distribution platform for showcasing projects and curated cinematic content.",
        href: "https://tv.cinento.net",
      },
    ],
    gallerySection: {
      title: "CINENTO Gallery",
      subtitle:
        "Selected visual frames designed to strengthen CINENTO’s cinematic identity, brand presence, and professional presentation.",
    },
    journalSection: {
      title: "CINENTO Journal",
    },
    journal: [
      {
        title: "Why strong film projects fail before reaching the market",
        description:
          "Development gaps and weak positioning often damage otherwise promising projects.",
      },
      {
        title: "Investor-ready storytelling changes project value",
        description:
          "The way a project is packaged and presented directly shapes professional interest.",
      },
      {
        title: "Building a media ecosystem beyond one project",
        description:
          "Long-term value comes from systems, not only single productions.",
      },
    ],
    contact: {
      title: "Start Your Project",
      namePlaceholder: "Name / Company",
      emailPlaceholder: "Email",
      phonePlaceholder: "Phone / WhatsApp",
      messagePlaceholder: "Tell us about your project",
      submitLabel: "Submit Project",
      submittingLabel: "Submitting...",
      successMessage: "Your request has been recorded.",
      errorRequired: "Please fill in all fields.",
    },
  },
  tr: {
    brand: "CINENTO",
    languageLabel: "DİL",
    nav: [
      { label: "Ana Sayfa", target: "home" },
      { label: "Hakkında", target: "about" },
      { label: "Platformlar", target: "platforms" },
      { label: "Galeri", target: "gallery" },
      { label: "Journal", target: "journal" },
      { label: "İletişim", target: "contact" },
    ],
    hero: {
      eyebrow: "CINENTO",
      title: "Fikirden Uluslararası Film Pazarına",
      subtitle:
        "CINENTO; hikâye geliştirme, finansman ve dağıtımı tek bir sinematik ekosistemde birleştiren yeni nesil bir film geliştirme platformudur.",
      cta1: "Platformu Keşfet",
      cta2: "Projeni Başlat",
      visualTitle: "Uluslararası Pazar için Sinematik Geliştirme",
      visualSubtitle: "Hikâye • Paketleme • Konumlandırma • Dağıtım",
    },
    about: {
      titleLeft: "Ne Yapıyoruz",
      titleRight: "Neden CINENTO",
      whatWeDo: [
        "Film ve Dizi Geliştirme",
        "Ortak Yapım Stratejisi",
        "Yatırımcı Paketi Hazırlığı",
        "Dağıtım Stratejisi",
      ],
      whyCinento: [
        "Türkiye–Körfez Köprüsü",
        "Yaratıcı ve Finansal Entegrasyon",
        "Ölçeklenebilir Medya Sistemi",
        "Yatırımcıya Hazır Çıktılar",
      ],
    },
    platformsSection: {
      title: "CINENTO Ekosistemi",
      subtitle:
        "Yaratıcı geliştirme, proje kabul süreci, iş geliştirme ve geleceğe dönük dağıtımı tek bir marka ekosisteminde bir araya getiren bağlı bir yapı.",
    },
    platforms: [
      {
        title: "CINENTO AI Studio",
        description:
          "Senaryo üretimi, hikâye mimarisi ve yatırımcıya hazır paketleme için profesyonel sinematik geliştirme sistemi.",
        href: "https://studio.cinento.net",
      },
      {
        title: "Outreach CRM",
        description:
          "CINENTO iş ortaklıkları ve büyüme için lead yönetimi, proje takibi ve iş geliştirme sistemi.",
        href: "https://crm.cinento.net",
      },
      {
        title: "CINENTO Academy",
        description:
          "İçerik üreticileri ve sektör profesyonelleri için eğitim programları ve atölyeler.",
        href: "https://academy.cinento.net",
      },
      {
        title: "CINENTO TV",
        description:
          "Projeleri ve seçili sinematik içerikleri sunan dağıtım platformu.",
        href: "https://tv.cinento.net",
      },
    ],
    gallerySection: {
      title: "CINENTO Galeri",
      subtitle:
        "CINENTO’nun sinematik kimliğini, marka görünürlüğünü ve profesyonel sunum gücünü destekleyen seçili görseller.",
    },
    journalSection: {
      title: "CINENTO Journal",
    },
    journal: [
      {
        title: "Güçlü film projeleri pazara ulaşmadan neden başarısız olur?",
        description:
          "Geliştirme boşlukları ve zayıf konumlandırma umut vadeden projeleri zayıflatabilir.",
      },
      {
        title: "Yatırımcıya hazır anlatım proje değerini değiştirir",
        description:
          "Bir projenin sunulma ve paketlenme biçimi profesyonel ilgiyi doğrudan etkiler.",
      },
      {
        title: "Tek projeden öte medya ekosistemi kurmak",
        description:
          "Uzun vadeli değer, tek üretimden değil sistem kurmaktan gelir.",
      },
    ],
    contact: {
      title: "Projenizi Başlatın",
      namePlaceholder: "İsim / Şirket",
      emailPlaceholder: "E-posta",
      phonePlaceholder: "Telefon / WhatsApp",
      messagePlaceholder: "Projenizi bize anlatın",
      submitLabel: "Projeyi Gönder",
      submittingLabel: "Gönderiliyor...",
      successMessage: "Talebiniz kaydedildi.",
      errorRequired: "Lütfen tüm alanları doldurun.",
    },
  },
};

export default function HomePage() {
  const params = useParams();
  const router = useRouter();
  const currentLang: Lang = params?.lang === "tr" ? "tr" : "en";
  const content = useMemo(() => contentByLang[currentLang], [currentLang]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

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

  const changeLanguage = (lang: Lang) => {
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

    goToSection(target);
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
                onClick={() => goToSection("contact")}
                className="px-6 py-3 border border-yellow-600/40 rounded-xl hover:border-yellow-500 transition"
              >
                {content.hero.cta2}
              </button>
            </div>
          </div>

          <div className="relative h-[360px] rounded-3xl overflow-hidden border border-yellow-600/20 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.25),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_22%)]" />
            <div className="absolute inset-0 border border-yellow-500/10 rounded-3xl" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-xs uppercase tracking-[0.3em] text-yellow-500 mb-3">
                {content.hero.eyebrow}
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-white leading-tight max-w-xl mb-2">
                {content.hero.visualTitle}
              </div>
              <div className="text-sm text-neutral-400">
                {content.hero.visualSubtitle}
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
                onClick={() => (window.location.href = item.href)}
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
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[280px] rounded-2xl border border-yellow-600/20 bg-gradient-to-br from-neutral-900 via-black to-neutral-950"
              />
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-5">
          {content.platforms.slice(0, 3).map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-neutral-900 border border-yellow-600/20 p-6 space-y-3"
            >
              <div className="text-lg font-medium text-yellow-500">
                {item.title}
              </div>
              <div className="text-sm text-neutral-400 leading-7">
                {item.description}
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
              CINENTO
              {"\n\n"}
              International development, positioning and platform-oriented project structure.
              {"\n\n"}
              → Film
              {"\n"}
              → Series
              {"\n"}
              → Pitch Deck
              {"\n"}
              → Co-Production
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}