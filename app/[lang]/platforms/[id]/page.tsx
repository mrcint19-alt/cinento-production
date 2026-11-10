import { notFound } from "next/navigation";
import { publicCatalogClient, staticPrograms, type Language, type Program } from "../../../../lib/program-catalog";

export const dynamic = "force-dynamic";

const labels = {
  en: { back: "All products", audience: "Audience", focus: "Focus areas", features: "Program features", advantages: "Competitive advantages", gallery: "Gallery", status: "Status", development: "In development", desktop: "Desktop application", service: "Related service", profileOnly: "This page introduces the product. It does not open the application.", category: "Category" },
  tr: { back: "Tüm ürünler", audience: "Hedef kitle", focus: "Odak alanları", features: "Program özellikleri", advantages: "Öne çıkan yönler", gallery: "Galeri", status: "Durum", development: "Geliştiriliyor", desktop: "Masaüstü uygulaması", service: "İlgili hizmet", profileOnly: "Bu sayfa ürünü tanıtır; uygulamayı açmaz.", category: "Kategori" },
  fa: { back: "همهٔ برنامه‌ها", audience: "مخاطبان", focus: "حوزه‌های فعالیت", features: "امکانات برنامه", advantages: "مزیت‌های رقابتی", gallery: "گالری", status: "وضعیت", development: "در حال توسعه", desktop: "برنامهٔ دسکتاپ", service: "خدمت مرتبط", profileOnly: "این صفحه برای معرفی برنامه است و خودِ برنامه را باز نمی‌کند.", category: "دسته‌بندی" },
  ar: { back: "كل المنتجات", audience: "الجمهور المستهدف", focus: "مجالات التركيز", features: "ميزات البرنامج", advantages: "المزايا التنافسية", gallery: "معرض الصور", status: "الحالة", development: "قيد التطوير", desktop: "تطبيق سطح المكتب", service: "الخدمة ذات الصلة", profileOnly: "هذه الصفحة للتعريف بالمنتج ولا تفتح التطبيق.", category: "التصنيف" },
} as const;

const categories = {
  intelligence: { en: "Intelligence", tr: "Yapay zekâ", fa: "هوش مصنوعی", ar: "الذكاء الاصطناعي" },
  media: { en: "Film & media", tr: "Sinema ve medya", fa: "سینما و رسانه", ar: "السينما والإعلام" },
  business: { en: "Business", tr: "İş yönetimi", fa: "کسب‌وکار", ar: "الأعمال" },
  connectivity: { en: "Connectivity", tr: "Bağlantı", fa: "ارتباطات", ar: "الاتصالات" },
} as const;

async function getProgram(id: string): Promise<Program | null> {
  if (process.env.VERCEL_ENV === "preview") return staticPrograms.find(program => program.id === id) ?? null;
  const client = publicCatalogClient();
  if (!client) return staticPrograms.find(program => program.id === id) ?? null;
  const { data, error } = await client.from("site_programs")
    .select("id,name,mark,category,status,copy,access_url,icon_url,logo_url,cover_url,published,sort_order")
    .eq("id", id).eq("published", true).maybeSingle();
  return error || !data ? null : data as Program;
}

export default async function ProgramProfile({ params, searchParams }: { params: Promise<{ lang: string; id: string }>; searchParams: Promise<{ view?: string }> }) {
  const { lang, id } = await params;
  const { view } = await searchParams;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) notFound();
  const language: Language = lang === "ar" ? "ar" : view === "fa" || lang === "fa" ? "fa" : lang === "tr" ? "tr" : "en";
  const text = labels[language];
  const program = await getProgram(id);
  if (!program) notFound();
  const arabicFallback = language === "ar" && !program.copy.ar;
  const copy = program.copy[language] ?? program.copy.en;
  if (!copy) notFound();
  const catalogUrl = `/${lang}/platforms`;

  return (
    <main className="profile" lang={language} dir={language === "fa" || language === "ar" ? "rtl" : "ltr"}>
      <header className="profile-header">
        <a className="brand" href={`/${lang}`}>CINENTO<span>•</span></a>
        <a className="back" href={catalogUrl}>← {text.back}</a>
      </header>
      <article className="profile-content">
        <div className="cover">
          {program.cover_url && <img src={program.cover_url} alt="" />}
          <span className="cover-label">CINENTO / {program.mark}</span>
        </div>
        <div className="intro">
          {program.icon_url && <img className="icon" src={program.icon_url} alt="" />}
          <div>
            <p className="category">{categories[program.category]?.[language] ?? text.category}</p>
            <h1>{program.name}</h1>
          </div>
          {program.logo_url && <img className="logo" src={program.logo_url} alt="" />}
        </div>
        {arabicFallback && <p className="translation-note">تفاصيل هذا البرنامج بالإنجليزية إلى حين اعتماد الترجمة العربية.</p>}
        <p className="description" lang={arabicFallback ? "en" : undefined} dir={arabicFallback ? "ltr" : undefined}>{copy.description}</p>
        <div className="information">
          <section><h2>{text.audience}</h2><p lang={arabicFallback ? "en" : undefined} dir={arabicFallback ? "ltr" : undefined}>{copy.audience}</p></section>
          <section><h2>{text.focus}</h2><ul lang={arabicFallback ? "en" : undefined} dir={arabicFallback ? "ltr" : undefined}>{copy.scope.map((item, index) => <li key={index}>{item}</li>)}</ul></section>
          <section><h2>{text.service}</h2><p lang={arabicFallback ? "en" : undefined} dir={arabicFallback ? "ltr" : undefined}>{copy.service}</p></section>
          {program.status && <section><h2>{text.status}</h2><p>{program.status === "desktop" ? text.desktop : text.development}</p></section>}
        </div>
        {!!copy.features?.length && <section className="features" aria-labelledby="features-title">
          <h2 id="features-title">{text.features}</h2>
          <ul lang={arabicFallback ? "en" : undefined} dir={arabicFallback ? "ltr" : undefined}>
            {copy.features.map((feature, index) => <li key={`${index}-${feature}`}>{feature}</li>)}
          </ul>
        </section>}
        {!!copy.advantages?.length && <section className="features" aria-labelledby="advantages-title">
          <h2 id="advantages-title">{text.advantages}</h2>
          <ul lang={arabicFallback ? "en" : undefined} dir={arabicFallback ? "ltr" : undefined}>{copy.advantages.map((advantage, index) => <li key={`${index}-${advantage}`}>{advantage}</li>)}</ul>
        </section>}
        {!!program.copy.media?.gallery?.length && <section className="features" aria-labelledby="gallery-title">
          <h2 id="gallery-title">{text.gallery}</h2>
          <div className="gallery">{program.copy.media.gallery.map((url, index) => <a key={`${index}-${url}`} href={url} target="_blank" rel="noopener noreferrer"><img src={url} alt={`${program.name} — ${text.gallery} ${index + 1}`} loading="lazy" /></a>)}</div>
        </section>}
        <p className="pending">{text.profileOnly}</p>
      </article>
      <style>{`
        .translation-note{color:#d6b453;font-size:13px;margin:24px 44px 0}.profile[dir=rtl] .logo{margin-left:0;margin-right:auto}.profile[dir=rtl] .information ul{padding-left:0;padding-right:20px}.features{margin:34px 44px 0;border-top:1px solid #d6b45366;padding-top:24px}.features h2{font-size:20px;color:#e9cd81;margin:0 0 20px}.features ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.features li{border:1px solid #ffffff25;background:#182028;padding:16px 18px;font-size:15px;line-height:1.6;overflow-wrap:anywhere}.features li::before{content:'✦';color:#e9cd81;margin-inline-end:12px}.gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.gallery a{display:block;border:1px solid #ffffff25;background:#090c10}.gallery img{width:100%;aspect-ratio:16/9;object-fit:contain;display:block}@media(max-width:700px){.translation-note{margin:22px 22px 0}.features{margin:26px 22px 0}.features ul,.gallery{grid-template-columns:1fr}}
        *{box-sizing:border-box}.profile{min-height:100vh;background:#090c10;color:#f3f0e8;font-family:Arial,Helvetica,sans-serif;padding:0 24px 80px}.profile a{color:inherit;text-decoration:none}.profile-header{max-width:1120px;margin:auto;min-height:96px;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{font-size:22px;font-weight:800;letter-spacing:.15em}.brand span{color:#d6b453}.back{border:1px solid #bfa66355;border-radius:6px;padding:11px 16px;font-size:13px;color:#dfca8b!important}.back:hover,.action:hover{background:#d6b45322}.profile-content{max-width:1120px;margin:auto;border:1px solid #ffffff20;background:#11161c;border-radius:14px;overflow:hidden}.cover{height:min(45vw,440px);min-height:240px;position:relative;display:grid;place-items:center;background:radial-gradient(circle at 70% 40%,#23394b,#0d1117 70%)}.cover>img{width:100%;height:100%;object-fit:cover}.cover-label{position:absolute;left:30px;top:28px;letter-spacing:.22em;font-size:11px;color:#f3e6c6;text-shadow:0 1px 8px #000}.intro{display:flex;align-items:center;gap:22px;padding:32px 44px 0}.icon{width:84px;height:84px;object-fit:contain;border-radius:18px}.category{color:#d8b85d;font-size:12px;letter-spacing:.12em;text-transform:uppercase}.intro h1{font-size:clamp(30px,4vw,54px);line-height:1.15;margin:8px 0}.logo{width:160px;max-height:80px;object-fit:contain;margin-left:auto}.description{font-size:clamp(16px,2vw,20px);line-height:1.75;color:#d9dfdf;margin:26px 44px 36px;max-width:850px}.information{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;padding:0 44px}.information section{border-top:1px solid #d6b45366;padding:24px 0;color:#b9c4ca}.information h2{font-size:14px;color:#e9cd81;margin:0 0 14px}.information p,.information li{font-size:15px;line-height:1.7}.information p{margin:0}.information ul{margin:0;padding-left:20px}.action,.pending{display:inline-block;margin:34px 44px 44px}.action{border:1px solid #d6b453;color:#f3d788!important;border-radius:6px;padding:14px 22px}.pending{font-size:14px;color:#a8b4ba}@media(max-width:700px){.profile{padding:0 14px 48px}.profile-header{min-height:72px}.brand{font-size:17px}.back{font-size:12px}.cover{min-height:210px}.intro{padding:22px 22px 0;gap:15px;flex-wrap:wrap}.icon{width:62px;height:62px}.logo{width:112px;margin-left:0}.description{margin:22px;font-size:16px}.information{grid-template-columns:1fr;padding:0 22px;gap:0}.action,.pending{margin:24px 22px 34px}}
      `}</style>
    </main>
  );
}
