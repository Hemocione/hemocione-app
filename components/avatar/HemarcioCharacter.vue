<template>
  <div class="hemarcio" :class="[size]">
    <img v-if="fundoAssetRef" class="layer fundo" :style="rectStyle('fundo')" :src="assetUrl(fundoAssetRef)" alt="" />
    <img class="layer base" :style="rectStyle('base')" :src="assetUrl('base/hemarcio_base.svg')" alt="" />
    <img v-if="pernasAssetRef" class="layer pernas" :style="rectStyle('pernas')" :src="assetUrl(pernasAssetRef)" alt="" />
    <img v-if="corpoAssetRef" class="layer corpo" :style="rectStyle('corpo')" :src="assetUrl(corpoAssetRef)" alt="" />
    <img v-if="olhosAssetRef" class="layer olhos" :style="rectStyle('olhos')" :src="assetUrl(olhosAssetRef)" alt="" />
    <img
      v-if="bloodTypeBadgeAssetRef"
      class="layer blood-type-medal"
      :style="rectStyle('bloodTypeMedal')"
      :src="assetUrl(bloodTypeBadgeAssetRef)"
      alt=""
    />
    <img v-if="acessoriosAssetRef" class="layer acessorios" :style="rectStyle('acessorios')" :src="assetUrl(acessoriosAssetRef)" alt="" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: "large" | "thumbnail";
    olhosAssetRef: string | null;
    corpoAssetRef: string | null;
    pernasAssetRef: string | null;
    acessoriosAssetRef: string | null;
    fundoAssetRef: string | null;
    bloodTypeBadgeAssetRef?: string | null;
  }>(),
  { size: "large", bloodTypeBadgeAssetRef: null }
);

import { avatarAssetUrl } from "~/utils/avatarAssetUrl";
import { AVATAR_LAYER_RECTS } from "~/utils/avatarLayerLayout";

const assetUrl = avatarAssetUrl;

const rectStyle = (key: keyof typeof AVATAR_LAYER_RECTS) => {
  const rect = AVATAR_LAYER_RECTS[key];
  return {
    top: `${rect.top}%`,
    left: `${rect.left}%`,
    width: `${rect.width}%`,
    height: `${rect.height}%`,
  };
};
</script>

<style scoped>
.hemarcio {
  position: relative;
  margin: 0 auto;
}
.hemarcio.large {
  width: 220px;
  height: 220px;
}
.hemarcio.thumbnail {
  width: 56px;
  height: 56px;
}
.layer {
  position: absolute;
}
.layer.fundo {
  z-index: 0;
  object-fit: cover;
  border-radius: 12px;
}
.layer.pernas {
  z-index: 1;
  object-fit: contain;
}
.layer.base {
  z-index: 2;
  object-fit: contain;
}
.layer.corpo {
  z-index: 3;
  object-fit: contain;
}
.layer.olhos {
  z-index: 4;
  object-fit: contain;
}
.layer.blood-type-medal {
  z-index: 5;
  object-fit: contain;
}
.layer.acessorios {
  z-index: 6;
  object-fit: contain;
}
</style>
