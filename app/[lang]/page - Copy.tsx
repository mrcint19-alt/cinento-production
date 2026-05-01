/* 
File: app/[lang]/page.tsx
Version: CINENTO Website PRO v3.6
Updated: 2026-04-30 [Europe/Istanbul]
Status: PAGE54 BASE + CMS CONNECTED + IMAGE MANAGER ACTIVE HERO SYSTEM CONNECTED + SAFE FALLBACK
*/

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Lang = "en" | "tr";

type NavItem = {
  label: string;
  href: string;
};

type PlatformItem = {
  title: string;
  description: string;
};

type JournalItem = {
  title: string;
  description: string;
};

type ContactContent = {
  title: string;
  subtitle: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  buttonLabel: string;
  whatsappLabel: string;
};

type PageContent = {
  brand: string;
  nav: NavItem[];
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    cardTitle: string;
    cardSubtitle: string;
  };
  whatWeDo: {
    title: string;
    items: string[];
  };
  whyCinento: {
    title: string;
    items: string[];
  };
  ecosystem: {
    title: string;
    subtitle: string;
  };
  platforms: PlatformItem[];
  gallery: {
    title: string;
    subtitle: string;
    items: string[];
    images?: string[];
  };
  journalSection: {
    title: string;
  };
  journal: JournalItem[];
  contact: ContactContent;
  footer: {
    brandLine: string;
    contactTitle: string;
    followTitle: string;
    rights: string;
    social?: {
      instagram?: string;
      linkedin?: string;
      website?: string;
    };
  };
};

type DynamicHomepageContent = Partial<PageContent> & {
  heroTitle?: string;
  heroSubtitle?: string;
  buttonPrimary?: string;
  buttonSecondary?: string;
};

type UploadedImages = {
  hero: string[];
  gallery: string[];
  projects: string[];
  active: {
    hero: string;
    gallery: string;
    projects: string;
  };
};

const CONTENT: Record<Lang, PageContent> = {
  en: {
    brand: "CINENTO",
    nav: [
      { label: "Home", href: "#home" },
      { label: "About", href: "#about" },
      { label: "Gallery", href: "#gallery" },
      { label: "Journal", href: "#journal" },
      { label: "Contact", href: "#contact" },
    ],
    hero: {
      eyebrow: "CINENTO",
      title: "From Idea to International Film Market",
      description:
        "CINENTO is a next-generation film development platform connecting storytelling, financing, and distribution into one unified cinematic ecosystem.",
      primaryCta: "watch now",
      secondaryCta: "Start Project",
      cardTitle: "CINENTO",
      cardSubtitle: "Cinematic Development for the International Market",
    },
    whatWeDo: {
      title: "What We Do",
      items: [
        "Film & Series Development",
        "Co-Production Strategy",
        "Investor Packaging",
      ],
    },
    whyCinento: {
      title: "Why CINENTO",
      items: [
        "Turkey–GCC Bridge",
        "Creative + Financial Integration",
        "Scalable Media System",
        "Investor-Ready Output",
      ],
    },
    ecosystem: {
      title: "CINENTO Ecosystem",
      subtitle:
        "A connected structure designed to combine creative development, project intake, business growth, and future-facing distribution under one brand ecosystem.",
    },
    platforms: [
      {
        title: "CINENTO AI Studio",
        description:
          "Professional cinematic development system for screenplay generation, story architecture, and investor-ready packaging.",
      },
      {
        title: "Outreach CRM",
        description:
          "Lead management, project tracking, and business development system for CINENTO partnerships and growth.",
      },
      {
        title: "CINENTO Academy",
        description:
          "Training programs, workshops, and structured learning for creators and industry professionals.",
      },
      {
        title: "CINENTO TV",
        description:
          "Distribution platform for showcasing projects and curated cinematic content.",
      },
    ],
    gallery: {
      title: "CINENTO Gallery",
      subtitle:
        "Selected visual frames designed to strengthen CINENTO’s cinematic identity, brand presence, and professional presentation.",
      items: [
        "Cinematic brand frame",
        "Development environment",
        "Investor-ready presentation mood",
      ],
      images: [
        "/images/gallery/gallery-1.jpg",
        "/images/gallery/gallery-2.jpg",
        "/images/gallery/gallery-3.jpg",
      ],
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
      subtitle:
        "Tell us about your project and begin the first step toward development, packaging, and international positioning.",
      namePlaceholder: "Name / Company",
      emailPlaceholder: "Email",
      messagePlaceholder: "Tell us about your project...",
      buttonLabel: "Submit Project",
      whatsappLabel: "WhatsApp",
    },
    footer: {
      brandLine: "From Idea to International Film Market",
      contactTitle: "Contact",
      followTitle: "Follow",
      rights: "© 2026 CINENTO. All rights reserved.",
      social: {
        instagram: "https://instagram.com/cinento",
        linkedin: "https://linkedin.com/company/cinento",
        website: "https://cinento.net",
      },
    },
  },
  tr: {
    brand: "CINENTO",
    nav: [
      { label: "Ana Sayfa", href: "#home" },
      { label: "Hakkında", href: "#about" },
      { label: "Galeri", href: "#gallery" },
      { label: "Journal", href: "#journal" },
      { label: "İletişim", href: "#contact" },
    ],
    hero: {
      eyebrow: "CINENTO",
      title: "Fikirden Uluslararası Film Pazarına",
      description:
        "CINENTO; hikâye geliştirme, finansman ve dağıtımı tek bir sinematik ekosistemde birleştiren yeni nesil bir film geliştirme platformudur.",
      primaryCta: "Platformu Keşfet",
      secondaryCta: "Projeni Başlat",
      cardTitle: "CINENTO",
      cardSubtitle: "Uluslararası Pazar İçin Sinematik Geliştirme",
    },
    whatWeDo: {
      title: "Ne Yapıyoruz",
      items: [
        "Film ve Dizi Geliştirme",
        "Ortak Yapım Stratejisi",
        "Yatırımcı Paketleme",
      ],
    },
    whyCinento: {
      title: "Neden CINENTO",
      items: [
        "Türkiye–Körfez Köprüsü",
        "Yaratıcı + Finansal Entegrasyon",
        "Ölçeklenebilir Medya Sistemi",
        "Yatırımcıya Hazır Çıktı",
      ],
    },
    ecosystem: {
      title: "CINENTO Ekosistemi",
      subtitle:
        "Yaratıcı geliştirme, proje kabulü, iş büyümesi ve geleceğe dönük dağıtımı tek bir marka sistemi altında birleştiren bağlantılı bir yapı.",
    },
    platforms: [
      {
        title: "CINENTO AI Studio",
        description:
          "Senaryo üretimi, hikâye mimarisi ve yatırımcıya hazır paketleme için profesyonel sinematik geliştirme sistemi.",
      },
      {
        title: "Outreach CRM",
        description:
          "CINENTO ortaklıkları ve büyümesi için lead yönetimi, proje takibi ve iş geliştirme sistemi.",
      },
      {
        title: "CINENTO Academy",
        description:
          "Yaratıcılar ve sektör profesyonelleri için eğitim programları, atölyeler ve yapılandırılmış öğrenme.",
      },
      {
        title: "CINENTO TV",
        description:
          "Projeleri ve seçilmiş sinematik içerikleri sunmaya yönelik dağıtım platformu.",
      },
    ],
    gallery: {
      title: "CINENTO Galeri",
      subtitle:
        "CINENTO’nun sinematik kimliğini, marka görünürlüğünü ve profesyonel sunum gücünü destekleyen seçilmiş görseller.",
      items: [
        "Sinematik marka karesi",
        "Geliştirme ortamı",
        "Yatırımcı sunum atmosferi",
      ],
      images: [
        "/images/gallery/gallery-1.jpg",
        "/images/gallery/gallery-2.jpg",
        "/images/gallery/gallery-3.jpg",
      ],
    },
    journalSection: {
      title: "CINENTO Journal",
    },
    journal: [
      {
        title: "Güçlü film projeleri neden pazara ulaşmadan zayıflar",
        description:
          "Geliştirme eksikleri ve zayıf konumlandırma, umut veren projeleri bile zedeleyebilir.",
      },
      {
        title: "Yatırımcıya hazır hikâye anlatımı proje değerini değiştirir",
        description:
          "Bir projenin nasıl paketlendiği ve sunulduğu, profesyonel ilgiyi doğrudan etkiler.",
      },
      {
        title: "Tek projeden öte bir medya ekosistemi kurmak",
        description:
          "Uzun vadeli değer sadece tekil yapımlardan değil, sistemlerden doğar.",
      },
    ],
    contact: {
      title: "Projenizi Başlatın",
      subtitle:
        "Bize projenizi anlatın ve geliştirme, paketleme ve uluslararası konumlandırmanın ilk adımını başlatın.",
      namePlaceholder: "İsim / Şirket",
      emailPlaceholder: "E-posta",
      messagePlaceholder: "Projenizi anlatın...",
      buttonLabel: "Projeyi Gönder",
      whatsappLabel: "WhatsApp",
    },
    footer: {
      brandLine: "Fikirden Uluslararası Film Pazarına",
      contactTitle: "İletişim",
      followTitle: "Takip Et",
      rights: "© 2026 CINENTO. Tüm hakları saklıdır.",
      social: {
        instagram: "https://instagram.com/cinento",
        linkedin: "https://linkedin.com/company/cinento",
        website: "https://cinento.net",
      },
    },
  },
};

function mergeHomepageContent(
  fallback: PageContent,
  dynamic?: DynamicHomepageContent | null
): PageContent {
  if (!dynamic) return fallback;

  return {
    ...fallback,
    ...dynamic,
    nav: dynamic.nav || fallback.nav,
    hero: {
      ...fallback.hero,
      ...(dynamic.hero || {}),
      title: dynamic.heroTitle || dynamic.hero?.title || fallback.hero.title,
      description:
        dynamic.heroSubtitle ||
        dynamic.hero?.description ||
        fallback.hero.description,
      primaryCta:
        dynamic.buttonPrimary ||
        dynamic.hero?.primaryCta ||
        fallback.hero.primaryCta,
      secondaryCta:
        dynamic.buttonSecondary ||
        dynamic.hero?.secondaryCta ||
        fallback.hero.secondaryCta,
    },
    whatWeDo: {
      ...fallback.whatWeDo,
      ...(dynamic.whatWeDo || {}),
      items: dynamic.whatWeDo?.items || fallback.whatWeDo.items,
    },
    whyCinento: {
      ...fallback.whyCinento,
      ...(dynamic.whyCinento || {}),
      items: dynamic.whyCinento?.items || fallback.whyCinento.items,
    },
    ecosystem: {
      ...fallback.ecosystem,
      ...(dynamic.ecosystem || {}),
    },
    platforms: dynamic.platforms || fallback.platforms,
    gallery: {
      ...fallback.gallery,
      ...(dynamic.gallery || {}),
      items: dynamic.gallery?.items || fallback.gallery.items,
      images: dynamic.gallery?.images || fallback.gallery.images,
    },
    journalSection: {
      ...fallback.journalSection,
      ...(dynamic.journalSection || {}),
    },
    journal: dynamic.journal || fallback.journal,
    contact: {
      ...fallback.contact,
      ...(dynamic.contact || {}),
    },
    footer: {
      ...fallback.footer,
      ...(dynamic.footer || {}),
    },
  };
}

export default function HomePage() {
  const params = useParams();
  const router = useRouter();

  const lang = (params?.lang === "tr" ? "tr" : "en") as Lang;

  const [dynamicContent, setDynamicContent] =
    useState<DynamicHomepageContent | null>(null);

  const [uploadedImages, setUploadedImages] = useState<UploadedImages>({
    hero: [],
    gallery: [],
    projects: [],
    active: {
      hero: "",
      gallery: "",
      projects: "",
    },
  });

  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const content = useMemo(() => {
    return mergeHomepageContent(CONTENT[lang], dynamicContent);
  }, [lang, dynamicContent]);

  const activeHeroImage = useMemo(() => {
    const activeHero = uploadedImages.active.hero;

    if (activeHero && !brokenImages[activeHero]) {
      return activeHero;
    }

    const validHeroImages = uploadedImages.hero.filter(
      (image) => !brokenImages[image]
    );

    if (validHeroImages.length > 0) {
      return validHeroImages[0];
    }

    return null;
  }, [uploadedImages.active.hero, uploadedImages.hero, brokenImages]);

  const activeGalleryImages = useMemo(() => {
    const uploadedGallery = uploadedImages.gallery.filter(
      (image) => !brokenImages[image]
    );

    if (uploadedGallery.length > 0) {
      return uploadedGallery;
    }

    return (content.gallery.images || []).filter(
      (image) => !brokenImages[image]
    );
  }, [uploadedImages.gallery, content.gallery.images, brokenImages]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const whatsappNumber = "905555555555";

  useEffect(() => {
    let isActive = true;

    fetch("/api/content/homepage", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!isActive) return;

        if (data && data[lang]) {
          setDynamicContent(data[lang]);
        } else {
          setDynamicContent(null);
        }
      })
      .catch(() => {
        if (isActive) {
          setDynamicContent(null);
        }
      });

    return () => {
      isActive = false;
    };
  }, [lang]);

  useEffect(() => {
    let isActive = true;

    fetch("/api/admin/images", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!isActive) return;

        if (data?.success && data.images) {
          setUploadedImages({
            hero: Array.isArray(data.images.hero) ? data.images.hero : [],
            gallery: Array.isArray(data.images.gallery)
              ? data.images.gallery
              : [],
            projects: Array.isArray(data.images.projects)
              ? data.images.projects
              : [],
            active: {
              hero: data.active?.hero || "",
              gallery: data.active?.gallery || "",
              projects: data.active?.projects || "",
            },
          });
        }
      })
      .catch(() => {
        if (isActive) {
          setUploadedImages({
            hero: [],
            gallery: [],
            projects: [],
            active: {
              hero: "",
              gallery: "",
              projects: "",
            },
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const mailBody = useMemo(() => {
    return `${content.contact.title}

${content.contact.namePlaceholder}: ${name}
${content.contact.emailPlaceholder}: ${email}

${message}`;
  }, [content, name, email, message]);

  function handleLanguageSwitch(nextLang: Lang) {
    if (nextLang === lang) return;
    router.push(`/${nextLang}`);
  }

  function handleNavClick(href: string) {
    const targetId = href.replace("#", "");
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleImageError(src: string) {
    setBrokenImages((current) => ({
      ...current,
      [src]: true,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      alert(
        lang === "tr"
          ? "Lütfen tüm alanları doldurun."
          : "Please fill in all fields."
      );
      return;
    }

    const whatsappText = encodeURIComponent(mailBody);
    window.open(
      `https://wa.me/${whatsappNumber}?text=${whatsappText}`,
      "_blank"
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-lg font-bold tracking-wide text-white">
            {content.brand}
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {content.nav.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-sm text-neutral-300 transition hover:text-[#d4af37]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-white/10 bg-white/5 p-1 sm:flex">
              <button
                onClick={() => handleLanguageSwitch("en")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  lang === "en"
                    ? "bg-[#d4af37] text-black"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                EN
              </button>

              <button
                onClick={() => handleLanguageSwitch("tr")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  lang === "tr"
                    ? "bg-[#d4af37] text-black"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                TR
              </button>
            </div>

           <a
            href="https://watch.cinento.net"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[#d4af37] px-6 py-3 font-semibold text-black transition hover:opacity-90 inline-block"
          >
            {content.hero.primaryCta}
          </a>
          </div>
        </div>
      </header>

      <section
        id="home"
        className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28"
      >
        <div className="flex flex-col justify-center">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#d4af37]">
            {content.hero.eyebrow}
          </div>

          <h1 className="max-w-xl text-4xl font-bold leading-tight md:text-6xl">
            {content.hero.title}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-neutral-400">
            {content.hero.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              <a
                href="https://watch.cinento.net"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#d4af37] px-6 py-3 font-semibold text-black transition hover:opacity-90"
              >
                Watch Now
              </a>

            <button
              onClick={() => handleNavClick("#contact")}
              className="rounded-xl border border-[#d4af37] px-6 py-3 font-semibold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black"
            >
              {content.hero.secondaryCta}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full rounded-3xl border border-[#d4af37]/20 bg-neutral-900/80 p-6 shadow-2xl">
            <div className="relative min-h-[320px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#0b0b0b] p-8">
              {activeHeroImage && (
                <>
                  <img
                    src={activeHeroImage}
                    alt="CINENTO Hero"
                    onError={() => handleImageError(activeHeroImage)}
                    className="absolute inset-0 h-full w-full object-cover opacity-45"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/45 to-black/70" />
                </>
              )}

              <div className="relative z-10 flex min-h-[260px] flex-col justify-end">
                <div className="mb-3 text-sm uppercase tracking-[0.25em] text-[#d4af37]">
                  {content.hero.cardTitle}
                </div>

                <div className="text-2xl font-semibold leading-snug text-white">
                  {content.hero.cardSubtitle}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-semibold text-[#d4af37]">
          {content.whatWeDo.title}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {content.whatWeDo.items.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-[#d4af37]/15 bg-neutral-900/80 p-6 text-white shadow-lg transition hover:border-[#d4af37]/40"
            >
              <div className="font-medium leading-7">{item}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-semibold text-[#d4af37]">
          {content.whyCinento.title}
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {content.whyCinento.items.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 text-neutral-200"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-[#d4af37]/20 bg-neutral-900/80 p-8 shadow-xl">
          <h2 className="mb-4 text-2xl font-semibold text-[#d4af37]">
            {content.ecosystem.title}
          </h2>

          <p className="max-w-4xl text-neutral-300 leading-8">
            {content.ecosystem.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {content.platforms.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#d4af37]/15 bg-neutral-900/80 p-6 shadow-lg"
            >
              <h3 className="mb-3 text-lg font-semibold text-white">
                {item.title}
              </h3>

              <p className="text-sm leading-7 text-neutral-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-4 text-2xl font-semibold text-[#d4af37]">
          {content.gallery.title}
        </h2>

        <p className="mb-8 max-w-4xl text-neutral-400 leading-8">
          {content.gallery.subtitle}
        </p>

        {activeGalleryImages.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {activeGalleryImages.map((image, index) => {
              const label =
                content.gallery.items[index] || `Gallery ${index + 1}`;

              return (
                <div
                  key={`${image}-${index}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-lg"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={image}
                      alt={label}
                      onError={() => handleImageError(image)}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="text-sm font-medium text-neutral-100">
                        {label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {content.gallery.items.map((item) => (
              <div
                key={item}
                className="flex h-48 items-end rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] via-[#101010] to-[#050505] p-5 shadow-lg"
              >
                <span className="text-sm font-medium text-neutral-200">
                  {item}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="journal" className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-semibold text-[#d4af37]">
          {content.journalSection.title}
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {content.journal.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#d4af37]/15 bg-neutral-900 p-6 shadow-lg"
            >
              <div className="mb-3 text-lg font-medium leading-7 text-white">
                {item.title}
              </div>

              <div className="text-sm leading-7 text-neutral-400">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-3xl border border-[#d4af37]/20 bg-neutral-900/80 p-8 shadow-2xl md:p-10">
          <h2 className="mb-3 text-3xl font-bold text-[#d4af37]">
            {content.contact.title}
          </h2>

          <p className="mb-8 text-neutral-400 leading-8">
            {content.contact.subtitle}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={content.contact.namePlaceholder}
              className="w-full rounded-xl border border-[#d4af37]/20 bg-neutral-950 px-4 py-3 text-white placeholder-neutral-500 outline-none transition focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={content.contact.emailPlaceholder}
              className="w-full rounded-xl border border-[#d4af37]/20 bg-neutral-950 px-4 py-3 text-white placeholder-neutral-500 outline-none transition focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={content.contact.messagePlaceholder}
              className="h-36 w-full rounded-xl border border-[#d4af37]/20 bg-neutral-950 px-4 py-3 text-white placeholder-neutral-500 outline-none transition focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-[#d4af37] py-3 font-semibold text-black transition hover:opacity-90"
            >
              {content.contact.buttonLabel}
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
          <div>
            <div className="mb-3 text-lg font-bold text-white">
              {content.brand}
            </div>

            <div className="text-sm leading-7 text-neutral-400">
              {content.footer.brandLine}
            </div>
          </div>

          <div>
            <div className="mb-3 font-semibold text-white">
              {content.footer.contactTitle}
            </div>

            <div className="space-y-2 text-sm text-neutral-400">
              <div>Istanbul, Turkey</div>
              <div>cinento.tv@gmail.com</div>

              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                className="block hover:text-[#d4af37]"
                rel="noreferrer"
              >
                {content.contact.whatsappLabel}
              </a>
            </div>
          </div>

          <div>
            <div className="mb-3 font-semibold text-white">
              {content.footer.followTitle}
            </div>

            <div className="space-y-2 text-sm text-neutral-400">
              <a
                href={
                  content.footer.social?.instagram ||
                  "https://instagram.com/cinento"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-[#d4af37]"
              >
                Instagram
              </a>

              <a
                href={
                  content.footer.social?.linkedin ||
                  "https://linkedin.com/company/cinento"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-[#d4af37]"
              >
                LinkedIn
              </a>

              <a
                href={content.footer.social?.website || "https://cinento.net"}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-[#d4af37]"
              >
                Website
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-4 text-center text-xs text-neutral-500">
          {content.footer.rights}
        </div>
      </footer>
    </main>
  );
}