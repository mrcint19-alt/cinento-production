export const homepageContent = {
  nav: {
    brand: "CINENTO",
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
    {
      src: "/images/gallery/gallery-1.jpg",
      alt: "CINENTO Gallery 1",
    },
    {
      src: "/images/gallery/gallery-2.jpg",
      alt: "CINENTO Gallery 2",
    },
    {
      src: "/images/gallery/gallery-3.jpg",
      alt: "CINENTO Gallery 3",
    },
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
    statusOptions: [
      "New",
      "In Review",
      "Contacted",
      "Closed",
    ] as const,
  },
};