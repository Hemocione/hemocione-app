// Botao do Hemarcio na home: intervalo quando nao pode doar; duvidas nos demais casos.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { buildSync } = require("esbuild");

const root = path.join(__dirname, "..");
const bundle = buildSync({
  entryPoints: [path.join(root, "utils/hemarcioBridge.ts")],
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
  nodePaths: [path.join(root, "node_modules")],
});
const mod = { exports: {} };
new Function("module", "exports", "require", bundle.outputFiles[0].text)(mod, mod.exports, require);
const { homeHemarcioCta, isHemarcioIntentId } = mod.exports;

test("ainda nao pode doar: pergunta quando pode doar de novo", () => {
  const cta = homeHemarcioCta("unable-to-donate");
  assert.equal(cta.label, "Quando posso doar de novo?");
  const url = new URL(cta.path, "https://app.local");
  assert.equal(url.pathname, "/hemarcio");
  assert.equal(url.searchParams.get("ask"), "app.proxima-doacao");
  assert.deepEqual(JSON.parse(url.searchParams.get("ctx")), { product: "app", screen: "home" });
});

for (const status of ["able-to-donate", "never-donated", undefined]) {
  test(`pode doar (${status}): botao generico envia app.duvidas com contexto`, () => {
    const cta = homeHemarcioCta(status);
    assert.equal(cta.label, "Tirar dúvidas com o Hemárcio");
    const url = new URL(cta.path, "https://app.local");
    assert.equal(url.pathname, "/hemarcio");
    assert.equal(url.searchParams.get("ask"), "app.duvidas");
    assert.deepEqual(JSON.parse(url.searchParams.get("ctx")), { product: "app", screen: "home" });
  });
}

test("o SDK aceita app.duvidas como intent do Hemarcio", () => {
  assert.equal(isHemarcioIntentId("app.duvidas"), true);
});
