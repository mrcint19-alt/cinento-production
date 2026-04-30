export type SiteLanguage = "en" | "tr";

type LeadStatus = "New" | "In Review" | "Contacted" | "Closed";

type HomepageLocaleContent = {
  nav: {
    brand: string;
    languageLabel: string;
    items: { label: string; target: string }[];
  };

  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta1: string;
    cta2: string;
    image: string;
    overlayEyebrow: string;
    overlayTitle: string;
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

  platforms: {
    title: string;
    description: string;
    href: string;
  }[];

  gallerySection: {
    title: string;
    subtitle: string;
  };

  gallery: {
    src: string;
    alt: string;
  }[];

  teaser: {
    enabled: boolean;
    title: string;
    subtitle: string;
    videoSrc: string;
    poster: string;
  };

  highlights: {
    title: string;
    desc: string;
  }[];

  journalSection: {
    title: string;
  };

  journal: {
    title: string;
    description: string;
  }[];

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
    sideText: string;
    statusOptions: readonly LeadStatus[];
  };
};

export const homepageContent: Record<SiteLanguage, HomepageLocaleContent> = {
  en: {
    nav: {
      brand: "CINENTO",
      languageLabel: "Language",
      items: [
        { label: "Home", target: "home" },
        { label: "About", target: "about" },
        { label: "Platforms", target: "platforms" },
        { label: "Gallery", target: "gallery" },
        { label: "Journal", target: "journal" },
        { label: "Contact", target: "contact" },
      ],
    },

    hero: {
      eyebrow: "CINENTO",
      title: "From Idea to International Film Market",
      subtitle:
        "CINENTO is a next-generation film development platform connecting storytelling, financing, and distribution into one unified cinematic ecosystem.",
      cta1: "Explore Platform",
      cta2: "Start Project",
      image: "/images/hero/hero-1.jpg",
      overlayEyebrow: "CINENTO",
      overlayTitle: "Cinematic Development for the International Market",
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
          "Creative development tools for screenplay generation, story architecture, and cinematic packaging.",
        href: "http://studio.cinento.net",
      },
      {
        title: "Outreach CRM",
        description:
          "Lead capture, contact organization, and business follow-up for partnerships and project growth.",
        href: "http://crm.cinento.net",
      },
      {
        title: "CINENTO Academy",
        description:
          "Training, workshops, and structured professional development for creators.",
        href: "/academy",
      },
      {
        title: "CINENTO TV",
        description:
          "Distribution layer for showcasing projects and curated screen content.",
        href: "/tv",
      },
    ],

    gallerySection: {
      title: "CINENTO Gallery",
      subtitle:
        "Selected visual frames designed to strengthen CINENTO’s cinematic identity, brand presence, and professional presentation.",
    },

    gallery: [
      { src: "/images/gallery/gallery-1.jpg", alt: "CINENTO Gallery 1" },
      { src: "/images/gallery/gallery-2.jpg", alt: "CINENTO Gallery 2" },
      { src: "/images/gallery/gallery-3.jpg", alt: "CINENTO Gallery 3" },
    ],

    teaser: {
      enabled: false,
      title: "CINENTO Teaser",
      subtitle:
        "Use this section for your cinematic teaser, platform reel, or brand intro video.",
      videoSrc: "/video/cinento-teaser.mp4",
      poster: "/images/hero/hero-1.jpg",
    },

    highlights: [
      {
        title: "Creative Development",
        desc:
          "Professional support for story development, screenplay design, and project shaping from concept to cinematic structure.",
      },
      {
        title: "Business Positioning",
        desc:
          "Strategic packaging for producers, partners, investors, and international market presentation.",
      },
      {
        title: "Scalable Ecosystem",
        desc:
          "An integrated structure connecting storytelling, outreach, CRM, and future distribution under one brand.",
      },
    ],

    journalSection: {
      title: "CINENTO Journal",
    },

    journal: [
      {
        title: "Why strong film projects fail before reaching the market",
        description:
          "Development gaps and the missing bridge between creation and positioning often weaken otherwise promising projects.",
      },
      {
        title: "How investor-ready storytelling changes project value",
        description:
          "The way a project is framed, packaged, and presented directly influences professional interest and decision-making.",
      },
      {
        title: "Building a media ecosystem beyond one project",
        description:
          "Long-term value comes from creating a system that connects content, growth, and monetization beyond a single title.",
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
      successMessage: "Your project request was submitted successfully.",
      errorRequired: "Please complete all fields before submitting.",
      sideText:
        "This is your real intake point for CINENTO leads.\n\nEvery form submission can be sent to your backend, saved in your CRM, and used for the next stage of development.\n\n→ New film lead\n→ New pitch deck request\n→ New investor or partner opportunity",
      statusOptions: ["New", "In Review", "Contacted", "Closed"],
    },
  },

  tr: {
    nav: {
      brand: "CINENTO",
      languageLabel: "Dil",
      items: [
        { label: "Ana Sayfa", target: "home" },
        { label: "Hakkında", target: "about" },
        { label: "Platformlar", target: "platforms" },
        { label: "Galeri", target: "gallery" },
        { label: "Journal", target: "journal" },
        { label: "İletişim", target: "contact" },
      ],
    },

    hero: {
      eyebrow: "CINENTO",
      title: "Fikirden Uluslararası Film Pazarına",
      subtitle:
        "CINENTO; hikâye geliştirme, finansman ve dağıtımı tek bir sinematik ekosistemde birleştiren yeni nesil bir film geliştirme platformudur.",
      cta1: "Platformu Keşfet",
      cta2: "Projeni Başlat",
      image: "/images/hero/hero-1.jpg",
      overlayEyebrow: "CINENTO",
      overlayTitle: "Uluslararası Pazar için Sinematik Geliştirme",
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
          "Senaryo üretimi, hikâye mimarisi ve sinematik paketleme için yaratıcı geliştirme araçları.",
        href: "http://studio.cinento.net",
      },
      {
        title: "Outreach CRM",
        description:
          "İş ortaklıkları ve proje büyümesi için lead toplama, iletişim yönetimi ve takip sistemi.",
        href: "http://crm.cinento.net",
      },
      {
        title: "CINENTO Academy",
        description:
          "İçerik üreticileri için eğitimler, atölyeler ve yapılandırılmış profesyonel gelişim.",
        href: "/academy",
      },
      {
        title: "CINENTO TV",
        description:
          "Projeleri ve seçili ekran içeriklerini sergilemek için dağıtım katmanı.",
        href: "/tv",
      },
    ],

    gallerySection: {
      title: "CINENTO Galeri",
      subtitle:
        "CINENTO’nun sinematik kimliğini, marka görünürlüğünü ve profesyonel sunum gücünü destekleyen seçili görseller.",
    },

    gallery: [
      { src: "/images/gallery/gallery-1.jpg", alt: "CINENTO Galeri 1" },
      { src: "/images/gallery/gallery-2.jpg", alt: "CINENTO Galeri 2" },
      { src: "/images/gallery/gallery-3.jpg", alt: "CINENTO Galeri 3" },
    ],

    teaser: {
      enabled: false,
      title: "CINENTO Tanıtım Videosu",
      subtitle:
        "Bu alanı sinematik teaser, platform tanıtımı veya marka giriş videosu için kullanabilirsiniz.",
      videoSrc: "/video/cinento-teaser.mp4",
      poster: "/images/hero/hero-1.jpg",
    },

    highlights: [
      {
        title: "Yaratıcı Geliştirme",
        desc:
          "Fikir aşamasından sinematik yapıya kadar hikâye geliştirme, senaryo tasarımı ve proje şekillendirme desteği.",
      },
      {
        title: "İş Konumlandırması",
        desc:
          "Yapımcılar, ortaklar, yatırımcılar ve uluslararası sunumlar için stratejik paketleme.",
      },
      {
        title: "Ölçeklenebilir Ekosistem",
        desc:
          "Hikâye anlatımını, outreach, CRM ve gelecekteki dağıtımı tek marka altında birleştiren entegre yapı.",
      },
    ],

    journalSection: {
      title: "CINENTO Journal",
    },

    journal: [
      {
        title: "Güçlü film projeleri pazara ulaşmadan neden başarısız olur?",
        description:
          "Geliştirme boşlukları ve yaratım ile konumlandırma arasındaki eksik köprü, umut vadeden projeleri zayıflatabilir.",
      },
      {
        title: "Yatırımcıya hazır anlatım proje değerini nasıl değiştirir?",
        description:
          "Bir projenin çerçevelenme, paketlenme ve sunulma biçimi profesyonel ilgiyi ve karar sürecini doğrudan etkiler.",
      },
      {
        title: "Tek projeden öte bir medya ekosistemi kurmak",
        description:
          "Uzun vadeli değer, içeriği, büyümeyi ve gelir modelini tek başlıktan öte bağlayan bir sistem kurmaktan gelir.",
      },
    ],

    contact: {
      title: "Projenizi Başlatın",
      namePlaceholder: "İsim / Şirket",
      emailPlaceholder: "E-posta",
      phonePlaceholder: "Telefon / WhatsApp",
      messagePlaceholder: "Bize projenizi anlatın",
      submitLabel: "Projeyi Gönder",
      submittingLabel: "Gönderiliyor...",
      successMessage: "Proje talebiniz başarıyla gönderildi.",
      errorRequired: "Lütfen göndermeden önce tüm alanları doldurun.",
      sideText:
        "Burası CINENTO lead akışınızın gerçek giriş noktasıdır.\n\nHer form gönderimi backend'e iletilebilir, CRM'e kaydedilebilir ve geliştirme sürecinin bir sonraki adımında kullanılabilir.\n\n→ Yeni film lead'i\n→ Yeni pitch deck talebi\n→ Yeni yatırımcı veya partner fırsatı",
      statusOptions: ["New", "In Review", "Contacted", "Closed"],
    },
  },
};