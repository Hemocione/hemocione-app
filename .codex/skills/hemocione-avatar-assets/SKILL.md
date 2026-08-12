---
name: hemocione-avatar-assets
description: Create, repair, and validate Hemocione Hemárcio avatar SVG items with the shared layer geometry. Use when adding or changing assets under public/illustrations/avatarItems, changing an avatar assetRef, fixing item proportions, or checking large editor, thumbnail, home, and share rendering.
---

# Hemocione Avatar Assets

Use this skill whenever an avatar item is created or repaired. Treat each SVG as a transparent layer in a fixed composition, not as an isolated illustration that can choose its own canvas or scale.

## Workflow

1. Inspect the active catalog and the canonical `assetRef` before editing. Current canonical folders are `base`, `pernas`, `corpo`, `olhos`, `acessorios`, `background`, and `badge`. Do not add new files to the retired `body`, `head`, or `face` folders.
2. Read `utils/avatarLayerLayout.ts` and `components/avatar/HemarcioCharacter.vue` before changing geometry. Reuse the existing layer order and rects; do not compensate for an SVG mistake with a component-wide transform.
3. Match the slot contract in `references/item-spec.md`. Keep clothing inside the body slot, keep face items inside the eyes rect, and use the full 1200×1200 canvas only for accessories, backgrounds, and blood-type badges. Start from the slot's visual budget instead of drawing a large illustration and hoping the renderer scales it correctly.
4. Draw transparent SVGs with explicit `viewBox`, `stroke-linecap`, and `stroke-linejoin`. Avoid external `<image>` references, embedded raster art, full-canvas opaque rectangles, and text that becomes noise at 56px.
5. Run the validator from the app root:

   ```bash
   node .codex/skills/hemocione-avatar-assets/scripts/validate_avatar_assets.mjs
   ```

6. Compose the item with the real base, legs, body, eyes, blood badge, and accessory layers. Check three scales: the editor stage (220px), the item card thumbnail (56px), and the home avatar preview (66px). Check at least one neighboring item at the same time so a fix does not solve one combination by breaking another.
7. Use browser QA against the real deployed app or PR preview before shipping. A local canvas, SVG coordinate inspection, DOM snapshot, or generated composition grid is diagnostic only; it is not visual acceptance. Open the actual URL with the QA account, enter the editor, select every item in the changed slot, take screenshots of the rendered stage and item card, open those screenshots with an image viewer, and judge the bitmap as a person would. Then close/reload the editor and inspect the home avatar screenshot at its compact size. Confirm the same item is recognizable, proportionate, and layered correctly in all three contexts.
8. Commit the SVG and any catalog change together. Keep the canonical `assetRef` stable when only art is being repaired.

## Creation recipe for new items

Design against the rendered Hemárcio, not against the empty SVG canvas. The five custom items exposed the practical limits of this composition:

| Item family | Shared-canvas visual budget | Non-negotiable visual rule |
| --- | --- | --- |
| torso clothing (`corpo`) | body-local `x≈220..492`, `y≈295..500`; a sash may reach `x≈190..520` | Follow the torso curve. Never use a flat rectangle, never cover the face, and leave both arms and the blood medal readable. |
| crown | roughly `x≈425..775`, `y≈135..350` | Sit on the head with breathing room; the crown must be narrower than the head silhouette and must not cover the eyes. |
| hat | roughly `x≈420..780`, `y≈145..345` | The brim follows the head width; keep the crown compact and keep the flame tip from looking like a random extra spike. |
| event badge | card around `x≈805..950`, `y≈620..880` | The strap must visibly begin at the shoulder and stay outside the blood-medal rectangle (`x=576..768`, `y=564..756`). The card is a chest accessory, not a second torso. |

For a new clothing item, keep the complete body silhouette required by the slot, then add only the clothing overlay. If the base silhouette is copied into the file, the overlay still has to be aligned to the body-local art: the existing body art is translated by `y=273`, while the clothing overlay is authored in the same 712×670 body viewBox. Do not apply the shared-canvas `(283,271)` offset a second time.

Use this visual checklist before calling an item finished:

1. At 220px, can a person name the item immediately without reading its label?
2. At 56px, does its silhouette differ from `corpo_padrao.svg` instead of collapsing into the default avatar?
3. At 66px, is the item still visible without becoming the largest feature of the avatar?
4. Does the item have a clear relationship to the body: worn on the torso, sitting on the head, or hanging from a shoulder?
5. Is the nearest competing layer still legible: face/eyes, blood medal, arms, and feet?

If any answer is no, change the SVG's geometry, contrast, or visual hierarchy. Do not solve an item-specific problem by changing `AVATAR_LAYER_RECTS` or a global component transform.

## Real-browser review gate

Use this exact acceptance loop for visual work:

```text
deployed/preview URL + QA token
  -> home screenshot (66px avatar)
  -> click Edit
  -> select changed item by its visible/accessibility name
  -> editor screenshot (220px stage)
  -> item-card screenshot (56px)
  -> open each screenshot and inspect the rendered pixels
  -> reload, close the editor, and inspect home again
```

The rendered result is the source of truth because the shared layer rects can make an asset look reasonable in isolation while making it oversized or invisible in the product. During the real review, explicitly look for these failure modes:

- headwear that dominates the head or touches the canvas edge;
- a chest card whose lanyard crosses the face, blood badge, or arm;
- clothing overlays translated into the face because the body-local `y` was treated as a shared-canvas `y`;
- glasses that technically load but are too faint or narrow to read at 220px, 66px, and 56px, or that hide the base eyes;
- an item that looks acceptable in the editor but becomes clipped, tiny, or visually absent in the card/home preview.
- a clothing item that is technically present but reads as a box, a stray stripe, or the default body because its contrast and silhouette do not survive the 56px card;
- a lanyard that technically reaches a card but does not visually connect it to the character's shoulder.

Do not mark the item complete from the SVG source or canvas alone. If the screenshot looks wrong, fix the asset geometry or contrast, redeploy the preview, and repeat the browser loop.

## Slot contracts

- `corpo/*.svg`: use `viewBox="0 0 712 670"`. Include the complete body silhouette required by the body slot, then place clothing overlays around the torso coordinates documented in the reference. Never start a clothing overlay at the face height.
- `olhos/*.svg`: let the component place the asset in the shared eyes rect. Veteran glasses must be transparent around the lenses, cover roughly the same width as both eyes, and leave the base eyes layer visible underneath.
- `pernas/*.svg`: use the existing legs rect and keep both feet inside it.
- `acessorios/*.svg`: use `viewBox="0 0 1200 1200"`, keep headwear around 32–68% of the canvas width and chest cards around 12–18%, and anchor the item to the head/chest instead of stretching it to the canvas edges.
- `background/*.svg` and `badge/*.svg`: use a transparent or intentionally painted full canvas according to the slot’s semantics. Do not let these assets alter the avatar silhouette.

## Visual acceptance

Accept an item only when it remains recognizable and proportional at all three sizes. The headwear must follow the head width without touching the canvas edge; clothing must leave the face, arms, medal, and feet legible; badges must read as a small chest accessory rather than a second body part; and thumbnail cards must not show empty padding that makes the item appear missing.

When a visual result is ambiguous, compare it with `corpo/corpo_padrao.svg` in the same composition. Correct the asset’s coordinates first. Change shared layout code only when the base avatar itself is wrong for every item.

See `references/item-spec.md` for the coordinate table and `scripts/validate_avatar_assets.mjs` for the mechanical checks.
