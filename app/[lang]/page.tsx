/* File: app/[lang]/page.tsx | CINENTO Website v3.7.3
 * Updated: 2026-11-14 | Load public dashboard data before rendering.
 */
import { NextRequest } from "next/server";
import HomepageClient from "./HomepageClient";
import { GET as homepageContent } from "../api/content/homepage/route";
import { GET as homepageImages } from "../api/admin/images/route";
import { GET as publicPrograms } from "../api/programs/route";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: requested } = await params;
  const lang = requested === "tr" || requested === "fa" || requested === "ar" ? requested : "en";
  // Reuse the existing public readers without an HTTP request, cookies or admin scope.
  const [content, images, programs] = await Promise.allSettled([
    homepageContent().then(response => response.ok ? response.json() : null),
    homepageImages().then(response => response.ok ? response.json() : null),
    publicPrograms(new NextRequest("https://cinento.invalid/api/programs")).then(response => response.ok ? response.json() : null),
  ]);
  const initialData = content.status === "fulfilled" ? content.value : null;
  const media = images.status === "fulfilled" ? images.value : null;
  const catalog = programs.status === "fulfilled" ? programs.value : null;
  const initialImages = media?.success && media.images ? { ...media.images, active: media.active } : null;
  const initialPrograms = Array.isArray(catalog?.programs) ? catalog.programs : null;
  return <HomepageClient key={lang} lang={lang} initialData={initialData} initialImages={initialImages} initialPrograms={initialPrograms} />;
}
