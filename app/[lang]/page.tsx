/* 
File: app/[lang]/page.tsx
Version: CINENTO Website PRO v3.7.1
Updated: 2026-05-01 [Europe/Istanbul]
Status: PAGE54 BASE + CMS CONNECTED + IMAGE MANAGER ACTIVE HERO SYSTEM CONNECTED + WATCH CTA CONNECTED + JSX STRUCTURE FIXED
*/

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import rtlHomepage from "../data/rtl-homepage.json";

type Lang = "en" | "tr" | "fa" | "ar";
const isRtl = (lang: Lang) => lang === "fa" || lang === "ar";
const ui = {
  en: { menu: "Main navigation", platforms: "Products & Platforms", watch: "Watch Now", all: "All platforms", profile: "Explore profile", gallery: "CINENTO Gallery", sending: "Sending…", sent: "Your inquiry was received. Our team will review your project.", unavailable: "The form is unavailable right now. Please contact us by email.", privacy: "Your details will be sent to the CINENTO project team.", email: "Open email draft", required: "Please fill in all fields.", invalidEmail: "Enter a valid email address.", short: "Please describe your project in at least 20 characters.", translation: "Project details appear in English until translations are saved." },
  tr: { menu: "Ana menü", platforms: "Ürünler & Platformlar", watch: "İzlemeye Başla", all: "Tüm platformlar", profile: "Profili incele", gallery: "CINENTO Galeri", sending: "Gönderiliyor…", sent: "Mesajınız alındı. Ekibimiz projenizi inceleyecek.", unavailable: "Şu anda form gönderilemiyor. Lütfen e-posta ile iletişime geçin.", privacy: "Bilgileriniz CINENTO proje ekibine iletilecektir.", email: "E-posta taslağı aç", required: "Lütfen tüm alanları doldurun.", invalidEmail: "Geçerli bir e-posta adresi girin.", short: "Lütfen projenizi en az 20 karakterle açıklayın.", translation: "Proje ayrıntıları Türkçe çevirileri kaydedilene kadar İngilizce gösterilir." },
  fa: { menu: "منوی اصلی", platforms: "محصولات و پلتفرم‌ها", watch: "تماشای CINENTO WATCH", all: "همه پلتفرم‌ها", profile: "مشاهده معرفی", gallery: "گالری CINENTO", sending: "در حال ارسال…", sent: "درخواست شما دریافت شد. تیم ما پروژه را بررسی می‌کند.", unavailable: "فرم موقتاً در دسترس نیست. لطفاً از راه ایمیل تماس بگیرید.", privacy: "اطلاعات شما به تیم پروژه CINENTO ارسال می‌شود.", email: "بازکردن پیش‌نویس ایمیل", required: "لطفاً همه فیلدها را تکمیل کنید.", invalidEmail: "یک نشانی ایمیل معتبر وارد کنید.", short: "لطفاً پروژه را در دست‌کم ۲۰ نویسه توضیح دهید.", translation: "تا ثبت ترجمه در داشبورد، اطلاعات برخی پروژه‌ها به انگلیسی نمایش داده می‌شود." },
  ar: { menu: "القائمة الرئيسية", platforms: "المنتجات والمنصات", watch: "شاهد CINENTO WATCH", all: "جميع المنصات", profile: "استكشف الملف", gallery: "معرض CINENTO", sending: "جارٍ الإرسال…", sent: "وصل طلبك. سيراجع فريقنا مشروعك.", unavailable: "النموذج غير متاح حالياً. يرجى التواصل عبر البريد الإلكتروني.", privacy: "ستُرسل بياناتك إلى فريق مشاريع CINENTO.", email: "فتح مسودة البريد", required: "يرجى ملء جميع الحقول.", invalidEmail: "يرجى إدخال بريد إلكتروني صالح.", short: "يرجى وصف مشروعك في ٢٠ حرفاً على الأقل.", translation: "تُعرض بعض تفاصيل المشاريع بالإنجليزية إلى حين حفظ ترجمتها في لوحة التحكم." },
} as const;

type NavItem = { label: string; href: string };
type PlatformItem = { title: string; description: string };
type JournalItem = { title: string; description: string };
type ServiceItem = { title: string; description: string };
type ProjectItem = { id?: string; title: string; role: string; status: string; description: string; image?: string };
type FeaturedProgram = {
  id: string;
  name: string;
  mark: string;
  category: string;
  cover_url?: string | null;
  icon_url?: string | null;
  logo_url?: string | null;
  copy?: Partial<Record<Lang, { description?: string }>>;
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
    primaryCtaHref?: string;
    secondaryCta: string;
    secondaryCtaHref?: string;
    cardTitle: string;
    cardSubtitle: string;
  };
  whatWeDo: { title: string; items: string[] };
  services: { title: string; subtitle: string; items: ServiceItem[] };
  featuredProjects: { title: string; subtitle: string; items: ProjectItem[] };
  process: { title: string; subtitle: string; steps: ServiceItem[] };
  whyCinento: { title: string; items: string[] };
  ecosystem: { title: string; subtitle: string };
  platforms: PlatformItem[];
  gallery: { title: string; subtitle: string; items: string[]; images?: string[] };
  journalSection: { title: string };
  journal: JournalItem[];
  contact: ContactContent;
  footer: {
    brandLine: string;
    contactTitle: string;
    followTitle: string;
    rights: string;
    location?: string;
    email?: string;
    whatsappNumber?: string;
    social?: { instagram?: string; linkedin?: string; website?: string };
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
  active: { hero: string; gallery: string; projects: string };
};

const WATCH_URL = "https://watch.cinento.net";

const BASE_CONTENT: Record<"en" | "tr", PageContent> = {
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
      primaryCta: "Watch Now",
      secondaryCta: "Start Project",
      cardTitle: "CINENTO",
      cardSubtitle: "Cinematic Development for the International Market",
    },
    whatWeDo: {
      title: "What We Do",
      items: ["Film & Series Development", "Co-Production Strategy", "Investor Packaging"],
    },
    services: { title: "How We Help", subtitle: "Focused support for projects moving from a promising idea to a professional presentation.", items: [
      { title: "Story & Screenplay Development", description: "Shape the concept, characters, structure and screenplay for film or series." },
      { title: "Pitch & Investor Materials", description: "Prepare a clear pitch deck, project dossier and presentation materials." },
      { title: "Production & Co-Production Strategy", description: "Define the production path, potential partners and international positioning." },
    ] },
    featuredProjects: { title: "Selected Projects", subtitle: "A closer look at CINENTO's film and series work.", items: [] },
    process: { title: "Work With CINENTO", subtitle: "A clear path from first conversation to a presentation-ready project.", steps: [
      { title: "Share your idea", description: "Tell us the format, story and current stage of your project." },
      { title: "Define the development plan", description: "We review the material and agree on the right scope of work." },
      { title: "Build the package", description: "Develop the story and presentation materials for the next conversation." },
    ] },
    whyCinento: {
      title: "Why CINENTO",
      items: ["Turkey–GCC Bridge", "Creative + Financial Integration", "Scalable Media System", "Investor-Ready Output"],
    },
    ecosystem: {
      title: "CINENTO Ecosystem",
      subtitle:
        "A connected structure designed to combine creative development, project intake, business growth, and future-facing distribution under one brand ecosystem.",
    },
    platforms: [
      { title: "CINENTO AI Studio", description: "Professional cinematic development system for screenplay generation, story architecture, and investor-ready packaging." },
      { title: "Outreach CRM", description: "Lead management, project tracking, and business development system for CINENTO partnerships and growth." },
      { title: "CINENTO Academy", description: "Training programs, workshops, and structured learning for creators and industry professionals." },
      { title: "CINENTO TV", description: "Distribution platform for showcasing projects and curated cinematic content." },
    ],
    gallery: {
      title: "CINENTO Gallery",
      subtitle: "Selected visual frames designed to strengthen CINENTO’s cinematic identity, brand presence, and professional presentation.",
      items: ["Cinematic brand frame", "Development environment", "Investor-ready presentation mood"],
      images: ["/images/gallery/gallery-1.jpg", "/images/gallery/gallery-2.jpg", "/images/gallery/gallery-3.jpg"],
    },
    journalSection: { title: "CINENTO Journal" },
    journal: [
      { title: "Why strong film projects fail before reaching the market", description: "Development gaps and weak positioning often damage otherwise promising projects." },
      { title: "Investor-ready storytelling changes project value", description: "The way a project is packaged and presented directly shapes professional interest." },
      { title: "Building a media ecosystem beyond one project", description: "Long-term value comes from systems, not only single productions." },
    ],
    contact: {
      title: "Start Your Project",
      subtitle: "Tell us about your project and begin the first step toward development, packaging, and international positioning.",
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
      social: { instagram: "https://instagram.com/cinento", linkedin: "https://linkedin.com/company/cinento", website: "https://cinento.net" },
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
      description: "CINENTO; hikâye geliştirme, finansman ve dağıtımı tek bir sinematik ekosistemde birleştiren yeni nesil bir film geliştirme platformudur.",
      primaryCta: "İzlemeye Başla",
      secondaryCta: "Projeni Başlat",
      cardTitle: "CINENTO",
      cardSubtitle: "Uluslararası Pazar İçin Sinematik Geliştirme",
    },
    whatWeDo: { title: "Ne Yapıyoruz", items: ["Film ve Dizi Geliştirme", "Ortak Yapım Stratejisi", "Yatırımcı Paketleme"] },
    services: { title: "Nasıl Yardımcı Oluyoruz", subtitle: "Fikirden profesyonel sunuma uzanan film ve dizi projeleri için odaklı destek.", items: [
      { title: "Hikâye ve Senaryo Geliştirme", description: "Film veya dizi fikrini, karakterlerini, yapısını ve senaryosunu geliştirme." },
      { title: "Pitch ve Yatırımcı Dosyası", description: "Proje dosyası, pitch deck ve profesyonel sunum materyalleri hazırlama." },
      { title: "Yapım ve Ortak Yapım Stratejisi", description: "Yapım yolunu, olası ortakları ve uluslararası konumlandırmayı belirleme." },
    ] },
    featuredProjects: { title: "Seçili Projeler", subtitle: "CINENTO'nun film ve dizi çalışmalarından seçmeler.", items: [] },
    process: { title: "CINENTO ile Çalışın", subtitle: "İlk görüşmeden sunuma hazır projeye uzanan net bir yol.", steps: [
      { title: "Fikrinizi paylaşın", description: "Projenizin türünü, hikâyesini ve mevcut aşamasını anlatın." },
      { title: "Geliştirme planını belirleyin", description: "Materyali inceleyip çalışma kapsamını birlikte netleştirelim." },
      { title: "Proje dosyasını hazırlayın", description: "Hikâyeyi ve bir sonraki görüşme için sunum materyallerini geliştirelim." },
    ] },
    whyCinento: { title: "Neden CINENTO", items: ["Türkiye–Körfez Köprüsü", "Yaratıcı + Finansal Entegrasyon", "Ölçeklenebilir Medya Sistemi", "Yatırımcıya Hazır Çıktı"] },
    ecosystem: { title: "CINENTO Ekosistemi", subtitle: "Yaratıcı geliştirme, proje kabulü, iş büyümesi ve geleceğe dönük dağıtımı tek bir marka sistemi altında birleştiren bağlantılı bir yapı." },
    platforms: [
      { title: "CINENTO AI Studio", description: "Senaryo üretimi, hikâye mimarisi ve yatırımcıya hazır paketleme için profesyonel sinematik geliştirme sistemi." },
      { title: "Outreach CRM", description: "CINENTO ortaklıkları ve büyümesi için lead yönetimi, proje takibi ve iş geliştirme sistemi." },
      { title: "CINENTO Academy", description: "Yaratıcılar ve sektör profesyonelleri için eğitim programları, atölyeler ve yapılandırılmış öğrenme." },
      { title: "CINENTO TV", description: "Projeleri ve seçilmiş sinematik içerikleri sunmaya yönelik dağıtım platformu." },
    ],
    gallery: {
      title: "CINENTO Galeri",
      subtitle: "CINENTO’nun sinematik kimliğini, marka görünürlüğünü ve profesyonel sunum gücünü destekleyen seçilmiş görseller.",
      items: ["Sinematik marka karesi", "Geliştirme ortamı", "Yatırımcı sunum atmosferi"],
      images: ["/images/gallery/gallery-1.jpg", "/images/gallery/gallery-2.jpg", "/images/gallery/gallery-3.jpg"],
    },
    journalSection: { title: "CINENTO Journal" },
    journal: [
      { title: "Güçlü film projeleri neden pazara ulaşmadan zayıflar", description: "Geliştirme eksikleri ve zayıf konumlandırma, umut veren projeleri bile zedeleyebilir." },
      { title: "Yatırımcıya hazır hikâye anlatımı proje değerini değiştirir", description: "Bir projenin nasıl paketlendiği ve sunulduğu, profesyonel ilgiyi doğrudan etkiler." },
      { title: "Tek projeden öte bir medya ekosistemi kurmak", description: "Uzun vadeli değer sadece tekil yapımlardan değil, sistemlerden doğar." },
    ],
    contact: {
      title: "Projenizi Başlatın",
      subtitle: "Bize projenizi anlatın ve geliştirme, paketleme ve uluslararası konumlandırmanın ilk adımını başlatın.",
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
      social: { instagram: "https://instagram.com/cinento", linkedin: "https://linkedin.com/company/cinento", website: "https://cinento.net" },
    },
  },
};

const CONTENT: Record<Lang, PageContent> = {
  ...BASE_CONTENT,
  fa: { ...BASE_CONTENT.en, ...rtlHomepage.fa, gallery: { ...BASE_CONTENT.en.gallery, ...rtlHomepage.fa.gallery }, footer: { ...BASE_CONTENT.en.footer, ...rtlHomepage.fa.footer } } as PageContent,
  ar: { ...BASE_CONTENT.en, ...rtlHomepage.ar, gallery: { ...BASE_CONTENT.en.gallery, ...rtlHomepage.ar.gallery }, footer: { ...BASE_CONTENT.en.footer, ...rtlHomepage.ar.footer } } as PageContent,
};

function mergeHomepageContent(fallback: PageContent, dynamic?: DynamicHomepageContent | null): PageContent {
  if (!dynamic) return fallback;
  return {
    ...fallback,
    ...dynamic,
    nav: dynamic.nav || fallback.nav,
    hero: {
      ...fallback.hero,
      ...(dynamic.hero || {}),
      title: dynamic.heroTitle || dynamic.hero?.title || fallback.hero.title,
      description: dynamic.heroSubtitle || dynamic.hero?.description || fallback.hero.description,
      primaryCta: dynamic.buttonPrimary || dynamic.hero?.primaryCta || fallback.hero.primaryCta,
      secondaryCta: dynamic.buttonSecondary || dynamic.hero?.secondaryCta || fallback.hero.secondaryCta,
    },
    whatWeDo: { ...fallback.whatWeDo, ...(dynamic.whatWeDo || {}), items: dynamic.whatWeDo?.items || fallback.whatWeDo.items },
    services: { ...fallback.services, ...(dynamic.services || {}), items: dynamic.services?.items || fallback.services.items },
    featuredProjects: { ...fallback.featuredProjects, ...(dynamic.featuredProjects || {}), items: dynamic.featuredProjects?.items || fallback.featuredProjects.items },
    process: { ...fallback.process, ...(dynamic.process || {}), steps: dynamic.process?.steps || fallback.process.steps },
    whyCinento: { ...fallback.whyCinento, ...(dynamic.whyCinento || {}), items: dynamic.whyCinento?.items || fallback.whyCinento.items },
    ecosystem: { ...fallback.ecosystem, ...(dynamic.ecosystem || {}) },
    platforms: dynamic.platforms || fallback.platforms,
    gallery: { ...fallback.gallery, ...(dynamic.gallery || {}), items: dynamic.gallery?.items || fallback.gallery.items, images: dynamic.gallery?.images || fallback.gallery.images },
    journalSection: { ...fallback.journalSection, ...(dynamic.journalSection || {}) },
    journal: dynamic.journal || fallback.journal,
    contact: { ...fallback.contact, ...(dynamic.contact || {}) },
    footer: { ...fallback.footer, ...(dynamic.footer || {}) },
  };
}

export default function HomePage() {
  const params = useParams();
  const router = useRouter();
  const lang: Lang = params?.lang === "tr" || params?.lang === "fa" || params?.lang === "ar" ? params.lang : "en";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl(lang) ? "rtl" : "ltr";
  }, [lang]);

  const [dynamicContent, setDynamicContent] = useState<DynamicHomepageContent | null>(null);
  const [showEnglishProjectDetails, setShowEnglishProjectDetails] = useState(false);
  const [featuredPrograms, setFeaturedPrograms] = useState<FeaturedProgram[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImages>({ hero: [], gallery: [], projects: [], active: { hero: "", gallery: "", projects: "" } });
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const content = useMemo(() => mergeHomepageContent(CONTENT[lang], dynamicContent), [lang, dynamicContent]);

  const activeHeroImage = useMemo(() => {
    const activeHero = uploadedImages.active.hero;
    if (activeHero && !brokenImages[activeHero]) return activeHero;
    const validHeroImages = uploadedImages.hero.filter((image) => !brokenImages[image]);
    return validHeroImages.length > 0 ? validHeroImages[0] : null;
  }, [uploadedImages.active.hero, uploadedImages.hero, brokenImages]);

  const activeGalleryImages = useMemo(() => {
    const uploadedGallery = uploadedImages.gallery.filter((image) => !brokenImages[image]);
    if (uploadedGallery.length > 0) return uploadedGallery;
    return (content.gallery.images || []).filter((image) => !brokenImages[image]);
  }, [uploadedImages.gallery, content.gallery.images, brokenImages]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [inquiryState, setInquiryState] = useState<"idle" | "sent" | "unavailable">("idle");
  const whatsappNumber = content.footer.whatsappNumber?.replace(/\D/g, "") || "";
  const contactEmail = content.footer.email?.trim() || "cinento.tv@gmail.com";

  useEffect(() => {
    let isActive = true;
    fetch("/api/content/homepage", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!isActive) return;
        const selected = data?.[lang] || null;
        const englishProjects = data?.en?.featuredProjects?.items;
        const translatedProjects: ProjectItem[] = Array.isArray(selected?.featuredProjects?.items) ? selected.featuredProjects.items : [];
        const hasEnglishProjects = Array.isArray(englishProjects) && englishProjects.some((item: ProjectItem) => item?.title?.trim());
        let needsEnglishFallback = false;
        const mergedProjects: ProjectItem[] = lang !== "en" && hasEnglishProjects
          ? englishProjects.map((item: ProjectItem, index: number) => {
              const translation = translatedProjects.find((candidate) => candidate.id === (item.id || `project-${index + 1}`))
                || (!translatedProjects.some(candidate => candidate.id) ? translatedProjects[index] : undefined);
              if (item.title?.trim() && (!translation?.title?.trim() || !translation?.role?.trim() || !translation?.status?.trim() || !translation?.description?.trim())) needsEnglishFallback = true;
              return {
                ...item,
                title: translation?.title?.trim() || item.title,
                role: translation?.role?.trim() || item.role,
                status: translation?.status?.trim() || item.status,
                description: translation?.description?.trim() || item.description,
                image: item.image, // Artwork is shared across languages.
              };
            })
          : translatedProjects;
        setShowEnglishProjectDetails(needsEnglishFallback);
        setDynamicContent(lang !== "en" && hasEnglishProjects ? {
          ...selected,
          featuredProjects: {
            title: selected?.featuredProjects?.title || CONTENT[lang].featuredProjects.title,
            subtitle: selected?.featuredProjects?.subtitle || CONTENT[lang].featuredProjects.subtitle,
            items: mergedProjects,
          },
          footer: { ...data?.en?.footer, ...CONTENT[lang].footer, ...selected?.footer },
        } : selected);
      })
      .catch(() => {
        if (isActive) { setDynamicContent(null); setShowEnglishProjectDetails(false); }
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
            gallery: Array.isArray(data.images.gallery) ? data.images.gallery : [],
            projects: Array.isArray(data.images.projects) ? data.images.projects : [],
            active: { hero: data.active?.hero || "", gallery: data.active?.gallery || "", projects: data.active?.projects || "" },
          });
        }
      })
      .catch(() => {
        if (isActive) setUploadedImages({ hero: [], gallery: [], projects: [], active: { hero: "", gallery: "", projects: "" } });
      });
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/programs", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (Array.isArray(data?.programs)) {
          setFeaturedPrograms(data.programs.filter((program: FeaturedProgram) =>
            typeof program.id === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(program.id)
          ).slice(0, 6));
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const mailBody = useMemo(() => {
    return `${content.contact.title}\n\n${content.contact.namePlaceholder}: ${name}\n${content.contact.emailPlaceholder}: ${email}\n\n${message}`;
  }, [content, name, email, message]);

  function handleLanguageSwitch(nextLang: Lang) {
    if (nextLang === lang) return;
    router.push(`/${nextLang}`);
  }

  function handleNavClick(href: string) {
    const targetId = href.replace("#", "");
    const target = document.getElementById(targetId);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleImageError(src: string) {
    setBrokenImages((current) => ({ ...current, [src]: true }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert(ui[lang].required);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      alert(ui[lang].invalidEmail);
      return;
    }
    if (message.trim().length < 20) {
      alert(ui[lang].short);
      return;
    }
    setSubmitting(true);
    setInquiryState("idle");
    try {
      const response = await fetch("/api/project-inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, message, language: lang, website: "" }) });
      if (!response.ok) throw new Error("Inquiry could not be saved");
      setInquiryState("sent");
      setName(""); setEmail(""); setMessage("");
    } catch {
      setInquiryState("unavailable");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main lang={lang} dir={isRtl(lang) ? "rtl" : "ltr"} className="min-h-screen bg-[#070707] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="text-lg font-bold tracking-wide text-white">{content.brand}</div>

          <nav aria-label={ui[lang].menu} className="order-3 flex w-full flex-wrap items-center gap-x-5 gap-y-3 lg:order-none lg:w-auto">
            {content.nav.map((item) => (
              <button key={item.label} onClick={() => handleNavClick(item.href)} className="text-sm text-neutral-300 transition hover:text-[#d4af37]">
                {item.label}
              </button>
            ))}
            <a href={`/${lang}/platforms`} className="text-sm font-semibold text-[#d4af37] transition hover:text-white">
              {ui[lang].platforms}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
              <button aria-label="English" aria-current={lang === "en" ? "page" : undefined} onClick={() => handleLanguageSwitch("en")} className={`rounded-full px-3 py-1 text-xs font-medium transition ${lang === "en" ? "bg-[#d4af37] text-black" : "text-neutral-300 hover:text-white"}`}>EN</button>
              <button aria-label="Türkçe" aria-current={lang === "tr" ? "page" : undefined} onClick={() => handleLanguageSwitch("tr")} className={`rounded-full px-3 py-1 text-xs font-medium transition ${lang === "tr" ? "bg-[#d4af37] text-black" : "text-neutral-300 hover:text-white"}`}>TR</button>
              <button aria-label="فارسی" aria-current={lang === "fa" ? "page" : undefined} onClick={() => handleLanguageSwitch("fa")} className={`rounded-full px-3 py-1 text-xs font-medium transition ${lang === "fa" ? "bg-[#d4af37] text-black" : "text-neutral-300 hover:text-white"}`}>FA</button>
              <button aria-label="العربية" aria-current={lang === "ar" ? "page" : undefined} onClick={() => handleLanguageSwitch("ar")} className={`rounded-full px-3 py-1 text-xs font-medium transition ${lang === "ar" ? "bg-[#d4af37] text-black" : "text-neutral-300 hover:text-white"}`}>AR</button>
            </div>

            <a href={WATCH_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#d4af37] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90">
              {ui[lang].watch}
            </a>
          </div>
        </div>
      </header>

      <section id="home" className="relative isolate overflow-hidden border-b border-white/5 bg-[radial-gradient(ellipse_at_78%_25%,rgba(166,120,43,.15),transparent_42%)]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,transparent_49.9%,rgba(212,175,55,.07)_50%,transparent_50.1%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28 lg:gap-20">
        <div className="flex flex-col justify-center">
          <div className="mb-7 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#d4af37]"><span className="h-px w-10 bg-[#d4af37]" />{content.hero.eyebrow}</div>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">{content.hero.title}</h1>
          <p className="mt-7 max-w-xl border-s border-[#d4af37]/60 ps-5 text-base leading-8 text-neutral-300">{content.hero.description}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a href={content.hero.primaryCtaHref === "#contact" ? "#contact" : WATCH_URL} target={content.hero.primaryCtaHref === "#contact" ? undefined : "_blank"} rel={content.hero.primaryCtaHref === "#contact" ? undefined : "noopener noreferrer"} className="rounded-xl bg-[#d4af37] px-6 py-3 font-semibold text-black transition hover:opacity-90">
              {content.hero.primaryCta}
            </a>
            <a href={content.hero.secondaryCtaHref === "#contact" ? "#contact" : `/${lang}/platforms`} className="rounded-xl border border-[#d4af37] px-6 py-3 font-semibold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black">
              {content.hero.secondaryCta}
            </a>
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative w-full border border-[#d4af37]/30 bg-neutral-900/80 p-2 shadow-[0_35px_100px_rgba(0,0,0,.65)] sm:p-3">
            <div className="relative min-h-[430px] overflow-hidden bg-gradient-to-br from-[#1d1a16] via-[#101010] to-[#080808] p-8 sm:min-h-[520px]">
              {activeHeroImage && (
                <>
                  <Image src={activeHeroImage} alt="" fill priority sizes="(min-width: 768px) 50vw, 100vw" unoptimized={activeHeroImage.startsWith("https://")} onError={() => handleImageError(activeHeroImage)} className="object-cover opacity-45" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10" />
                </>
              )}
              <div className="relative z-10 flex min-h-[366px] flex-col justify-between sm:min-h-[456px]">
                <div className="flex items-start justify-between gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#e6c878]"><span>{content.hero.cardTitle}</span><span aria-hidden="true">✦</span></div>
                <div className="max-w-sm border-t border-white/40 pt-5 text-2xl font-semibold leading-snug text-white sm:text-3xl">{content.hero.cardSubtitle}</div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-semibold text-[#d4af37]">{content.whatWeDo.title}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {content.whatWeDo.items.map((item, index) => (
            <div key={item} className="rounded-2xl border border-[#d4af37]/15 bg-neutral-900/80 p-6 text-white shadow-lg transition hover:border-[#d4af37]/40">
              <div className="mb-10 text-xs font-semibold tracking-[0.25em] text-[#d4af37]">{String(index + 1).padStart(2, "0")}</div>
              <div className="border-t border-white/10 pt-5 text-lg font-medium leading-7">{item}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#0d0d0d] py-20" aria-labelledby="services-title">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl"><div className="mb-4 h-px w-14 bg-[#d4af37]" /><h2 id="services-title" className="text-3xl font-semibold md:text-4xl">{content.services.title}</h2><p className="mt-4 leading-8 text-neutral-400">{content.services.subtitle}</p></div>
          <div className="grid gap-5 md:grid-cols-3">
            {content.services.items.filter(item => item.title.trim()).map((item, index) => (
              <article key={`${item.title}-${index}`} className="border border-white/10 bg-[#151515] p-7 transition hover:border-[#d4af37]/50">
                <div className="mb-12 text-sm tracking-[0.25em] text-[#d4af37]">{String(index + 1).padStart(2, "0")} / 03</div>
                <h3 className="text-xl font-semibold leading-7">{item.title}</h3><p className="mt-4 text-sm leading-7 text-neutral-400">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-semibold text-[#d4af37]">{content.whyCinento.title}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {content.whyCinento.items.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 text-neutral-200">{item}</div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#0b0b0b] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div><div className="mb-4 h-px w-14 bg-[#d4af37]" /><h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{content.ecosystem.title}</h2><p className="mt-4 max-w-3xl leading-8 text-neutral-400">{content.ecosystem.subtitle}</p></div>
            <a href={`/${lang}/platforms`} className="inline-flex min-h-11 items-center gap-3 border-b border-[#d4af37] pb-2 text-sm font-semibold text-[#e6c878] transition hover:text-white">{ui[lang].all}<span aria-hidden="true">↗</span></a>
          </div>
          {featuredPrograms.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featuredPrograms.map((program, index) => (
                <a key={program.id} href={`/${lang}/platforms/${program.id}`} className="group overflow-hidden border border-white/10 bg-[#131313] transition hover:border-[#d4af37]/60 hover:bg-[#191919]">
                  <div className="relative flex h-48 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#2d2b27,#101010_70%)]">
                    {program.cover_url && !brokenImages[program.cover_url] && <Image src={program.cover_url} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" unoptimized={program.cover_url.startsWith("https://")} onError={() => handleImageError(program.cover_url!)} className="object-cover opacity-80 transition duration-500 group-hover:scale-105" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-black/10" />
                    {(!program.cover_url || brokenImages[program.cover_url]) && (program.icon_url && !brokenImages[program.icon_url] ? <Image src={program.icon_url} alt="" width={64} height={64} unoptimized={program.icon_url.startsWith("https://")} onError={() => handleImageError(program.icon_url!)} className="relative z-10 h-16 w-16 object-contain drop-shadow-xl" /> : <span className="relative z-10 border border-[#d4af37]/60 bg-black/60 px-4 py-3 text-xl font-semibold text-[#e6c878]">{program.mark}</span>)}
                  </div>
                  <div className="p-6"><div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#d4af37]"><span>{program.category}</span><span>{String(index + 1).padStart(2, "0")}</span></div><h3 className="text-xl font-semibold text-white">{program.name}</h3><p className="mt-3 min-h-20 text-sm leading-7 text-neutral-400">{program.copy?.[lang]?.description || program.copy?.en?.description}</p><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm font-medium text-[#e6c878]"><span>{ui[lang].profile}</span><span aria-hidden="true" className="transition group-hover:translate-x-1">↗</span></div></div>
                </a>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">{content.platforms.map((item) => <div key={item.title} className="border border-[#d4af37]/15 bg-neutral-900/80 p-6"><h3 className="mb-3 text-lg font-semibold text-white">{item.title}</h3><p className="text-sm leading-7 text-neutral-400">{item.description}</p></div>)}</div>
          )}
        </div>
      </section>

      {content.featuredProjects.items.some(item => item.title.trim()) && (
        <section className="mx-auto max-w-7xl px-6 py-20" aria-labelledby="projects-title">
          <div className="mb-10 max-w-3xl"><div className="mb-4 h-px w-14 bg-[#d4af37]" /><h2 id="projects-title" className="text-3xl font-semibold md:text-4xl">{content.featuredProjects.title}</h2><p className="mt-4 leading-8 text-neutral-400">{content.featuredProjects.subtitle}</p>{showEnglishProjectDetails && <p className="mt-3 text-sm text-[#e6c878]">{ui[lang].translation}</p>}</div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {content.featuredProjects.items.filter(item => item.title.trim()).map((item, index) => {
              const rawImage = item.image?.trim() || "";
              const image = rawImage.startsWith("/") && !rawImage.startsWith("//") || /^https:\/\/[^\s]+$/i.test(rawImage) ? rawImage : "";
              return <article key={`${item.title}-${index}`} className="overflow-hidden border border-white/10 bg-[#131313]">
                <div className="relative h-56 bg-[radial-gradient(circle_at_60%_25%,#373022,#111_70%)]">
                  {image && !brokenImages[image] ? <Image src={image} alt={item.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" unoptimized={image.startsWith("https://")} onError={() => handleImageError(image)} className="object-cover" /> : <div className="flex h-full items-center justify-center text-4xl tracking-[0.3em] text-[#d4af37]/45">CINENTO</div>}
                </div>
                <div className="p-6"><div className="mb-3 text-xs uppercase tracking-[0.18em] text-[#d4af37]">{item.status}</div><h3 className="text-xl font-semibold">{item.title}</h3>{item.role && <p className="mt-3 text-sm text-[#e6c878]">{item.role}</p>}<p className="mt-4 text-sm leading-7 text-neutral-400">{item.description}</p></div>
              </article>;
            })}
          </div>
        </section>
      )}

      <section id="gallery" className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-4 text-2xl font-semibold text-[#d4af37]">{content.gallery.title || ui[lang].gallery}</h2>
        <p className="mb-8 max-w-4xl text-neutral-400 leading-8">{content.gallery.subtitle}</p>
        {activeGalleryImages.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {activeGalleryImages.map((image, index) => {
              const label = content.gallery.items[index] || `Gallery ${index + 1}`;
              return (
                <div key={`${image}-${index}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-lg">
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image src={image} alt={label} fill sizes="(min-width: 768px) 33vw, 100vw" unoptimized={image.startsWith("https://")} onError={() => handleImageError(image)} className="object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5"><span className="text-sm font-medium text-neutral-100">{label}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {content.gallery.items.map((item) => (
              <div key={item} className="flex h-48 items-end rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] via-[#101010] to-[#050505] p-5 shadow-lg">
                <span className="text-sm font-medium text-neutral-200">{item}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="journal" className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-semibold text-[#d4af37]">{content.journalSection.title}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {content.journal.map((item) => (
            <div key={item.title} className="rounded-2xl border border-[#d4af37]/15 bg-neutral-900 p-6 shadow-lg">
              <div className="mb-3 text-lg font-medium leading-7 text-white">{item.title}</div>
              <div className="text-sm leading-7 text-neutral-400">{item.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#0d0d0d] py-20" aria-labelledby="process-title">
        <div className="mx-auto max-w-7xl px-6"><div className="mb-10 max-w-3xl"><div className="mb-4 h-px w-14 bg-[#d4af37]" /><h2 id="process-title" className="text-3xl font-semibold md:text-4xl">{content.process.title}</h2><p className="mt-4 leading-8 text-neutral-400">{content.process.subtitle}</p></div>
          <div className="grid gap-5 md:grid-cols-3">{content.process.steps.filter(step => step.title.trim()).map((step, index) => <div key={`${step.title}-${index}`} className="border-t border-[#d4af37]/60 pt-6"><div className="mb-7 text-4xl font-light text-[#d4af37]/60">{String(index + 1).padStart(2, "0")}</div><h3 className="text-xl font-semibold">{step.title}</h3><p className="mt-3 text-sm leading-7 text-neutral-400">{step.description}</p></div>)}</div>
          <a href="#contact" className="mt-10 inline-flex rounded-xl bg-[#d4af37] px-6 py-3 font-semibold text-black transition hover:opacity-90">{content.hero.primaryCtaHref === "#contact" ? content.hero.primaryCta : content.contact.title}</a>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-3xl border border-[#d4af37]/20 bg-neutral-900/80 p-8 shadow-2xl md:p-10">
          <h2 className="mb-3 text-3xl font-bold text-[#d4af37]">{content.contact.title}</h2>
          <p className="mb-8 text-neutral-400 leading-8">{content.contact.subtitle}</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block" htmlFor="project-name">{content.contact.namePlaceholder}</label>
            <input id="project-name" name="name" required autoComplete="name" minLength={2} maxLength={120} value={name} onChange={(e) => setName(e.target.value)} placeholder={content.contact.namePlaceholder} style={{ backgroundColor: "#0a0a0a", color: "#fff" }} className="w-full rounded-xl border border-[#d4af37]/20 px-4 py-3 placeholder-neutral-500 outline-none transition focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]" />
            <label className="block" htmlFor="project-email">{content.contact.emailPlaceholder}</label>
            <input id="project-email" name="email" type="email" required autoComplete="email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} placeholder={content.contact.emailPlaceholder} style={{ backgroundColor: "#0a0a0a", color: "#fff" }} className="w-full rounded-xl border border-[#d4af37]/20 px-4 py-3 placeholder-neutral-500 outline-none transition focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]" />
            <label className="block" htmlFor="project-message">{content.contact.messagePlaceholder}</label>
            <textarea id="project-message" name="message" required minLength={20} maxLength={4000} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={content.contact.messagePlaceholder} style={{ backgroundColor: "#0a0a0a", color: "#fff" }} className="h-36 w-full rounded-xl border border-[#d4af37]/20 px-4 py-3 placeholder-neutral-500 outline-none transition focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]" />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]" />
            <button type="submit" disabled={submitting} className="w-full rounded-xl bg-[#d4af37] py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60">{submitting ? ui[lang].sending : lang === "en" && (content.contact.buttonLabel === "Prepare message" || content.contact.buttonLabel === "Submit Project") ? "Send project inquiry" : lang === "tr" && content.contact.buttonLabel === "Mesaj hazırla" ? "Proje talebini gönder" : content.contact.buttonLabel}</button>
            <div role="status" aria-live="polite" className="text-sm text-neutral-300">{inquiryState === "sent" ? ui[lang].sent : inquiryState === "unavailable" ? ui[lang].unavailable : ui[lang].privacy}</div>
            {inquiryState === "unavailable" && <a href={`mailto:${contactEmail}?subject=${encodeURIComponent(content.contact.title)}&body=${encodeURIComponent(mailBody)}`} className="inline-block border-b border-[#d4af37] pb-1 text-sm text-[#d4af37]">{ui[lang].email}</a>}
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
          <div>
            <div className="mb-3 text-lg font-bold text-white">{content.brand}</div>
            <div className="text-sm leading-7 text-neutral-400">{content.footer.brandLine}</div>
          </div>
          <div>
            <div className="mb-3 font-semibold text-white">{content.footer.contactTitle}</div>
            <div className="space-y-2 text-sm text-neutral-400">
              <div>{content.footer.location?.trim() || "Istanbul, Turkey"}</div>
              <a href={`mailto:${contactEmail}`} className="block hover:text-[#d4af37]">{contactEmail}</a>
              {whatsappNumber && <a href={`https://wa.me/${whatsappNumber}`} target="_blank" className="block hover:text-[#d4af37]" rel="noreferrer">{content.contact.whatsappLabel}</a>}
            </div>
          </div>
          <div>
            <div className="mb-3 font-semibold text-white">{content.footer.followTitle}</div>
            <div className="space-y-2 text-sm text-neutral-400">
              <a href={content.footer.social?.instagram || "https://instagram.com/cinento"} target="_blank" rel="noopener noreferrer" className="block hover:text-[#d4af37]">Instagram</a>
              <a href={content.footer.social?.linkedin || "https://linkedin.com/company/cinento"} target="_blank" rel="noopener noreferrer" className="block hover:text-[#d4af37]">LinkedIn</a>
              <a href={content.footer.social?.website || "https://cinento.net"} target="_blank" rel="noopener noreferrer" className="block hover:text-[#d4af37]">Website</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-neutral-500">{content.footer.rights}</div>
      </footer>
    </main>
  );
}

