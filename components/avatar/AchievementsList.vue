<template>
  <div
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

      <template v-if="achievement.unlocked">
        <div class="achievement-unlocked">
          <time v-if="achievement.unlockedAt" :datetime="achievement.unlockedAt">
            {{ formatAchievementDate(achievement.unlockedAt) }}
          </time>
          <div v-if="achievement.rewardItem" class="achievement-reward">
            <img
              :src="avatarAssetUrl(achievement.rewardItem.assetRef)"
              :alt="achievement.rewardItem.name"
            />
            <span>Destravou {{ achievement.rewardItem.name }}</span>
          </div>
        </div>
        <button
          v-if="achievement.rewardItem && achievement.rewardItem.id !== null && achievement.rewardItem.slot !== 'BADGE'"
          type="button"
          class="equip-cta"
          @click="handleEquip(achievement.rewardItem.id)"
        >
          🎒 Equipar no meu Hemárcio
        </button>
      </template>

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
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAvatarStore } from "~/stores/avatar";
import { avatarAssetUrl } from "~/utils/avatarAssetUrl";

const avatarStore = useAvatarStore();

const formatAchievementDate = (date: string) =>
  new Date(date).toLocaleDateString("pt-BR");

const getProgressPercent = (progress: { current: number; target: number }) => {
  if (progress.target <= 0) return 0;
  return Math.min(100, Math.max(0, (progress.current / progress.target) * 100));
};

const handleEquip = async (itemId: number) => {
  const item = avatarStore.items.find((candidate) => candidate.id === itemId);
  if (avatarStore.isEditorOpen && item) {
    avatarStore.openEditor(item.slot);
    await avatarStore.equipItem(item);
    return;
  }
  avatarStore.requestEquipItem(itemId);
  await navigateTo("/");
};

onMounted(() => {
  void avatarStore.fetchAchievements();
});
</script>

<style scoped>
.achievements-list {
  --cp-paper: #ffffff;
  --cp-outline: #17324a;
  --cp-outline-soft: #7c98aa;
  --cp-ink: #17324a;
  --cp-ink-soft: #4c6c82;
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

.equip-cta {
  justify-self: start;
  padding: 0.4rem 0.8rem;
  border: 2px solid var(--hemo-color-primary-dark);
  border-radius: 999px;
  background: var(--hemo-color-primary);
  box-shadow: 0 2px 0 var(--hemo-color-primary-dark);
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 0.7rem;
  font-weight: 800;
}

.equip-cta:active {
  transform: translateY(1px);
  box-shadow: none;
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
  .progress-fill {
    transition: none;
  }
}
</style>
