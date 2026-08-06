<template>
  <button
    type="button"
    class="avatar-widget"
    aria-haspopup="dialog"
    aria-label="Editar meu Hemocionezinho"
    @click="isDialogOpen = true"
  >
    <span class="avatar-stage" aria-hidden="true">
      <HemocionezinhoCharacter
        size="thumbnail"
        :head-asset-ref="avatarStore.equippedAssetRef('HEAD')"
        :face-asset-ref="avatarStore.equippedAssetRef('FACE')"
        :body-asset-ref="avatarStore.equippedAssetRef('BODY')"
        :background-asset-ref="avatarStore.equippedAssetRef('BACKGROUND')"
      />
      <span class="snow-ledge"></span>
    </span>
    <span class="edit-badge" aria-hidden="true">🖌️</span>
  </button>

  <ElDialog
    v-model="isDialogOpen"
    fullscreen
    :show-close="false"
    class="avatar-dialog"
  >
    <div
      class="dialog-content"
      :style="{ paddingTop: `${topSafeAreaInset?.value ?? 0}px` }"
    >
      <div class="editor-header">
        <div>
          <p class="eyebrow">PERSONALIZE SEU</p>
          <h2>Hemocionezinho</h2>
        </div>
        <button
          type="button"
          class="close-btn"
          aria-label="Fechar editor do Hemocionezinho"
          @click="isDialogOpen = false"
        >
          ✕
        </button>
      </div>

      <div class="stage-wrap" aria-hidden="true">
        <div class="cloud cloud-a"></div>
        <div class="cloud cloud-b"></div>
        <span class="sparkle sparkle-a">✦</span>
        <span class="sparkle sparkle-b">✦</span>
        <HemocionezinhoCharacter
          size="large"
          :head-asset-ref="avatarStore.equippedAssetRef('HEAD')"
          :face-asset-ref="avatarStore.equippedAssetRef('FACE')"
          :body-asset-ref="avatarStore.equippedAssetRef('BODY')"
          :background-asset-ref="avatarStore.equippedAssetRef('BACKGROUND')"
        />
        <div class="snow-mound"></div>
      </div>

      <div class="customization-sheet">
        <div class="tabs" role="tablist" aria-label="Categorias do avatar">
          <button
            v-for="slot in slots"
            :key="slot"
            type="button"
            class="tab"
            :class="{ active: activeSlot === slot }"
            role="tab"
            :aria-selected="activeSlot === slot"
            :aria-pressed="activeSlot === slot"
            @click="activeSlot = slot"
          >
            <span aria-hidden="true">{{ slotLabels[slot].emoji }}</span>
            {{ slotLabels[slot].label }}
          </button>
        </div>

        <div id="avatar-items-grid" class="items-grid" role="tabpanel">
          <button
            v-for="item in avatarStore.itemsBySlot[activeSlot]"
            :key="item.id"
            type="button"
            class="item-card"
            :class="{
              owned: item.owned,
              locked: !item.owned,
              equipped: avatarStore.isEquipped(item),
            }"
            :disabled="!item.owned"
            :aria-label="item.name"
            :aria-pressed="avatarStore.isEquipped(item)"
            @click="avatarStore.equipItem(item)"
          >
            <span v-if="!item.owned" class="lock" aria-hidden="true">🔒</span>
            <img
              :src="`/illustrations/avatarItems/${item.assetRef}`"
              :alt="item.name"
            />
            <span>{{ item.name }}</span>
            <span v-if="!item.owned" class="locked-hint">Bloqueado</span>
          </button>
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { useAvatarStore, type AvatarSlot } from "~/stores/avatar";
import HemocionezinhoCharacter from "~/components/avatar/HemocionezinhoCharacter.vue";

const avatarStore = useAvatarStore();
const isDialogOpen = ref(false);
const activeSlot = ref<AvatarSlot>("HEAD");
const topSafeAreaInset = shallowRef<{ value: number } | null>(null);

void avatarStore.fetchAvatar();
void useTopSafeAreaInset().then((inset) => {
  topSafeAreaInset.value = inset;
});

const slots: AvatarSlot[] = ["HEAD", "FACE", "BODY", "BACKGROUND"];
const slotLabels: Record<AvatarSlot, { emoji: string; label: string }> = {
  HEAD: { emoji: "🎓", label: "Cabeça" },
  FACE: { emoji: "🕶️", label: "Rosto" },
  BODY: { emoji: "🎗️", label: "Corpo" },
  BACKGROUND: { emoji: "🖼️", label: "Fundo" },
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
.avatar-widget,
:deep(.avatar-dialog) {
  --cp-sky-top: #6fd0ff;
  --cp-sky-mid: #bdecff;
  --cp-sky-bottom: #f3fbff;
  --cp-snow: #ffffff;
  --cp-ice-line: #1f7cb4;
  --cp-ice-line-soft: #59a8d6;
  --cp-gold: #ffc635;
  --cp-gold-dark: #d99a00;
  --cp-ink: #17324a;
  --cp-ink-soft: #4c6c82;
}

.avatar-widget {
  position: relative;
  display: block;
  flex: 0 0 62px;
  width: 62px;
  height: 90px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  font: inherit;
}

.avatar-stage {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 3px solid var(--cp-ice-line);
  border-radius: 1.1rem;
  background: linear-gradient(
    180deg,
    var(--cp-sky-top) 0%,
    var(--cp-sky-mid) 55%,
    var(--cp-sky-bottom) 100%
  );
  box-shadow: 0 3px 0 var(--cp-ice-line),
    inset 0 -6px 10px rgba(255, 255, 255, 0.5);
  transition: transform 160ms ease;
}

.avatar-widget:hover .avatar-stage {
  transform: translateY(-3px) rotate(-3deg);
}

.avatar-widget:active .avatar-stage {
  transform: translateY(0) scale(0.95);
}

.avatar-widget:focus-visible {
  outline: 3px solid var(--hemo-color-primary-light);
  outline-offset: 3px;
}

.snow-ledge {
  position: absolute;
  bottom: 6px;
  left: 8%;
  width: 84%;
  height: 10px;
  border-radius: 50%;
  background: var(--cp-snow);
  box-shadow: 0 1px 0 rgba(31, 124, 180, 0.3);
}

.edit-badge {
  position: absolute;
  right: -6px;
  bottom: -6px;
  display: grid;
  place-items: center;
  width: 1.6rem;
  height: 1.6rem;
  border: 2px solid var(--cp-ink);
  border-radius: 50%;
  background: var(--cp-gold);
  font-size: 0.8rem;
  line-height: 1;
  animation: badge-pulse 2.4s ease-in-out infinite;
}

:deep(.avatar-dialog.el-dialog) {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: none;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: var(--cp-snow);
  box-shadow: none;
}

:deep(.avatar-dialog .el-dialog__header) {
  display: none;
}

:deep(.avatar-dialog .el-dialog__body) {
  display: flex;
  flex: 1;
  min-height: 0;
  padding: 0;
  overflow: hidden;
}

.dialog-content {
  display: flex;
  min-height: 100%;
  flex: 1;
  flex-direction: column;
  box-sizing: border-box;
  padding-right: 0;
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: 0;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    var(--cp-sky-top) 0%,
    var(--cp-sky-mid) 28%,
    var(--cp-snow) 46%,
    var(--cp-snow) 100%
  );
  color: var(--cp-ink);
}

.editor-header {
  position: relative;
  z-index: 2;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.1rem 0.6rem;
}

.eyebrow {
  margin: 0;
  color: var(--hemo-color-primary-dark);
  font-size: 0.6rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.editor-header h2 {
  margin: 0.1rem 0 0;
  color: var(--cp-ink);
  font-family: "Baloo 2", sans-serif;
  font-size: clamp(1.35rem, 4vw, 1.8rem);
  font-weight: 800;
  line-height: 1.1;
}

.close-btn {
  display: grid;
  width: 2.1rem;
  height: 2.1rem;
  flex: 0 0 2.1rem;
  place-items: center;
  padding: 0;
  border: 2px solid var(--cp-ice-line);
  border-radius: 50%;
  background: var(--cp-snow);
  box-shadow: 0 2px 0 var(--cp-ice-line-soft);
  color: var(--cp-ink);
  cursor: pointer;
  font-family: "Baloo 2", sans-serif;
  font-size: 1rem;
  line-height: 1;
}

.close-btn:hover {
  transform: translateY(-1px);
}

.close-btn:focus-visible {
  outline: 3px solid var(--hemo-color-primary-light);
  outline-offset: 2px;
}

.stage-wrap {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  align-items: flex-end;
  justify-content: center;
  width: min(100%, 420px);
  min-height: 340px;
  margin: 0 auto 0.6rem;
  overflow: hidden;
  border-radius: 1.5rem;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.35),
    rgba(255, 255, 255, 0)
  );
}

.stage-wrap :deep(.hemocionezinho) {
  z-index: 2;
  margin-bottom: 14px;
}

.cloud {
  position: absolute;
  border-radius: 999px;
  background: var(--cp-snow);
  opacity: 0.9;
}

.cloud-a {
  top: 8%;
  left: -10px;
  width: 60px;
  height: 22px;
}

.cloud-a::after {
  position: absolute;
  top: -12px;
  left: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--cp-snow);
  content: "";
}

.cloud-b {
  top: 22%;
  right: -6px;
  width: 44px;
  height: 16px;
}

.sparkle {
  position: absolute;
  color: var(--cp-gold-dark);
  font-size: 1.1rem;
}

.sparkle-a {
  top: 10%;
  left: 12%;
  transform: rotate(-10deg);
}

.sparkle-b {
  top: 40%;
  right: 10%;
  transform: rotate(15deg);
}

.snow-mound {
  position: absolute;
  bottom: -10px;
  left: 50%;
  z-index: 3;
  width: 78%;
  height: 34px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: var(--cp-snow);
  box-shadow: 0 2px 0 rgba(31, 124, 180, 0.25);
}

.customization-sheet {
  min-height: 0;
  flex: 1;
  padding: 0.85rem 0.9rem 1.1rem;
  overflow-y: auto;
  border-top: 3px solid var(--cp-ice-line);
  border-radius: 1.4rem 1.4rem 0 0;
  background: var(--cp-snow);
  color: var(--cp-ink);
}

.tabs {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.7rem;
  overflow-x: auto;
  padding-bottom: 0.7rem;
  border-bottom: 2px dashed #d7e2e8;
  scrollbar-width: none;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.7rem;
  border: 2px solid var(--cp-ice-line-soft);
  border-radius: 999px;
  background: var(--cp-snow);
  color: var(--cp-ink-soft);
  cursor: pointer;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.1;
  white-space: nowrap;
}

.tab.active {
  border-color: var(--hemo-color-primary-dark);
  background: var(--hemo-color-primary);
  box-shadow: 0 2px 0 var(--hemo-color-primary-dark);
  color: var(--cp-snow);
}

.tab:focus-visible,
.item-card:focus-visible {
  outline: 3px solid var(--hemo-color-primary-light);
  outline-offset: 2px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.55rem;
}

.item-card {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.55rem 0.3rem 0.4rem;
  border: 2px solid #d7e2e8;
  border-radius: 1rem;
  background: #fbfdfe;
  color: var(--cp-ink-soft);
  cursor: pointer;
  font: inherit;
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  transition: transform 160ms ease, border-color 160ms ease,
    box-shadow 160ms ease;
}

.item-card img {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

.item-card.owned {
  border-color: var(--cp-ice-line-soft);
  background: var(--cp-snow);
  color: var(--cp-ink);
}

.item-card.equipped {
  border-color: var(--hemo-color-primary);
  background: #fff5f6;
  box-shadow: 0 3px 0 var(--hemo-color-primary);
}

.item-card.equipped::after {
  position: absolute;
  top: -8px;
  right: -8px;
  display: grid;
  width: 1.3rem;
  height: 1.3rem;
  place-items: center;
  border: 2px solid var(--cp-snow);
  border-radius: 50%;
  background: var(--hemo-color-primary);
  color: var(--cp-snow);
  content: "✓";
  font-size: 0.7rem;
}

.item-card.locked {
  opacity: 0.55;
}

.item-card.locked img {
  filter: grayscale(1);
}

.item-card .lock {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 0.7rem;
}

.locked-hint {
  font-size: 0.58rem;
}

.item-card:not(:disabled):hover {
  border-color: var(--hemo-color-primary);
  box-shadow: 0 3px 0 var(--hemo-color-primary-dark);
  transform: translateY(-3px) rotate(-1deg);
}

.item-card:not(:disabled):active {
  transform: translateY(0) scale(0.97);
}

.item-card:disabled {
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .edit-badge {
    animation: none;
  }

  .avatar-stage,
  .close-btn,
  .item-card {
    transition: none;
  }
}

@keyframes badge-pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.12);
  }
}
</style>
