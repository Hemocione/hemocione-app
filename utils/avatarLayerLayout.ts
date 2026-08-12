export interface AvatarLayerRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Position of each Hemárcio layer as a percentage of a square reference
 * frame. Derived from each asset's exact pixel bounding box within the
 * shared 1200x1200 Canva export (every part is centered on that same
 * canvas by design convention), so these numbers are the single source
 * of truth for both the live editor (HemarcioCharacter.vue) and the
 * shareable-image canvas composite (AvatarWidget.vue) - keeping them in
 * one place is what stops the two from silently drifting apart.
 */
export const AVATAR_LAYER_RECTS: Record<string, AvatarLayerRect> = {
  fundo: { top: 0, left: 0, width: 100, height: 100 },
  base: { top: 6.25, left: 28.83, width: 42.33, height: 56.75 },
  pernas: { top: 61.58, left: 35.33, width: 29.33, height: 32.17 },
  corpo: { top: 22.58, left: 23.58, width: 59.33, height: 55.83 },
  olhos: { top: 28.75, left: 38.75, width: 22.42, height: 18.75 },
  bloodTypeMedal: { top: 47, left: 42, width: 16, height: 16 },
  acessorios: { top: 0, left: 0, width: 100, height: 100 },
};

export const AVATAR_LAYER_CLASS: Record<keyof typeof AVATAR_LAYER_RECTS, string> = {
  fundo: "fundo",
  base: "base",
  pernas: "pernas",
  corpo: "corpo",
  olhos: "olhos",
  bloodTypeMedal: "blood-type-medal",
  acessorios: "acessorios",
};

export const AVATAR_LAYER_ORDER: Array<keyof typeof AVATAR_LAYER_RECTS> = [
  "fundo",
  "base",
  "pernas",
  "corpo",
  "olhos",
  "bloodTypeMedal",
  "acessorios",
];
