import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "..");
const cache = new Map();
function compile(file, mocks = {}) {
  const code = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  const localRequire = id => {
    if (id in mocks) return { __esModule: true, ...mocks[id] };
    if (!id.startsWith(".")) return require(id);
    const absolute = path.resolve(path.dirname(file), id);
    if (absolute.endsWith(".json")) return JSON.parse(readFileSync(absolute, "utf8"));
    if (!cache.has(absolute)) cache.set(absolute, compile(absolute + ".ts"));
    return cache.get(absolute);
  };
  vm.runInNewContext(code, { module, exports: module.exports, require: localRequire, URL, console });
  return module.exports;
}

const Client = compile(path.join(root, "app/[lang]/HomepageClient.tsx"), {
  "next/image": { default: props => React.createElement("img", { src: props.src, alt: props.alt }) },
  "../../components/SiteHeader": { default: props => React.createElement("header", null, props.brand) },
  "../../components/ManagedFooter": { default: () => React.createElement("footer") },
}).default;

test("first server-rendered HTML contains dashboard text, images and catalog in all four locales", () => {
  for (const lang of ["en", "tr", "fa", "ar"]) {
    const initialData = { [lang]: {
      brand: "Dashboard Brand",
      hero: { title: lang + " saved hero", description: lang + " saved description" },
      services: { title: lang + " saved services", subtitle: "Saved introduction", items: [] },
    }, theme: { background: "#111820", surface: "#182630", accent: "#e4af37" } };
    const program = { id: "saved-program", name: "Saved catalog", mark: "S", category: "business", status: "active", copy: { [lang]: { description: "Saved catalog description" } } };
    const html = renderToStaticMarkup(React.createElement(Client, {
      lang, initialData, initialImages: { hero: ["/saved-image.jpg"], gallery: [], projects: [], active: { hero: "/saved-image.jpg", gallery: "", projects: "" } },
      initialPrograms: [program],
    }));
    assert.ok(html.includes(lang + " saved hero"));
    assert.ok(html.includes(lang + " saved services"));
    assert.ok(html.includes("/saved-image.jpg"));
    assert.ok(html.includes("Saved catalog description"));
    assert.doesNotMatch(html, /next-generation film development platform/);
  }
});

function PageWithReaders(readers) {
  return compile(path.join(root, "app/[lang]/page.tsx"), {
    "next/server": { NextRequest: class { constructor(url) { this.nextUrl = new URL(url); } } },
    "./HomepageClient": { default: () => null },
    "../api/content/homepage/route": { GET: readers.content },
    "../api/admin/images/route": { GET: readers.images },
    "../api/programs/route": { GET: readers.programs },
  }).default;
}
const response = value => Promise.resolve({ ok: true, json: async () => value });
test("server readers use public catalog scope and preserve empty results", async () => {
  const Page = PageWithReaders({
    content: () => response({ en: { brand: "Stored" } }),
    images: () => response({ success: true, images: { hero: [], gallery: [], projects: [] }, active: { hero: "", gallery: "", projects: "" } }),
    programs: req => { assert.equal(req.nextUrl.searchParams.has("scope"), false); return response({ programs: [] }); },
  });
  const element = await Page({ params: Promise.resolve({ lang: "ar" }) });
  assert.equal(element.props.lang, "ar");
  assert.equal(element.props.initialData.en.brand, "Stored");
  assert.equal(element.props.initialPrograms.length, 0);
  assert.equal(element.props.initialImages.hero.length, 0);
});
test("one failed reader retains the other successful sources", async () => {
  const Page = PageWithReaders({
    content: () => Promise.reject(new Error("temporary outage")),
    images: () => response({ success: true, images: { hero: [], gallery: [], projects: [] }, active: {} }),
    programs: () => response({ programs: [] }),
  });
  const element = await Page({ params: Promise.resolve({ lang: "en" }) });
  assert.equal(element.props.initialData, null);
  assert.ok(element.props.initialImages);
  assert.equal(element.props.initialPrograms.length, 0);
});
