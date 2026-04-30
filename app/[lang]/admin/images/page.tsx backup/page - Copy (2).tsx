"use client";

import { useState } from "react";

export default function ImageManagerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState("hero");

  const handleUpload = async () => {
    if (!file) {
      alert("Select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      alert("Uploaded!");
      window.location.reload();
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Image Manager</h1>

      <div className="flex gap-4 items-center">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-black border p-2 rounded"
        >
          <option value="hero">Hero</option>
          <option value="gallery">Gallery</option>
          <option value="projects">Projects</option>
        </select>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="bg-black border p-2 rounded"
        />

        <button
          onClick={handleUpload}
          className="bg-yellow-500 text-black px-4 py-2 rounded"
        >
          Upload Image
        </button>
      </div>
    </div>
  );
}