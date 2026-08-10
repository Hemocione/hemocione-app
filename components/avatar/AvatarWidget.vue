<template>
  <button
    type="button"
    class="avatar-widget"
    aria-haspopup="dialog"
    aria-label="Editar meu Hemocionezinho"
    :aria-describedby="showAchievementChip ? 'avatar-achievements-count' : undefined"
    @click="avatarStore.openEditor()"
  >
    <span class="avatar-stage" aria-hidden="true">
      <HemocionezinhoCharacter
        size="thumbnail"
        :head-asset-ref="avatarStore.equippedAssetRef('HEAD')"
        :face-asset-ref="avatarStore.equippedAssetRef('FACE')"
        :body-asset-ref="avatarStore.equippedAssetRef('BODY')"
        :background-asset-ref="avatarStore.equippedAssetRef('BACKGROUND')"
        :blood-type-badge-asset-ref="avatarStore.bloodTypeBadge?.assetRef ?? null"
      />
    </span>
    <span v-if="showAchievementChip" class="achievement-chip" aria-hidden="true">
      🏆 {{ unlockedAchievementsCount }}/{{ totalAchievementsCount }}
    </span>
    <span v-if="showAchievementChip" id="avatar-achievements-count" class="sr-only">
      {{ unlockedAchievementsCount }} de {{ totalAchievementsCount }} conquistas desbloqueadas
    </span>
  </button>

  <ElDialog
    v-model="isEditorOpen"
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
          @click="avatarStore.closeEditor()"
        >
          ✕
        </button>
      </div>

      <div class="stage-wrap" aria-hidden="true">
        <div class="stage-backdrop" :style="stageBackdropStyle"></div>
        <HemocionezinhoCharacter
          size="large"
          :head-asset-ref="avatarStore.equippedAssetRef('HEAD')"
          :face-asset-ref="avatarStore.equippedAssetRef('FACE')"
          :body-asset-ref="avatarStore.equippedAssetRef('BODY')"
          :background-asset-ref="null"
          :blood-type-badge-asset-ref="avatarStore.bloodTypeBadge?.assetRef ?? null"
        />
      </div>

      <div v-if="canShare" class="share-actions">
        <button
          type="button"
          class="share-btn"
          :disabled="!shareableImage || !canShare"
          @click="shareHemocionezinho"
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
            :aria-controls="tab === 'ACHIEVEMENTS' ? 'avatar-achievements' : 'avatar-items-grid'"
            @click="activeTab = tab"
          >
            <span aria-hidden="true">{{ tabLabels[tab].emoji }}</span>
            {{ tabLabels[tab].label }}
          </button>
        </div>

        <div
          v-if="activeTab !== 'ACHIEVEMENTS'"
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

        <div
          v-else
          id="avatar-achievements"
          class="achievements-list"
          role="tabpanel"
          aria-label="Conquistas"
        >
          <article
            v-for="achievement in avatarStore.achievements"
            :key="achievement.id"
            class="achievement-card"
            :class="{ unlocked: achievement.unlocked }"
          >
            <div class="achievement-card__topline">
              <div>
                <h3>{{ achievement.name }}</h3>
                <p>{{ achievement.description }}</p>
              </div>
              <span
                class="achievement-badge"
                :class="achievement.unlocked ? 'is-unlocked' : 'is-locked'"
              >
                {{ achievement.unlocked ? "✓ Desbloqueada" : "🔒 Bloqueada" }}
              </span>
            </div>

            <div v-if="achievement.unlocked" class="achievement-unlocked">
              <time v-if="achievement.unlockedAt" :datetime="achievement.unlockedAt">
                {{ formatAchievementDate(achievement.unlockedAt) }}
              </time>
              <div v-if="achievement.rewardItem" class="achievement-reward">
                <img
                  :src="`/illustrations/avatarItems/${achievement.rewardItem.assetRef}`"
                  :alt="achievement.rewardItem.name"
                />
                <span>Destravou {{ achievement.rewardItem.name }}</span>
              </div>
            </div>

            <div
              v-else-if="achievement.progress"
              class="achievement-progress"
            >
              <div
                class="progress-bar"
                role="progressbar"
                :aria-valuenow="achievement.progress.current"
                :aria-valuemin="0"
                :aria-valuemax="achievement.progress.target"
                :aria-label="`Progresso: ${achievement.progress.current} de ${achievement.progress.target}`"
              >
                <div
                  class="progress-fill"
                  :style="{ width: `${getProgressPercent(achievement.progress)}%` }"
                ></div>
              </div>
              <span>
                {{ achievement.progress.current }}/{{ achievement.progress.target }}
              </span>
            </div>
          </article>

          <p v-if="avatarStore.achievements.length === 0" class="empty-state">
            Suas conquistas vão aparecer aqui. Continue participando para desbloquear novas recompensas!
          </p>
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { createHemocioneSdk } from "@hemocione/sdk";
import { storeToRefs } from "pinia";
import { onMounted, ref, shallowRef, watch, computed } from "vue";
import { useAvatarStore, type AvatarTab } from "~/stores/avatar";
import HemocionezinhoCharacter from "~/components/avatar/HemocionezinhoCharacter.vue";

const avatarStore = useAvatarStore();
const { isEditorOpen, activeTab } = storeToRefs(avatarStore);
const topSafeAreaInset = shallowRef<{ value: number } | null>(null);
const shareableImage = ref<File | null>(null);
const canShare =
  typeof navigator !== "undefined" && typeof navigator.share === "function";

const tabs: AvatarTab[] = [
  "HEAD",
  "FACE",
  "BODY",
  "BACKGROUND",
  "ACHIEVEMENTS",
];
const tabLabels: Record<AvatarTab, { emoji: string; label: string }> = {
  HEAD: { emoji: "🎓", label: "Cabeça" },
  FACE: { emoji: "🕶️", label: "Rosto" },
  BODY: { emoji: "🎗️", label: "Corpo" },
  BACKGROUND: { emoji: "🖼️", label: "Fundo" },
  ACHIEVEMENTS: { emoji: "🏆", label: "Conquistas" },
};

const unlockedAchievementsCount = computed(
  () => avatarStore.achievements.filter((achievement) => achievement.unlocked).length
);
const totalAchievementsCount = computed(() => avatarStore.achievements.length);
const showAchievementChip = computed(() => unlockedAchievementsCount.value > 0);

const activeItems = computed(() => {
  if (activeTab.value === "ACHIEVEMENTS") return [];
  return avatarStore.itemsBySlot[activeTab.value];
});

const stageBackdropStyle = computed(() => {
  const assetRef = avatarStore.equippedAssetRef("BACKGROUND");
  return assetRef
    ? {
        backgroundImage: `url("/illustrations/avatarItems/${assetRef}")`,
      }
    : {};
});

const formatAchievementDate = (date: string) =>
  new Date(date).toLocaleDateString("pt-BR");

const getProgressPercent = (progress: { current: number; target: number }) => {
  if (progress.target <= 0) return 0;
  return Math.min(100, Math.max(0, (progress.current / progress.target) * 100));
};

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

const escapeSvgAttribute = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const baseCharacterSvg = `
  <g transform="scale(1.1 1.0666667)">
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
  </g>`;

const svgLayer = (
  assetRef: string | null,
  top: number,
  left: number,
  width: number
) => {
  if (!assetRef) return "";

  const x = (220 * left) / 100;
  const y = (320 * top) / 100;
  const size = (220 * width) / 100;
  const href = escapeSvgAttribute(`/illustrations/avatarItems/${assetRef}`);

  return `<image href="${href}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="none" />`;
};

const svgBackgroundLayer = (assetRef: string | null) => {
  if (!assetRef) return "";

  const href = escapeSvgAttribute(`/illustrations/avatarItems/${assetRef}`);
  return `<image href="${href}" x="0" y="0" width="220" height="320" preserveAspectRatio="xMidYMid slice" />`;
};

let shareGeneration = 0;

const regenerateShareableImage = async () => {
  const generation = ++shareGeneration;
  shareableImage.value = null;

  const backgroundAssetRef = avatarStore.equippedAssetRef("BACKGROUND");
  const bodyAssetRef = avatarStore.equippedAssetRef("BODY");
  const faceAssetRef = avatarStore.equippedAssetRef("FACE");
  const headAssetRef = avatarStore.equippedAssetRef("HEAD");
  const backgroundLayer = svgBackgroundLayer(backgroundAssetRef);
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="320" viewBox="0 0 220 320">${backgroundLayer}${baseCharacterSvg}${svgLayer(bodyAssetRef, 62, 12, 76)}${svgLayer(faceAssetRef, 42, 28, 44)}${svgLayer(headAssetRef, -4, 18, 64)}</svg>`;

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const loadedImage = new Image();
    loadedImage.onload = () => resolve(loadedImage);
    loadedImage.onerror = () => reject(new Error("Could not load avatar image"));
    loadedImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      svgString
    )}`;
  });

  if (generation !== shareGeneration) return;

  const canvas = document.createElement("canvas");
  canvas.width = 440;
  canvas.height = 640;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create avatar canvas context");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  if (!blob || generation !== shareGeneration) return;
  shareableImage.value = new File([blob], "hemocionezinho.png", {
    type: "image/png",
  });
};

const refreshShareableImage = () => {
  void regenerateShareableImage().catch(() => {
    shareableImage.value = null;
  });
};

const shareHemocionezinho = () => {
  if (!canShare || !shareableImage.value) return;

  const sdk = createHemocioneSdk();
  sdk
    .share({
      files: [shareableImage.value],
      title: "Meu Hemocionezinho",
      text: "Olha meu hemocionezinho no app da Hemocione! 🩸",
    })
    .catch(() => {
      // Cancelar a folha de compartilhamento é um fluxo normal.
    });
};

watch(
  () =>
    (["HEAD", "FACE", "BODY", "BACKGROUND"] as const).map((slot) =>
      avatarStore.equippedAssetRef(slot)
    ),
  refreshShareableImage
);

onMounted(() => {
  void avatarStore.fetchAvatar();
  void avatarStore.fetchAchievements();
  void useTopSafeAreaInset().then((inset) => {
    topSafeAreaInset.value = inset;
  });
  refreshShareableImage();
});
</script>

<style scoped>
.avatar-widget,
:global(.avatar-dialog) {
  --cp-paper: #ffffff;
  --cp-outline: #17324a;
  --cp-outline-soft: #7c98aa;
  --cp-gold: #ffc635;
  --cp-gold-dark: #d99a00;
  --cp-ink: #17324a;
  --cp-ink-soft: #4c6c82;
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
  background: radial-gradient(
    circle at 50% 30%,
    var(--hemo-color-primary-light),
    var(--hemo-color-primary) 70%
  );
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

.achievement-chip {
  position: absolute;
  bottom: -0.35rem;
  left: 50%;
  z-index: 2;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  padding: 0.05rem 0.4rem;
  border: 2px solid #fff;
  border-radius: 999px;
  background: var(--cp-gold);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  color: #6b4900;
  font-size: 0.58rem;
  font-weight: 900;
  line-height: 1.4;
  white-space: nowrap;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

:global(.avatar-dialog.el-dialog) {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: none;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: var(--cp-paper);
  box-shadow: none;
}

:global(.avatar-dialog .el-dialog__header) {
  display: none;
}

:global(.avatar-dialog .el-dialog__body) {
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
  background: radial-gradient(
    circle at 50% 30%,
    var(--hemo-color-primary-light),
    var(--hemo-color-primary) 70%
  );
}

.stage-backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: radial-gradient(
    circle at 50% 30%,
    var(--hemo-color-primary-light),
    var(--hemo-color-primary) 70%
  );
  background-position: center;
  background-size: cover;
}

.stage-wrap :deep(.hemocionezinho) {
  z-index: 2;
  margin-bottom: 14px;
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

.achievements-list {
  display: grid;
  gap: 0.65rem;
}

.achievement-card {
  display: grid;
  gap: 0.65rem;
  padding: 0.8rem;
  border: 3px solid #d7e2e8;
  border-radius: 1.1rem;
  background: #fbfdfe;
  box-shadow: 0 3px 0 #d7e2e8;
}

.achievement-card.unlocked {
  border-color: var(--hemo-color-primary);
  background: #fff5f6;
  box-shadow: 0 3px 0 var(--hemo-color-primary-dark);
}

.achievement-card__topline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.65rem;
}

.achievement-card h3 {
  margin: 0;
  color: var(--cp-ink);
  font-family: "Baloo 2", sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.05;
}

.achievement-card p {
  margin: 0.2rem 0 0;
  color: var(--cp-ink-soft);
  font-size: 0.76rem;
  line-height: 1.35;
}

.achievement-badge {
  flex: 0 0 auto;
  padding: 0.25rem 0.45rem;
  border-radius: 999px;
  font-size: 0.62rem;
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;
}

.achievement-badge.is-unlocked {
  background: var(--hemo-color-primary);
  color: var(--cp-paper);
}

.achievement-badge.is-locked {
  background: #e6edf1;
  color: var(--cp-ink-soft);
}

.achievement-unlocked {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  color: var(--cp-ink-soft);
  font-size: 0.7rem;
  font-weight: 700;
}

.achievement-reward {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--hemo-color-primary-dark);
  font-size: 0.68rem;
  font-weight: 900;
  text-align: right;
}

.achievement-reward img {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--cp-ink-soft);
  font-size: 0.7rem;
  font-weight: 900;
}

.progress-bar {
  flex: 1;
  height: 0.65rem;
  overflow: hidden;
  border: 2px solid var(--cp-outline);
  border-radius: 999px;
  background: #e6edf1;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    var(--hemo-color-primary-light),
    var(--hemo-color-primary)
  );
  transition: width 240ms ease;
}

.empty-state {
  padding: 1rem;
  border: 2px dashed var(--cp-outline-soft);
  border-radius: 1rem;
  text-align: center;
}

@media (prefers-reduced-motion: reduce) {
  .avatar-stage,
  .close-btn,
  .item-card,
  .share-btn,
  .progress-fill {
    transition: none;
  }
}
</style>
