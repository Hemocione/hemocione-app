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
  pernas: { top: 52, left: 35.33, width: 29.33, height: 32.17 },
  corpo: { top: 22.58, left: 23.58, width: 59.33, height: 55.83 },
  olhosBase: { top: 28.75, left: 38.75, width: 22.42, height: 18.75 },
  olhos: { top: 28.75, left: 38.75, width: 22.42, height: 18.75 },
  bloodTypeMedal: { top: 47, left: 48, width: 16, height: 16 },
  acessorios: { top: 0, left: 0, width: 100, height: 100 },
};

export type AvatarFraming = "full" | "face";

export interface AvatarFramingView {
  /** Zoom factor applied to the character layers. */
  scale: number;
  /** Point of the reference frame (in %) that lands on the frame center. */
  focusX: number;
  focusY: number;
}

/**
 * How much of Hemárcio each display shows. "full" is the whole body (editor
 * and share image). "face" is a bust shot for the small avatar outside the
 * editor: the eyes sit just below the center, the top of the head and any
 * hat or crown stay in frame, and the body is cropped below the chest.
 */
export const AVATAR_FRAMINGS: Record<AvatarFraming, AvatarFramingView> = {
  full: { scale: 1, focusX: 50, focusY: 50 },
  face: { scale: 1.5, focusX: 50, focusY: 36 },
};

/** Layers that always fill the frame, whatever the framing. */
const FRAME_FILLING_LAYERS = new Set<string>(["fundo"]);

export const framedLayerRect = (
  key: keyof typeof AVATAR_LAYER_RECTS,
  framing: AvatarFraming,
): AvatarLayerRect => {
  const rect = AVATAR_LAYER_RECTS[key];
  if (FRAME_FILLING_LAYERS.has(key)) return rect;
  const { scale, focusX, focusY } = AVATAR_FRAMINGS[framing];
  return {
    top: (rect.top - focusY) * scale + 50,
    left: (rect.left - focusX) * scale + 50,
    width: rect.width * scale,
    height: rect.height * scale,
  };
};

export const AVATAR_LAYER_CLASS: Record<
  keyof typeof AVATAR_LAYER_RECTS,
  string
> = {
  fundo: "fundo",
  base: "base",
  pernas: "pernas",
  corpo: "corpo",
  olhosBase: "olhos-base",
  olhos: "olhos",
  bloodTypeMedal: "blood-type-medal",
  acessorios: "acessorios",
};

export const AVATAR_LAYER_ORDER: Array<keyof typeof AVATAR_LAYER_RECTS> = [
  "fundo",
  "pernas",
  "base",
  "corpo",
  "olhosBase",
  "olhos",
  "bloodTypeMedal",
  "acessorios",
];
