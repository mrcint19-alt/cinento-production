"use client";

/*
File: app/admin/content/page.tsx
Version: v4.1 FULL HOMEPAGE CMS + SOCIAL LINKS
Updated: 2026-04-29 [Europe/Istanbul]
Status: HERO + WHAT WE DO + WHY + ECOSYSTEM + PLATFORMS + GALLERY + JOURNAL + CONTACT + FOOTER + SOCIAL LINKS
*/

import { useEffect, useState } from "react";

type Lang = "en" | "tr";

type PlatformItem = {
  title: string;
  description: string;
};

type JournalItem = {
  title: string;
  description: string;
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

export default function ContentManager() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  const [brand, setBrand] = useState("");

  const [heroEyebrow, setHeroEyebrow] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroPrimaryCta, setHeroPrimaryCta] = useState("");
  const [heroSecondaryCta, setHeroSecondaryCta] = useState("");
  const [heroCardTitle, setHeroCardTitle] = useState("");
  const [heroCardSubtitle, setHeroCardSubtitle] = useState("");

  const [whatTitle, setWhatTitle] = useState("");
  const [whatItems, setWhatItems] = useState("");

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
  const [footerFollowTitle, setFooterFollowTitle] = useState("");
  const [footerRights, setFooterRights] = useState("");
  const [footerInstagram, setFooterInstagram] = useState("");
  const [footerLinkedin, setFooterLinkedin] = useState("");
  const [footerWebsite, setFooterWebsite] = useState("");

  useEffect(() => {
    fetch("/api/content/homepage", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        loadLang(json, "en");
        setLoading(false);
      })
      .catch(() => {
        setData({ en: {}, tr: {} });
        setLoading(false);
      });
  }, []);

  const loadLang = (json: any, selectedLang: Lang) => {
    const section = json?.[selectedLang] || {};

    setBrand(section.brand || "CINENTO");

    setHeroEyebrow(section.hero?.eyebrow || section.heroEyebrow || "CINENTO");
    setHeroTitle(section.hero?.title || section.heroTitle || "");
    setHeroDescription(section.hero?.description || section.heroSubtitle || "");
    setHeroPrimaryCta(section.hero?.primaryCta || section.buttonPrimary || "");
    setHeroSecondaryCta(section.hero?.secondaryCta || section.buttonSecondary || "");
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
    setFooterFollowTitle(section.footer?.followTitle || "");
    setFooterRights(section.footer?.rights || "");
    setFooterInstagram(section.footer?.social?.instagram || "");
    setFooterLinkedin(section.footer?.social?.linkedin || "");
    setFooterWebsite(section.footer?.social?.website || "");
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
            secondaryCta: heroSecondaryCta,
            cardTitle: heroCardTitle,
            cardSubtitle: heroCardSubtitle,
          },
          whatWeDo: {
            title: whatTitle,
            items: linesToArray(whatItems),
          },
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
            followTitle: footerFollowTitle,
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
    <div className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-yellow-600">CINENTO CMS</div>
          <h1 className="mt-2 text-3xl font-bold text-yellow-500">Content Manager</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleLangChange("en")}
            className={`rounded-xl px-5 py-2 font-semibold ${
              lang === "en" ? "bg-yellow-500 text-black" : "bg-neutral-800 text-white"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => handleLangChange("tr")}
            className={`rounded-xl px-5 py-2 font-semibold ${
              lang === "tr" ? "bg-yellow-500 text-black" : "bg-neutral-800 text-white"
            }`}
          >
            TR
          </button>
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
          <Input label="Secondary Button" value={heroSecondaryCta} onChange={setHeroSecondaryCta} />
          <Input label="Hero Card Title" value={heroCardTitle} onChange={setHeroCardTitle} />
          <Input label="Hero Card Subtitle" value={heroCardSubtitle} onChange={setHeroCardSubtitle} />
        </Section>

        <Section title="What We Do">
          <Input label="Section Title" value={whatTitle} onChange={setWhatTitle} />
          <Textarea label="Items - each line is one card" value={whatItems} onChange={setWhatItems} />
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

        <Section title="Footer">
          <Input label="Brand Line" value={footerBrandLine} onChange={setFooterBrandLine} />
          <Input label="Contact Title" value={footerContactTitle} onChange={setFooterContactTitle} />
          <Input label="Follow Title" value={footerFollowTitle} onChange={setFooterFollowTitle} />
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
