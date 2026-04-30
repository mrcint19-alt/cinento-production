/*
File: app/[lang]/admin/images/page.tsx
Version: CINENTO Image Manager UI v2.0 PRO
Updated: 2026-04-30 [Europe/Istanbul]
Status: Upload + Preview + Hero/Gallery/Projects Manager
*/

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type FolderType = "hero" | "gallery" | "projects";

type ImagesData = {
  hero: string[];
  gallery: string[];
  projects: string[];
};

export default function ImageManagerPage() {
  const [folder, setFolder] = useState<FolderType>("hero");
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<ImagesData>({
    hero: [],
    gallery: [],
    projects: [],
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadImages() {
    try {
      const res = await fetch("/api/admin/images", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setImages({
          hero: data.images.hero || [],
          gallery: data.images.gallery || [],
          projects: data.images.projects || [],
        });
      }
    } catch {
      setMessage("Could not load images.");
    }
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file) {
      setMessage("Please choose an image first.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("folder", folder);
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`Uploaded successfully: ${data.url}`);
        setFile(null);
        await loadImages();
      } else {
        setMessage(data.message || "Upload failed.");
      }
    } catch {
      setMessage("Upload failed.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#070707] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-[#d4af37]">
              CINENTO
            </p>

            <h1 className="text-4xl font-bold">Image Manager PRO</h1>

            <p className="mt-3 max-w-2xl text-neutral-400">
              Upload and manage Hero, Gallery and Project images for the CINENTO website.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/en/dashboard"
              className="rounded-xl border border-[#d4af37]/50 px-4 py-2 text-sm text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
            >
              Back to Dashboard
            </Link>

            <Link
              href="/en"
              className="rounded-xl bg-[#d4af37] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
            >
              View Website
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleUpload}
          className="mb-10 rounded-2xl border border-white/10 bg-neutral-900/80 p-6 shadow-xl"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value as FolderType)}
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#d4af37]"
            >
              <option value="hero">Hero</option>
              <option value="gallery">Gallery</option>
              <option value="projects">Projects</option>
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#d4af37]"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#d4af37] px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload Image"}
            </button>
          </div>

          {message && (
            <div className="mt-5 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-neutral-300">
              {message}
            </div>
          )}
        </form>

        <div className="grid gap-8">
          {(["hero", "gallery", "projects"] as FolderType[]).map((section) => (
            <section
              key={section}
              className="rounded-2xl border border-white/10 bg-neutral-900/80 p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-semibold capitalize text-[#d4af37]">
                  {section}
                </h2>

                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-400">
                  {images[section].length} images
                </span>
              </div>

              {images[section].length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-8 text-neutral-500">
                  No images uploaded yet.
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-3">
                  {images[section].map((src) => (
                    <div
                      key={src}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-black"
                    >
                      <img
                        src={src}
                        alt={section}
                        className="h-52 w-full object-cover"
                      />

                      <div className="space-y-2 p-4">
                        <div className="break-all text-xs text-neutral-400">
                          {src}
                        </div>

                        <a
                          href={src}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block rounded-lg border border-[#d4af37]/50 px-3 py-1 text-xs text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
                        >
                          Open Image
                        </a>
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