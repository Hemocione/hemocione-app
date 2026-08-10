<template>
  <div class="hemarcio" :class="[size]">
    <img v-if="fundoAssetRef" class="layer fundo" :src="assetUrl(fundoAssetRef)" alt="" />
    <img class="layer base" :src="assetUrl('base/hemarcio_base.png')" alt="" />
    <img v-if="pernasAssetRef" class="layer pernas" :src="assetUrl(pernasAssetRef)" alt="" />
    <img v-if="corpoAssetRef" class="layer corpo" :src="assetUrl(corpoAssetRef)" alt="" />
    <img v-if="olhosAssetRef" class="layer olhos" :src="assetUrl(olhosAssetRef)" alt="" />
    <img
      v-if="bloodTypeBadgeAssetRef"
      class="layer blood-type-medal"
      :src="assetUrl(bloodTypeBadgeAssetRef)"
      alt=""
    />
    <img v-if="acessoriosAssetRef" class="layer acessorios" :src="assetUrl(acessoriosAssetRef)" alt="" />
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

const assetUrl = (assetRef: string) => `/illustrations/avatarItems/${assetRef}`;
</script>

<style scoped>
.hemarcio {
  position: relative;
  margin: 0 auto;
}
.hemarcio.large {
  width: 220px;
  height: 320px;
}
.hemarcio.thumbnail {
  width: 48px;
  height: 70px;
}
.layer {
  position: absolute;
}
.layer.fundo {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  object-fit: cover;
  border-radius: 12px;
}
.layer.base {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  object-fit: contain;
}
.layer.pernas {
  top: 58%;
  left: 12%;
  width: 76%;
  z-index: 2;
}
.layer.corpo {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  object-fit: contain;
}
.layer.olhos {
  top: 42%;
  left: 28%;
  width: 44%;
  z-index: 4;
}
.layer.blood-type-medal {
  top: 54%;
  left: 34%;
  width: 32%;
  z-index: 5;
}
.layer.acessorios {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 6;
  object-fit: contain;
}
</style>
