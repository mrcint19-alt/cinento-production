/*
File: app/[lang]/admin/images/page.tsx
Version: CINENTO Image Manager UI v4.0 PRO
Updated: 2026-04-30 [Europe/Istanbul]
Status: Netflix-Level UI + Upload + Preview + Set Active + Delete
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

type ActiveData = {
  hero: string;
  gallery: string;
  projects: string;
};

export default function ImageManagerPage() {
  const [folder, setFolder] = useState<FolderType>("hero");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [images, setImages] = useState<ImagesData>({
    hero: [],
    gallery: [],
    projects: [],
  });

  const [active, setActive] = useState<ActiveData>({
    hero: "",
    gallery: "",
    projects: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  async function loadImages() {
    try {
      const res = await fetch("/api/admin/images", { cache: "no-store" });
      const data = await res.json();

      if (data.success) {
        setImages({
          hero: data.images.hero || [],
          gallery: data.images.gallery || [],
          projects: data.images.projects || [],
        });

        setActive({
          hero: data.active?.hero || "",
          gallery: data.active?.gallery || "",
          projects: data.active?.projects || "",
        });
      } else {
        setMessage(data.message || "Could not load images.");
      }
    } catch {
      setMessage("Could not load images.");
    }
  }

  useEffect(() => {
    loadImages();
  }, []);

  function handleFileChange(selectedFile: File | null) {
    setFile(selectedFile);

    if (!selectedFile) {
      setPreview("");
      return;
    }

    const localUrl = URL.createObjectURL(selectedFile);
    setPreview(localUrl);
  }

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
        setPreview("");
        await loadImages();
      } else {
        setMessage(data.message || "Upload failed.");
      }
    } catch {
      setMessage("Upload failed.");
    }

    setLoading(false);
  }

  async function setActiveImage(section: FolderType, url: string) {
    setActionLoading(`active-${url}`);
    setMessage("");

    try {
      const res = await fetch("/api/admin/images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: section, url }),
      });

      const data = await res.json();

      if (data.success) {
        setActive({
          hero: data.active?.hero || "",
          gallery: data.active?.gallery || "",
          projects: data.active?.projects || "",
        });

        setMessage(`Active ${section} image updated.`);
        await loadImages();
      } else {
        setMessage(data.message || "Could not set active image.");
      }
    } catch {
      setMessage("Could not set active image.");
    }

    setActionLoading("");
  }

  async function deleteImage(section: FolderType, url: string) {
    const confirmed = confirm("Delete this image?");
    if (!confirmed) return;

    setActionLoading(`delete-${url}`);
    setMessage("");

    try {
      const res = await fetch("/api/admin/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: section, url }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Image deleted.");
        await loadImages();
      } else {
        setMessage(data.message || "Delete failed.");
      }
    } catch {
      setMessage("Delete failed.");
    }

    setActionLoading("");
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-[#d4af37]">
              CINENTO
            </p>
            <h1 className="text-4xl font-bold">Image Manager PRO</h1>
            <p className="mt-3 max-w-2xl text-neutral-400">
              Upload, preview, activate and delete website images from one cinematic control panel.
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
          className="mb-10 rounded-3xl border border-white/10 bg-neutral-900/80 p-6 shadow-2xl"
        >
          <div className="grid gap-5 lg:grid-cols-[220px_1fr_220px]">
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
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
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

          {preview && (
            <div className="mt-6 grid gap-4 md:grid-cols-[280px_1fr]">
              <img
                src={preview}
                alt="Preview"
                className="h-44 w-full rounded-2xl border border-[#d4af37]/30 object-cover"
              />
              <div className="rounded-2xl border border-white/10 bg-black p-5">
                <div className="mb-2 text-sm text-[#d4af37]">Preview Ready</div>
                <div className="text-sm text-neutral-400">
                  This image will be uploaded to:
                </div>
                <div className="mt-2 text-sm font-semibold text-white">
                  /public/images/{folder}
                </div>
              </div>
            </div>
          )}

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
              className="rounded-3xl border border-white/10 bg-neutral-900/80 p-6 shadow-xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-semibold capitalize text-[#d4af37]">
                  {section}
                </h2>

                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-400">
                  {images[section].length} images
                </span>
              </div>

              {active[section] && (
                <div className="mb-5 rounded-xl border border-[#d4af37]/30 bg-black/40 px-4 py-3 text-sm text-[#d4af37]">
                  Active {section}: {active[section]}
                </div>
              )}

              {images[section].length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-8 text-neutral-500">
                  No images uploaded yet.
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-3">
                  {images[section].map((src) => {
                    const isActive = active[section] === src;

                    return (
                      <div
                        key={src}
                        className={`overflow-hidden rounded-2xl border bg-black transition ${
                          isActive ? "border-[#d4af37]" : "border-white/10"
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={src}
                            alt={section}
                            className="h-56 w-full object-cover"
                          />

                          {isActive && (
                            <div className="absolute left-3 top-3 rounded-full bg-[#d4af37] px-3 py-1 text-xs font-bold text-black">
                              ACTIVE
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 p-4">
                          <div className="break-all text-xs text-neutral-400">
                            {src}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveImage(section, src)}
                              disabled={isActive || actionLoading === `active-${src}`}
                              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                isActive
                                  ? "bg-[#d4af37] text-black"
                                  : "border border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
                              } disabled:opacity-60`}
                            >
                              {isActive
                                ? "Active"
                                : actionLoading === `active-${src}`
                                ? "Setting..."
                                : section === "hero"
                                ? "Set as Hero"
                                : `Set as ${section}`}
                            </button>

                            <a
                              href={src}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-neutral-300 hover:border-[#d4af37] hover:text-[#d4af37]"
                            >
                              Open
                            </a>

                            <button
                              type="button"
                              onClick={() => deleteImage(section, src)}
                              disabled={actionLoading === `delete-${src}`}
                              className="rounded-lg border border-red-500/50 px-3 py-2 text-xs text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-60"
                            >
                              {actionLoading === `delete-${src}`
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}