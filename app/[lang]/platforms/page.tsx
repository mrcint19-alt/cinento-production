"use client";

/**
 * File: app/[lang]/platforms/page.tsx
 * CINENTO Products & Platforms — UI review v0.1 | 2026-10-17
 * Illustrative content only. No API, database, analytics or outbound product links.
 * Local language switch includes Persian without adding a /fa route.
 * CMS integration and verified product information are subsequent work.
 */
import { useState } from "react";
import { useParams } from "next/navigation";

type Language = "en" | "tr" | "fa";
type Category = "all" | "intelligence" | "media" | "business" | "connectivity";
type Copy = {
  eyebrow: string; title: string; lead: string; explore: string;
  catalog: string; catalogIntro: string; review: string; notice: string;
  details: string; audience: string; scope: string; related: string;
  linkNote: string; concept: string; showing: string; language: string;
  footerTitle: string; footerText: string; footerNote: string;
  categories: Record<Category, string>;
};
type ProductText = { description: string; audience: string; scope: string[]; service: string };
type Product = {
  id: string; name: string; mark: string; category: Exclude<Category, "all">;
  copy: Record<Language, ProductText>;
};

const COPY: Record<Language, Copy> = {
  en: {
    eyebrow: "THE CINENTO ECOSYSTEM", title: "Products & Platforms",
    lead: "A new chapter where cinema, media and digital technology meet. Explore the proposed product portfolio behind CINENTO.",
    explore: "Explore the collection", catalog: "One vision. Different possibilities.",
    catalogIntro: "Six product profiles, brought together for this design review.",
    review: "Pending verification", notice: "Design preview · Descriptions and focus areas below are proposed editorial content. Product availability and capabilities have not been verified.",
    details: "Explore this profile", audience: "Proposed audience", scope: "Proposed focus areas",
    related: "Related service proposal", linkNote: "Website and demo links will appear after verification.",
    concept: "Concept artwork · not a product screenshot", showing: "Profiles shown", language: "Page language",
    footerTitle: "From the screen to the system.",
    footerText: "The showcase brings CINENTO’s film, media and technology interests into one coherent experience. Verified product stories and real media will shape the next edition.",
    footerNote: "UI review v0.1 · No live demo requests or account actions on this page.",
    categories: { all: "All products", intelligence: "Intelligence", media: "Film & media", business: "Business", connectivity: "Connectivity" },
  },
  tr: {
    eyebrow: "CINENTO EKOSİSTEMİ", title: "Ürünler & Platformlar",
    lead: "Sinema, medya ve dijital teknolojinin buluştuğu yeni bir bölüm. CINENTO için önerilen ürün portföyünü keşfedin.",
    explore: "Koleksiyonu keşfet", catalog: "Tek vizyon. Farklı olasılıklar.",
    catalogIntro: "Bu tasarım incelemesi için bir araya getirilen altı ürün profili.",
    review: "Doğrulama bekliyor", notice: "Tasarım önizlemesi · Aşağıdaki açıklamalar ve odak alanları içerik önerisidir. Ürünlerin erişilebilirliği ve yetenekleri doğrulanmamıştır.",
    details: "Profili incele", audience: "Önerilen hedef kitle", scope: "Önerilen odak alanları",
    related: "İlgili hizmet önerisi", linkNote: "Web sitesi ve demo bağlantıları doğrulamadan sonra eklenecek.",
    concept: "Konsept görsel · ürün ekran görüntüsü değildir", showing: "Gösterilen profiller", language: "Sayfa dili",
    footerTitle: "Ekrandan sisteme.",
    footerText: "Bu vitrin, CINENTO’nun sinema, medya ve teknoloji alanlarını ortak bir deneyimde buluşturur. Sonraki sürüm doğrulanmış ürün bilgileri ve gerçek görsellerle şekillenecek.",
    footerNote: "Arayüz incelemesi v0.1 · Bu sayfada canlı demo talebi veya hesap işlemi yoktur.",
    categories: { all: "Tüm ürünler", intelligence: "Yapay zekâ", media: "Sinema & medya", business: "İş yönetimi", connectivity: "Bağlantı" },
  },
  fa: {
    eyebrow: "اکوسیستم سیننتو", title: "محصولات و پلتفرم‌ها",
    lead: "فصلی تازه در پیوند سینما، رسانه و فناوری دیجیتال. مجموعه پیشنهادی محصولات CINENTO را کشف کنید.",
    explore: "کاوش در محصولات", catalog: "یک چشم‌انداز؛ امکان‌های متفاوت.",
    catalogIntro: "شش معرفی محصول در کنار هم، برای بررسی طراحی این مجموعه.",
    review: "در انتظار تأیید", notice: "پیش‌نمایش طراحی · توضیحات و محورهای زیر، پیشنهاد محتوایی هستند. قابلیت‌ها و دسترسی واقعی محصولات هنوز تأیید نشده‌اند.",
    details: "مشاهده معرفی", audience: "مخاطبان پیشنهادی", scope: "محورهای پیشنهادی",
    related: "خدمت مرتبط پیشنهادی", linkNote: "لینک وب‌سایت و دمو پس از بررسی و تأیید اضافه می‌شود.",
    concept: "تصویر مفهومی؛ نمای واقعی محصول نیست", showing: "تعداد معرفی‌های نمایان", language: "زبان صفحه",
    footerTitle: "از قاب سینما تا دنیای سیستم‌ها.",
    footerText: "این مجموعه، حوزه‌های سینما، رسانه و فناوری CINENTO را در تجربه‌ای منسجم معرفی می‌کند. نسخه بعدی با اطلاعات تأییدشده و تصاویر واقعی محصولات تکمیل خواهد شد.",
    footerNote: "بررسی رابط نسخه ۰٫۱ · درخواست دموی واقعی و عملیات حساب کاربری در این صفحه فعال نیست.",
    categories: { all: "همه محصولات", intelligence: "هوش مصنوعی", media: "سینما و رسانه", business: "کسب‌وکار", connectivity: "ارتباطات" },
  },
};

const PRODUCTS: Product[] = [
  { id: "ai", name: "CINENTO AI", mark: "AI", category: "intelligence", copy: {
    en: { description: "A proposed home for CINENTO’s AI experiences, with a multilingual product story and a clear view of its intended uses.", audience: "Creators, professionals and teams", scope: ["Multilingual interaction", "Creative exploration", "Everyday assistance"], service: "AI experience design" },
    tr: { description: "CINENTO’nun yapay zekâ deneyimleri için çok dilli bir ürün hikâyesi ve kullanım alanları sunmayı amaçlayan tanıtım.", audience: "Yaratıcılar, profesyoneller ve ekipler", scope: ["Çok dilli etkileşim", "Yaratıcı keşif", "Günlük destek"], service: "Yapay zekâ deneyimi tasarımı" },
    fa: { description: "معرفی پیشنهادی تجربه‌های هوش مصنوعی CINENTO، با روایت چندزبانه و تصویری روشن از کاربردهای مورد نظر.", audience: "تولیدکنندگان محتوا، متخصصان و تیم‌ها", scope: ["تعامل چندزبانه", "کاوش خلاقانه", "دستیاری روزمره"], service: "طراحی تجربه هوش مصنوعی" },
  } },
  { id: "watch", name: "CINENTO WATCH", mark: "W", category: "media", copy: {
    en: { description: "A dedicated profile for the independent WATCH application, connecting its cinematic identity with its intended viewing experience.", audience: "Audiences, filmmakers and media partners", scope: ["Film discovery", "Viewing experience", "Media presentation"], service: "Film and media strategy" },
    tr: { description: "Bağımsız WATCH uygulamasının sinematik kimliğini ve hedeflenen izleme deneyimini anlatan özel ürün profili.", audience: "İzleyiciler, sinemacılar ve medya ortakları", scope: ["Film keşfi", "İzleme deneyimi", "Medya sunumu"], service: "Sinema ve medya stratejisi" },
    fa: { description: "معرفی اختصاصی برنامه مستقل WATCH، با تمرکز بر هویت سینمایی و تجربه تماشای مورد نظر آن.", audience: "مخاطبان، فیلم‌سازان و شرکای رسانه‌ای", scope: ["کشف فیلم", "تجربه تماشا", "ارائه محتوای رسانه‌ای"], service: "راهبرد سینما و رسانه" },
  } },
  { id: "enterprise", name: "CINENTO Enterprise OS", mark: "OS", category: "business", copy: {
    en: { description: "A proposed presentation of CINENTO’s enterprise system, organized around the business workflows selected for a future demonstration.", audience: "Business leaders and operational teams", scope: ["Operational workflows", "Management workspace", "Module organization"], service: "Business system design" },
    tr: { description: "Gelecekteki bir gösterim için seçilecek iş akışları etrafında düzenlenen CINENTO kurumsal sistem tanıtımı önerisi.", audience: "Yöneticiler ve operasyon ekipleri", scope: ["Operasyon akışları", "Yönetim çalışma alanı", "Modül düzeni"], service: "İş sistemi tasarımı" },
    fa: { description: "معرفی پیشنهادی سیستم سازمانی CINENTO، بر اساس فرایندهایی که برای نمایش آینده انتخاب و بررسی خواهند شد.", audience: "مدیران کسب‌وکار و تیم‌های عملیاتی", scope: ["فرایندهای عملیاتی", "محیط مدیریت", "سازمان‌دهی ماژول‌ها"], service: "طراحی سیستم کسب‌وکار" },
  } },
  { id: "autocall", name: "CINENTO AutoCall", mark: "AC", category: "connectivity", copy: {
    en: { description: "A product story exploring coordinated calling workflows. Calling methods, regional support and automation require separate validation.", audience: "Outreach and customer communication teams", scope: ["Call planning", "Contact organization", "Campaign workflows"], service: "Communication workflow design" },
    tr: { description: "Koordineli arama akışlarını ele alan ürün hikâyesi. Arama yöntemleri, bölgesel destek ve otomasyon ayrıca doğrulanmalıdır.", audience: "Müşteri iletişimi ve erişim ekipleri", scope: ["Arama planlaması", "Kişi düzeni", "Kampanya akışları"], service: "İletişim akışı tasarımı" },
    fa: { description: "روایتی پیشنهادی برای مدیریت فرایند تماس؛ روش تماس، پشتیبانی منطقه‌ای و خودکارسازی نیازمند بررسی مستقل است.", audience: "تیم‌های ارتباط با مشتری و توسعه بازار", scope: ["برنامه‌ریزی تماس", "سازمان‌دهی مخاطبان", "فرایند کمپین"], service: "طراحی فرایند ارتباطات" },
  } },
  { id: "crm", name: "CINENTO CRM", mark: "CRM", category: "business", copy: {
    en: { description: "A proposed customer relationship profile. The scope of a standalone product will be distinguished from the website’s internal CRM.", audience: "Sales, partnerships and client service teams", scope: ["Relationship management", "Inquiry follow-up", "Partnership workflows"], service: "Customer journey design" },
    tr: { description: "Müşteri ilişkileri için önerilen ürün profili. Bağımsız ürünün kapsamı, sitenin iç CRM sisteminden ayrı tanımlanacak.", audience: "Satış, iş ortaklığı ve müşteri hizmetleri ekipleri", scope: ["İlişki yönetimi", "Talep takibi", "İş ortaklığı akışları"], service: "Müşteri yolculuğu tasarımı" },
    fa: { description: "معرفی پیشنهادی مدیریت ارتباط با مشتری؛ محدوده محصول مستقل باید از CRM داخلی سایت تفکیک و تأیید شود.", audience: "تیم‌های فروش، مشارکت و خدمات مشتری", scope: ["مدیریت ارتباطات", "پیگیری درخواست‌ها", "فرایند همکاری"], service: "طراحی مسیر مشتری" },
  } },
  { id: "vpn", name: "CINENTO VPN", mark: "VPN", category: "connectivity", copy: {
    en: { description: "A profile reserved for CINENTO’s connectivity project. Network operation, service availability and security claims remain under review.", audience: "Audience to be defined after technical review", scope: ["Connection lifecycle", "Node organization", "Service access model"], service: "Connectivity experience design" },
    tr: { description: "CINENTO bağlantı projesi için ayrılan profil. Ağın çalışması, hizmet erişimi ve güvenlik iddiaları inceleme bekliyor.", audience: "Teknik inceleme sonrası belirlenecek", scope: ["Bağlantı yaşam döngüsü", "Düğüm düzeni", "Hizmete erişim modeli"], service: "Bağlantı deneyimi tasarımı" },
    fa: { description: "معرفی پروژه ارتباطی CINENTO؛ عملکرد شبکه، دسترسی به سرویس و ادعاهای امنیتی همچنان نیازمند بررسی هستند.", audience: "پس از بررسی فنی تعیین می‌شود", scope: ["چرخه اتصال", "سازمان‌دهی گره‌ها", "مدل دسترسی به سرویس"], service: "طراحی تجربه ارتباطی" },
  } },
];

const CATEGORIES: Category[] = ["all", "intelligence", "media", "business", "connectivity"];

function ProductSymbol({ id }: { id: string }) {
  const paths: Record<string, string> = {
    ai: "M24 4 29 18 44 24 29 30 24 44 18 30 4 24 18 18Z",
    watch: "M18 12 37 24 18 36Z M5 10V38 M43 10V38",
    enterprise: "M6 6H19V19H6Z M29 6H42V19H29Z M6 29H19V42H6Z M29 29H42V42H29Z",
    autocall: "M13 7 7 13C7 26 22 41 35 41L41 35 32 27 27 31C22 29 19 26 17 21L21 16Z",
    crm: "M16 24A8 8 0 1 0 16 8 8 8 0 1 0 16 24 M3 42V37C3 30 29 30 29 37V42 M34 10A7 7 0 0 1 34 24 M36 31C41 31 45 34 45 38V42",
    vpn: "M24 4 41 11V24C41 34 32 41 24 45 16 41 7 34 7 24V11Z M17 24 22 29 32 19",
  };
  return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[id]} /></svg>;
}

export default function PlatformsPage() {
  const params = useParams<{ lang: string }>();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [category, setCategory] = useState<Category>("all");
  const language: Language = selectedLanguage ?? (params?.lang === "tr" ? "tr" : "en");
  const text = COPY[language];
  const siteLanguage = language === "tr" ? "tr" : language === "en" ? "en" : params?.lang === "tr" ? "tr" : "en";
  const homeUrl = `/${siteLanguage}`;
  const siteLabels = {
    en: ["Home", "About", "Gallery", "Journal", "Contact"],
    tr: ["Ana Sayfa", "Hakkımızda", "Galeri", "Günlük", "İletişim"],
    fa: ["خانه", "درباره ما", "گالری", "مجله", "تماس"],
  }[language];
  const products = PRODUCTS.filter((product) => category === "all" || product.category === category);
  const count = new Intl.NumberFormat(language).format(products.length);

  return (
    <main className="cp" lang={language} dir={language === "fa" ? "rtl" : "ltr"}>
      <a className="cp-skip" href="#collection">{text.explore}</a>
      <header className="cp-header">
        <a className="cp-brand" href={homeUrl} aria-label={`CINENTO — ${siteLabels[0]}`}>CINENTO<span aria-hidden="true">•</span></a>
        <nav className="cp-site-nav" aria-label={language === "fa" ? "منوی اصلی" : language === "tr" ? "Ana menü" : "Main navigation"}>
          {(["home", "about", "gallery", "journal", "contact"] as const).map((section, index) => (
            <a key={section} href={`${homeUrl}#${section}`}>{siteLabels[index]}</a>
          ))}
          <a href="#top" aria-current="page">{text.title}</a>
        </nav>
        <div className="cp-languages" role="group" aria-label={text.language}>
          {(["en", "tr", "fa"] as Language[]).map((locale) => (
            <button key={locale} type="button" lang={locale} aria-pressed={language === locale} onClick={() => setSelectedLanguage(locale)}>
              {locale === "fa" ? "فارسی" : locale.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <section className="cp-hero" id="top" aria-labelledby="cp-title">
        <div className="cp-hero-copy">
          <p className="cp-eyebrow"><span />{text.eyebrow}</p>
          <h1 id="cp-title">{text.title}</h1>
          <p className="cp-lead">{text.lead}</p>
          <a className="cp-cta" href="#collection">{text.explore}<span aria-hidden="true">↘</span></a>
        </div>
        <div className="cp-orbit" aria-hidden="true" dir="ltr">
          <div className="cp-orbit-ring cp-ring-one" /><div className="cp-orbit-ring cp-ring-two" />
          <div className="cp-orbit-axis" />
          <div className="cp-orbit-core"><span>C</span><small>CINENTO</small></div>
          <span className="cp-orbit-tag cp-tag-one">AI</span><span className="cp-orbit-tag cp-tag-two">FILM</span>
          <span className="cp-orbit-tag cp-tag-three">SYSTEMS</span><span className="cp-orbit-caption">CREATIVE VISION / DIGITAL POSSIBILITIES</span>
        </div>
      </section>

      <aside className="cp-notice"><span aria-hidden="true">◇</span><p>{text.notice}</p></aside>

      <section className="cp-collection" id="collection" aria-labelledby="cp-catalog-title">
        <div className="cp-section-heading"><div><p className="cp-eyebrow">CINENTO / 01—06</p><h2 id="cp-catalog-title">{text.catalog}</h2><p>{text.catalogIntro}</p></div><span className="cp-count" aria-live="polite">{text.showing} <strong>{count}</strong></span></div>
        <div className="cp-filters" role="group" aria-label={text.catalog}>
          {CATEGORIES.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{text.categories[item]}</button>)}
        </div>

        <div className="cp-grid">
          {products.map((product) => {
            const content = product.copy[language];
            return (
              <article className={`cp-card cp-card-${product.id}`} key={product.id} aria-labelledby={`cp-${product.id}`}>
                <div className="cp-art" aria-hidden="true">
                  <div className="cp-art-grid" /><div className="cp-art-orbit" />
                  <span className="cp-art-id">{String(PRODUCTS.indexOf(product) + 1).padStart(2, "0")} / CINENTO</span>
                  <div className="cp-art-symbol"><ProductSymbol id={product.id} /></div>
                  <span className="cp-art-mark">{product.mark}</span>
                </div>
                <p className="cp-art-caption">{text.concept}</p>
                <div className="cp-card-body">
                  <div className="cp-card-meta"><span>{text.categories[product.category]}</span><span className="cp-status"><i />{text.review}</span></div>
                  <h3 id={`cp-${product.id}`} dir="ltr">{product.name}</h3>
                  <p className="cp-description">{content.description}</p>
                  <details className="cp-details">
                    <summary>{text.details}<span aria-hidden="true">+</span></summary>
                    <div className="cp-detail-content"><h4>{text.audience}</h4><p>{content.audience}</p><h4>{text.scope}</h4><ul>{content.scope.map((item) => <li key={item}>{item}</li>)}</ul><h4>{text.related}</h4><p>{content.service}</p></div>
                  </details>
                  <p className="cp-link-note">{text.linkNote}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="cp-closing"><span className="cp-closing-mark" aria-hidden="true">C.</span><div><p className="cp-eyebrow">CINENTO</p><h2>{text.footerTitle}</h2><p>{text.footerText}</p></div></section>
      <footer className="cp-footer"><a className="cp-footer-brand" href={homeUrl}>CINENTO</a><p>{text.footerNote}</p><a href={`${homeUrl}#contact`}>{siteLabels[4]}</a><span>2026</span></footer>

      <style jsx global>{`
        .cp-site-nav{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px 17px;font-size:12px;color:#c2c1b8}.cp-site-nav a:hover,.cp-site-nav a[aria-current=page]{color:#d9b95b}.cp-site-nav a{padding-block:8px}.cp a:focus-visible,.cp button:focus-visible{outline:2px solid #d9b95b;outline-offset:5px}.cp-header{flex-wrap:wrap}.cp-site-nav{flex:1 1 400px}@media(max-width:900px){.cp-site-nav{order:3;flex-basis:100%;justify-content:flex-start;gap:5px 18px}.cp-header .cp-languages{margin-inline-start:auto}}
        .cp{--cp-gold:#d4af37;--cp-text:#f2f0e9;--cp-muted:#aaa9a2;background:#08090b;color:var(--cp-text);min-height:100vh;font-family:Arial,Tahoma,sans-serif;overflow-wrap:anywhere;color-scheme:dark}
        .cp *{box-sizing:border-box}.cp a{color:inherit;text-decoration:none}.cp button{font:inherit;cursor:pointer}.cp button,.cp a,.cp summary{-webkit-tap-highlight-color:transparent}.cp :focus-visible{outline:2px solid #e8c75b;outline-offset:5px}.cp h1,.cp h2,.cp h3,.cp h4,.cp p{margin:0}.cp button,.cp summary,.cp a{touch-action:manipulation}.cp-skip{position:fixed;top:8px;inset-inline-start:12px;padding:12px 20px;background:#d4af37;color:#111!important;z-index:100;transform:translateY(-160%)}.cp-skip:focus{transform:none}
        .cp-header{max-width:1320px;margin:auto;min-height:96px;padding:20px 44px;display:flex;align-items:center;justify-content:space-between;gap:22px;border-bottom:1px solid #ffffff12}.cp-brand{font-size:23px;letter-spacing:.16em;font-weight:750;direction:ltr;white-space:nowrap}.cp-brand span{font-size:10px;vertical-align:top;color:var(--cp-gold);margin-inline-start:4px}.cp-header-label{font-size:12px;color:#c2c1b8;letter-spacing:.04em}.cp-languages{display:flex;gap:3px;padding:4px;border:1px solid #ffffff20;border-radius:30px;direction:ltr}.cp-languages button{min-height:38px;min-width:42px;background:transparent;color:#bcbcb6;border:0;border-radius:22px;font-size:12px;padding:7px 12px}.cp-languages button[aria-pressed=true]{color:#111;background:#d9b95b}
        .cp-hero{max-width:1320px;margin:auto;padding:80px 44px 70px;display:grid;grid-template-columns:1.2fr 1fr;gap:50px;align-items:center;position:relative;scroll-margin-top:24px}.cp-eyebrow{color:#d6b967;font-size:10px;font-weight:600;letter-spacing:.2em;display:flex;align-items:center;gap:10px;line-height:1.8}.cp-eyebrow>span{display:inline-block;height:6px;width:6px;background:var(--cp-gold);border-radius:50%}.cp h1{font-size:clamp(42px,5.5vw,76px);letter-spacing:-.055em;font-weight:500;line-height:1.06;max-width:650px;margin:24px 0}.cp-lead{color:#b3b3ae;font-size:16px;line-height:1.85;max-width:535px}.cp-cta{margin-top:32px;display:inline-flex;align-items:center;gap:32px;border:1px solid #9d8445;border-radius:6px;padding:15px 20px;font-size:13px;background:#d4af3710;transition:background .2s}.cp-cta:hover{background:#d4af3726}.cp-cta span{color:#e9c969;font-size:21px}
        .cp-orbit{height:340px;position:relative;display:grid;place-items:center;background:radial-gradient(ellipse,#c0a04d12,transparent 65%);overflow:hidden}.cp-orbit-ring{position:absolute;border:1px solid #b99b4b35;border-radius:50%;width:270px;height:270px;transform:rotate(-24deg) scaleX(1.3)}.cp-ring-two{width:320px;height:320px;transform:rotate(42deg) scaleX(.72);border-color:#ffffff15}.cp-orbit-axis{position:absolute;width:96%;height:1px;background:linear-gradient(90deg,transparent,#d4af3730,transparent);transform:rotate(-24deg)}.cp-orbit-core{width:145px;height:145px;display:flex;align-items:center;justify-content:center;flex-direction:column;border:1px solid #dac07570;border-radius:50%;background:radial-gradient(at 30% 20%,#343027,#111316 70%);box-shadow:0 0 70px #c3a34c0d}.cp-orbit-core>span{font-family:Georgia,serif;font-size:80px;line-height:1;color:#e4c77c}.cp-orbit-core small{font-size:8px;letter-spacing:.3em;margin-top:4px;color:#a89772}.cp-orbit-tag{position:absolute;border:1px solid #b59b5140;background:#111214;padding:8px 14px;font-size:9px;letter-spacing:.14em;border-radius:4px;color:#dfcd97}.cp-tag-one{top:30px;left:24%}.cp-tag-two{right:3%;top:51%}.cp-tag-three{bottom:28px;left:13%}.cp-orbit-caption{position:absolute;bottom:0;font-size:8px;letter-spacing:.16em;color:#8a877e}
        .cp-notice{max-width:1232px;margin:0 auto;display:flex;gap:12px;padding:16px 20px;border:1px solid #b79a4d2b;border-radius:6px;background:#d4af3706;align-items:flex-start}.cp-notice>span{color:#dfbf67;font-size:19px;line-height:1.4}.cp-notice p{font-size:12px;line-height:1.8;color:#bab5a6}
        .cp-collection{max-width:1320px;margin:auto;padding:72px 44px 90px;scroll-margin-top:28px}.cp-section-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:28px}.cp-section-heading h2{font-size:clamp(25px,3vw,36px);font-weight:500;letter-spacing:-.035em;margin:10px 0 12px;line-height:1.3}.cp-section-heading>div>p:last-child{font-size:13px;line-height:1.8;color:var(--cp-muted)}.cp-count{display:flex;gap:12px;align-items:center;white-space:nowrap;font-size:11px;color:#92938d}.cp-count strong{color:#dfc374;font-size:22px;font-weight:400}.cp-filters{display:flex;flex-wrap:wrap;gap:8px;margin:30px 0}.cp-filters button{font-size:12px;min-height:40px;border:1px solid #ffffff18;background:transparent;color:#b4b6b0;padding:9px 17px;border-radius:30px;transition:border-color .2s,color .2s}.cp-filters button:hover{border-color:#d4af3770;color:white}.cp-filters button[aria-pressed=true]{background:#d4af37;color:#111;border-color:#d4af37}
        .cp-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;align-items:start}.cp-card{--cp-accent:#bfa663;min-width:0;border:1px solid #ffffff14;background:#101215;border-radius:12px;overflow:hidden;transition:border-color .2s}.cp-card:hover{border-color:#d4af3755}.cp-card-watch{--cp-accent:#a98e72}.cp-card-enterprise{--cp-accent:#8a9a9f}.cp-card-autocall{--cp-accent:#a6a67b}.cp-card-crm{--cp-accent:#8da597}.cp-card-vpn{--cp-accent:#9596b2}.cp-art{height:188px;position:relative;display:grid;place-items:center;background:radial-gradient(ellipse at 50% 60%,color-mix(in srgb,var(--cp-accent) 16%,transparent),transparent 70%),#0b0d10;overflow:hidden;direction:ltr}.cp-art-grid{position:absolute;inset:0;opacity:.18;background-image:linear-gradient(#ffffff18 1px,transparent 1px),linear-gradient(90deg,#ffffff18 1px,transparent 1px);background-size:32px 32px;mask-image:radial-gradient(ellipse,#000,transparent 75%)}.cp-art-orbit{position:absolute;border:1px solid color-mix(in srgb,var(--cp-accent) 30%,transparent);width:175px;height:175px;border-radius:50%;transform:rotate(-30deg) scaleX(1.25)}.cp-card-enterprise .cp-art-orbit{border-radius:20px;transform:rotate(45deg);height:130px;width:130px}.cp-card-vpn .cp-art-orbit{width:150px;height:150px;transform:scaleX(.85)}.cp-art-symbol{width:94px;height:94px;border:1px solid color-mix(in srgb,var(--cp-accent) 55%,transparent);border-radius:24px;display:grid;place-items:center;position:relative;background:linear-gradient(140deg,#28292b,#0c0e11);box-shadow:0 12px 24px #0007;color:var(--cp-accent)}.cp-art-symbol svg{width:48px;height:48px}.cp-art-id{position:absolute;top:18px;left:18px;font-size:8px;letter-spacing:.15em;color:#888b88}.cp-art-mark{position:absolute;bottom:14px;right:18px;color:var(--cp-accent);font-size:10px;letter-spacing:.14em}.cp-art-caption{font-size:9px;line-height:1.6;padding:8px 20px;color:#989b94;border-bottom:1px solid #ffffff0b;background:#0d0f12}.cp-card-body{padding:23px 23px 19px}.cp-card-meta{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-size:9px;color:#a5a79e;margin-bottom:17px;line-height:1.6}.cp-status{border:1px solid #c9ab552e;padding:4px 7px;border-radius:20px;display:inline-flex;align-items:center;gap:5px;color:#d0bd85;font-size:9px}.cp-status i{height:4px;width:4px;background:#c0a658;border-radius:50%}.cp h3{font-size:21px;font-weight:500;letter-spacing:-.02em;line-height:1.35;margin-bottom:12px;text-align:start}.cp-description{font-size:12px;line-height:1.9;color:#b2b4af;min-height:96px}.cp-details{margin-top:19px;border-top:1px solid #ffffff13}.cp-details summary{min-height:50px;padding:16px 0;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px;font-size:12px;color:#e4c776}.cp-details summary::-webkit-details-marker{display:none}.cp-details summary>span{font-size:21px;line-height:16px;transition:transform .2s}.cp-details[open] summary>span{transform:rotate(45deg)}.cp-detail-content{padding-bottom:16px;color:#b2b4af;font-size:12px;line-height:1.8}.cp-detail-content h4{font-size:10px;color:#e3e0d3;margin-top:15px;margin-bottom:6px;font-weight:600}.cp-detail-content ul{padding-inline-start:18px;margin:0}.cp-link-note{font-size:10px;line-height:1.7;color:#92958d;border-top:1px solid #ffffff0c;padding-top:12px}
        .cp-closing{max-width:1232px;margin:0 auto 64px;border-top:1px solid #d4af3730;border-bottom:1px solid #d4af3720;padding:48px 0;display:grid;grid-template-columns:150px 1fr;gap:30px;align-items:center}.cp-closing-mark{font:100px Georgia,serif;color:#c2a454;direction:ltr;text-align:center}.cp-closing h2{font-size:clamp(26px,3vw,36px);font-weight:400;line-height:1.4;margin:9px 0 14px}.cp-closing>div>p:last-child{font-size:13px;color:#a4a69f;line-height:1.9;max-width:710px}.cp-footer{max-width:1320px;padding:0 44px 35px;margin:auto;display:flex;gap:25px;justify-content:space-between;align-items:center;color:#8e9089;font-size:10px;line-height:1.8}.cp-footer p{max-width:640px}.cp-footer-brand{letter-spacing:.18em;color:#c3b58c;font-size:12px;direction:ltr}
        .cp[dir=rtl]{font-family:Tahoma,Arial,sans-serif}.cp[dir=rtl] h1{letter-spacing:-.035em;line-height:1.45;font-size:clamp(36px,4.7vw,62px)}.cp[dir=rtl] .cp-eyebrow{letter-spacing:0}.cp[dir=rtl] h3{text-align:right}.cp[dir=rtl] .cp-cta span{transform:scaleX(-1)}.cp[dir=rtl] .cp-description{line-height:2.1}.cp[dir=rtl] .cp-card-meta{font-size:10px}.cp[dir=rtl] .cp-status{font-size:10px}
        @media(min-width:1600px){.cp-hero{padding-top:100px;padding-bottom:100px}}@media(max-width:1100px){.cp-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.cp-notice,.cp-closing{margin-inline:32px}.cp-header,.cp-hero,.cp-collection{padding-inline:32px}.cp-hero{gap:20px}.cp-orbit{height:300px}.cp-orbit-ring{width:210px;height:210px}.cp-ring-two{width:265px;height:265px}.cp-hero h1{font-size:55px}.cp-description{min-height:78px}}
        @media(max-width:700px){.cp-header{min-height:82px;padding:17px 20px;flex-wrap:wrap;gap:12px}.cp-header-label{display:none}.cp-brand{font-size:20px}.cp-languages button{min-height:38px;padding:7px 9px}.cp-hero{grid-template-columns:1fr;padding:48px 20px 34px;gap:20px}.cp-hero h1{font-size:47px;max-width:480px;margin:18px 0}.cp-lead{font-size:14px}.cp-orbit{height:220px;max-width:400px;width:100%;margin:auto}.cp-orbit-core{width:105px;height:105px}.cp-orbit-core>span{font-size:58px}.cp-orbit-core small{font-size:7px}.cp-orbit-ring{width:160px;height:160px}.cp-ring-two{width:200px;height:200px}.cp-orbit-caption{font-size:7px}.cp-orbit-tag{font-size:8px;padding:6px 10px}.cp-tag-one{top:10px}.cp-tag-three{bottom:20px}.cp-notice{margin-inline:20px;padding:14px}.cp-notice p{font-size:11px}.cp-collection{padding:46px 20px}.cp-section-heading{align-items:start;flex-direction:column;gap:15px}.cp-count{font-size:10px}.cp-section-heading h2{font-size:27px}.cp-grid{grid-template-columns:1fr;gap:22px}.cp-card-body{padding:22px}.cp-description{min-height:0;font-size:13px}.cp-art{height:205px}.cp-filters{gap:7px;margin:22px 0}.cp-filters button{padding:9px 13px;min-height:42px;font-size:11px}.cp-card-meta,.cp-status{font-size:10px}.cp-closing{margin:0 20px 32px;padding:30px 0;grid-template-columns:1fr;gap:8px}.cp-closing-mark{font-size:65px;text-align:start}.cp-footer{padding:0 20px 28px;flex-wrap:wrap;gap:12px}.cp-footer p{order:3;flex-basis:100%}.cp[dir=rtl] h1{font-size:37px}.cp[dir=rtl] .cp-closing-mark{text-align:right}}
        @media(prefers-reduced-motion:reduce){.cp *{transition:none!important;scroll-behavior:auto!important}}
      `}</style>
    </main>
  );
}

