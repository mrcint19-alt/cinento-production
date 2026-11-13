import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(path.resolve(import.meta.dirname, "../lib/hero-slides.ts"), "utf8");
const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
vm.runInNewContext(output, { exports }, { filename: "hero-slides.ts" });
const { addHeroSlide, moveHeroSlide, removeHeroSlide, setHeroSlideImage, visibleHeroSlides } = exports;

test("adding a slide shares identity but keeps translations separate", () => {
  const original = { en: { hero: { title: "Main", slides: [] }, services: { title: "Keep" } }, tr: { hero: { slides: [] } }, custom: "keep" };
  const updated = addHeroSlide(original, "slide-one");
  updated.fa.hero.slides[0].title = "عنوان";
  assert.equal(updated.en.hero.slides[0].title, "");
  assert.equal(updated.ar.hero.slides[0].id, "slide-one");
  assert.equal(updated.en.services.title, "Keep");
  assert.equal(updated.custom, "keep");
  assert.equal(original.en.hero.slides.length, 0);
});

test("image, order and removal stay aligned in all four languages", () => {
  let data = addHeroSlide(addHeroSlide({}, "first"), "second");
  data.en.hero.slides[0].title = "English";
  data.tr.hero.slides[0].title = "Türkçe";
  data = setHeroSlideImage(data, "first", "/images/hero/one.png");
  data = moveHeroSlide(data, "second", -1);
  for (const lang of ["en", "tr", "fa", "ar"]) {
    assert.equal(data[lang].hero.slides[1].id, "first");
    assert.equal(data[lang].hero.slides[1].image, "/images/hero/one.png");
  }
  assert.equal(data.en.hero.slides[1].title, "English");
  assert.equal(data.tr.hero.slides[1].title, "Türkçe");
  data = removeHeroSlide(data, "second");
  for (const lang of ["en", "tr", "fa", "ar"]) assert.equal(data[lang].hero.slides.length, 1);
});

test("incomplete slides do not replace the existing Hero card", () => {
  assert.equal(visibleHeroSlides(undefined).length, 0);
  assert.equal(visibleHeroSlides([{ id: "one", title: "  ", subtitle: "Detail", image: "" }]).length, 0);
  assert.equal(visibleHeroSlides([{ id: "one", title: "Ready", subtitle: "", image: "" }]).length, 1);
});
