<template>
  <button
    type="button"
    class="avatar-widget"
    aria-haspopup="dialog"
    aria-label="Editar meu Hemárcio"
    @click="avatarStore.openEditor()"
  >
    <span class="avatar-stage" aria-hidden="true">
      <HemarcioCharacter
        size="thumbnail"
        :olhos-asset-ref="avatarStore.equippedAssetRef('OLHOS')"
        :corpo-asset-ref="avatarStore.equippedAssetRef('CORPO')"
        :pernas-asset-ref="avatarStore.equippedAssetRef('PERNAS')"
        :acessorios-asset-ref="avatarStore.equippedAssetRef('ACESSORIOS')"
        :fundo-asset-ref="avatarStore.equippedAssetRef('FUNDO')"
        :blood-type-badge-asset-ref="visibleBloodTypeBadgeAssetRef"
      />
    </span>
  </button>

  <Teleport to="body">
    <Transition name="slide-up">
      <div
        v-if="isEditorOpen"
        class="avatar-drawer-overlay"
        @click.self="avatarStore.closeEditor()"
      >
        <div class="avatar-drawer">
          <div
            class="dialog-content"
            :style="{ paddingTop: `${topSafeAreaInset?.value ?? 0}px` }"
          >
      <div class="editor-header">
        <div>
          <p class="eyebrow">PERSONALIZE SEU</p>
          <h2>Hemárcio</h2>
        </div>
        <div class="header-actions">
          <NuxtLink
            v-if="showAchievementChip"
            to="/achievements"
            class="achievement-chip"
            @click="avatarStore.closeEditor()"
          >
            🏅 {{ unlockedAchievementsCount }}/{{ totalAchievementsCount }}
          </NuxtLink>
          <button
            type="button"
            class="close-btn"
            aria-label="Fechar editor do Hemárcio"
            @click="avatarStore.closeEditor()"
          >
            ✕
          </button>
        </div>
      </div>

      <div class="stage-wrap" aria-hidden="true">
        <div class="stage-backdrop" :style="stageBackdropStyle"></div>
        <HemarcioCharacter
          ref="stageCharacterRef"
          size="large"
          :olhos-asset-ref="avatarStore.equippedAssetRef('OLHOS')"
          :corpo-asset-ref="avatarStore.equippedAssetRef('CORPO')"
          :pernas-asset-ref="avatarStore.equippedAssetRef('PERNAS')"
          :acessorios-asset-ref="avatarStore.equippedAssetRef('ACESSORIOS')"
          :fundo-asset-ref="null"
          :blood-type-badge-asset-ref="visibleBloodTypeBadgeAssetRef"
        />
        <img
          v-if="shareOnlyFundoAssetRef"
          ref="shareOnlyFundoRef"
          class="share-only-fundo"
          :src="avatarAssetUrl(shareOnlyFundoAssetRef)"
          alt=""
        />
      </div>

      <div v-if="canShare" class="share-actions">
        <button
          type="button"
          class="share-btn"
          :disabled="!shareableImage || !canShare"
          @click="shareHemarcio"
        >
          <span aria-hidden="true">📤</span>
          Compartilhar
        </button>
      </div>

      <div class="customization-sheet">
        <div class="tabs" role="tablist" aria-label="Categorias do avatar">
          <button
            v-for="tab in tabs"
            :key="tab"
            type="button"
            class="tab"
            :class="{ active: activeTab === tab }"
            role="tab"
            :aria-selected="activeTab === tab"
            :aria-pressed="activeTab === tab"
            :aria-controls="tabPanelId(tab)"
            @click="activeTab = tab"
          >
            <span aria-hidden="true">{{ tabLabels[tab].emoji }}</span>
            {{ tabLabels[tab].label }}
          </button>
        </div>

        <div
          v-if="isSlotTab(activeTab)"
          id="avatar-items-grid"
          class="items-grid"
          role="tabpanel"
          aria-label="Itens do avatar"
        >
          <button
            v-for="item in activeItems"
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
            @click="handleItemClick(item)"
          >
            <span v-if="!item.owned" class="lock" aria-hidden="true">🔒</span>
            <img
              v-if="item.slot === 'FUNDO'"
              :src="avatarAssetUrl(item.assetRef)"
              alt=""
              aria-hidden="true"
            />
            <AvatarItemPreview v-else :slot="item.slot" :asset-ref="item.assetRef" aria-hidden="true" />
            <span>{{ item.name }}</span>
            <span v-if="!item.owned" class="locked-hint">Bloqueado</span>
          </button>
        </div>

        <div
          v-else-if="activeTab === 'SELO'"
          id="avatar-badge-panel"
          class="badge-panel"
          role="tabpanel"
          aria-label="Selo de tipo sanguíneo"
        >
          <div class="badge-card">
            <img
              v-if="avatarStore.bloodTypeBadge"
              :src="avatarAssetUrl(avatarStore.bloodTypeBadge.assetRef)"
              :alt="`Selo ${avatarStore.bloodTypeBadge.bloodType}`"
              class="badge-card__img"
            />
            <div class="badge-card__info">
              <h3>Selo {{ avatarStore.bloodTypeBadge?.bloodType }}</h3>
              <p>
                Você ganhou esse selo automaticamente por ter o tipo
                sanguíneo cadastrado. Escolha se ele aparece no seu Hemárcio.
              </p>
            </div>
            <label class="badge-card__switch">
              <input
                type="checkbox"
                :checked="avatarStore.showBloodTypeBadge"
                @change="avatarStore.toggleBloodTypeBadge()"
              />
              <span>{{ avatarStore.showBloodTypeBadge ? "Exibindo" : "Oculto" }}</span>
            </label>
          </div>
        </div>

        <AvatarAchievementsList v-else />
      </div>
    </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { createHemocioneSdk } from "@hemocione/sdk";
import { storeToRefs } from "pinia";
import { onMounted, ref, shallowRef, watch, computed } from "vue";
import { useAvatarStore, type AvatarItem, type AvatarSlot, type AvatarTab } from "~/stores/avatar";
import HemarcioCharacter from "~/components/avatar/HemarcioCharacter.vue";
import AvatarItemPreview from "~/components/avatar/AvatarItemPreview.vue";
import { avatarAssetUrl } from "~/utils/avatarAssetUrl";
import { AVATAR_LAYER_CLASS, AVATAR_LAYER_ORDER, AVATAR_LAYER_RECTS } from "~/utils/avatarLayerLayout";

const avatarStore = useAvatarStore();
const { isEditorOpen, activeTab } = storeToRefs(avatarStore);
const topSafeAreaInset = shallowRef<{ value: number } | null>(null);
const shareableImage = ref<File | null>(null);
const canShare =
  typeof navigator !== "undefined" && typeof navigator.share === "function";
const stageCharacterRef = ref<InstanceType<typeof HemarcioCharacter> | null>(null);
const shareOnlyFundoRef = ref<HTMLImageElement | null>(null);
const shareOnlyFundoAssetRef = computed(() => avatarStore.equippedAssetRef("FUNDO"));

const slotTabs: AvatarSlot[] = ["OLHOS", "CORPO", "PERNAS", "ACESSORIOS", "FUNDO"];

const tabs = computed<AvatarTab[]>(() => [
  ...slotTabs,
  ...(avatarStore.bloodTypeBadge !== null ? (["SELO"] as const) : []),
  "ACHIEVEMENTS",
]);
const tabLabels: Record<AvatarTab, { emoji: string; label: string }> = {
  OLHOS: { emoji: "👀", label: "Olhos" },
  CORPO: { emoji: "👕", label: "Corpo" },
  PERNAS: { emoji: "👖", label: "Pernas" },
  ACESSORIOS: { emoji: "🎒", label: "Acessórios" },
  FUNDO: { emoji: "🖼️", label: "Fundo" },
  SELO: { emoji: "🩸", label: "Selo" },
  ACHIEVEMENTS: { emoji: "🏆", label: "Conquistas" },
};

const isSlotTab = (tab: AvatarTab): tab is AvatarSlot =>
  (slotTabs as AvatarTab[]).includes(tab);

const tabPanelId = (tab: AvatarTab) => {
  if (tab === "ACHIEVEMENTS") return "avatar-achievements";
  if (tab === "SELO") return "avatar-badge-panel";
  return "avatar-items-grid";
};

const unlockedAchievementsCount = computed(
  () => avatarStore.achievements.filter((achievement) => achievement.unlocked).length
);
const totalAchievementsCount = computed(() => avatarStore.achievements.length);
const showAchievementChip = computed(() => unlockedAchievementsCount.value > 0);

const visibleBloodTypeBadgeAssetRef = computed(() =>
  avatarStore.showBloodTypeBadge ? avatarStore.bloodTypeBadge?.assetRef ?? null : null
);

const activeItems = computed(() => {
  if (!isSlotTab(activeTab.value)) return [];
  return avatarStore.itemsBySlot[activeTab.value];
});

const stageBackdropStyle = computed(() => {
  const assetRef = avatarStore.equippedAssetRef("FUNDO");
  return assetRef
    ? {
        backgroundImage: `url("${avatarAssetUrl(assetRef)}")`,
      }
    : {};
});

const handlePopState = (_event: Event) => {
  if (isEditorOpen.value) avatarStore.closeEditor();
};

watch(isEditorOpen, (newValue) => {
  if (newValue) {
    window.addEventListener("popstate", handlePopState);
    window.history.pushState({ avatarDialog: "open" }, "");
  } else {
    window.removeEventListener("popstate", handlePopState);
  }
});

const AVATAR_SHARE_CANVAS_SIZE = 440;

let shareGeneration = 0;

const regenerateShareableImage = async () => {
  const generation = ++shareGeneration;
  shareableImage.value = null;

  const stageEl = stageCharacterRef.value?.$el as HTMLElement | undefined;
  if (!stageEl) return;

  const layerImages: Array<{ key: keyof typeof AVATAR_LAYER_RECTS; el: HTMLImageElement }> = [];
  for (const key of AVATAR_LAYER_ORDER) {
    const el =
      key === "fundo"
        ? shareOnlyFundoRef.value
        : stageEl.querySelector<HTMLImageElement>(`img.layer.${AVATAR_LAYER_CLASS[key]}`);
    if (el) layerImages.push({ key, el });
  }

  // Same-origin <img> elements already rendered on screen - decode() resolves
  // immediately if already loaded, or waits for an in-flight src change.
  await Promise.all(layerImages.map(({ el }) => el.decode().catch(() => {})));

  if (generation !== shareGeneration) return;

  const canvas = document.createElement("canvas");
  canvas.width = AVATAR_SHARE_CANVAS_SIZE;
  canvas.height = AVATAR_SHARE_CANVAS_SIZE;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create avatar canvas context");

  for (const { key, el } of layerImages) {
    if (!el.complete || el.naturalWidth === 0) continue;
    const rect = AVATAR_LAYER_RECTS[key];
    context.drawImage(
      el,
      (canvas.width * rect.left) / 100,
      (canvas.height * rect.top) / 100,
      (canvas.width * rect.width) / 100,
      (canvas.height * rect.height) / 100
    );
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  if (!blob || generation !== shareGeneration) return;
  shareableImage.value = new File([blob], "hemarcio.png", {
    type: "image/png",
  });
};

const refreshShareableImage = () => {
  void regenerateShareableImage().catch(() => {
    shareableImage.value = null;
  });
};

const shareHemarcio = () => {
  if (!canShare || !shareableImage.value) return;

  const sdk = createHemocioneSdk();
  sdk
    .share({
      files: [shareableImage.value],
      title: "Meu Hemárcio",
      text: "Olha meu Hemárcio no app da Hemocione! 🩸",
    })
    .catch(() => {
      // Cancelar a folha de compartilhamento é um fluxo normal.
    });
};

const handleItemClick = (item: AvatarItem) => {
  if (!item.owned) return;
  if (avatarStore.isEquipped(item)) {
    avatarStore.unequipItem(item.slot);
  } else {
    avatarStore.equipItem(item);
  }
};

watch(
  () =>
    (["OLHOS", "CORPO", "PERNAS", "ACESSORIOS", "FUNDO"] as const).map((slot) =>
      avatarStore.equippedAssetRef(slot)
    ),
  refreshShareableImage
);

onMounted(async () => {
  await avatarStore.fetchAvatar();
  void avatarStore.resolvePendingEquip();
  void avatarStore.fetchAchievements();
  void useTopSafeAreaInset().then((inset) => {
    topSafeAreaInset.value = inset;
  });
  refreshShareableImage();
});
</script>

<style scoped>
.avatar-widget {
}

.avatar-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 2100;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: flex-end;
}

.avatar-drawer {
  --cp-paper: #ffffff;
  --cp-outline: #17324a;
  --cp-outline-soft: #7c98aa;
  --cp-gold: #ffc635;
  --cp-gold-dark: #d99a00;
  --cp-ink: #17324a;
  --cp-ink-soft: #4c6c82;
  width: 100%;
  height: 100%;
  max-height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--cp-paper);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-active .avatar-drawer,
.slide-up-leave-active .avatar-drawer {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from .avatar-drawer,
.slide-up-leave-to .avatar-drawer {
  transform: translateY(100%);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
}

.avatar-widget {
  position: relative;
  display: block;
  flex: 0 0 4rem;
  width: 4rem;
  height: 4rem;
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
  border: 2px solid var(--hemo-color-primary);
  border-radius: 50%;
  background: radial-gradient(circle at 50% 30%, #ffffff, #e7ebee 70%);
  box-shadow: inset 0 -6px 10px rgba(255, 255, 255, 0.5);
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
  background: linear-gradient(180deg, #fff5f5 0%, var(--cp-paper) 46%);
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.achievement-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.55rem;
  border: 2px solid var(--cp-gold-dark);
  border-radius: 999px;
  background: var(--cp-gold);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  color: #6b4900;
  font-size: 0.7rem;
  font-weight: 900;
  line-height: 1.3;
  white-space: nowrap;
  text-decoration: none;
}

.close-btn {
  display: grid;
  width: 2.1rem;
  height: 2.1rem;
  flex: 0 0 2.1rem;
  place-items: center;
  padding: 0;
  border: 2px solid var(--cp-outline);
  border-radius: 50%;
  background: var(--cp-paper);
  box-shadow: 0 2px 0 var(--cp-outline-soft);
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
  background: radial-gradient(circle at 50% 30%, var(--cp-paper), #e7ebee 70%);
}

.stage-backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: radial-gradient(circle at 50% 30%, var(--cp-paper), #e7ebee 70%);
  background-position: center;
  background-size: cover;
}

.stage-wrap .hemarcio {
  z-index: 2;
  margin-bottom: 14px;
}

.share-only-fundo {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.share-actions {
  display: flex;
  justify-content: center;
  padding: 0 0 0.4rem;
}

.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  border: 2px solid var(--cp-outline);
  border-radius: 999px;
  background: var(--cp-paper);
  box-shadow: 0 2px 0 var(--cp-outline);
  color: var(--cp-ink);
  cursor: pointer;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 800;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.share-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 0 var(--cp-outline);
}

.share-btn:not(:disabled):active {
  transform: translateY(0);
  box-shadow: 0 2px 0 var(--cp-outline);
}

.share-btn:disabled {
  cursor: wait;
  opacity: 0.55;
}

.badge-panel {
  display: flex;
}

.badge-card {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.75rem 1rem;
  width: 100%;
  padding: 1rem;
  border: 3px solid #d7e2e8;
  border-radius: 1.1rem;
  background: #fbfdfe;
  box-shadow: 0 3px 0 #d7e2e8;
}

.badge-card__img {
  grid-row: span 2;
  width: 3.2rem;
  height: 3.2rem;
  object-fit: contain;
}

.badge-card__info h3 {
  margin: 0;
  color: var(--cp-ink);
  font-family: "Baloo 2", sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.05;
}

.badge-card__info p {
  margin: 0.2rem 0 0;
  color: var(--cp-ink-soft);
  font-size: 0.76rem;
  line-height: 1.35;
}

.badge-card__switch {
  grid-column: 1 / -1;
  display: inline-flex;
  align-items: center;
  justify-self: start;
  gap: 0.45rem;
  padding: 0.35rem 0.8rem;
  border: 2px solid var(--cp-outline-soft);
  border-radius: 999px;
  background: var(--cp-paper);
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--cp-ink);
  cursor: pointer;
}

.badge-card__switch input {
  margin: 0;
}

.customization-sheet {
  min-height: 0;
  flex: 1;
  padding: 0.85rem 0.9rem 1.1rem;
  overflow-y: auto;
  border-top: 3px solid var(--cp-outline);
  border-radius: 1.4rem 1.4rem 0 0;
  background: var(--cp-paper);
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
  border: 2px solid var(--cp-outline-soft);
  border-radius: 999px;
  background: var(--cp-paper);
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
  color: var(--cp-paper);
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
  border-color: var(--cp-outline-soft);
  background: var(--cp-paper);
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
  border: 2px solid var(--cp-paper);
  border-radius: 50%;
  background: var(--hemo-color-primary);
  color: var(--cp-paper);
  content: "✓";
  font-size: 0.7rem;
}

.item-card.locked {
  opacity: 0.55;
}

.item-card.locked img,
.item-card.locked :deep(.hemarcio) {
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
  .avatar-stage,
  .close-btn,
  .item-card,
  .share-btn {
    transition: none;
  }
}
</style>
