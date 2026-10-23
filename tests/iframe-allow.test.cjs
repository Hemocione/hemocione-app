// The allow list of the embedded sub-app iframes.
//
// On iOS, WebKit ignores `navigator.audioSession.type = "playback"` in a frame where the
// `microphone` permissions policy is off (DOMAudioSession::setType returns early). A
// cross-origin iframe has it off unless the parent delegates it. Without the playback
// session, Web Audio uses the ambient category and the silent switch mutes the games.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { buildSync } = require("esbuild");

const bundle = buildSync({
  entryPoints: [path.join(__dirname, "..", "utils/iframeAllow.ts")],
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
const { iframeAllow } = mod.exports;

const features = (allow) => allow.split(";").map((item) => item.trim());

test("keeps the default features for every sub-app", () => {
  assert.deepEqual(features(iframeAllow()), [
    "accelerometer",
    "autoplay",
    "clipboard-write",
    "encrypted-media",
    "geolocation",
    "gyroscope",
    "picture-in-picture",
  ]);
});

test("does not delegate the microphone by default", () => {
  assert.ok(!features(iframeAllow()).includes("microphone"));
  assert.ok(!features(iframeAllow({ audioSession: false })).includes("microphone"));
});

test("delegates the microphone policy when the sub-app needs the audio session", () => {
  const allow = features(iframeAllow({ audioSession: true }));
  assert.ok(allow.includes("microphone"));
  assert.ok(allow.includes("autoplay"));
});
