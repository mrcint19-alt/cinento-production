"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type ContentType = any;

export default function HomePage() {
  const params = useParams();
  const lang = params.lang as string;

  const [content, setContent] = useState<ContentType | null>(null);

  useEffect(() => {
    fetch("/api/content/homepage")
      .then((res) => res.json())
      .then((data) => {
        setContent(data[lang]);
      });
  }, [lang]);

  if (!content) return null;

  return (
    <main className="bg-black text-white">

      {/* HERO */}
      <section className="py-20 text-center">
        <h4 className="text-yellow-500 mb-2">{content.hero.eyebrow}</h4>
        <h1 className="text-4xl font-bold mb-4">{content.hero.title}</h1>
        <p className="max-w-xl mx-auto mb-6">{content.hero.description}</p>

        <div className="flex justify-center gap-4">
          <button className="bg-yellow-500 px-6 py-2 rounded">
            {content.hero.primaryCta}
          </button>
          <button className="border px-6 py-2 rounded">
            {content.hero.secondaryCta}
          </button>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="py-16 text-center">
        <h2 className="text-2xl mb-6">{content.whatWeDo.title}</h2>
        <div className="space-y-2">
          {content.whatWeDo.items.map((item: string, i: number) => (
            <p key={i}>{item}</p>
          ))}
        </div>
      </section>

      {/* WHY CINENTO */}
      <section className="py-16 text-center">
        <h2 className="text-2xl mb-6">{content.whyCinento.title}</h2>
        <div className="space-y-2">
          {content.whyCinento.items.map((item: string, i: number) => (
            <p key={i}>{item}</p>
          ))}
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="py-16 text-center">
        <h2 className="text-2xl mb-4">{content.ecosystem.title}</h2>
        <p>{content.ecosystem.subtitle}</p>
      </section>

      {/* PLATFORMS */}
      <section className="py-16 text-center">
        <h2 className="text-2xl mb-6">Platforms</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
          {content.platforms.map((p: any, i: number) => (
            <div key={i} className="border p-4 rounded-xl">
              <h3 className="text-lg font-bold mb-2">{p.title}</h3>
              <p>{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🎬 GALLERY (نسخه حرفه‌ای) */}
      <section id="gallery" className="py-20 px-6">
        <h2 className="text-3xl text-center mb-4">
          {content.gallery.title}
        </h2>

        <p className="text-center mb-10 opacity-70">
          {content.gallery.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.gallery.images?.map((img: string, i: number) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border hover:scale-105 transition"
            >
              <img
                src={img}
                alt="gallery"
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* JOURNAL */}
      <section className="py-16 text-center">
        <h2 className="text-2xl mb-6">
          {content.journalSection.title}
        </h2>

        <div className="grid md:grid-cols-3 gap-6 px-6">
          {content.journal.map((j: any, i: number) => (
            <div key={i} className="border p-4 rounded-xl">
              <h3 className="mb-2 font-bold">{j.title}</h3>
              <p>{j.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-16 text-center">
        <h2 className="text-2xl mb-4">{content.contact.title}</h2>
        <p className="mb-6">{content.contact.subtitle}</p>

        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <input placeholder={content.contact.namePlaceholder} className="p-2" />
          <input placeholder={content.contact.emailPlaceholder} className="p-2" />
          <textarea placeholder={content.contact.messagePlaceholder} className="p-2" />

          <button className="bg-yellow-500 py-2">
            {content.contact.buttonLabel}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center border-t mt-10">
        <p>{content.footer.brandLine}</p>
        <p className="text-sm opacity-50 mt-2">
          {content.footer.rights}
        </p>
      </footer>

    </main>
  );
}