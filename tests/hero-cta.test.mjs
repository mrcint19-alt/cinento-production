import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(path.resolve(import.meta.dirname, "../lib/hero-cta.ts"), "utf8");
const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
vm.runInNewContext(output, { exports }, { filename: "hero-cta.ts" });
const { heroLink, heroIcon } = exports;

test("legacy buttons retain their destinations in every language", () => {
  for (const lang of ["en", "tr", "fa", "ar"]) {
    assert.equal(heroLink("#contact", lang, "watch").href, "#contact");
    assert.equal(heroLink("/platforms", lang, "/platforms").href, `/${lang}/platforms`);
    assert.equal(heroLink(undefined, lang, "watch").href, "https://watch.cinento.net");
  }
});

test("internal pages follow the selected language and Watch opens externally", () => {
  assert.equal(heroLink("/journal", "fa", "watch").href, "/fa/journal");
  assert.equal(heroLink("#about", "ar", "watch").external, false);
  assert.equal(heroLink("watch", "tr", "/platforms").external, true);
});

test("unapproved destinations and icons cannot become executable links or markup", () => {
  for (const value of ["javascript:alert(1)", "https://elsewhere.example", "//elsewhere.example", "/admin"]) {
    assert.equal(heroLink(value, "en", "watch").href, "https://watch.cinento.net");
  }
  assert.equal(heroIcon("<script>"), "none");
});
