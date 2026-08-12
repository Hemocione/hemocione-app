<template>
  <HemarcioCharacter
    size="thumbnail"
    :olhos-asset-ref="slot === 'OLHOS' ? assetRef : avatarStore.equippedAssetRef('OLHOS')"
    :corpo-asset-ref="slot === 'CORPO' ? assetRef : avatarStore.equippedAssetRef('CORPO')"
    :pernas-asset-ref="slot === 'PERNAS' ? assetRef : avatarStore.equippedAssetRef('PERNAS')"
    :acessorios-asset-ref="slot === 'ACESSORIOS' ? assetRef : avatarStore.equippedAssetRef('ACESSORIOS')"
    :fundo-asset-ref="null"
    :blood-type-badge-asset-ref="slot === 'BADGE' ? assetRef : visibleBloodTypeBadgeAssetRef"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import HemarcioCharacter from "~/components/avatar/HemarcioCharacter.vue";
import { useAvatarStore, type AvatarSlot } from "~/stores/avatar";

defineProps<{
  slot: AvatarSlot | "BADGE";
  assetRef: string;
}>();

const avatarStore = useAvatarStore();

// Item pickers preview "what would I look like wearing this" - every other
// slot keeps whatever the donor already has equipped, only the slot being
// browsed swaps to the card's own item. Rendering through HemarcioCharacter
// (instead of the item's raw SVG) is what fixes items like corpo_padrao/
// capa_heroi looking like near-empty squares: their arms are cropped to sit
// on the shared body, so the body needs to actually be there.
const visibleBloodTypeBadgeAssetRef = computed(() =>
  avatarStore.showBloodTypeBadge ? avatarStore.bloodTypeBadge?.assetRef ?? null : null
);
</script>
