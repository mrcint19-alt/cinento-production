/*
File: app/api/admin/images/route.ts
Version: CINENTO Image Manager API v4.0 PRO UI
Updated: 2026-04-30 [Europe/Istanbul]
Status: Upload + List + Active Image + Delete Image
*/

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { catalogSession, sameOrigin } from "../../../../lib/program-catalog";

export const runtime = "nodejs";

const allowedFolders = ["hero", "gallery", "projects"] as const;
type FolderType = (typeof allowedFolders)[number];

const dataPath = path.join(process.cwd(), "app", "data", "images.json");

type ImageMeta = {
  active: Record<FolderType, string>;
};

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

async function readMeta(): Promise<ImageMeta> {
  try {
    const raw = await fs.readFile(dataPath, "utf-8");
    const parsed = JSON.parse(raw);

    return {
      active: {
        hero: parsed?.active?.hero || "",
        gallery: parsed?.active?.gallery || "",
        projects: parsed?.active?.projects || "",
      },
    };
  } catch {
    const initial: ImageMeta = {
      active: { hero: "", gallery: "", projects: "" },
    };

    await fs.mkdir(path.dirname(dataPath), { recursive: true });
    await fs.writeFile(dataPath, JSON.stringify(initial, null, 2), "utf-8");

    return initial;
  }
}

async function writeMeta(meta: ImageMeta) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(meta, null, 2), "utf-8");
}

async function getImagesByFolder(folder: FolderType) {
  const folderPath = path.join(process.cwd(), "public", "images", folder);

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

  return imageFiles
    .sort((a, b) => b.time - a.time)
    .map((item) => `/images/${folder}/${item.file}`);
}

function resolvePublicImagePath(url: string) {
  const cleanUrl = url.replace(/^\/+/, "");
  return path.join(process.cwd(), "public", cleanUrl.replace(/^images\//, "images/"));
}

export async function GET() {
  try {
    const meta = await readMeta();

    const images: Record<FolderType, string[]> = {
      hero: [],
      gallery: [],
      projects: [],
    };

    let metaChanged = false;

    for (const folder of allowedFolders) {
      images[folder] = await getImagesByFolder(folder);

      if (!meta.active[folder] && images[folder].length > 0) {
        meta.active[folder] = images[folder][0];
        metaChanged = true;
      }

      if (meta.active[folder] && !images[folder].includes(meta.active[folder])) {
        meta.active[folder] = images[folder][0] || "";
        metaChanged = true;
      }
    }

    if (metaChanged) {
      await writeMeta(meta);
    }

    return NextResponse.json({
      success: true,
      images,
      active: meta.active,
    });
  } catch (error) {
    console.error("IMAGE_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load images.",
        images: { hero: [], gallery: [], projects: [] },
        active: { hero: "", gallery: "", projects: "" },
      },
      { status: 500 }
    );
  }
}

async function authorizedMutation(req: NextRequest, run: () => Promise<NextResponse>) {
  if (process.env.VERCEL_ENV === "preview" || !sameOrigin(req)) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  const session = catalogSession(req);
  if (!session) return NextResponse.json({ success: false, message: "Administrator access is not configured" }, { status: 503 });
  try {
    const { data, error } = await session.client.auth.getUser();
    if (error || !data.user || !session.allowed(data.user.id)) return session.finish(NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }));
    return session.finish(await run());
  } catch {
    return session.finish(NextResponse.json({ success: false, message: "Request failed" }, { status: 500 }));
  }
}

export async function POST(req: NextRequest) {
  return authorizedMutation(req, () => uploadImage(req));
}

async function uploadImage(req: NextRequest) {
  try {
    const formData = await req.formData();

    const folder = String(formData.get("folder") || "hero") as FolderType;
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

    const uploadDir = path.join(process.cwd(), "public", "images", folder);
    await fs.mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${safeFileName(file.name)}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);

    const url = `/images/${folder}/${filename}`;

    const meta = await readMeta();

    if (!meta.active[folder]) {
      meta.active[folder] = url;
      await writeMeta(meta);
    }

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully.",
      url,
      active: meta.active,
    });
  } catch (error) {
    console.error("IMAGE_UPLOAD_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Upload failed." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  return authorizedMutation(req, () => setActiveImage(req));
}

async function setActiveImage(req: NextRequest) {
  try {
    const body = await req.json();

    const folder = String(body.folder || "hero") as FolderType;
    const url = String(body.url || "");

    if (!allowedFolders.includes(folder)) {
      return NextResponse.json(
        { success: false, message: "Invalid folder." },
        { status: 400 }
      );
    }

    if (!url.startsWith(`/images/${folder}/`)) {
      return NextResponse.json(
        { success: false, message: "Invalid image url." },
        { status: 400 }
      );
    }

    const meta = await readMeta();
    meta.active[folder] = url;
    await writeMeta(meta);

    return NextResponse.json({
      success: true,
      message: "Active image updated.",
      active: meta.active,
    });
  } catch (error) {
    console.error("IMAGE_ACTIVE_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to set active image." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  return authorizedMutation(req, () => deleteImage(req));
}

async function deleteImage(req: NextRequest) {
  try {
    const body = await req.json();

    const folder = String(body.folder || "hero") as FolderType;
    const url = String(body.url || "");

    if (!allowedFolders.includes(folder)) {
      return NextResponse.json(
        { success: false, message: "Invalid folder." },
        { status: 400 }
      );
    }

    if (!url.startsWith(`/images/${folder}/`)) {
      return NextResponse.json(
        { success: false, message: "Invalid image url." },
        { status: 400 }
      );
    }

    const filePath = resolvePublicImagePath(url);

    try {
      await fs.unlink(filePath);
    } catch {
      // file may already be deleted
    }

    const meta = await readMeta();

    if (meta.active[folder] === url) {
      const remainingImages = await getImagesByFolder(folder);
      meta.active[folder] = remainingImages[0] || "";
      await writeMeta(meta);
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted.",
      active: meta.active,
    });
  } catch (error) {
    console.error("IMAGE_DELETE_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete image." },
      { status: 500 }
    );
  }
}
