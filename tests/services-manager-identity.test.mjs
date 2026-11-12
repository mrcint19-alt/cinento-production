import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const adminFile = path.resolve(import.meta.dirname, "../app/admin/content/page.tsx");
const source = ts.createSourceFile(adminFile, readFileSync(adminFile, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const helper = source.statements.find(statement =>
  ts.isFunctionDeclaration(statement) && statement.name?.text === "appendServiceAcrossLocales"
);
assert.ok(helper, "Services Manager must contain its locale-aware service insertion logic");

const defaults = Object.fromEntries(["en", "tr", "fa", "ar"].map(locale => [locale, {
  items: [{ title: `Existing ${locale}`, description: `Description ${locale}` }],
}]));
const compiled = ts.transpileModule(`${helper.getText(source)}\nmodule.exports = appendServiceAcrossLocales;`, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const sandbox = { module: { exports: {} }, serviceDefaults: defaults, Array };
vm.runInNewContext(compiled, sandbox, { filename: adminFile });
const appendServiceAcrossLocales = sandbox.module.exports;

test("one new service shares an ID across EN/TR/FA/AR without creating translated text", () => {
  const result = appendServiceAcrossLocales({}, "service-42");
  for (const locale of ["en", "tr", "fa", "ar"]) {
    assert.equal(result[locale].services.items.at(-1).id, "service-42");
    assert.equal(result[locale].services.items.at(-1).title, "");
    assert.equal(result[locale].services.items.at(-1).description, "");
    assert.equal(result[locale].services.items[0].title, `Existing ${locale}`);
  }
});

test("legacy records and unrelated homepage sections remain unchanged", () => {
  const oldItems = Array.from({ length: 4 }, (_, index) => ({ title: `Legacy ${index}`, description: "Original" }));
  const current = { en: { services: { title: "Services", items: oldItems }, hero: { title: "CINENTO" } }, tr: { services: { items: [] } }, custom: "preserve" };
  const result = appendServiceAcrossLocales(current, "service-new");
  assert.equal(result.en.services.items.length, 5);
  assert.equal(result.en.services.items.slice(0, 4).every((item, index) => item === oldItems[index] && !Object.hasOwn(item, "id")), true);
  assert.equal(result.en.services.title, "Services");
  assert.equal(result.en.hero, current.en.hero);
  assert.equal(result.custom, "preserve");
  assert.equal(result.tr.services.items.length, 1);
  assert.equal(current.en.services.items.length, 4);
});

test("a sixth service survives serialization with the same ID in every locale", () => {
  const current = Object.fromEntries(["en", "tr", "fa", "ar"].map(locale => [locale, {
    services: { items: Array.from({ length: 5 }, (_, index) => ({ id: `existing-${index}`, title: `${locale}-${index}`, description: "" })) },
  }]));
  const saved = JSON.parse(JSON.stringify(appendServiceAcrossLocales(current, "sixth")));
  for (const locale of ["en", "tr", "fa", "ar"]) {
    assert.equal(saved[locale].services.items.length, 6);
    assert.equal(saved[locale].services.items[5].id, "sixth");
  }
});

test("editing one locale does not alter another locale's text", () => {
  const result = appendServiceAcrossLocales({}, "new-id");
  result.fa.services.items.at(-1).title = "خدمت جدید";
  assert.equal(result.en.services.items.at(-1).title, "");
  assert.equal(result.tr.services.items.at(-1).title, "");
  assert.equal(result.ar.services.items.at(-1).title, "");
});

test("reordering and archiving a new service preserve its identity", () => {
  const result = appendServiceAcrossLocales({}, "moveable-id");
  const items = result.en.services.items;
  const reordered = [items[1], items[0]];
  const archived = { ...reordered[0], status: "archived" };
  assert.equal(archived.id, "moveable-id");
  assert.equal(result.tr.services.items.at(-1).id, archived.id);
  assert.equal(result.en.services.items[0].title, "Existing en");
});
