import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(path.resolve(import.meta.dirname, "../lib/site-navigation.ts"), "utf8");
const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
vm.runInNewContext(output, { exports, URL }, { filename: "site-navigation.ts" });
const { navigationFromContent, siteNavigation, validNavigationHref, localeHref, switchLocalePath } = exports;

test("existing header links survive conversion and products remains available", () => {
  const menu = navigationFromContent({ en: { nav: [{ label: "Home", href: "#home" }, { label: "News", href: "#journal" }] }, tr: { nav: [{ label: "Ana Sayfa", href: "#home" }, { label: "Haberler", href: "#journal" }] } });
  assert.equal(menu.items[0].labels.tr, "Ana Sayfa");
  assert.equal(menu.items[1].labels.en, "News");
  assert.ok(menu.items.some(item => item.id === "platforms"));
});

test("menu destinations reject executable and protocol-relative URLs", () => {
  for (const href of ["javascript:alert(1)", "//evil.example", "http://example.com", "/admin?x=1"]) assert.equal(validNavigationHref(href), false);
  assert.equal(siteNavigation({ menuIcon: "menu", items: [{ id: "unsafe", href: "javascript:alert(1)", icon: "star", enabled: true, labels: { en: "Unsafe", tr: "", fa: "", ar: "" } }] }).items[0].href, "");
});

test("language switch preserves equivalent catalog pages and RTL section paths", () => {
  assert.equal(localeHref("#contact", "fa"), "/fa#contact");
  assert.equal(localeHref("/platforms", "tr"), "/tr/platforms");
  assert.equal(switchLocalePath("/en/platforms/ai", "ar"), "/ar/platforms/ai");
  assert.equal(switchLocalePath("/en/about", "fa"), "/fa#about");
});
