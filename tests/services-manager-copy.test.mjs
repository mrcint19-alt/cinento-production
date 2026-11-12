import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const publicPath = path.resolve(import.meta.dirname, "../app/[lang]/page.tsx");
const adminPath = path.resolve(import.meta.dirname, "../app/admin/content/page.tsx");
const publicSource = ts.createSourceFile(publicPath, readFileSync(publicPath, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const adminText = readFileSync(adminPath, "utf8");
const helper = publicSource.statements.find(statement =>
  ts.isFunctionDeclaration(statement) && statement.name?.text === "serviceCardSummary"
);
assert.ok(helper, "public service cards need a summary selector");
const compiled = ts.transpileModule(`${helper.getText(publicSource)}\nmodule.exports = serviceCardSummary;`, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const sandbox = { module: { exports: {} } };
vm.runInNewContext(compiled, sandbox, { filename: publicPath });
const serviceCardSummary = sandbox.module.exports;

test("old services retain their existing card copy", () => {
  const old = { id: "legacy", title: "Service", description: "Original description" };
  assert.equal(serviceCardSummary(old), "Original description");
  assert.equal(old.description, "Original description");
});

test("card summary takes precedence while the full description remains intact", () => {
  const item = { title: "Service", description: "Existing", shortDescription: "  Card text  ", fullDescription: "Detailed text" };
  assert.equal(serviceCardSummary(item), "Card text");
  assert.equal(item.fullDescription, "Detailed text");
  assert.equal(item.description, "Existing");
});

test("blank or absent summary safely falls back to the existing description", () => {
  for (const shortDescription of ["", "  \n  ", undefined]) {
    assert.equal(serviceCardSummary({ title: "Service", description: "Fallback", shortDescription }), "Fallback");
  }
});

test("EN/TR/FA/AR copy stays independent through JSON storage", () => {
  const stored = Object.fromEntries(["en", "tr", "fa", "ar"].map(lang => [lang, {
    services: { items: [{ id: "shared", title: lang, description: `${lang} legacy`, shortDescription: `${lang} card`, fullDescription: `${lang} detail` }] },
  }]));
  const restored = JSON.parse(JSON.stringify(stored));
  for (const lang of ["en", "tr", "fa", "ar"]) {
    const item = restored[lang].services.items[0];
    assert.equal(serviceCardSummary(item), `${lang} card`);
    assert.equal(item.fullDescription, `${lang} detail`);
  }
  restored.fa.services.items[0].shortDescription = "متن کارت";
  assert.equal(serviceCardSummary(restored.en.services.items[0]), "en card");
});

test("dashboard edits both copy fields in the existing Services section and public cards use the selector", () => {
  assert.match(adminText, /updateItem\(setServices, index, "shortDescription", value\)/);
  assert.match(adminText, /updateItem\(setServices, index, "fullDescription", value\)/);
  assert.match(adminText, /services: \{ \.\.\.data\?\.\[lang\]\?\.services, title: servicesTitle, subtitle: servicesSubtitle, items: services \}/);
  assert.match(readFileSync(publicPath, "utf8"), /\{serviceCardSummary\(item\)\}<\/p>/);
});
