<template>
  <span class="item-preview">
    <img :src="avatarAssetUrl(assetRef)" :style="imageStyle" alt="" />
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { avatarAssetUrl } from "~/utils/avatarAssetUrl";
import type { AvatarSlot } from "~/stores/avatar";

interface PreviewCrop {
  sourceWidth: number;
  sourceHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const props = defineProps<{
  slot: AvatarSlot | "BADGE";
  assetRef: string;
}>();

const accessoryCrops: Record<string, PreviewCrop> = {
  chapeu_estreante: { sourceWidth: 1200, sourceHeight: 1200, x: 410, y: 70, width: 380, height: 250 },
  coroa_campeao: { sourceWidth: 1200, sourceHeight: 1200, x: 430, y: 110, width: 340, height: 250 },
  cracha_evento: { sourceWidth: 1200, sourceHeight: 1200, x: 365, y: 530, width: 210, height: 190 },
  selo_liberado: { sourceWidth: 1200, sourceHeight: 1200, x: 275, y: 465, width: 165, height: 165 },
  fita_incentivo: { sourceWidth: 1200, sourceHeight: 1200, x: 390, y: 540, width: 150, height: 190 },
};

const crop = computed<PreviewCrop>(() => {
  const name = props.assetRef.split("/").pop()?.replace(/\.svg$/, "") ?? "";
  if (props.slot === "ACESSORIOS") {
    return accessoryCrops[name] ?? { sourceWidth: 1200, sourceHeight: 1200, x: 280, y: 100, width: 640, height: 650 };
  }
  if (props.slot === "CORPO") {
    if (name === "colete_completo" || name === "faixa_competidor") {
      return { sourceWidth: 712, sourceHeight: 670, x: 60, y: 255, width: 590, height: 410 };
    }
    return { sourceWidth: 712, sourceHeight: 670, x: 0, y: 0, width: 712, height: 670 };
  }
  if (props.slot === "PERNAS") {
    return { sourceWidth: 364, sourceHeight: 398, x: 0, y: 0, width: 364, height: 398 };
  }
  return { sourceWidth: 100, sourceHeight: 100, x: 0, y: 0, width: 100, height: 100 };
});

const imageStyle = computed(() => {
  const { sourceWidth, sourceHeight, x, y, width, height } = crop.value;
  const scale = 56 / Math.max(width, height);
  return {
    width: `${sourceWidth * scale}px`,
    height: `${sourceHeight * scale}px`,
    left: `${28 - (x + width / 2) * scale}px`,
    top: `${28 - (y + height / 2) * scale}px`,
  };
});
</script>

<style scoped>
.item-preview {
  position: relative;
  display: block;
  width: 56px;
  height: 56px;
  margin: 0 auto;
  overflow: hidden;
}

.item-preview img {
  position: absolute;
  max-width: none;
}
</style>
