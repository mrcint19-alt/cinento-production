import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
const file = path.resolve(import.meta.dirname, "../app/api/admin/images/route.ts");
const code = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
const legacy = { active: { hero: "/images/old-hero.png", gallery: "", projects: "" } };
function setup({ preview = false, authorized = true, rows = [] } = {}) {
  const calls = [], uploads = [], removals = [];
  const state = { rows: [...rows] };
  function builder() {
    const filters = []; let action = "select", value;
    const result = single => {
      calls.push({ action, value, filters: [...filters] });
      const matched = state.rows.filter(row => filters.every(([key, expected]) => row[key] === expected));
      if (action === "insert") { state.rows.push({ is_active: false, ...value }); return { data: null, error: null }; }
      if (action === "update") { matched.forEach(row => Object.assign(row, value)); return { data: null, error: null }; }
      if (action === "delete") { state.rows = state.rows.filter(row => !matched.includes(row)); return { data: null, error: null }; }
      return { data: single ? matched[0] ?? null : matched, error: null };
    };
    const query = {
      select() { return query; }, order() { return query; },
      eq(key, expected) { filters.push([key, expected]); return query; },
      insert(record) { action = "insert"; value = record; return query; },
      update(record) { action = "update"; value = record; return query; },
      delete() { action = "delete"; return query; },
      maybeSingle() { return Promise.resolve(result(true)); },
      then(resolve, reject) { return Promise.resolve(result(false)).then(resolve, reject); },
    };
    return query;
  }
  const client = { from: () => builder(), auth: { getUser: async () => ({ data: { user: { id: "admin" } }, error: null }) }, storage: { from: () => ({
    upload: async (storagePath, bytes, options) => { uploads.push({ storagePath, bytes, options }); return { error: null }; },
    getPublicUrl: storagePath => ({ data: { publicUrl: "https://media.example/" + storagePath } }),
    remove: async paths => { removals.push(...paths); return { error: null }; },
  }) } };
  const session = { client, allowed: id => id === "admin", finish: response => response };
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, URL, File, Uint8Array, performance, crypto: { randomUUID: () => "test-uuid" }, process: { env: { VERCEL_ENV: preview ? "preview" : "production" } }, require: id => {
    if (id === "next/server") return { NextResponse: { json: (data, options) => Response.json(data, options) } };
    if (id.endsWith("images.json")) return { __esModule: true, default: legacy };
    if (id.endsWith("program-catalog")) return { publicCatalogClient: () => client, catalogSession: () => authorized ? session : null, sameOrigin: request => request.sameOrigin !== false, readBoundedJson: async request => request.bodyValue };
    throw Error("Unexpected dependency: " + id);
  } });
  return { api: module.exports, calls, uploads, removals, state };
}
const png = () => new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0])], "camera.png", { type: "image/png" });
const uploadRequest = (file = png(), folder = "icons") => ({ headers: new Headers({ "content-length": "1024" }), formData: async () => ({ get: key => key === "file" ? file : folder }) });
const media = [
  { url: "https://media.example/gallery/frame.png", folder: "gallery", storage_path: "gallery/frame.png", is_active: true },
  { url: "https://media.example/icons/camera.png", folder: "gallery", storage_path: "icons/camera.png", is_active: false },
];
test("GET keeps icon uploads out of the public Gallery without a database migration", async () => {
  const mock = setup({ rows: media });
  const result = await (await mock.api.GET()).json();
  assert.ok(result.images.gallery.includes(media[0].url));
  assert.equal(result.images.gallery.includes(media[1].url), false);
  assert.deepEqual(result.images.icons, [media[1].url]);
  assert.equal(result.active.gallery, media[0].url);
  assert.equal("icons" in result.active, false);
  assert.equal(result.readOnly, false);
});
test("an icon upload reuses the bucket, database folder and authorization path", async () => {
  const mock = setup();
  const response = await mock.api.POST(uploadRequest());
  assert.equal(response.status, 200);
  assert.equal(mock.uploads[0].storagePath, "icons/test-uuid.png");
  const insert = mock.calls.find(call => call.action === "insert").value;
  assert.equal(insert.folder, "gallery");
  assert.equal(insert.storage_path, "icons/test-uuid.png");
  const result = await (await mock.api.GET()).json();
  assert.equal(result.images.gallery.includes(insert.url), false);
  assert.ok(result.images.icons.includes(insert.url));
});
test("existing Gallery uploads retain their old folder and listing", async () => {
  const mock = setup();
  assert.equal((await mock.api.POST(uploadRequest(png(), "gallery"))).status, 200);
  assert.equal(mock.uploads[0].storagePath, "gallery/test-uuid.png");
  const result = await (await mock.api.GET()).json();
  assert.ok(result.images.gallery.includes("https://media.example/gallery/test-uuid.png"));
  assert.equal(result.images.icons.length, 0);
});
test("SVG and disguised image uploads are rejected before storing bytes", async () => {
  const mock = setup();
  const svg = new File(["<svg></svg>"], "icon.svg", { type: "image/svg+xml" });
  const disguised = new File(["not an image"], "icon.png", { type: "image/png" });
  for (const file of [svg, disguised]) assert.equal((await mock.api.POST(uploadRequest(file))).status, 400);
  assert.equal(mock.uploads.length, 0);
  assert.equal(mock.calls.some(call => call.action === "insert"), false);
});
test("preview reads are snapshots and all writes stay blocked", async () => {
  const mock = setup({ preview: true });
  const data = await (await mock.api.GET()).json();
  assert.equal(data.readOnly, true);
  assert.equal(data.images.icons.length, 0);
  for (const method of ["POST", "PATCH", "DELETE"]) assert.equal((await mock.api[method]({ bodyValue: { folder: "icons", url: media[1].url } })).status, 401);
  assert.equal(mock.calls.length, 0);
  assert.equal(mock.uploads.length, 0);
});
test("administrator and same-origin checks still protect icon uploads", async () => {
  assert.equal((await setup({ authorized: false }).api.POST(uploadRequest())).status, 401);
  assert.equal((await setup().api.POST({ ...uploadRequest(), sameOrigin: false })).status, 401);
});
test("icon files cannot become active Hero or Gallery images", async () => {
  const mock = setup({ rows: media });
  assert.equal((await mock.api.PATCH({ bodyValue: { folder: "icons", url: media[1].url } })).status, 400);
  assert.equal((await mock.api.PATCH({ bodyValue: { folder: "gallery", url: media[1].url } })).status, 400);
  assert.equal(mock.calls.some(call => call.action === "update"), false);
});
test("deleting an icon removes only its existing media record and storage object", async () => {
  const mock = setup({ rows: media });
  assert.equal((await mock.api.DELETE({ bodyValue: { folder: "icons", url: media[1].url } })).status, 200);
  assert.deepEqual(mock.removals, ["icons/camera.png"]);
  assert.ok(mock.state.rows.some(row => row.url === media[0].url));
  assert.equal(mock.state.rows.some(row => row.url === media[1].url), false);
});
test("a mismatched folder cannot delete an icon image or another Gallery image", async () => {
  const mock = setup({ rows: media });
  assert.equal((await mock.api.DELETE({ bodyValue: { folder: "gallery", url: media[1].url } })).status, 400);
  assert.equal((await mock.api.DELETE({ bodyValue: { folder: "icons", url: media[0].url } })).status, 400);
  assert.equal(mock.removals.length, 0);
});
