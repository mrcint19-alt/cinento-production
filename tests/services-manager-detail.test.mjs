import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const file = path.resolve(import.meta.dirname, "../app/[lang]/page.tsx");
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
  assert.match(text, /serviceHasDistinctDetail\(item\) \? <details/);
  assert.match(text, /<details className="group">[\s\S]*?<summary className="[^"]*focus-visible:outline/);
  assert.match(text, /\{serviceDetailText\(item\)\}<\/p>/);
});
