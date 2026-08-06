<template>
  <button
    type="button"
    class="avatar-widget"
    aria-haspopup="dialog"
    aria-label="Editar meu Hemocionezinho"
    @click="isDialogOpen = true"
  >
    <HemocionezinhoCharacter
      size="thumbnail"
      :head-asset-ref="avatarStore.equippedAssetRef('HEAD')"
      :face-asset-ref="avatarStore.equippedAssetRef('FACE')"
      :body-asset-ref="avatarStore.equippedAssetRef('BODY')"
      :background-asset-ref="avatarStore.equippedAssetRef('BACKGROUND')"
    />
    <span class="edit-badge" aria-hidden="true">✏️</span>
  </button>

  <ElDialog
    v-model="isDialogOpen"
    fullscreen
    :show-close="true"
    class="avatar-dialog"
  >
    <div
      class="dialog-content"
      :style="{ paddingTop: `${topSafeAreaInset?.value ?? 0}px` }"
    >
      <div class="dialog-heading">
        <div>
          <p class="eyebrow">PERSONALIZE SEU</p>
          <h2>Meu Hemocionezinho</h2>
        </div>
        <span class="heading-mark" aria-hidden="true">🎨</span>
      </div>

      <div class="character-stage">
        <span class="stage-sparkle stage-sparkle-left" aria-hidden="true">✦</span>
        <HemocionezinhoCharacter
          size="large"
          :head-asset-ref="avatarStore.equippedAssetRef('HEAD')"
          :face-asset-ref="avatarStore.equippedAssetRef('FACE')"
          :body-asset-ref="avatarStore.equippedAssetRef('BODY')"
          :background-asset-ref="avatarStore.equippedAssetRef('BACKGROUND')"
        />
        <span class="stage-sparkle stage-sparkle-right" aria-hidden="true">✦</span>
      </div>

      <div class="customization-sections">
        <section v-for="slot in slots" :key="slot" class="slot-section">
          <div class="slot-heading">
            <h3>{{ slotLabels[slot] }}</h3>
            <span>{{ avatarStore.itemsBySlot[slot].length }} itens</span>
          </div>
          <div class="items-grid">
            <button
              v-for="item in avatarStore.itemsBySlot[slot]"
              :key="item.id"
              type="button"
              class="item-card"
              :class="{ owned: item.owned, equipped: avatarStore.isEquipped(item) }"
              :disabled="!item.owned"
              :aria-label="item.name"
              :aria-pressed="avatarStore.isEquipped(item)"
              @click="avatarStore.equipItem(item)"
            >
              <img :src="`/illustrations/avatarItems/${item.assetRef}`" :alt="item.name" />
              <span>{{ item.name }}</span>
              <span v-if="!item.owned" class="locked-hint">Bloqueado</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { useAvatarStore, type AvatarSlot } from "~/stores/avatar";
import HemocionezinhoCharacter from "~/components/avatar/HemocionezinhoCharacter.vue";

const avatarStore = useAvatarStore();
const isDialogOpen = ref(false);
const topSafeAreaInset = shallowRef<{ value: number } | null>(null);

void avatarStore.fetchAvatar();
void useTopSafeAreaInset().then((inset) => {
  topSafeAreaInset.value = inset;
});

const slots: AvatarSlot[] = ["HEAD", "FACE", "BODY", "BACKGROUND"];
const slotLabels: Record<AvatarSlot, string> = {
  HEAD: "Cabeça",
  FACE: "Rosto",
  BODY: "Corpo",
  BACKGROUND: "Fundo",
};

const handlePopState = (_event: Event) => {
  if (isDialogOpen.value) {
    isDialogOpen.value = false;
  }
};

watch(isDialogOpen, (newValue) => {
  if (newValue) {
    window.addEventListener("popstate", handlePopState);
    window.history.pushState({ avatarDialog: "open" }, "");
  } else {
    window.removeEventListener("popstate", handlePopState);
  }
});
</script>

<style scoped>
.avatar-widget {
  position: relative;
  display: block;
  flex: 0 0 56px;
  width: 56px;
  height: 82px;
  padding: 0;
  border: 2px solid var(--hemo-color-primary);
  border-radius: 1.25rem;
  background-color: var(--light-purple);
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.avatar-widget:hover {
  transform: translateY(-2px) rotate(-2deg);
  box-shadow: 0 4px 0 var(--hemo-color-primary-dark);
}

.avatar-widget:active {
  transform: translateY(0) scale(0.96);
}

.avatar-widget:focus-visible {
  box-shadow: 0 0 0 3px var(--hemo-color-primary-light);
}

.edit-badge {
  position: absolute;
  right: -0.45rem;
  bottom: -0.35rem;
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--black-100);
  border-radius: 50%;
  background-color: var(--hemo-color-primary);
  font-size: 0.8rem;
  line-height: 1;
}

:deep(.avatar-dialog.el-dialog) {
  display: flex;
  flex-direction: column;
  background-color: var(--black-100);
}

:deep(.avatar-dialog .el-dialog__header) {
  flex: 0 0 auto;
  margin: 0;
  padding: 0;
}

:deep(.avatar-dialog .el-dialog__headerbtn) {
  top: calc(1rem + env(safe-area-inset-top));
  right: 1rem;
  z-index: 3;
}

:deep(.avatar-dialog .el-dialog__close) {
  color: var(--hemo-color-text-primary);
}

:deep(.avatar-dialog .el-dialog__body) {
  flex: 1;
  min-height: 0;
  padding: 0;
  overflow-y: auto;
}

.dialog-content {
  min-height: 100%;
  padding-right: 1rem;
  padding-bottom: calc(2rem + env(safe-area-inset-bottom));
  padding-left: 1rem;
  background-color: var(--black-100);
  color: var(--hemo-color-text-primary);
}

.dialog-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(100%, 900px);
  margin: 0 auto;
  padding: 1rem 0 0.5rem;
}

.eyebrow {
  margin: 0 0 0.25rem;
  color: var(--hemo-color-primary-light);
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.dialog-heading h2 {
  margin: 0;
  color: var(--hemo-color-text-primary);
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 900;
}

.heading-mark {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border: 2px solid var(--hemo-color-primary);
  border-radius: 1rem;
  background-color: var(--light-purple);
  font-size: 1.5rem;
  transform: rotate(5deg);
}

.character-stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(100%, 330px);
  min-height: 340px;
  margin: 1rem auto 2rem;
  border: 3px solid var(--hemo-color-primary);
  border-radius: 2rem;
  background-color: var(--light-purple);
  overflow: hidden;
}

.stage-sparkle {
  position: absolute;
  color: var(--hemo-color-primary);
  font-size: 2.25rem;
  line-height: 1;
}

.stage-sparkle-left {
  top: 1.5rem;
  left: 1rem;
  transform: rotate(-12deg);
}

.stage-sparkle-right {
  right: 1rem;
  bottom: 1.5rem;
  transform: rotate(12deg);
}

.customization-sections {
  display: grid;
  gap: 1.5rem;
  width: min(100%, 900px);
  margin: 0 auto;
}

.slot-section + .slot-section {
  padding-top: 1.5rem;
  border-top: 1px solid var(--black-80);
}

.slot-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.slot-heading h3 {
  margin: 0;
  color: var(--hemo-color-text-primary);
  font-size: 1.15rem;
}

.slot-heading span {
  color: var(--black-20);
  font-size: 0.75rem;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
  gap: 0.75rem;
}

.item-card {
  display: flex;
  min-height: 112px;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border: 2px solid var(--black-20);
  border-radius: 1rem;
  background-color: var(--light-purple);
  color: var(--black-100);
  cursor: pointer;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.item-card img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.item-card:not(:disabled):hover {
  border-color: var(--hemo-color-primary);
  box-shadow: 0 4px 0 var(--hemo-color-primary-dark);
  transform: translateY(-3px) rotate(-1deg);
}

.item-card:not(:disabled):active {
  transform: translateY(0) scale(0.97);
}

.item-card.equipped {
  border-color: var(--hemo-color-primary);
  background-color: var(--hemo-color-primary-light);
  box-shadow: 0 4px 0 var(--hemo-color-primary-dark);
}

.item-card:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.locked-hint {
  color: var(--black-80);
  font-size: 0.65rem;
}
</style>
