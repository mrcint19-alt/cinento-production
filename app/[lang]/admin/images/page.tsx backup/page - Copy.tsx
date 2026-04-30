/**
 * File: app/[lang]/admin/images/page.tsx
 * Project: CINENTO SITE
 * Version: v1.0
 * Updated: 2026-04-29 [Europe/Istanbul]
 * Status: PRO IMAGE MANAGER UI
 */

"use client";

import { useEffect, useState } from "react";

type ImagesData = {
  hero: string[];
  gallery: string[];
  projects: string[];
};

export default function ImageManagerPage() {
  const [folder, setFolder] = useState("hero");
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<ImagesData>({
    hero: [],
    gallery: [],
    projects: [],
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadImages() {
    const res = await fetch("/api/admin/images");
    const data = await res.json();

    if (data.success) {
      setImages(data.images);
    }
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function uploadImage(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      setMessage("Please select an image first.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("folder", folder);
    formData.append("file", file);

    const res = await fetch("/api/admin/images", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setMessage(`Uploaded: ${data.url}`);
      setFile(null);
      await loadImages();
    } else {
      setMessage(data.message || "Upload failed.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-sm uppercase tracking-[0.25em] text-yellow-400">
          CINENTO
        </p>

        <h1 className="mb-4 text-4xl font-bold">Image Manager</h1>

        <p className="mb-8 max-w-2xl text-gray-400">
          Upload and manage website images for Hero, Gallery and Projects.
        </p>

        <form
          onSubmit={uploadImage}
          className="mb-10 rounded-2xl border border-neutral-800 bg-[#111] p-6"
        >
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="rounded-lg border border-neutral-700 bg-black px-4 py-3 text-white"
            >
              <option value="hero">Hero</option>
              <option value="gallery">Gallery</option>
              <option value="projects">Projects</option>
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="rounded-lg border border-neutral-700 bg-black px-4 py-3 text-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-yellow-500 px-4 py-3 font-semibold text-black disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Upload Image"}
            </button>
          </div>

          {message && (
            <div className="rounded-lg border border-neutral-700 bg-black px-4 py-3 text-sm text-gray-300">
              {message}
            </div>
          )}
        </form>

        <div className="grid gap-8">
          {(["hero", "gallery", "projects"] as const).map((section) => (
            <section
              key={section}
              className="rounded-2xl border border-neutral-800 bg-[#111] p-6"
            >
              <h2 className="mb-4 text-2xl font-semibold capitalize">
                {section}
              </h2>

              {images[section].length === 0 ? (
                <p className="text-gray-500">No images uploaded yet.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  {images[section].map((src) => (
                    <div
                      key={src}
                      className="overflow-hidden rounded-xl border border-neutral-800 bg-black"
                    >
                      <img
                        src={src}
                        alt={section}
                        className="h-48 w-full object-cover"
                      />
                      <div className="p-3 text-xs text-gray-400">
                        {src}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}