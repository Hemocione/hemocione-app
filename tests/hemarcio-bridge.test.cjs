// Tests the Hemarcio bridge against the real SDK IframeReceiver, using a
// minimal fake `window` that dispatches message events.
const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { buildSync } = require("esbuild");

const root = path.join(__dirname, "..");
const win = new EventTarget();
globalThis.window = win;

const bundle = buildSync({
  entryPoints: [path.join(root, "utils/hemarcioBridge.ts")],
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
  nodePaths: [path.join(root, "node_modules")],
});
const mod = { exports: {} };
new Function("module", "exports", "require", bundle.outputFiles[0].text)(
  mod,
  mod.exports,
  require,
);
const bridge = mod.exports;
const sdkBundle = buildSync({
  stdin: {
    contents: 'module.exports = require("@hemocione/sdk");',
    resolveDir: root,
  },
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
});
const sdkMod = { exports: {} };
new Function("module", "exports", "require", sdkBundle.outputFiles[0].text)(
  sdkMod,
  sdkMod.exports,
  require,
);
const { createIframeReceiver, isHemocioneOrigin } = sdkMod.exports;

let receiver;
let navigated;
let replies;

beforeEach(() => {
  receiver?.destroy();
  navigated = [];
  receiver = createIframeReceiver(isHemocioneOrigin);
  bridge.registerHemarcioHandlers(receiver, (p) => navigated.push(p));
  replies = [];
});

async function send(type, data, origin = "https://eventos.hemocione.com.br") {
  const event = new Event("message");
  Object.assign(event, {
    data: { id: "1", type, payload: { data } },
    origin,
    source: { postMessage: (msg) => replies.push(msg) },
  });
  win.dispatchEvent(event);
  await new Promise((r) => setTimeout(r, 10));
}

test("capable handler answers { capable: true }", async () => {
  await send("hemocione:hemarcio-capable", {});
  assert.deepEqual(replies[0].result, { capable: true });
});

test("open-hemarcio navigates with ask and encoded ctx", async () => {
  const context = { product: "eventos", eventSlug: "doe é bom" };
  await send("hemocione:open-hemarcio", {
    intent: "eventos.preparar",
    context,
  });
  assert.equal(navigated.length, 1);
  const url = new URL(navigated[0], "https://app.hemocione.com.br");
  assert.equal(url.pathname, "/hemarcio");
  assert.equal(url.searchParams.get("ask"), "eventos.preparar");
  assert.deepEqual(JSON.parse(url.searchParams.get("ctx")), context);
});

test("invalid intent is ignored", async () => {
  await send("hemocione:open-hemarcio", {
    intent: "evil.intent",
    context: { product: "x" },
  });
  assert.deepEqual(navigated, []);
});

test("origin outside Hemocione is ignored for both handlers", async () => {
  for (const origin of [
    "https://evil.com",
    "https://hemocione.com.br.evil.com",
    "https://evilhemocione.com.br",
  ]) {
    await send("hemocione:hemarcio-capable", {}, origin);
    await send(
      "hemocione:open-hemarcio",
      { intent: "ondedoar.ponto", context: { product: "x" } },
      origin,
    );
  }
  assert.deepEqual(navigated, []);
  assert.deepEqual(replies, []);
});

test("buildHemarcioPath without context has only ask", () => {
  assert.equal(
    bridge.buildHemarcioPath("app.proxima-doacao"),
    "/hemarcio?ask=app.proxima-doacao",
  );
});

test("buildChatUrl forwards ask/ctx, token and iframed", () => {
  const ctx = JSON.stringify({ product: "eventos" });
  const url = new URL(
    bridge.buildChatUrl("https://chat.hemocione.com.br", {
      slug: ["a", "b"],
      query: { ask: "eventos.preparar", ctx, token: "stale" },
      token: "jwt",
      includeToken: true,
    }),
  );
  assert.equal(url.origin, "https://chat.hemocione.com.br");
  assert.equal(url.pathname, "/a/b");
  assert.equal(url.searchParams.get("ask"), "eventos.preparar");
  assert.equal(url.searchParams.get("ctx"), ctx);
  assert.equal(url.searchParams.get("token"), "jwt");
  assert.equal(url.searchParams.get("iframed"), "true");
});
