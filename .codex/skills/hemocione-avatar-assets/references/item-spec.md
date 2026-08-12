# Hemocione avatar item specification

## Shared canvas

The avatar is composed in a 1200×1200 logical canvas. The Vue renderer places each layer with these percentages; the share generator uses the same order and geometry.

| Layer | left | top | width | height | Asset contract |
| --- | ---: | ---: | ---: | ---: | --- |
| base | 28.83% | 6.25% | 42.33% | 56.75% | Preserve the base art viewBox. |
| pernas | 35.33% | 52% | 29.33% | 32.17% | Preserve the legs art viewBox. |
| corpo | 23.58% | 22.58% | 59.33% | 55.83% | Canonical viewBox `0 0 712 670`. |
| olhos | 38.75% | 28.75% | 22.42% | 18.75% | Transparent face art; glasses sit above eyes. |
| blood badge | 48% | 47% | 16% | 16% | Full badge art is scaled into this rect. |
| acessórios | 0 | 0 | 100% | 100% | Canonical viewBox `0 0 1200 1200`. |

For a 1200×1200 canvas, the body slot begins at roughly `(283, 271)` and is `712×670`. A coordinate in a body SVG maps to the shared canvas as:

```text
sharedX = 283 + bodyX
sharedY = 271 + bodyY
```

This is why a body overlay at `y=180` covers the face: the body slot itself is already offset down by about 271px. Start torso clothing near the body silhouette’s translated torso, usually around body-local `y=290`, and verify against the default body.

## Art rules

- Keep all SVGs transparent unless the slot explicitly supplies a background.
- Keep strokes rounded and consistent with the Hemárcio art: dark navy/burgundy outlines, bright red, warm gold, cream, and green accents.
- Make the primary shape readable as a silhouette at 56px. Use contrast, not tiny labels, to communicate the item.
- Keep headwear visual bounds around 32–68% of the 1200 canvas width; keep a chest-card accessory around 12–18% of the canvas width. Leave a visible breathing margin around both.
- Put chest accessories to one side of the torso and below the eyes. Keep the blood badge visible unless the item is explicitly a replacement badge.
- Do not use an SVG `<image href="...">` to borrow another layer. The browser may show it while the canvas/share renderer drops the nested resource.

## QA matrix

For each changed item, test:

1. The item by itself with default body, eyes, legs, and blood badge.
2. The item with veteran glasses and one head accessory.
3. The item in the editor’s 220px stage.
4. The item card at 56px and the home preview at 66px.
5. A reload after selecting the item, so cached and persisted asset refs are exercised.

Record the browser URL, selected item, screenshot, and any console/page error. A passing asset has no broken image, no unexpected opaque rectangle, no face/feet collision, and no visible layer-order workaround.
