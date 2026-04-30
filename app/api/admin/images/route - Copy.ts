/**
 * File: app/api/admin/images/route.ts
 * Project: CINENTO SITE
 * Version: v1.0
 * Updated: 2026-04-29 [Europe/Istanbul]
 * Status: PRO IMAGE UPLOAD API
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
  try {
    const basePath = path.join(process.cwd(), "public", "images");
    const result: Record<string, string[]> = {};

    for (const folder of allowedFolders) {
      const folderPath = path.join(basePath, folder);

      try {
        const files = await fs.readdir(folderPath);
        result[folder] = files
          .filter((file) => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
          .map((file) => `/images/${folder}/${file}`);
      } catch {
        result[folder] = [];
      }
    }

    return NextResponse.json({ success: true, images: result });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to load images." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const folder = String(formData.get("folder") || "gallery");
    const file = formData.get("file") as File | null;

    if (!allowedFolders.includes(folder)) {
      return NextResponse.json(
        { success: false, message: "Invalid folder." },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "images", folder);
    await fs.mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const filename = `${timestamp}-${safeFileName(file.name)}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully.",
      url: `/images/${folder}/${filename}`,
    });
  } catch (error) {
    console.error("IMAGE UPLOAD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed." },
      { status: 500 }
    );
  }
}