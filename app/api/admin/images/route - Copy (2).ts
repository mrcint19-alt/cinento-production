/*
File: app/api/admin/images/route.ts
Version: CINENTO Image Manager API v2.0 PRO
Updated: 2026-04-30 [Europe/Istanbul]
Status: Upload + List Images
*/

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const allowedFolders = ["hero", "gallery", "projects"];

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

export async function GET() {
  const basePath = path.join(process.cwd(), "public", "images");

  const images: Record<string, string[]> = {
    hero: [],
    gallery: [],
    projects: [],
  };

  for (const folder of allowedFolders) {
    const folderPath = path.join(basePath, folder);

    try {
      await fs.mkdir(folderPath, { recursive: true });
      const files = await fs.readdir(folderPath);
  const imageFiles = await Promise.all(
  files
    .filter((file) => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
    .map(async (file) => {
      const filePath = path.join(folderPath, file);
      const stat = await fs.stat(filePath);

      return {
        file,
        time: stat.mtimeMs,
      };
    })
);

images[folder] = imageFiles
  .sort((a, b) => b.time - a.time)
  .map((item) => `/images/${folder}/${item.file}`);
    } catch {
      images[folder] = [];
    }
  }

  return NextResponse.json({
    success: true,
    images,
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const folder = String(formData.get("folder") || "hero");
    const file = formData.get("file") as File | null;

    if (!allowedFolders.includes(folder)) {
      return NextResponse.json(
        { success: false, message: "Invalid folder." },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file selected." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "images",
      folder
    );

    await fs.mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${safeFileName(file.name)}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully.",
      url: `/images/${folder}/${filename}`,
    });
  } catch (error) {
    console.error("IMAGE_UPLOAD_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Upload failed." },
      { status: 500 }
    );
  }
}