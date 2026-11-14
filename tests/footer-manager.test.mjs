// CINENTO Footer Manager PRO v1.0 | 2026-11-14
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
const require = createRequire(import.meta.url);
function compile(relative, dependencies = {}) {
  const exports = {};
  const output = ts.transpileModule(readFileSync(new URL(relative, import.meta.url), "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(output, { exports, URL, require: name => dependencies[name] ?? require(name) });
  return exports;
}
const helpers = compile("../lib/footer-manager.ts");
const { footerShared, footerHref, footerErrors } = helpers;
const Footer = compile("../components/ManagedFooter.tsx", { "../lib/footer-manager": helpers }).default;
test("legacy content does not enable migration or invent contact values", () => {
  const value = footerShared(undefined);
  assert.equal(value.enabled, false);
  assert.equal(value.email, "");
  assert.equal(value.legalOwner, "");
});
test("links reject executable URLs and malformed contact data", () => {
  for (const input of ["javascript:alert(1)", "data:text/html,hello", "https://user:password@example.com"]) assert.equal(footerHref("website", input), null);
  assert.equal(footerHref("email", "hello@example.com?bcc=other@example.com"), null);
  assert.equal(footerHref("whatsapp", "123"), null);
  assert.equal(footerHref("whatsapp", "+90 (555) 123-4567"), "https://wa.me/905551234567");
  assert.equal(footerErrors({ enabled: true, website: "javascript:alert(1)" }).length, 1);
});
test("settings survive storage with visibility and explicit blank values", () => {
  const value = footerShared({ enabled: true, email: "a@example.com", visible: { email: false }, website: "" });
  assert.equal(JSON.stringify(footerShared(JSON.parse(JSON.stringify(value)))), JSON.stringify(value));
  assert.equal(value.visible.email, false);
});
test("four language copies render independently with shared identity", () => {
  for (const title of ["Contact", "İletişim", "تماس", "اتصال"]) {
    const html = renderToStaticMarkup(React.createElement(Footer, { settings: footerShared({ enabled: true, legalOwner: "CINENTO Film Yapım Ltd. Şti.", whatsapp: "+905551234567", website: "https://cinento.net", visible: { website: false } }), brand: "CINENTO", whatsappLabel: "Fallback", copy: { brandLine: title, contactTitle: title, followTitle: "Social", rights: "Rights", whatsappText: `WA ${title}` } }));
    assert.ok(html.includes(title));
    assert.ok(html.includes("CINENTO Film Yapım Ltd. Şti."));
    assert.ok(html.includes(`WA ${title}`));
    assert.ok(!html.includes('href="https://cinento.net/"'));
    assert.ok(html.includes("https://wa.me/905551234567"));
  }
});
test("blank channels stay hidden and legal text is escaped", () => {
  const html = renderToStaticMarkup(React.createElement(Footer, { settings: footerShared({ enabled: true, legalOwner: "<script>bad</script>" }), brand: "Brand", whatsappLabel: "WhatsApp", copy: { brandLine: "", contactTitle: "", followTitle: "", rights: "" } }));
  assert.ok(!html.includes("href="));
  assert.ok(html.includes("&lt;script&gt;"));
});
