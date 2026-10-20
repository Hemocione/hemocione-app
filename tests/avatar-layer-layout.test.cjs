const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { transformSync } = require("esbuild");
const source = transformSync(
  fs.readFileSync("utils/avatarLayerLayout.ts", "utf8"),
  { loader: "ts", format: "cjs" },
).code;
const layout = { exports: {} };
new Function("module", "exports", source)(layout, layout.exports);
const { AVATAR_LAYER_RECTS, AVATAR_FRAMINGS, framedLayerRect } =
  layout.exports;

// Head accessory boxes in % of the 1200x1200 canvas (AvatarItemPreview crops).
const HEAD_ACCESSORIES = {
  chapeu_estreante: { top: 55 / 12, bottom: 345 / 12 },
  coroa_campeao: { top: 65 / 12, bottom: 345 / 12 },
  faixa_corredor: { top: 255 / 12, bottom: 370 / 12 },
};
const toFrame = (value, focus, scale) => (value - focus) * scale + 50;

test("full framing keeps every layer rect unchanged", () => {
  for (const key of Object.keys(AVATAR_LAYER_RECTS)) {
    assert.deepEqual(framedLayerRect(key, "full"), AVATAR_LAYER_RECTS[key]);
  }
});

test("face framing keeps the background filling the frame", () => {
  assert.deepEqual(framedLayerRect("fundo", "face"), {
    top: 0,
    left: 0,
    width: 100,
    height: 100,
  });
});

test("face framing zooms the character in", () => {
  const { scale } = AVATAR_FRAMINGS.face;
  assert.ok(scale > 1.4, `scale ${scale} is not a zoom`);
  const base = framedLayerRect("base", "face");
  assert.ok(
    Math.abs(base.width - AVATAR_LAYER_RECTS.base.width * scale) < 1e-9,
  );
});

test("face framing centers the eyes horizontally and keeps them inside", () => {
  const eyes = framedLayerRect("olhos", "face");
  assert.ok(Math.abs(eyes.left + eyes.width / 2 - 50) < 1);
  assert.ok(eyes.top > 0 && eyes.top + eyes.height < 100);
  const eyesCenterY = eyes.top + eyes.height / 2;
  assert.ok(eyesCenterY > 40 && eyesCenterY < 65, `eyes at ${eyesCenterY}%`);
});

test("face framing shows the top of the head and part of the body", () => {
  const base = framedLayerRect("base", "face");
  assert.ok(base.top >= 0, `head tip cut at ${base.top}%`);
  const corpo = framedLayerRect("corpo", "face");
  assert.ok(corpo.top < 100, "body is not visible");
  assert.ok(corpo.top + corpo.height > 100, "body is not cropped");
});

test("face framing keeps most of each head accessory visible", () => {
  const { focusY, scale } = AVATAR_FRAMINGS.face;
  for (const [name, box] of Object.entries(HEAD_ACCESSORIES)) {
    const top = toFrame(box.top, focusY, scale);
    const bottom = toFrame(box.bottom, focusY, scale);
    const visible = Math.min(bottom, 100) - Math.max(top, 0);
    assert.ok(
      visible / (bottom - top) >= 0.9,
      `${name} only ${visible}/${bottom - top} visible`,
    );
  }
});
