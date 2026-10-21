// Regression test for the "https://app.hemocione.com.brundefined/" redirect.
//
// vue-router keeps its bookkeeping (back/current/forward/position) in
// history.state. On push it first calls replaceState(origin + state.current).
// When the app writes a history entry without those keys and the user lands
// on it with the back button, state.current is undefined, replaceState throws
// a SecurityError and vue-router falls back to
// location.replace("https://app.hemocione.com.br" + undefined).
//
// The test runs the real vue-router against a minimal fake browser history.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { transformSync } = require("esbuild");
// Loaded before the fake browser globals exist: @vue/runtime-dom probes
// `document` at import time.
const { createRouter, createWebHistory } = require("vue-router");

const ORIGIN = "https://app.hemocione.com.br";

function createFakeBrowser(initialPath) {
  const listeners = {};
  const entries = [{ url: new URL(initialPath, ORIGIN), state: null }];
  let index = 0;
  const hardNavigations = [];

  const current = () => entries[index].url;
  const resolve = (url) => {
    const next = new URL(url ?? current().href, current());
    if (next.origin !== ORIGIN) {
      const error = new Error(
        `A history state object with URL '${next.href}' cannot be created`,
      );
      error.name = "SecurityError";
      throw error;
    }
    return next;
  };
  const clone = (state) =>
    state === undefined || state === null ? null : structuredClone(state);

  const history = {
    get state() {
      return entries[index].state;
    },
    get length() {
      return entries.length;
    },
    pushState(state, _title, url) {
      const next = resolve(url);
      entries.splice(index + 1);
      entries.push({ url: next, state: clone(state) });
      index = entries.length - 1;
    },
    replaceState(state, _title, url) {
      entries[index] = { url: resolve(url), state: clone(state) };
    },
    back() {
      if (index === 0) return;
      index -= 1;
      for (const listener of listeners.popstate ?? []) {
        listener({ state: entries[index].state });
      }
    },
  };

  const location = {
    get href() {
      return current().href;
    },
    get protocol() {
      return current().protocol;
    },
    get host() {
      return current().host;
    },
    get pathname() {
      return current().pathname;
    },
    get search() {
      return current().search;
    },
    get hash() {
      return current().hash;
    },
    replace: (url) => hardNavigations.push(String(url)),
    assign: (url) => hardNavigations.push(String(url)),
  };

  const window = {
    history,
    location,
    scrollX: 0,
    scrollY: 0,
    pageXOffset: 0,
    pageYOffset: 0,
    addEventListener(type, listener) {
      (listeners[type] ??= []).push(listener);
    },
    removeEventListener(type, listener) {
      listeners[type] = (listeners[type] ?? []).filter((l) => l !== listener);
    },
  };

  globalThis.window = window;
  globalThis.location = location;
  globalThis.history = history;
  globalThis.document = {
    visibilityState: "visible",
    querySelector: () => null,
    addEventListener() {},
    removeEventListener() {},
  };

  return { history, location, hardNavigations };
}

function loadHistoryHelpers() {
  const source = transformSync(
    fs.readFileSync("utils/historyState.ts", "utf8"),
    { loader: "ts", format: "cjs" },
  ).code;
  const mod = { exports: {} };
  new Function("module", "exports", source)(mod, mod.exports);
  return mod.exports;
}

async function createAppRouter() {
  const page = { render: () => null };
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: "/", component: page },
      { path: "/donations", component: page },
      { path: "/events", component: page },
    ],
  });
  await router.push(globalThis.location.pathname + globalThis.location.search);
  await router.isReady();
  return router;
}

const silenceRouterWarnings = () => {
  const original = { warn: console.warn, error: console.error };
  console.warn = () => {};
  console.error = () => {};
  return () => Object.assign(console, original);
};

test("menu opened twice and closed with back keeps router navigation inside the app", async (t) => {
  t.after(silenceRouterWarnings());
  const browser = createFakeBrowser("/");
  const { pushOverlayHistoryEntry } = loadHistoryHelpers();
  const router = await createAppRouter();

  pushOverlayHistoryEntry("drawer", browser.history); // open menu
  // menu closed by tapping outside: the entry stays
  pushOverlayHistoryEntry("drawer", browser.history); // open menu again
  browser.history.back(); // Android back closes the menu

  await router.push("/donations");

  assert.deepEqual(browser.hardNavigations, []);
  assert.equal(browser.location.href, `${ORIGIN}/donations`);
});

test("login with ?token= followed by menu + back keeps router navigation inside the app", async (t) => {
  t.after(silenceRouterWarnings());
  const browser = createFakeBrowser("/?token=jwt");
  const { pushOverlayHistoryEntry, replaceUrlKeepingRouterState } =
    loadHistoryHelpers();
  const router = await createAppRouter();

  replaceUrlKeepingRouterState("/", browser.history); // app.vue drops ?token=
  pushOverlayHistoryEntry("drawer", browser.history); // open menu
  browser.history.back(); // close menu with back

  await router.push("/events");

  assert.deepEqual(browser.hardNavigations, []);
  assert.equal(browser.location.href, `${ORIGIN}/events`);
});

test("overlay entry still carries the overlay marker for the popstate handlers", () => {
  const browser = createFakeBrowser("/");
  const { pushOverlayHistoryEntry } = loadHistoryHelpers();
  browser.history.replaceState({ current: "/", position: 1 }, "");

  pushOverlayHistoryEntry("drawer", browser.history);

  assert.equal(browser.history.state.drawer, "open");
  assert.equal(browser.history.state.current, "/");
});
