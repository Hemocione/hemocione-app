<template>
  <div class="achievement-card">
    <div class="achievement-card-content">
      <div class="achievement-icon">
        <img
          v-if="achievement.rewardItem"
          :src="avatarAssetUrl(achievement.rewardItem.assetRef)"
          :alt="achievement.rewardItem.name"
        />
        <img v-else src="/icons/medal.svg" alt="conquista desbloqueada" />
      </div>
      <div class="achievement-info">
        <span class="achievement-date">{{ readableSimpleDate }}</span>
        <span class="achievement-label">{{ achievementText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Achievement } from "~/stores/avatar";
import { avatarAssetUrl } from "~/utils/avatarAssetUrl";

const props = defineProps<{
  achievement: Achievement;
}>();

const readableSimpleDate = computed(() => {
  if (!props.achievement.unlockedAt) return "";
  return new Date(props.achievement.unlockedAt).toLocaleDateString("pt-BR");
});

const achievementText = computed(() => {
  const baseText = `Você desbloqueou ${props.achievement.name}`;
  if (!props.achievement.rewardItem) return baseText;
  return `${baseText} e ganhou ${props.achievement.rewardItem.name}`;
});
</script>

<style scoped>
.achievement-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--hemo-color-warn);
  border-radius: 0.5rem;
  padding: 1rem;
  width: 100%;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  gap: 1rem;
  background-color: var(--yellow-light);
}

.achievement-card-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-grow: 1;
  width: 100%;
}

.achievement-date {
  font-size: 0.7rem;
  color: var(--black-80);
}

.achievement-info {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  height: 100%;
  gap: 0.5rem;
}

.achievement-label {
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  color: var(--black-100);
  font-weight: 500;
}

.achievement-icon {
  padding: 10px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
  aspect-ratio: 1;
  background-color: var(--hemo-color-warn);
}

.achievement-icon img {
  aspect-ratio: 1;
  width: 100%;
}
</style>
