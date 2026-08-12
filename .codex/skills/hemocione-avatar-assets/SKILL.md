---
name: hemocione-avatar-assets
description: Create, repair, and validate Hemocione Hemárcio avatar SVG items with the shared layer geometry. Use when adding or changing assets under public/illustrations/avatarItems, changing an avatar assetRef, fixing item proportions, or checking large editor, thumbnail, home, and share rendering.
---

# Hemocione Avatar Assets

Use this skill whenever an avatar item is created or repaired. Treat each SVG as a transparent layer in a fixed composition, not as an isolated illustration that can choose its own canvas or scale.

## Workflow

1. Inspect the active catalog and the canonical `assetRef` before editing. Current canonical folders are `base`, `pernas`, `corpo`, `olhos`, `acessorios`, `background`, and `badge`. Do not add new files to the retired `body`, `head`, or `face` folders.
2. Read `utils/avatarLayerLayout.ts` and `components/avatar/HemarcioCharacter.vue` before changing geometry. Reuse the existing layer order and rects; do not compensate for an SVG mistake with a component-wide transform.
3. Match the slot contract in `references/item-spec.md`. Keep clothing inside the body slot, keep face items inside the eyes rect, and use the full 1200×1200 canvas only for accessories, backgrounds, and blood-type badges.
4. Draw transparent SVGs with explicit `viewBox`, `stroke-linecap`, and `stroke-linejoin`. Avoid external `<image>` references, embedded raster art, full-canvas opaque rectangles, and text that becomes noise at 56px.
5. Run the validator from the app root:

   ```bash
   node .codex/skills/hemocione-avatar-assets/scripts/validate_avatar_assets.mjs
   ```

6. Compose the item with the real base, legs, body, eyes, blood badge, and accessory layers. Check three scales: the editor stage (220px), the item card thumbnail (56px), and the home avatar preview (66px). Check at least one neighboring item at the same time so a fix does not solve one combination by breaking another.
7. Use browser QA against the real deployed app or PR preview before shipping. A local canvas, SVG coordinate inspection, DOM snapshot, or generated composition grid is diagnostic only; it is not visual acceptance. Open the actual URL with the QA account, enter the editor, select every item in the changed slot, take screenshots of the rendered stage and item card, open those screenshots with an image viewer, and judge the bitmap as a person would. Then close/reload the editor and inspect the home avatar screenshot at its compact size. Confirm the same item is recognizable, proportionate, and layered correctly in all three contexts.
8. Commit the SVG and any catalog change together. Keep the canonical `assetRef` stable when only art is being repaired.

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
