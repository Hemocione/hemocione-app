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
  clipPath?: string;
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
  chapeu_estreante: { sourceWidth: 1200, sourceHeight: 1200, x: 370, y: 55, width: 460, height: 290 },
  coroa_campeao: { sourceWidth: 1200, sourceHeight: 1200, x: 395, y: 65, width: 425, height: 280 },
  faixa_corredor: { sourceWidth: 1200, sourceHeight: 1200, x: 425, y: 255, width: 400, height: 115 },
  cracha_evento: { sourceWidth: 1200, sourceHeight: 1200, x: 420, y: 530, width: 360, height: 230 },
  selo_liberado: { sourceWidth: 1200, sourceHeight: 1200, x: 315, y: 505, width: 185, height: 185 },
  fita_incentivo: { sourceWidth: 1200, sourceHeight: 1200, x: 385, y: 550, width: 150, height: 220 },
};

const bodyCrops: Record<string, PreviewCrop> = {
  capa_heroi: { sourceWidth: 712, sourceHeight: 670, x: 30, y: 265, width: 580, height: 340 },
  faixa_competidor: { sourceWidth: 712, sourceHeight: 670, x: 190, y: 280, width: 330, height: 190, clipPath: "polygon(75.84% 36.42%, 77.95% 47.91%, 29.35% 73.73%, 23.17% 62.54%)" },
  colete_completo: { sourceWidth: 712, sourceHeight: 670, x: 120, y: 270, width: 395, height: 255, clipPath: "polygon(16.43% 41.04%, 73.03% 41.04%, 73.88% 62.39%, 68.82% 73.13%, 58.99% 78.36%, 30.20% 78.36%, 20.37% 73.13%, 15.17% 62.39%)" },
  macacao_encanador: { sourceWidth: 712, sourceHeight: 670, x: 130, y: 265, width: 375, height: 280, clipPath: "polygon(19.66% 40.90%, 26.83% 40.30%, 31.18% 50.60%, 58.29% 50.60%, 62.50% 40.30%, 69.52% 40.90%, 66.57% 54.63%, 68.82% 71.49%, 59.69% 79.10%, 29.78% 79.10%, 20.37% 71.49%, 22.47% 54.63%)" },
  jaleco_hemocentro: { sourceWidth: 712, sourceHeight: 670, x: 50, y: 255, width: 535, height: 310, clipPath: "polygon(7.72% 41.49%, 18.96% 39.55%, 33.01% 41.04%, 44.66% 48.36%, 56.32% 41.04%, 70.93% 39.55%, 81.46% 41.49%, 82.87% 56.72%, 72.61% 57.61%, 70.08% 77.31%, 58.43% 80.90%, 44.80% 80.60%, 31.18% 80.90%, 19.24% 77.31%, 16.71% 57.61%, 6.32% 56.72%)" },
};

const crop = computed<PreviewCrop>(() => {
  const name = props.assetRef.split("/").pop()?.replace(/\.svg$/, "") ?? "";
  if (props.slot === "ACESSORIOS") {
    return accessoryCrops[name] ?? { sourceWidth: 1200, sourceHeight: 1200, x: 280, y: 100, width: 640, height: 650 };
  }
  if (props.slot === "OLHOS" && name === "oculos_veterano") {
    return { sourceWidth: 100, sourceHeight: 100, x: 0, y: 2, width: 100, height: 76 };
  }
  if (props.slot === "CORPO") {
    return bodyCrops[name] ?? { sourceWidth: 712, sourceHeight: 670, x: 0, y: 0, width: 712, height: 670 };
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
    clipPath: crop.value.clipPath,
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
