<template>
  <HemarcioCharacter
    size="thumbnail"
    :olhos-asset-ref="
      slot === 'OLHOS'
        ? assetRef
        : (avatarStore.equippedAssetRef('OLHOS') ?? 'olhos/olhos_padrao.svg')
    "
    :corpo-asset-ref="
      slot === 'CORPO'
        ? assetRef
        : (avatarStore.equippedAssetRef('CORPO') ?? 'corpo/corpo_padrao.svg')
    "
    :pernas-asset-ref="
      slot === 'PERNAS'
        ? assetRef
        : (avatarStore.equippedAssetRef('PERNAS') ?? 'pernas/pernas_padrao.svg')
    "
    :acessorios-asset-ref="
      slot === 'ACESSORIOS'
        ? assetRef
        : avatarStore.equippedAssetRef('ACESSORIOS')
    "
    :fundo-asset-ref="slot === 'FUNDO' ? assetRef : null"
    :blood-type-badge-asset-ref="
      slot === 'BADGE' ? assetRef : visibleBloodTypeBadgeAssetRef
    "
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

const visibleBloodTypeBadgeAssetRef = computed(() =>
  avatarStore.showBloodTypeBadge
    ? (avatarStore.bloodTypeBadge?.assetRef ?? null)
    : null,
);
</script>
