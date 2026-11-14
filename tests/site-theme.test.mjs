import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(path.resolve(import.meta.dirname, "../lib/site-theme.ts"), "utf8");
const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
vm.runInNewContext(output, { exports }, { filename: "site-theme.ts" });
const { siteTheme } = exports;

test("approved palette is shared and retained", () => {
  assert.equal(JSON.stringify(siteTheme({ background: "#111820", surface: "#1B2630", accent: "#D4AF37" })), JSON.stringify({ background: "#111820", surface: "#1B2630", accent: "#D4AF37" }));
});

test("invalid or low-contrast colors fall back safely", () => {
  const theme = siteTheme({ background: "#ffffff", surface: "red;url(x)", accent: "#080808" });
  assert.equal(theme.background, "#111820");
  assert.equal(theme.surface, "#1B2630");
  assert.equal(theme.accent, "#D4AF37");
});
