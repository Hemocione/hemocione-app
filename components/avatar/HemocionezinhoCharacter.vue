<template>
  <div class="hemocionezinho" :class="[size]">
    <img v-if="backgroundAssetRef" class="layer background" :src="assetUrl(backgroundAssetRef)" alt="" />
    <svg class="layer base" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M100 10 C 135 75, 180 125, 180 175 C 180 225, 144 260, 100 260 C 56 260, 20 225, 20 175 C 20 125, 65 75, 100 10 Z"
        fill="#E4002B"
      />
      <line x1="22" y1="175" x2="-10" y2="205" stroke="#E4002B" stroke-width="16" stroke-linecap="round" />
      <line x1="178" y1="175" x2="210" y2="205" stroke="#E4002B" stroke-width="16" stroke-linecap="round" />
      <line x1="80" y1="255" x2="65" y2="292" stroke="#E4002B" stroke-width="16" stroke-linecap="round" />
      <line x1="120" y1="255" x2="135" y2="292" stroke="#E4002B" stroke-width="16" stroke-linecap="round" />
      <circle cx="80" cy="155" r="12" fill="#fff" />
      <circle cx="120" cy="155" r="12" fill="#fff" />
      <circle cx="82" cy="158" r="5" fill="#1a1a1a" />
      <circle cx="122" cy="158" r="5" fill="#1a1a1a" />
    </svg>
    <img v-if="bodyAssetRef" class="layer body" :src="assetUrl(bodyAssetRef)" alt="" />
    <img
      v-if="bloodTypeBadgeAssetRef"
      class="layer blood-type-medal"
      :src="assetUrl(bloodTypeBadgeAssetRef)"
      alt=""
    />
    <img v-if="faceAssetRef" class="layer face" :src="assetUrl(faceAssetRef)" alt="" />
    <img v-if="headAssetRef" class="layer head" :src="assetUrl(headAssetRef)" alt="" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: "large" | "thumbnail";
    headAssetRef: string | null;
    faceAssetRef: string | null;
    bodyAssetRef: string | null;
    backgroundAssetRef: string | null;
    bloodTypeBadgeAssetRef?: string | null;
  }>(),
  { size: "large", bloodTypeBadgeAssetRef: null }
);

const assetUrl = (assetRef: string) => `/illustrations/avatarItems/${assetRef}`;
</script>

<style scoped>
.hemocionezinho {
  position: relative;
  margin: 0 auto;
}
.hemocionezinho.large {
  width: 220px;
  height: 320px;
}
.hemocionezinho.thumbnail {
  width: 48px;
  height: 70px;
}
.layer {
  position: absolute;
}
.layer.background {
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
}
.layer.body {
  top: 62%;
  left: 12%;
  width: 76%;
  z-index: 2;
}
.layer.blood-type-medal {
  top: 51%;
  left: 35%;
  width: 30%;
  z-index: 3;
}
.layer.face {
  top: 42%;
  left: 28%;
  width: 44%;
  z-index: 4;
}
.layer.head {
  top: -4%;
  left: 18%;
  width: 64%;
  z-index: 5;
}
</style>
