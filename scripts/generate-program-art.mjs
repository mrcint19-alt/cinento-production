import { mkdir, writeFile } from "node:fs/promises";
import { readFile } from "node:fs/promises";

// Editorial concept art for the catalog. Approved product imagery can replace each asset in Dashboard.
const programs = JSON.parse(await readFile(new URL("../app/data/programs.json", import.meta.url), "utf8"));
const output = new URL("../public/images/programs/", import.meta.url);
await mkdir(output, { recursive: true });
const art = {
  ai: ["#00c6ac", "#15417a", "M330 100l75 185 185 75-185 75-75 185-75-185-185-75 185-75z"],
  watch: ["#d9ad65", "#4a2031", "M260 140v360m60-350 300 165-300 165zM650 140v360"],
  enterprise: ["#97c4d0", "#283b55", "M290 170h130v130H290zM460 170h130v130H460zM290 340h130v130H290zM460 340h130v130H460z"],
  autocall: ["#d6c875", "#46504f", "M345 160c-55 20-20 110 45 205s145 135 205 85l-75-80-50 40c-50-20-80-55-100-100l40-50z"],
  crm: ["#a7d4bc", "#194b43", "M420 290a75 75 0 1 0 0-150 75 75 0 1 0 0 150zM295 470v-36c0-100 250-100 250 0v36M595 170a60 60 0 0 1 0 120"],
  vpn: ["#aaa9f2", "#292a55", "M435 125l165 65v140c0 95-65 160-165 210-100-50-165-115-165-210V190zM365 325l55 55 100-110"],
  "ai-studio-desktop": ["#e0a8e0", "#443354", "M270 145h330v250H270zM310 455h250M435 395v60M340 275l60 60 130-140"],
  "ai-studio-web": ["#7bded2", "#145653", "M255 155h360v300H255zM255 220h360M335 325l70 70 135-140"],
  "budget-studio": ["#e7c376", "#664525", "M305 150h260v340H305zM355 225h160M355 285h160M355 350h65M455 350h60M355 415h65M455 415h60"],
  "enterprise-os": ["#c0c9dc", "#313e5b", "M260 235l175-100 175 100-175 100zM260 335l175 100 175-100M260 430l175 100 175-100"],
  "app-center": ["#edab87", "#603d50", "M275 155h145v145H275zM450 155h145v145H450zM275 330h145v145H275zM450 330h145v145H450z"],
  "cv-kart": ["#a5c5ec", "#2b4166", "M310 155h250v340H310zM365 255a45 45 0 1 0 0-90 45 45 0 1 0 0 90zM340 335h190M340 390h190M340 445h125"],
  "outreach-crm": ["#c4d18e", "#41523c", "M270 180h320v250H430l-100 85v-85h-60zM330 265h200M330 330h140"],
};
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
for (const [number, program] of programs.entries()) {
  const [accent, deep, path] = art[program.id];
  const name = escape(program.name);
  const wordmark = escape(program.name.replace(/^CINENTO\s*/, ""));
  const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${deep}"/><stop offset="1" stop-color="#090e14"/></linearGradient></defs><rect width="640" height="640" rx="120" fill="url(#g)"/><circle cx="320" cy="320" r="232" fill="none" stroke="${accent}" opacity=".18" stroke-width="2"/><path d="${path}" transform="translate(50 65) scale(.65)" fill="none" stroke="${accent}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="M110 500h420" stroke="${accent}" opacity=".6" stroke-width="4"/></svg>`;
  const cover = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><defs><radialGradient id="g"><stop stop-color="${deep}"/><stop offset="1" stop-color="#080b10"/></radialGradient><pattern id="p" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M56 0H0V56" fill="none" stroke="${accent}" opacity=".08"/></pattern></defs><rect width="1200" height="675" fill="url(#g)"/><rect width="1200" height="675" fill="url(#p)"/><circle cx="825" cy="318" r="265" fill="none" stroke="${accent}" opacity=".25"/><circle cx="825" cy="318" r="210" fill="none" stroke="${accent}" opacity=".12"/><path d="${path}" transform="translate(355 18) scale(1.07)" fill="none" stroke="${accent}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/><path d="M76 75h220" stroke="${accent}" stroke-width="4"/><text x="76" y="132" fill="#f6f3eb" font-family="Arial,sans-serif" font-size="24" letter-spacing="7">CINENTO / ${String(number + 1).padStart(2, "0")}</text><text x="76" y="548" fill="#f6f3eb" font-family="Arial,sans-serif" font-size="46" font-weight="700">${name}</text><text x="78" y="600" fill="${accent}" font-family="Arial,sans-serif" font-size="20" letter-spacing="5">${program.category.toUpperCase()}</text></svg>`;
  const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 170"><path d="M74 35a50 50 0 1 0 0 100" fill="none" stroke="${accent}" stroke-width="17" stroke-linecap="round"/><text x="145" y="82" fill="#f8f5ed" font-family="Arial,sans-serif" font-size="37" font-weight="700" letter-spacing="4">CINENTO</text><text x="147" y="129" fill="${accent}" font-family="Arial,sans-serif" font-size="29" letter-spacing="2">${wordmark}</text></svg>`;
  await Promise.all([["icon", icon], ["cover", cover], ["logo", logo]].map(([kind, svg]) =>
    writeFile(new URL(`${program.id}-${kind}.svg`, output), svg)));
}
