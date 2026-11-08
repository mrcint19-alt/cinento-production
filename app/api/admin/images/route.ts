import { NextRequest, NextResponse } from "next/server";
import legacyMeta from "../../../data/images.json";
import { catalogSession, publicCatalogClient, readBoundedJson, sameOrigin } from "../../../../lib/program-catalog";

export const dynamic = "force-dynamic";
const BUCKET = "site-homepage-media";
const TABLE = "site_homepage_media";
const MAX_BYTES = 4 * 1024 * 1024;
const FOLDERS = ["hero", "gallery", "projects"] as const;
type Folder = (typeof FOLDERS)[number];
type Media = { url: string; folder: Folder; storage_path: string | null; is_active: boolean };
const legacy: Record<Folder, string[]> = {
  hero: [legacyMeta.active.hero, "/images/hero/1777547550890-cinento-app-icon-design.png"],
  // The former gallery-3.jpg is only 154 px wide. Keep the file but do not show it.
  gallery: ["/images/gallery/gallery-1.JPG", "/images/gallery/gallery-2.jpg", "/images/gallery/gallery-4.jpg"],
  projects: ["/images/projects/project-1.jpg", "/images/projects/project-2.jpg", "/images/projects/project-3.jpg"],
};
function isFolder(value: unknown): value is Folder { return FOLDERS.includes(value as Folder); }
function imageType(bytes: Uint8Array) {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
      bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return { mime: "image/png", ext: "png" };
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return { mime: "image/webp", ext: "webp" };
  return null;
}

export async function GET() {
  const client = publicCatalogClient();
  if (process.env.VERCEL_ENV === "preview" || !client)
    return NextResponse.json({ success: true, images: legacy, active: legacyMeta.active }, { headers: { "Cache-Control": "no-store" } });
  const { data, error } = await client.from(TABLE).select("url,folder,storage_path,is_active").order("created_at", { ascending: false });
  // Show the built-in images while the persistent media table is being provisioned.
  if (error) return NextResponse.json({ success: true, images: legacy, active: legacyMeta.active }, { headers: { "Cache-Control": "no-store", "X-CINENTO-Source": "snapshot" } });
  const rows = data as Media[];
  const images: Record<Folder, string[]> = { hero: [], gallery: [], projects: [] };
  const active: Record<Folder, string> = { ...legacyMeta.active };
  for (const folder of FOLDERS) {
    images[folder] = [...rows.filter(row => row.folder === folder && row.storage_path).map(row => row.url), ...legacy[folder]];
    const selected = rows.find(row => row.folder === folder && row.is_active);
    if (selected) active[folder] = selected.url;
  }
  return NextResponse.json({ success: true, images, active }, { headers: { "Cache-Control": "no-store" } });
}

async function authorize(request: NextRequest) {
  if (process.env.VERCEL_ENV === "preview" || !sameOrigin(request)) return null;
  const session = catalogSession(request);
  if (!session) return null;
  const { data, error } = await session.client.auth.getUser();
  return !error && data.user && session.allowed(data.user.id) ? session : null;
}

async function currentActive(client: NonNullable<ReturnType<typeof publicCatalogClient>>) {
  const active: Record<Folder, string> = { ...legacyMeta.active };
  const { data } = await client.from(TABLE).select("url,folder").eq("is_active", true).order("created_at", { ascending: false });
  for (const row of data ?? []) if (isFolder(row.folder) && active[row.folder] === legacyMeta.active[row.folder]) active[row.folder] = row.url;
  return active;
}

export async function POST(request: NextRequest) {
  const session = await authorize(request);
  if (!session) return NextResponse.json({ success: false, message: "Administrator login required" }, { status: 401 });
  const length = Number(request.headers.get("content-length"));
  if (!Number.isFinite(length) || length <= 0 || length > MAX_BYTES + 100_000)
    return session.finish(NextResponse.json({ success: false, message: "Image must be smaller than 4 MB" }, { status: 413 }));
  try {
    const form = await request.formData();
    const folder = form.get("folder");
    const file = form.get("file");
    if (!isFolder(folder) || !(file instanceof File) || file.size === 0 || file.size > MAX_BYTES)
      return session.finish(NextResponse.json({ success: false, message: "Select a PNG, JPG or WebP image under 4 MB" }, { status: 400 }));
    const bytes = new Uint8Array(await file.arrayBuffer());
    const type = imageType(bytes);
    if (!type || type.mime !== file.type)
      return session.finish(NextResponse.json({ success: false, message: "Invalid image format" }, { status: 400 }));
    const storagePath = `${folder}/${crypto.randomUUID()}.${type.ext}`;
    const uploaded = await session.client.storage.from(BUCKET).upload(storagePath, bytes, { contentType: type.mime, upsert: false });
    if (uploaded.error) return session.finish(NextResponse.json({ success: false, message: "Image storage is unavailable" }, { status: 503 }));
    const { data: publicImage } = session.client.storage.from(BUCKET).getPublicUrl(storagePath);
    const url = publicImage.publicUrl;
    const saved = await session.client.from(TABLE).insert({ url, folder, storage_path: storagePath });
    if (saved.error) {
      await session.client.storage.from(BUCKET).remove([storagePath]);
      return session.finish(NextResponse.json({ success: false, message: "Image record could not be saved" }, { status: 503 }));
    }
    return session.finish(NextResponse.json({ success: true, url, active: await currentActive(session.client) }));
  } catch {
    return session.finish(NextResponse.json({ success: false, message: "Invalid upload" }, { status: 400 }));
  }
}

export async function PATCH(request: NextRequest) {
  const session = await authorize(request);
  if (!session) return NextResponse.json({ success: false, message: "Administrator login required" }, { status: 401 });
  try {
    const { folder, url } = await readBoundedJson(request, 2048);
    if (!isFolder(folder) || typeof url !== "string") throw new Error("Invalid image");
    const { data: stored, error } = await session.client.from(TABLE).select("url").eq("url", url).eq("folder", folder).maybeSingle();
    if (error || (!stored && !legacy[folder].includes(url))) throw new Error("Unknown image");
    const cleared = await session.client.from(TABLE).update({ is_active: false }).eq("folder", folder).eq("is_active", true);
    if (cleared.error) throw new Error("Unable to select image");
    const saved = stored
      ? await session.client.from(TABLE).update({ is_active: true }).eq("url", url)
      : await session.client.from(TABLE).insert({ url, folder, storage_path: null, is_active: true });
    if (saved.error) throw new Error("Unable to select image");
    return session.finish(NextResponse.json({ success: true, active: await currentActive(session.client) }));
  } catch {
    return session.finish(NextResponse.json({ success: false, message: "Could not select this image" }, { status: 400 }));
  }
}

export async function DELETE(request: NextRequest) {
  const session = await authorize(request);
  if (!session) return NextResponse.json({ success: false, message: "Administrator login required" }, { status: 401 });
  try {
    const { folder, url } = await readBoundedJson(request, 2048);
    if (!isFolder(folder) || typeof url !== "string") throw new Error("Invalid image");
    const { data: row, error } = await session.client.from(TABLE).select("storage_path").eq("url", url).eq("folder", folder).maybeSingle();
    if (error || !row?.storage_path) throw new Error("Built-in images cannot be deleted");
    const removed = await session.client.from(TABLE).delete().eq("url", url);
    if (removed.error) throw new Error("Delete failed");
    await session.client.storage.from(BUCKET).remove([row.storage_path]);
    return session.finish(NextResponse.json({ success: true, active: await currentActive(session.client) }));
  } catch {
    return session.finish(NextResponse.json({ success: false, message: "This image cannot be deleted" }, { status: 400 }));
  }
}
