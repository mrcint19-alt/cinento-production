import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";

const file = path.resolve(import.meta.dirname, "../app/[lang]/HomepageClient.tsx");
const text = readFileSync(file, "utf8");
const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const helper = source.statements.find(statement => ts.isFunctionDeclaration(statement) && statement.name?.text === "serviceDetailText");
const summaryHelper = source.statements.find(statement => ts.isFunctionDeclaration(statement) && statement.name?.text === "serviceCardSummary");
const distinctHelper = source.statements.find(statement => ts.isFunctionDeclaration(statement) && statement.name?.text === "serviceHasDistinctDetail");
assert.ok(helper, "public services need detail copy selection");
assert.ok(summaryHelper && distinctHelper, "service cards need a distinct detail check");
const compiled = ts.transpileModule(`${summaryHelper.getText(source)}\n${helper.getText(source)}\n${distinctHelper.getText(source)}\nmodule.exports = { serviceDetailText, serviceHasDistinctDetail };`, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const sandbox = { module: { exports: {} } };
vm.runInNewContext(compiled, sandbox, { filename: file });
const { serviceDetailText, serviceHasDistinctDetail } = sandbox.module.exports;

test("new detail copy is shown without changing legacy or card text", () => {
  const item = { id: "one", title: "Service", description: "Original", shortDescription: "Card", fullDescription: "  Detailed copy  " };
  assert.equal(serviceDetailText(item), "Detailed copy");
  assert.equal(item.shortDescription, "Card");
  assert.equal(item.description, "Original");
});

test("legacy and blank full descriptions fall back to the existing description", () => {
  for (const fullDescription of [undefined, "", "  \n "]) {
    assert.equal(serviceDetailText({ title: "Legacy", description: "Original", fullDescription }), "Original");
    assert.equal(serviceHasDistinctDetail({ title: "Legacy", description: "Original", fullDescription }), false);
  }
});

test("only a different detail opens a service card", () => {
  assert.equal(serviceHasDistinctDetail({ description: "Original", fullDescription: " Original " }), false);
  assert.equal(serviceHasDistinctDetail({ description: "Original", shortDescription: "Summary" }), true);
  assert.equal(serviceHasDistinctDetail({ description: "Original", fullDescription: "Detailed copy" }), true);
});

test("EN/TR/FA/AR details remain independent after storage", () => {
  const saved = JSON.parse(JSON.stringify(Object.fromEntries(["en", "tr", "fa", "ar"].map(lang => [lang, {
    services: { items: [{ id: "shared", description: `${lang} old`, fullDescription: `${lang} detail` }] },
  }]))));
  saved.fa.services.items[0].fullDescription = "شرح کامل";
  for (const lang of ["en", "tr", "ar"]) assert.equal(serviceDetailText(saved[lang].services.items[0]), `${lang} detail`);
  assert.equal(serviceDetailText(saved.fa.services.items[0]), "شرح کامل");
});

test("the existing public service filter and accessible card toggle remain in use", () => {
  assert.match(text, /items\.filter\(item => item\.title\.trim\(\) && item\.status !== "archived"\)/);
  assert.match(text, /serviceHasDistinctDetail\(item\) \|\| serviceCardSummary\(item\)\.length > 240 \? <details/);
  assert.match(text, /<details className="group">[\s\S]*?<summary className="[^"]*focus-visible:outline/);
  assert.match(text, /\{serviceDetailText\(item\)\}<\/p>/);
});

const uiStatement = source.statements.find(statement => ts.isVariableStatement(statement) && statement.declarationList.declarations.some(declaration => declaration.name.getText(source) === "ui"));
const sectionStart = text.indexOf('<section className="border-y border-white/5 site-band py-20"');
const sectionEnd = text.indexOf("</section>", sectionStart) + "</section>".length;
assert.ok(uiStatement && sectionStart >= 0 && sectionEnd > sectionStart);
const renderCode = ts.transpileModule([
  uiStatement.getText(source), summaryHelper.getText(source), helper.getText(source), distinctHelper.getText(source),
  `module.exports = function ServiceFixture({content, lang}) { return (${text.slice(sectionStart, sectionEnd)}); };`,
].join("\n"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const renderSandbox = { module: { exports: {} }, require: createRequire(import.meta.url) };
renderSandbox.exports = renderSandbox.module.exports;
vm.runInNewContext(renderCode, renderSandbox);
const renderServices = (lang, services) => renderToStaticMarkup(renderSandbox.module.exports({ lang, content: { services } }));

test("long legacy copy can expand without duplicating or changing the stored text", () => {
  const introduction = "Introduction ".repeat(40);
  const description = "Complete service description ".repeat(20);
  const services = { title: "Services", subtitle: introduction, items: [{ title: "Production", description }] };
  const original = JSON.stringify(services);
  const html = renderServices("en", services);
  assert.equal((html.match(/<details\b/g) || []).length, 2);
  assert.ok(html.includes(introduction) && html.includes(description));
  assert.equal(html.split(description).length - 1, 1);
  assert.match(html, /group-open:line-clamp-none/);
  assert.match(html, /grid items-start/);
  assert.match(html, /Read more/);
  assert.equal(JSON.stringify(services), original);
});

test("short cards remain direct and archived services stay hidden", () => {
  const html = renderServices("en", { title: "Services", subtitle: "Introduction", items: [
    { title: "Visible", description: "Short copy" },
    { title: "Archived", description: "Hidden copy", status: "archived" },
  ] });
  assert.ok(html.includes("Short copy"));
  assert.doesNotMatch(html, /<details\b|Hidden copy/);
});

test("detail controls follow the selected language and preserve independent full copy", () => {
  for (const [lang, label] of [["en", "View service details"], ["tr", "Hizmet ayrıntılarını göster"], ["fa", "مشاهده جزئیات خدمت"], ["ar", "عرض تفاصيل الخدمة"]]) {
    const html = renderServices(lang, { title: lang, subtitle: "Intro", items: [{ title: "Service", description: "Legacy", shortDescription: "Summary", fullDescription: "Full detail" }] });
    assert.ok(html.includes(label) && html.includes("Summary") && html.includes("Full detail"));
    assert.doesNotMatch(html, /Legacy/);
  }
});
