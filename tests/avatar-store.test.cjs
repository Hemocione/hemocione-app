const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { transformSync } = require("esbuild");
const { defineStore, createPinia, setActivePinia } = require("pinia");
const source = transformSync(fs.readFileSync("stores/avatar.ts", "utf8"), {
  loader: "ts",
  format: "cjs",
}).code;
function setup(fetch) {
  const module = { exports: {} };
  new Function(
    "module",
    "exports",
    "defineStore",
    "useRuntimeConfig",
    "useUserStore",
    "$fetch",
    source,
  )(
    module,
    module.exports,
    defineStore,
    () => ({ public: { hemocioneIdApiUrl: "https://dev.invalid" } }),
    () => ({ token: "test" }),
    fetch,
  );
  setActivePinia(createPinia());
  const store = module.exports.useAvatarStore();
  store.equipped = {
    olhosItemId: 1,
    corpoItemId: 2,
    pernasItemId: 3,
    acessoriosItemId: null,
    fundoItemId: null,
  };
  return store;
}
test("failed badge save preserves confirmed visibility and shows an error", async () => {
  const store = setup(async () => {
    throw Error("offline");
  });
  await store.toggleBloodTypeBadge().catch(() => {});
  assert.equal(store.showBloodTypeBadge, true);
  assert.ok(store.saveError);
});
test("equip sends only the selected slot", async () => {
  let body;
  const store = setup(async (_, options) => {
    body =
      typeof options.body === "string"
        ? JSON.parse(options.body)
        : options.body;
    return { ...store.equipped, ...body };
  });
  await store.equipItem({ id: 9, slot: "CORPO", owned: true });
  assert.deepEqual(body, { corpoItemId: 9 });
  assert.equal(store.equipped.corpoItemId, 9);
});
test("pending save prevents overlapping writes and releases after completion", async () => {
  let release,
    calls = 0;
  const store = setup(() => {
    calls++;
    return new Promise((r) => {
      release = r;
    });
  });
  const first = store.equipItem({ id: 9, slot: "CORPO", owned: true });
  assert.equal(store.isSaving, true);
  const second = store.equipItem({ id: 8, slot: "OLHOS", owned: true });
  assert.equal(calls, 1);
  release({ ...store.equipped, corpoItemId: 9 });
  await Promise.all([first, second]);
  assert.equal(store.isSaving, false);
});
test("avatar load failure is visible and can be retried", async () => {
  let calls = 0;
  const store = setup(async () => {
    if (++calls === 1) throw Error("offline");
    return { items: [], equipped: store.equipped, bloodTypeBadge: null };
  });
  await store.fetchAvatar().catch(() => {});
  assert.ok(store.avatarError);
  assert.equal(store.isLoadingAvatar, false);
  await store.fetchAvatar();
  assert.equal(store.avatarError, "");
  assert.equal(store.avatarLoaded, true);
});
test("opening the editor keeps new item indicators until acknowledgement", () => {
  const store = setup(async () => ({ updated: 1 }));
  store.items = [
    { id: 9, isDefault: false, owned: true, seenAt: null, slot: "CORPO" },
  ];
  store.openEditor();
  assert.equal(store.unseenItems.length, 1);
});
test("concurrent avatar callers wait for the same request before pending equip", async () => {
  let release;
  let gets = 0;
  const store = setup(async (_, options) => {
    if (options.method === "PUT") return { ...store.equipped, ...options.body };
    gets++;
    return new Promise((resolve) => {
      release = resolve;
    });
  });
  const achievementsLoad = store.fetchAvatar();
  store.requestEquipItem(9);
  const mountHome = (async () => {
    await store.fetchAvatar();
    if (store.avatarLoaded) await store.resolvePendingEquip();
  })();
  await new Promise((resolve) => setImmediate(resolve));
  release({
    items: [{ id: 9, slot: "CORPO", owned: true }],
    equipped: store.equipped,
    bloodTypeBadge: null,
  });
  await Promise.all([achievementsLoad, mountHome]);
  assert.equal(gets, 1);
  assert.equal(store.pendingEquipItemId, null);
  assert.equal(store.isEditorOpen, true);
  assert.equal(store.equipped.corpoItemId, 9);
});

test("partial save response keeps effective defaults for nullable required slots", async () => {
  const store = setup(async () => ({
    olhosItemId: null,
    corpoItemId: null,
    pernasItemId: null,
    acessoriosItemId: null,
    fundoItemId: null,
    showBloodTypeBadge: false,
  }));
  store.items = [
    { id: 1, slot: "OLHOS", isDefault: true },
    { id: 2, slot: "CORPO", isDefault: true },
    { id: 3, slot: "PERNAS", isDefault: true },
  ];
  await store.toggleBloodTypeBadge();
  assert.equal(store.equipped.olhosItemId, 1);
  assert.equal(store.equipped.corpoItemId, 2);
  assert.equal(store.equipped.pernasItemId, 3);
  assert.equal(store.showBloodTypeBadge, false);
});
