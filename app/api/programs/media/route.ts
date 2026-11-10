import { NextRequest, NextResponse } from "next/server";
import { catalogSession, sameOrigin } from "../../../../lib/program-catalog";

export const dynamic = "force-dynamic";
const BUCKET = "site-program-media";
const MAX_BYTES = 4 * 1024 * 1024;
const MAX_REQUEST = MAX_BYTES + 100_000;

function imageType(bytes: Uint8Array): { mime: string; extension: string } | null {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
      bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return { mime: "image/png", extension: "png" };
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { mime: "image/jpeg", extension: "jpg" };
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return { mime: "image/webp", extension: "webp" };
  return null;
}

export async function POST(request: NextRequest) {
  if (process.env.VERCEL_ENV === "preview") return NextResponse.json({ error: "Preview is read-only" }, { status: 403 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const session = catalogSession(request);
  if (!session) return NextResponse.json({ error: "Catalog is not configured" }, { status: 503 });
  const { data, error } = await session.client.auth.getUser();
  if (error || !data.user || !session.allowed(data.user.id))
    return session.finish(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  const length = Number(request.headers.get("content-length"));
  if (!Number.isFinite(length) || length <= 0 || length > MAX_REQUEST)
    return session.finish(NextResponse.json({ error: "File is too large (4 MB max)" }, { status: 413 }));
  try {
    const form = await request.formData();
    const file = form.get("file");
    const id = form.get("id");
    const kind = form.get("kind");
    if (!(file instanceof File) || file.size === 0 || file.size > MAX_BYTES ||
        typeof id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || id.length > 64 ||
        !["icon", "logo", "cover", "gallery"].includes(String(kind)))
      return session.finish(NextResponse.json({ error: "Invalid image or program ID" }, { status: 400 }));
    const bytes = new Uint8Array(await file.arrayBuffer());
    const type = imageType(bytes);
    if (!type || file.type !== type.mime)
      return session.finish(NextResponse.json({ error: "Upload a PNG, JPG or WebP image" }, { status: 400 }));
    const path = `${id}/${kind}-${crypto.randomUUID()}.${type.extension}`;
    const result = await session.client.storage.from(BUCKET).upload(path, bytes, { contentType: type.mime, upsert: false });
    if (result.error) return session.finish(NextResponse.json({ error: "Image upload failed; check storage setup" }, { status: 503 }));
    const { data: publicImage } = session.client.storage.from(BUCKET).getPublicUrl(path);
    return session.finish(NextResponse.json({ url: publicImage.publicUrl }));
  } catch {
    return session.finish(NextResponse.json({ error: "Invalid upload" }, { status: 400 }));
  }
}
