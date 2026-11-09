"use client";

/*
File: app/admin/content/page.tsx
Version: v4.1 FULL HOMEPAGE CMS + FOOTER CONTACT SOCIAL
Updated: 2026-04-30 [Europe/Istanbul]
Status: HERO + WHAT WE DO + WHY + ECOSYSTEM + PLATFORMS + GALLERY + JOURNAL + CONTACT + FOOTER CONTACT/SOCIAL
*/

import { useEffect, useState } from "react";
import rtlHomepage from "../../data/rtl-homepage.json";

type Lang = "en" | "tr" | "fa" | "ar";

type PlatformItem = {
  title: string;
  description: string;
};

type JournalItem = {
  title: string;
  description: string;
};
type ServiceItem = { title: string; description: string };
type ProjectItem = { id?: string; title: string; role: string; status: string; description: string; image: string };
const emptyService: ServiceItem = { title: "", description: "" };
const emptyProject: ProjectItem = { title: "", role: "", status: "", description: "", image: "" };
const serviceDefaults: Record<Lang, { title: string; subtitle: string; items: ServiceItem[]; processTitle: string; processSubtitle: string; steps: ServiceItem[]; projectsTitle: string; projectsSubtitle: string }> = {
  en: { title: "How We Help", subtitle: "Focused support for projects moving from a promising idea to a professional presentation.", items: [
    { title: "Story & Screenplay Development", description: "Shape the concept, characters, structure and screenplay for film or series." },
    { title: "Pitch & Investor Materials", description: "Prepare a clear pitch deck, project dossier and presentation materials." },
    { title: "Production & Co-Production Strategy", description: "Define the production path, potential partners and international positioning." },
  ], processTitle: "Work With CINENTO", processSubtitle: "A clear path from first conversation to a presentation-ready project.", steps: [
    { title: "Share your idea", description: "Tell us the format, story and current stage of your project." },
    { title: "Define the development plan", description: "We review the material and agree on the right scope of work." },
    { title: "Build the package", description: "Develop the story and presentation materials for the next conversation." },
  ], projectsTitle: "Selected Projects", projectsSubtitle: "A closer look at CINENTO's film and series work." },
  tr: { title: "Nasıl Yardımcı Oluyoruz", subtitle: "Fikirden profesyonel sunuma uzanan film ve dizi projeleri için odaklı destek.", items: [
    { title: "Hikâye ve Senaryo Geliştirme", description: "Film veya dizi fikrini, karakterlerini, yapısını ve senaryosunu geliştirme." },
    { title: "Pitch ve Yatırımcı Dosyası", description: "Proje dosyası, pitch deck ve profesyonel sunum materyalleri hazırlama." },
    { title: "Yapım ve Ortak Yapım Stratejisi", description: "Yapım yolunu, olası ortakları ve uluslararası konumlandırmayı belirleme." },
  ], processTitle: "CINENTO ile Çalışın", processSubtitle: "İlk görüşmeden sunuma hazır projeye uzanan net bir yol.", steps: [
    { title: "Fikrinizi paylaşın", description: "Projenizin türünü, hikâyesini ve mevcut aşamasını anlatın." },
    { title: "Geliştirme planını belirleyin", description: "Materyali inceleyip çalışma kapsamını birlikte netleştirelim." },
    { title: "Proje dosyasını hazırlayın", description: "Hikâyeyi ve bir sonraki görüşme için sunum materyallerini geliştirelim." },
  ], projectsTitle: "Seçili Projeler", projectsSubtitle: "CINENTO'nun film ve dizi çalışmalarından seçmeler." },
  fa: { title: rtlHomepage.fa.services.title, subtitle: rtlHomepage.fa.services.subtitle, items: rtlHomepage.fa.services.items, processTitle: rtlHomepage.fa.process.title, processSubtitle: rtlHomepage.fa.process.subtitle, steps: rtlHomepage.fa.process.steps, projectsTitle: rtlHomepage.fa.featuredProjects.title, projectsSubtitle: rtlHomepage.fa.featuredProjects.subtitle },
  ar: { title: rtlHomepage.ar.services.title, subtitle: rtlHomepage.ar.services.subtitle, items: rtlHomepage.ar.services.items, processTitle: rtlHomepage.ar.process.title, processSubtitle: rtlHomepage.ar.process.subtitle, steps: rtlHomepage.ar.process.steps, projectsTitle: rtlHomepage.ar.featuredProjects.title, projectsSubtitle: rtlHomepage.ar.featuredProjects.subtitle },
};

const emptyPlatform: PlatformItem = { title: "", description: "" };
const emptyJournal: JournalItem = { title: "", description: "" };

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function arrayToLines(value?: string[]) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function normalizePlatforms(value?: PlatformItem[]) {
  const items = Array.isArray(value) ? value : [];
  return [0, 1, 2, 3].map((index) => items[index] || emptyPlatform);
}

function normalizeJournal(value?: JournalItem[]) {
  const items = Array.isArray(value) ? value : [];
  return [0, 1, 2].map((index) => items[index] || emptyJournal);
}
function threeItems<T>(value: T[] | undefined, fallback: T): T[] {
  return [0, 1, 2].map(index => value?.[index] || fallback);
}

export default function ContentManager() {
  // The legacy CMS payload contains several historical shapes alongside the current sections.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  const [brand, setBrand] = useState("");

  const [heroEyebrow, setHeroEyebrow] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroPrimaryCta, setHeroPrimaryCta] = useState("");
  const [heroPrimaryCtaHref, setHeroPrimaryCtaHref] = useState("watch");
  const [heroSecondaryCta, setHeroSecondaryCta] = useState("");
  const [heroSecondaryCtaHref, setHeroSecondaryCtaHref] = useState("/platforms");
  const [heroCardTitle, setHeroCardTitle] = useState("");
  const [heroCardSubtitle, setHeroCardSubtitle] = useState("");

  const [whatTitle, setWhatTitle] = useState("");
  const [whatItems, setWhatItems] = useState("");
  const [servicesTitle, setServicesTitle] = useState("");
  const [servicesSubtitle, setServicesSubtitle] = useState("");
  const [services, setServices] = useState<ServiceItem[]>(threeItems(undefined, emptyService));
  const [projectsTitle, setProjectsTitle] = useState("");
  const [projectsSubtitle, setProjectsSubtitle] = useState("");
  const [projects, setProjects] = useState<ProjectItem[]>(threeItems(undefined, emptyProject));
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [processTitle, setProcessTitle] = useState("");
  const [processSubtitle, setProcessSubtitle] = useState("");
  const [processSteps, setProcessSteps] = useState<ServiceItem[]>(threeItems(undefined, emptyService));

  const [whyTitle, setWhyTitle] = useState("");
  const [whyItems, setWhyItems] = useState("");

  const [ecosystemTitle, setEcosystemTitle] = useState("");
  const [ecosystemSubtitle, setEcosystemSubtitle] = useState("");

  const [platforms, setPlatforms] = useState<PlatformItem[]>([
    emptyPlatform,
    emptyPlatform,
    emptyPlatform,
    emptyPlatform,
  ]);

  const [galleryTitle, setGalleryTitle] = useState("");
  const [gallerySubtitle, setGallerySubtitle] = useState("");
  const [galleryItems, setGalleryItems] = useState("");

  const [journalSectionTitle, setJournalSectionTitle] = useState("");
  const [journal, setJournal] = useState<JournalItem[]>([
    emptyJournal,
    emptyJournal,
    emptyJournal,
  ]);

  const [contactTitle, setContactTitle] = useState("");
  const [contactSubtitle, setContactSubtitle] = useState("");
  const [contactNamePlaceholder, setContactNamePlaceholder] = useState("");
  const [contactEmailPlaceholder, setContactEmailPlaceholder] = useState("");
  const [contactMessagePlaceholder, setContactMessagePlaceholder] = useState("");
  const [contactButtonLabel, setContactButtonLabel] = useState("");
  const [contactWhatsappLabel, setContactWhatsappLabel] = useState("");

  const [footerBrandLine, setFooterBrandLine] = useState("");
  const [footerContactTitle, setFooterContactTitle] = useState("");
  const [footerLocation, setFooterLocation] = useState("");
  const [footerEmail, setFooterEmail] = useState("");
  const [footerWhatsappText, setFooterWhatsappText] = useState("");
  const [footerWhatsappNumber, setFooterWhatsappNumber] = useState("");
  const [footerFollowTitle, setFooterFollowTitle] = useState("");
  const [footerInstagram, setFooterInstagram] = useState("");
  const [footerLinkedin, setFooterLinkedin] = useState("");
  const [footerWebsite, setFooterWebsite] = useState("");
  const [footerRights, setFooterRights] = useState("");

  useEffect(() => {
    fetch("/api/content/homepage", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        loadLang(json, "en");
        setLoading(false);
      })
      .catch(() => {
        setData({ en: {}, tr: {}, fa: {}, ar: {} });
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/admin/images", { cache: "no-store" }).then(res => res.json())
      .then(json => setProjectImages(Array.isArray(json?.images?.projects) ? json.images.projects : []))
      .catch(() => {});
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadLang = (json: any, selectedLang: Lang) => {
    const rtlDefaults = selectedLang === "fa" || selectedLang === "ar" ? rtlHomepage[selectedLang] : null;
    const section = rtlDefaults
      ? { ...rtlDefaults, ...json?.[selectedLang], footer: { ...json?.en?.footer, ...rtlDefaults.footer, ...json?.[selectedLang]?.footer } }
      : json?.[selectedLang] || {};

    setBrand(section.brand || "CINENTO");

    setHeroEyebrow(section.hero?.eyebrow || section.heroEyebrow || "CINENTO");
    setHeroTitle(section.hero?.title || section.heroTitle || "");
    setHeroDescription(section.hero?.description || section.heroSubtitle || "");
    setHeroPrimaryCta(section.hero?.primaryCta || section.buttonPrimary || "");
    setHeroPrimaryCtaHref(section.hero?.primaryCtaHref === "#contact" ? "#contact" : "watch");
    setHeroSecondaryCta(section.hero?.secondaryCta || section.buttonSecondary || "");
    setHeroSecondaryCtaHref(section.hero?.secondaryCtaHref === "#contact" ? "#contact" : "/platforms");
    setHeroCardTitle(section.hero?.cardTitle || "CINENTO");
    setHeroCardSubtitle(section.hero?.cardSubtitle || "");

    setWhatTitle(section.whatWeDo?.title || section.whatTitle || "");
    setWhatItems(
      section.whatWeDo?.items
        ? arrayToLines(section.whatWeDo.items)
        : [section.whatItem1, section.whatItem2, section.whatItem3]
            .filter(Boolean)
            .join("\n")
    );
    const defaults = serviceDefaults[selectedLang];
    setServicesTitle(section.services?.title ?? defaults.title);
    setServicesSubtitle(section.services?.subtitle ?? defaults.subtitle);
    setServices(threeItems(section.services?.items ?? defaults.items, emptyService));
    setProjectsTitle(section.featuredProjects?.title ?? defaults.projectsTitle);
    setProjectsSubtitle(section.featuredProjects?.subtitle ?? defaults.projectsSubtitle);
    const savedProjects: ProjectItem[] = Array.isArray(section.featuredProjects?.items) ? section.featuredProjects.items : [];
    const englishProjects: ProjectItem[] = Array.isArray(json?.en?.featuredProjects?.items) ? json.en.featuredProjects.items : [];
    setProjects(selectedLang !== "en" && englishProjects.length
      ? threeItems(englishProjects, emptyProject).map((source, index) => {
          const id = source.id || `project-${index + 1}`;
          const translated = savedProjects.find(item => item.id === id)
            || (!savedProjects.some(item => item.id) ? savedProjects[index] : undefined);
          return { ...emptyProject, ...translated, id, image: source.image || "" };
        })
      : threeItems(savedProjects, emptyProject));
    setProcessTitle(section.process?.title ?? defaults.processTitle);
    setProcessSubtitle(section.process?.subtitle ?? defaults.processSubtitle);
    setProcessSteps(threeItems(section.process?.steps ?? defaults.steps, emptyService));

    setWhyTitle(section.whyCinento?.title || section.whyTitle || "");
    setWhyItems(
      section.whyCinento?.items
        ? arrayToLines(section.whyCinento.items)
        : [section.whyItem1, section.whyItem2, section.whyItem3, section.whyItem4]
            .filter(Boolean)
            .join("\n")
    );

    setEcosystemTitle(section.ecosystem?.title || section.ecosystemTitle || "");
    setEcosystemSubtitle(section.ecosystem?.subtitle || section.ecosystemSubtitle || "");

    setPlatforms(normalizePlatforms(section.platforms));

    setGalleryTitle(section.gallery?.title || section.galleryTitle || "");
    setGallerySubtitle(section.gallery?.subtitle || section.gallerySubtitle || "");
    setGalleryItems(
      section.gallery?.items
        ? arrayToLines(section.gallery.items)
        : [section.galleryItem1, section.galleryItem2, section.galleryItem3]
            .filter(Boolean)
            .join("\n")
    );

    setJournalSectionTitle(section.journalSection?.title || section.journalTitle || "");
    setJournal(normalizeJournal(section.journal));

    setContactTitle(section.contact?.title || section.contactTitle || "");
    setContactSubtitle(section.contact?.subtitle || section.contactSubtitle || "");
    setContactNamePlaceholder(section.contact?.namePlaceholder || "");
    setContactEmailPlaceholder(section.contact?.emailPlaceholder || "");
    setContactMessagePlaceholder(section.contact?.messagePlaceholder || "");
    setContactButtonLabel(section.contact?.buttonLabel || "");
    setContactWhatsappLabel(section.contact?.whatsappLabel || "WhatsApp");

    setFooterBrandLine(section.footer?.brandLine || section.footerText || "");
    setFooterContactTitle(section.footer?.contactTitle || "");
    setFooterLocation(section.footer?.location || "");
    setFooterEmail(section.footer?.email || "");
    setFooterWhatsappText(section.footer?.whatsappText || "");
    setFooterWhatsappNumber(section.footer?.whatsappNumber || "");
    setFooterFollowTitle(section.footer?.followTitle || "");
    setFooterInstagram(section.footer?.social?.instagram || "");
    setFooterLinkedin(section.footer?.social?.linkedin || "");
    setFooterWebsite(section.footer?.social?.website || "");
    setFooterRights(section.footer?.rights || "");
  };

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang);
    loadLang(data, newLang);
  };

  const updatePlatform = (index: number, key: keyof PlatformItem, value: string) => {
    setPlatforms((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    );
  };

  const updateJournal = (index: number, key: keyof JournalItem, value: string) => {
    setJournal((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    );
  };
  const updateItem = <T extends ServiceItem | ProjectItem>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number, key: keyof T, value: string) => {
    setter(prev => prev.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const updated = {
        ...data,
        [lang]: {
          ...data?.[lang],
          brand,
          hero: {
            eyebrow: heroEyebrow,
            title: heroTitle,
            description: heroDescription,
            primaryCta: heroPrimaryCta,
            primaryCtaHref: heroPrimaryCtaHref,
            secondaryCta: heroSecondaryCta,
            secondaryCtaHref: heroSecondaryCtaHref,
            cardTitle: heroCardTitle,
            cardSubtitle: heroCardSubtitle,
          },
          whatWeDo: {
            title: whatTitle,
            items: linesToArray(whatItems),
          },
          services: { title: servicesTitle, subtitle: servicesSubtitle, items: services.filter(item => item.title.trim()) },
          featuredProjects: { title: projectsTitle, subtitle: projectsSubtitle, items: lang !== "en"
            ? projects.map((item, index) => ({ ...item, id: item.id || `project-${index + 1}`, image: data?.en?.featuredProjects?.items?.[index]?.image || "" }))
            : projects.filter(item => item.title.trim()).map((item, index) => ({ ...item, id: item.id || `project-${index + 1}` })) },
          process: { title: processTitle, subtitle: processSubtitle, steps: processSteps.filter(item => item.title.trim()) },
          whyCinento: {
            title: whyTitle,
            items: linesToArray(whyItems),
          },
          ecosystem: {
            title: ecosystemTitle,
            subtitle: ecosystemSubtitle,
          },
          platforms: platforms.filter((item) => item.title.trim() || item.description.trim()),
          gallery: {
            title: galleryTitle,
            subtitle: gallerySubtitle,
            items: linesToArray(galleryItems),
          },
          journalSection: {
            title: journalSectionTitle,
          },
          journal: journal.filter((item) => item.title.trim() || item.description.trim()),
          contact: {
            title: contactTitle,
            subtitle: contactSubtitle,
            namePlaceholder: contactNamePlaceholder,
            emailPlaceholder: contactEmailPlaceholder,
            messagePlaceholder: contactMessagePlaceholder,
            buttonLabel: contactButtonLabel,
            whatsappLabel: contactWhatsappLabel,
          },
          footer: {
            brandLine: footerBrandLine,
            contactTitle: footerContactTitle,
            location: footerLocation,
            email: footerEmail,
            whatsappText: footerWhatsappText,
            whatsappNumber: footerWhatsappNumber.replace(/\D/g, ""),
            followTitle: footerFollowTitle,
            social: {
              instagram: footerInstagram,
              linkedin: footerLinkedin,
              website: footerWebsite,
            },
            rights: footerRights,
          },
        },
      };

      const response = await fetch("/api/content/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      setData(updated);
      alert("Saved successfully");
    } catch {
      alert("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black p-10 text-white">Loading...</div>;

  return (
    <div dir={lang === "fa" || lang === "ar" ? "rtl" : "ltr"} lang={lang} className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-yellow-600">CINENTO CMS</div>
          <h1 className="mt-2 text-3xl font-bold text-yellow-500">Content Manager</h1>
        </div>

        <div className="flex flex-wrap gap-3">
          {(["en", "tr", "fa", "ar"] as Lang[]).map(locale => <button key={locale}
            onClick={() => handleLangChange(locale)} aria-pressed={lang === locale}
            className={`rounded-xl px-5 py-2 font-semibold ${lang === locale ? "bg-yellow-500 text-black" : "bg-neutral-800 text-white"}`}>
            {locale.toUpperCase()}
          </button>)}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Brand">
          <Input label="Brand" value={brand} onChange={setBrand} />
        </Section>

        <Section title="Hero Section">
          <Input label="Eyebrow" value={heroEyebrow} onChange={setHeroEyebrow} />
          <Input label="Hero Title" value={heroTitle} onChange={setHeroTitle} />
          <Textarea label="Hero Description" value={heroDescription} onChange={setHeroDescription} />
          <Input label="Primary Button" value={heroPrimaryCta} onChange={setHeroPrimaryCta} />
          <label className="block text-sm text-neutral-300">Primary Button Destination
            <select value={heroPrimaryCtaHref} onChange={(event) => setHeroPrimaryCtaHref(event.target.value)} className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-900 p-3 text-white">
              <option value="watch">CINENTO Watch</option>
              <option value="#contact">Contact form</option>
            </select>
          </label>
          <Input label="Secondary Button" value={heroSecondaryCta} onChange={setHeroSecondaryCta} />
          <label className="block text-sm text-neutral-300">Secondary Button Destination
            <select value={heroSecondaryCtaHref} onChange={(event) => setHeroSecondaryCtaHref(event.target.value)} className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-900 p-3 text-white">
              <option value="/platforms">Products & Platforms</option>
              <option value="#contact">Contact form</option>
            </select>
          </label>
          <Input label="Hero Card Title" value={heroCardTitle} onChange={setHeroCardTitle} />
          <Input label="Hero Card Subtitle" value={heroCardSubtitle} onChange={setHeroCardSubtitle} />
        </Section>

        <Section title="What We Do">
          <Input label="Section Title" value={whatTitle} onChange={setWhatTitle} />
          <Textarea label="Items - each line is one card" value={whatItems} onChange={setWhatItems} />
        </Section>

        <Section title="Services / خدمات اصلی">
          <Input label="Section title" value={servicesTitle} onChange={setServicesTitle} />
          <Textarea label="Introduction" value={servicesSubtitle} onChange={setServicesSubtitle} />
          {services.map((item, index) => <div key={index} className="rounded-2xl border border-yellow-600/20 p-4">
            <div className="mb-3 text-sm text-yellow-400">Service {index + 1}</div>
            <Input label="Title" value={item.title} onChange={value => updateItem(setServices, index, "title", value)} />
            <Textarea label="Description" value={item.description} onChange={value => updateItem(setServices, index, "description", value)} />
          </div>)}
        </Section>

        <Section title="Selected Projects / پروژه‌های منتخب">
          <p className="text-sm leading-6 text-neutral-400">Only projects with a title appear publicly. Enter a verified title, your role and status. Upload images in Image Manager → Projects, then choose their URL below. Edit EN and TR separately.</p>
          <Input label="Section title" value={projectsTitle} onChange={setProjectsTitle} />
          <Textarea label="Introduction" value={projectsSubtitle} onChange={setProjectsSubtitle} />
          <datalist id="project-images">{projectImages.map(image => <option key={image} value={image} />)}</datalist>
          {projects.map((item, index) => <div key={index} className="space-y-4 rounded-2xl border border-yellow-600/20 p-4">
            <div className="text-sm text-yellow-400">Project {index + 1}{lang !== "en" && data?.en?.featuredProjects?.items?.[index]?.title ? ` · ${data.en.featuredProjects.items[index].title}` : ""}</div>
            <Input label={lang === "tr" ? "Turkish project title" : lang === "fa" ? "عنوان فارسی پروژه" : lang === "ar" ? "عنوان المشروع بالعربية" : "Project title"} value={item.title} onChange={value => updateItem(setProjects, index, "title", value)} />
            <Input label="CINENTO role" value={item.role} onChange={value => updateItem(setProjects, index, "role", value)} />
            <Input label="Verified status" value={item.status} onChange={value => updateItem(setProjects, index, "status", value)} />
            <Textarea label="Short description" value={item.description} onChange={value => updateItem(setProjects, index, "description", value)} />
            <label className="block space-y-2"><span className="text-sm text-neutral-400">{lang !== "en" ? "Shared image (edit in EN)" : "Image URL (choose an uploaded project image)"}</span><input dir="ltr" list="project-images" value={item.image || ""} readOnly={lang !== "en"} onChange={event => updateItem(setProjects, index, "image", event.target.value)} className="w-full rounded-xl border border-yellow-600/20 bg-black px-4 py-3 text-white" /></label>
            {item.image && <img src={item.image} alt={`${item.title || `Project ${index + 1}`} selected artwork`} className="h-36 w-full rounded-xl border border-yellow-600/30 object-contain bg-black" />}
            {lang === "en" && <details className="rounded-xl border border-yellow-600/20 p-3">
              <summary className="cursor-pointer text-sm text-yellow-400">Choose from project image library ({projectImages.length})</summary>
              {projectImages.length ? <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {projectImages.map((image, imageIndex) => <button key={image} type="button" onClick={() => updateItem(setProjects, index, "image", image)} aria-label={`Use project image ${imageIndex + 1} for project ${index + 1}`} aria-pressed={item.image === image} className={`rounded-xl border p-2 text-left text-xs ${item.image === image ? "border-yellow-400 text-yellow-400" : "border-white/20 text-neutral-300"}`}>
                  <img src={image} alt="" loading="lazy" className="mb-2 h-24 w-full rounded-lg bg-black object-cover" />
                  <span>Project image {imageIndex + 1}{item.image === image ? " · Selected" : ""}</span>
                </button>)}
              </div> : <p className="mt-3 text-xs text-neutral-400">No project images loaded yet. Upload in Image Manager → Projects, then refresh this page.</p>}
            </details>}
            {item.image && <div className="break-all text-xs text-neutral-500">{item.image}</div>}
          </div>)}
        </Section>

        <Section title="How It Works / مراحل همکاری">
          <Input label="Section title" value={processTitle} onChange={setProcessTitle} />
          <Textarea label="Introduction" value={processSubtitle} onChange={setProcessSubtitle} />
          {processSteps.map((item, index) => <div key={index} className="rounded-2xl border border-yellow-600/20 p-4">
            <div className="mb-3 text-sm text-yellow-400">Step {index + 1}</div>
            <Input label="Title" value={item.title} onChange={value => updateItem(setProcessSteps, index, "title", value)} />
            <Textarea label="Description" value={item.description} onChange={value => updateItem(setProcessSteps, index, "description", value)} />
          </div>)}
        </Section>

        <Section title="Why CINENTO">
          <Input label="Section Title" value={whyTitle} onChange={setWhyTitle} />
          <Textarea label="Items - each line is one card" value={whyItems} onChange={setWhyItems} />
        </Section>

        <Section title="Ecosystem">
          <Input label="Title" value={ecosystemTitle} onChange={setEcosystemTitle} />
          <Textarea label="Subtitle" value={ecosystemSubtitle} onChange={setEcosystemSubtitle} />
        </Section>

        <Section title="Platforms">
          {platforms.map((item, index) => (
            <div key={index} className="rounded-2xl border border-yellow-600/10 bg-black/30 p-4">
              <div className="mb-3 text-sm font-semibold text-yellow-400">Platform {index + 1}</div>
              <Input label="Title" value={item.title} onChange={(value) => updatePlatform(index, "title", value)} />
              <Textarea label="Description" value={item.description} onChange={(value) => updatePlatform(index, "description", value)} />
            </div>
          ))}
        </Section>

        <Section title="Gallery">
          <Input label="Title" value={galleryTitle} onChange={setGalleryTitle} />
          <Textarea label="Subtitle" value={gallerySubtitle} onChange={setGallerySubtitle} />
          <Textarea label="Items - each line is one frame" value={galleryItems} onChange={setGalleryItems} />
        </Section>

        <Section title="Journal">
          <Input label="Section Title" value={journalSectionTitle} onChange={setJournalSectionTitle} />
          {journal.map((item, index) => (
            <div key={index} className="rounded-2xl border border-yellow-600/10 bg-black/30 p-4">
              <div className="mb-3 text-sm font-semibold text-yellow-400">Journal {index + 1}</div>
              <Input label="Title" value={item.title} onChange={(value) => updateJournal(index, "title", value)} />
              <Textarea label="Description" value={item.description} onChange={(value) => updateJournal(index, "description", value)} />
            </div>
          ))}
        </Section>

        <Section title="Contact">
          <Input label="Title" value={contactTitle} onChange={setContactTitle} />
          <Textarea label="Subtitle" value={contactSubtitle} onChange={setContactSubtitle} />
          <Input label="Name Placeholder" value={contactNamePlaceholder} onChange={setContactNamePlaceholder} />
          <Input label="Email Placeholder" value={contactEmailPlaceholder} onChange={setContactEmailPlaceholder} />
          <Input label="Message Placeholder" value={contactMessagePlaceholder} onChange={setContactMessagePlaceholder} />
          <Input label="Button Label" value={contactButtonLabel} onChange={setContactButtonLabel} />
          <Input label="WhatsApp Label" value={contactWhatsappLabel} onChange={setContactWhatsappLabel} />
        </Section>

        <Section title="Footer Contact & Social">
          <Input label="Brand Line" value={footerBrandLine} onChange={setFooterBrandLine} />
          <Input label="Contact Title" value={footerContactTitle} onChange={setFooterContactTitle} />
          <Input label="Location" value={footerLocation} onChange={setFooterLocation} />
          <Input label="Email" value={footerEmail} onChange={setFooterEmail} />
          <Input label="WhatsApp Text" value={footerWhatsappText} onChange={setFooterWhatsappText} />
          <Input label="WhatsApp Number (country code, no +; leave blank to use email)" value={footerWhatsappNumber} onChange={setFooterWhatsappNumber} />
          <Input label="Follow Title" value={footerFollowTitle} onChange={setFooterFollowTitle} />
          <Input label="Instagram URL" value={footerInstagram} onChange={setFooterInstagram} />
          <Input label="LinkedIn URL" value={footerLinkedin} onChange={setFooterLinkedin} />
          <Input label="Website URL" value={footerWebsite} onChange={setFooterWebsite} />
          <Input label="Rights" value={footerRights} onChange={setFooterRights} />
        </Section>
      </div>

      <div className="sticky bottom-6 mt-8 rounded-2xl border border-yellow-600/20 bg-neutral-950/90 p-4 backdrop-blur">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-xl bg-yellow-500 px-6 py-4 font-bold text-black transition hover:bg-yellow-400 disabled:opacity-60"
        >
          {saving ? "Saving..." : `Save ${lang.toUpperCase()} Changes`}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-3xl border border-yellow-600/20 bg-neutral-950 p-6">
      <h2 className="text-xl font-bold text-yellow-400">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-neutral-400">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-yellow-600/20 bg-black px-4 py-3 text-white outline-none focus:border-yellow-500"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-neutral-400">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full rounded-xl border border-yellow-600/20 bg-black px-4 py-3 text-white outline-none focus:border-yellow-500"
      />
    </label>
  );
}
