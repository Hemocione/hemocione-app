// A persistent sub-app iframe keeps its page when the user comes back from the menu,
// but a link to a specific page (the Hemarcio chat, a deep link) must load that page.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { buildSync } = require("esbuild");

const bundle = buildSync({
  entryPoints: [path.join(__dirname, "..", "utils/persistentIframe.ts")],
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
});
const mod = { exports: {} };
new Function("module", "exports", "require", bundle.outputFiles[0].text)(
  mod,
  mod.exports,
  require,
);
const { iframeRouteKey, shouldReloadIframe } = mod.exports;

test("route key joins the slug and ignores token and iframed", () => {
  assert.equal(iframeRouteKey(["event", "doe-rj"], {}), "event/doe-rj");
  assert.equal(iframeRouteKey("quiz", {}), "quiz");
  assert.equal(iframeRouteKey(undefined, {}), "");
  assert.equal(iframeRouteKey(["", "x", ""], { b: "2", a: "1" }), "x?a=1&b=2");
  assert.equal(iframeRouteKey([], { token: "t", iframed: "true" }), "");
});

test("menu visit (no slug) keeps the iframe page", () => {
  assert.equal(shouldReloadIframe("event/doe-rj", ""), false);
});

test("a different page reloads the iframe", () => {
  assert.equal(shouldReloadIframe("", "event/doe-rj"), true);
  assert.equal(shouldReloadIframe("event/a", "event/b"), true);
});

test("the same page keeps the iframe", () => {
  assert.equal(shouldReloadIframe("event/a", "event/a"), false);
});
