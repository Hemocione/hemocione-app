<template>
  <div class="main">
    <CommonBackHeader title="Meu avatar" icon-direction="left" />

    <HemocionezinhoCharacter
      :head-asset-ref="avatarStore.equippedAssetRef('HEAD')"
      :face-asset-ref="avatarStore.equippedAssetRef('FACE')"
      :body-asset-ref="avatarStore.equippedAssetRef('BODY')"
      :background-asset-ref="avatarStore.equippedAssetRef('BACKGROUND')"
    />

    <section v-for="slot in slots" :key="slot" class="slot-section">
      <h3>{{ slotLabels[slot] }}</h3>
      <div class="items-grid">
        <button
          v-for="item in avatarStore.itemsBySlot[slot]"
          :key="item.id"
          class="item-card"
          :class="{ owned: item.owned, equipped: avatarStore.isEquipped(item) }"
          :disabled="!item.owned"
          @click="avatarStore.equipItem(item)"
        >
          <img :src="`/illustrations/avatarItems/${item.assetRef}`" :alt="item.name" />
          <span>{{ item.name }}</span>
          <span v-if="!item.owned" class="locked-hint">Bloqueado</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAvatarStore, type AvatarSlot } from "~/stores/avatar";
import HemocionezinhoCharacter from "~/components/avatar/HemocionezinhoCharacter.vue";

const avatarStore = useAvatarStore();
await avatarStore.fetchAvatar();

const slots: AvatarSlot[] = ["HEAD", "FACE", "BODY", "BACKGROUND"];
const slotLabels: Record<AvatarSlot, string> = {
  HEAD: "Cabeça",
  FACE: "Rosto",
  BODY: "Corpo",
  BACKGROUND: "Fundo",
};
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
}
.slot-section h3 {
  margin-bottom: 0.5rem;
}
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 0.75rem;
}
.item-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background: var(--light-purple);
  cursor: pointer;
}
.item-card img {
  width: 48px;
  height: 48px;
}
.item-card.equipped {
  border-color: var(--hemo-color-primary);
}
.item-card:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.locked-hint {
  font-size: 0.65rem;
  color: var(--black-80);
}
</style>
