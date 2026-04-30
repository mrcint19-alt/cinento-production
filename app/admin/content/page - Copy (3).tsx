"use client";

/*
File: app/admin/content/page.tsx
Version: v3.0 HERO FULL CMS
Updated: 2026-04-29 [Europe/Istanbul]
Status: FULL HERO EDIT READY (Title + Subtitle + Buttons)
*/

import { useEffect, useState } from "react";

type Lang = "en" | "tr";

export default function ContentManager() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [lang, setLang] = useState<Lang>("en");

  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [buttonPrimary, setButtonPrimary] = useState("");
  const [buttonSecondary, setButtonSecondary] = useState("");

  useEffect(() => {
    fetch("/api/content/homepage")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        loadLang(json, lang);
        setLoading(false);
      });
  }, []);

  const loadLang = (json: any, selectedLang: Lang) => {
    const section = json[selectedLang] || {};

    setHeroTitle(section.heroTitle || "");
    setHeroSubtitle(section.heroSubtitle || "");
    setButtonPrimary(section.buttonPrimary || "");
    setButtonSecondary(section.buttonSecondary || "");
  };

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang);
    loadLang(data, newLang);
  };

  const handleSave = async () => {
    const updated = {
      ...data,
      [lang]: {
        ...data[lang],
        heroTitle,
        heroSubtitle,
        buttonPrimary,
        buttonSecondary,
      },
    };

    await fetch("/api/content/homepage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updated),
    });

    alert("Saved successfully");
  };

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-8 text-yellow-500">
        Content Manager
      </h1>

      {/* Language Switch */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => handleLangChange("en")}
          className={`px-4 py-2 rounded ${
            lang === "en" ? "bg-yellow-500 text-black" : "bg-gray-800"
          }`}
        >
          EN
        </button>

        <button
          onClick={() => handleLangChange("tr")}
          className={`px-4 py-2 rounded ${
            lang === "tr" ? "bg-yellow-500 text-black" : "bg-gray-800"
          }`}
        >
          TR
        </button>
      </div>

      <div className="space-y-6 max-w-xl">

        {/* HERO TITLE */}
        <div>
          <label className="block mb-2 text-sm text-gray-400">
            Hero Title ({lang})
          </label>
          <input
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded"
          />
        </div>

        {/* HERO SUBTITLE */}
        <div>
          <label className="block mb-2 text-sm text-gray-400">
            Hero Subtitle ({lang})
          </label>
          <textarea
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded"
          />
        </div>

        {/* PRIMARY BUTTON */}
        <div>
          <label className="block mb-2 text-sm text-gray-400">
            Primary Button ({lang})
          </label>
          <input
            value={buttonPrimary}
            onChange={(e) => setButtonPrimary(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded"
          />
        </div>

        {/* SECONDARY BUTTON */}
        <div>
          <label className="block mb-2 text-sm text-gray-400">
            Secondary Button ({lang})
          </label>
          <input
            value={buttonSecondary}
            onChange={(e) => setButtonSecondary(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded"
          />
        </div>

        {/* SAVE */}
        <button
          onClick={handleSave}
          className="bg-yellow-500 text-black px-6 py-3 rounded font-bold"
        >
          Save Changes
        </button>

      </div>
    </div>
  );
}