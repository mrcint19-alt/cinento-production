import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { renderToStaticMarkup } from "react-dom/server";
const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "..");
function load(file, mocks = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(readFileSync(path.join(root, file), "utf8"), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, URL, require: id => id in mocks ? mocks[id] : require(id) });
  return module.exports;
}
const lib = load("lib/site-navigation.ts");
const url = "https://media.example/icons/camera.png";
const nextUrl = "https://media.example/icons/camera-v2.webp";
const labels = { en: "Home", tr: "Ana Sayfa", fa: "خانه", ar: "الرئيسية" };
function fixture() {
  return {
    menuIcon: url, menuIconLibraryId: "camera",
    iconLibrary: [{ id: "camera", name: "Camera", url }, { id: "other", name: "Other", url: "https://media.example/icons/other.png" }],
    items: [
      { id: "home", labels, href: "#home", icon: url, iconLibraryId: "camera", enabled: true },
      { id: "sub", labels: { ...labels, en: "Submenu" }, href: "/platforms", icon: url, iconLibraryId: "camera", parentId: "home", enabled: true },
      { id: "manual", labels, href: "#contact", icon: url, enabled: true },
    ],
  };
}
test("legacy presets and custom URLs survive normalization without adding a collection", () => {
  const old = { menuIcon: "film", items: [{ id: "home", labels, href: "#home", icon: url, enabled: true }] };
  const normalized = lib.siteNavigation(old);
  assert.equal(normalized.menuIcon, "film");
  assert.equal(normalized.items[0].icon, url);
  assert.equal("iconLibrary" in normalized, false);
  assert.deepEqual(JSON.parse(JSON.stringify(old)), old);
});
test("replacing a collection image updates only explicitly linked icons", () => {
  const original = fixture(), before = JSON.stringify(original);
  const edited = lib.editNavigationIcon(original, "camera", { name: "Cinema", url: nextUrl });
  assert.equal(JSON.stringify(original), before);
  assert.equal(edited.menuIcon, nextUrl);
  assert.equal(edited.items[0].icon, nextUrl);
  assert.equal(edited.items[1].icon, nextUrl);
  assert.equal(edited.items[2].icon, url);
  for (let i = 0; i < original.items.length; i++) {
    assert.deepEqual(edited.items[i].labels, original.items[i].labels);
    assert.equal(edited.items[i].href, original.items[i].href);
    assert.equal(edited.items[i].parentId, original.items[i].parentId);
  }
});
test("renaming an icon retains its image and all menu assignments", () => {
  const edited = lib.editNavigationIcon(fixture(), "camera", { name: "My camera" });
  assert.equal(edited.iconLibrary[0].name, "My camera");
  assert.equal(edited.items[0].icon, url);
  assert.equal(edited.items[0].iconLibraryId, "camera");
});
test("removing a collection icon resets linked main, menu and submenu icons only", () => {
  const original = fixture(), before = JSON.stringify(original);
  const removed = lib.removeNavigationIcon(original, "camera");
  assert.equal(removed.menuIcon, "menu");
  assert.equal(removed.menuIconLibraryId, undefined);
  assert.equal(removed.items[0].icon, "home");
  assert.equal(removed.items[1].icon, "star");
  assert.equal(removed.items[0].iconLibraryId, undefined);
  assert.equal(removed.items[2].icon, url);
  assert.equal(removed.iconLibrary.length, 1);
  assert.equal(JSON.stringify(original), before);
});
test("four labels and shared icon bindings survive JSON save and reload", () => {
  const saved = JSON.parse(JSON.stringify(lib.editNavigationIcon(fixture(), "camera", { url: nextUrl })));
  const loaded = lib.siteNavigation(saved);
  assert.equal(loaded.items[0].iconLibraryId, "camera");
  for (const locale of ["en", "tr", "fa", "ar"]) assert.equal(loaded.items[0].labels[locale], labels[locale]);
  assert.equal(loaded.items[0].icon, nextUrl);
  assert.equal(loaded.menuIcon, nextUrl);
});
test("unfinished or invalid collection images use defaults without executing URL markup", () => {
  const menu = fixture();
  menu.iconLibrary[0].url = "javascript:alert(1)";
  const loaded = lib.siteNavigation(menu);
  assert.equal(loaded.menuIcon, "menu");
  assert.equal(loaded.items[0].icon, "home");
  const removedImage = lib.editNavigationIcon(fixture(), "camera", { url: "" });
  assert.equal(removedImage.items[0].icon, "home");
  assert.equal(removedImage.items[0].iconLibraryId, "camera");
});
test("raster library validation accepts Gallery JPG and rejects SVG uploads or unsafe URLs", () => {
  assert.equal(lib.isNavigationImage("/images/gallery/gallery-1.JPG", true), true);
  assert.equal(lib.isNavigationImage(url + "?revision=2", true), true);
  assert.equal(lib.isNavigationImage("https://media.example/a.svg"), true);
  assert.equal(lib.isNavigationImage("https://media.example/a.svg", true), false);
  for (const invalid of ["data:image/png,abc", "javascript:alert(1)", "//media.example/a.png", "http://media.example/a.png", "https://u:p@media.example/a.png", "https://media.example/a.png#fragment"]) assert.equal(lib.isNavigationImage(invalid), false);
});
test("collection IDs are deduplicated and the supported size is bounded", () => {
  const entries = [{ id: "same", name: "A", url }, { id: "same", name: "B", url }, { id: "../bad", name: "Bad", url }];
  assert.equal(lib.navigationIconLibrary(entries).length, 1);
  assert.equal(lib.navigationIconLibrary(Array.from({ length: 100 }, (_, i) => ({ id: "icon-" + i, name: "Icon", url }))).length, lib.MAX_NAVIGATION_ICONS);
});
test("image failure switches to a decorative fallback and reports status only in previews", () => {
  let failed = null;
  const React = require("react");
  const header = load("components/SiteHeader.tsx", {
    react: { ...React, useState: () => [failed, value => { failed = value; }] },
    "next/navigation": {},
    "../lib/site-navigation": lib,
  });
  const initial = header.NavigationIcon({ value: url, fallback: "home" });
  assert.equal(initial.type, "img");
  initial.props.onError();
  const fallback = header.NavigationIcon({ value: url, fallback: "home" });
  assert.equal(fallback.type, "svg");
  assert.equal(fallback.props["aria-hidden"], "true");
  const preview = renderToStaticMarkup(header.NavigationIcon({ value: url, fallback: "home", showStatus: true }));
  assert.match(preview, /fallback shown/);
  assert.doesNotMatch(preview, /<img/);
});
test("dashboard renders collection CRUD and device preview without uploading during render", () => {
  const React = require("react");
  const header = load("components/SiteHeader.tsx", { "next/navigation": {}, "../lib/site-navigation": lib });
  const Editor = load("components/NavigationEditor.tsx", { "next/link": { default: props => React.createElement("a", props) }, "../lib/site-navigation": lib, "./SiteHeader": header }).default;
  const html = renderToStaticMarkup(React.createElement(Editor, { value: fixture(), onChange: () => { throw Error("Rendering must not modify navigation"); } }));
  for (const control of ["Add icon", "Icon name", "Remove icon", "Upload replacement", "Mobile preview", "Desktop preview", "Gallery images", "saved icon collection"]) assert.ok(html.includes(control), control);
  assert.match(html, /Preview does not save changes/);
});
