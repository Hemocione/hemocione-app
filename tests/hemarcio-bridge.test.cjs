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

test("open-hemarcio ignores array, non-plain and oversized context", async () => {
  class Foo {}
  const bad = [
    ["a"],
    new Foo(),
    "str",
    { product: "x", blob: "y".repeat(2000) },
  ];
  for (const context of bad) {
    await send("hemocione:open-hemarcio", { intent: "ondedoar.ponto", context });
  }
  assert.deepEqual(navigated, []);
  await send("hemocione:open-hemarcio", {
    intent: "ondedoar.ponto",
    context: { product: "x" },
  });
  assert.equal(navigated.length, 1);
});

function fakePage(token = "jwt", onNavigateTop = () => {}) {
  const calls = [];
  const chat = {
    ask: (...a) => calls.push(["ask", ...a]),
    setToken: (t) => calls.push(["setToken", t]),
    destroy: () => calls.push(["destroy"]),
  };
  let created = 0;
  const page = bridge.createHemarcioPage({
    createChat: (opts) => {
      created++;
      calls.push(["create", opts]);
      return chat;
    },
    container: {},
    chatUrl: "https://chat.hemocione.com.br",
    token,
    onNavigateTop,
  });
  return { page, calls, created: () => created };
}

test("page creates one inline chat with token and default context", () => {
  const { calls } = fakePage();
  const opts = calls[0][1];
  assert.equal(opts.mode, "inline");
  assert.equal(opts.token, "jwt");
  assert.deepEqual(opts.context, { product: "app" });
});

test("page passes onNavigateTop to the chat; calling it uses the handler", () => {
  const seen = [];
  const { calls } = fakePage("jwt", (u) => seen.push(u));
  const opts = calls[0][1];
  assert.equal(typeof opts.onNavigateTop, "function");
  opts.onNavigateTop("https://id.hemocione.com.br/login");
  assert.deepEqual(seen, ["https://id.hemocione.com.br/login"]);
});

test("home ask carries screen home explicitly via ctx", () => {
  const { page, calls } = fakePage();
  const path = bridge.buildHemarcioPath("app.proxima-doacao", {
    product: "app",
    screen: "home",
  });
  const q = Object.fromEntries(new URL(path, "https://x").searchParams);
  page.handleQuery(q);
  const ask = calls.find((c) => c[0] === "ask");
  assert.deepEqual(ask.slice(1), [
    "app.proxima-doacao",
    { product: "app", screen: "home" },
  ]);
});

test("page asks once with intent and merged ctx; ask again does not remount", () => {
  const { page, calls, created } = fakePage();
  const ctx = JSON.stringify({ product: "eventos", eventSlug: "x" });
  assert.equal(page.handleQuery({ ask: "eventos.preparar", ctx }), true);
  assert.equal(page.handleQuery({ ask: "app.proxima-doacao" }), true);
  const asks = calls.filter((c) => c[0] === "ask");
  assert.equal(asks.length, 2);
  assert.deepEqual(asks[0].slice(1), [
    "eventos.preparar",
    { product: "eventos", eventSlug: "x" },
  ]);
  assert.deepEqual(asks[1].slice(1), [
    "app.proxima-doacao",
    { product: "app" },
  ]);
  assert.equal(created(), 1);
});

test("page ignores no ask, bad intent, bad ctx (but consumes the params)", () => {
  const { page, calls } = fakePage();
  assert.equal(page.handleQuery({}), false);
  assert.equal(page.handleQuery({ ask: "evil" }), true);
  assert.equal(page.handleQuery({ ask: "ondedoar.ponto", ctx: "{not json" }), true);
  assert.equal(page.handleQuery({ ask: "ondedoar.ponto", ctx: "[1]" }), true);
  assert.equal(calls.filter((c) => c[0] === "ask").length, 0);
});

test("page forwards token updates and destroys", () => {
  const { page, calls } = fakePage();
  page.setToken("new");
  page.setToken(null);
  page.destroy();
  assert.deepEqual(calls.slice(1), [
    ["setToken", "new"],
    ["setToken", null],
    ["destroy"],
  ]);
});
