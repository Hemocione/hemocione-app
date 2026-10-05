# New Hemárcio item checklist

Use this short checklist when creating a new clothing, headwear, or chest-accessory SVG.

## Before drawing

- Find the catalog entry and its canonical `assetRef`.
- Read `utils/avatarLayerLayout.ts`, `components/avatar/HemarcioCharacter.vue`, and `item-spec.md`.
- Decide whether the item is body-local (`corpo`) or shared-canvas (`acessorios`). Never mix those coordinate systems.
- Choose a silhouette that is recognizable at 56px before adding decorative details.

## While drawing

- Keep the SVG transparent and preserve the slot `viewBox`.
- Use rounded strokes and a small, high-contrast palette.
- For torso clothing, shape the garment around the torso; do not draw a rectangular sticker over it.
- For a sash, use a clipped diagonal band with enough contrast against the red body.
- For a chest badge, make the shoulder connector visibly meet the card and keep it outside the blood-medal rectangle.
- Keep headwear narrower than the head, with an intentional breathing margin.

## Before merge

- Run the mechanical validator and `xmllint`/browser loading checks.
- Open the deployed PR preview with the QA account that owns the full catalog.
- Select the item by its visible name and capture the 220px editor stage and 56px item card.
- Close/reload the editor and capture the 66px home avatar.
- Open every capture with an image viewer and judge the rendered pixels. DOM refs, SVG source, and canvas-only grids are not acceptance evidence.
- Compare the new item beside the default body and beside at least one other custom item.
- Repeat after deployment on `develop`.
