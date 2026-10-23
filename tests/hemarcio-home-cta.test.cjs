// Botao do Hemarcio na home: a pergunta de intervalo so quando a pessoa ainda nao pode doar.
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
const { homeHemarcioCta } = mod.exports;

test("ainda nao pode doar: pergunta quando pode doar de novo", () => {
  const cta = homeHemarcioCta("unable-to-donate");
  assert.equal(cta.label, "Quando posso doar de novo?");
  const url = new URL(cta.path, "https://app.local");
  assert.equal(url.pathname, "/hemarcio");
  assert.equal(url.searchParams.get("ask"), "app.proxima-doacao");
  assert.deepEqual(JSON.parse(url.searchParams.get("ctx")), { product: "app", screen: "home" });
});

for (const status of ["able-to-donate", "never-donated", undefined]) {
  test(`pode doar (${status}): botao generico, sem pergunta automatica`, () => {
    const cta = homeHemarcioCta(status);
    assert.equal(cta.label, "Tirar dúvidas com o Hemárcio");
    assert.equal(cta.path, "/hemarcio");
  });
}
