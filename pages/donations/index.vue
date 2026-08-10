<template>
  <div class="main">
    <CommonBackHeader
      title="Histórico de Doações"
      iconDirection="left"
      :custom-path="'/'"
    />
    <div class="alert-wrapper" v-if="pendingReviewDonationsCount">
      <DonationPendingReviewAlert />
    </div>
    <div class="donations-wrapper" v-if="confirmedDonations.length">
      <DonationYearGrouping
        v-for="(year, index) in sortedYears"
        :key="year"
        :year="year"
        :is-last="index === sortedYears.length - 1"
        :is-first="index === 0"
        :items="itemsGroupedByYear[year]"
      />
      <div class="ending-wrapper">
        <div class="ending-line-with-dot">
          <div class="vertical-line" />
          <div class="ending-dot" />
        </div>
        <div class="ending-text">{{ endingText }}</div>
      </div>
    </div>
    <div v-else class="no-donations-wrapper">
      <CommonNoDonationsRegistered />
      <CommonDonationCTAs />
    </div>
    <RegisterDonationFooter v-if="confirmedDonations.length" />
  </div>
</template>

<style scoped>
.ending-line-with-dot {
  margin-bottom: 0.8rem;
  position: relative;
}

.ending-dot {
  width: 10px;
  height: 10px;
  background-color: var(--hemo-color-primary);
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  right: -4px;
}

.vertical-line {
  width: var(--history-vertical-line-width);
  height: 3.5rem;
  margin-left: var(--year-margin-base);
  background-color: var(--hemo-color-primary);
  flex-grow: 1;
}

.ending-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  width: 100%;
  font-size: 0.8rem;
  color: var(--black-80);
}

.no-donations-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  padding: 1rem;
}

.donations-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex-grow: 1;
  padding: 0 1rem 2rem 1rem;
}
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  min-height: 100%;
}

.alert-wrapper {
  width: 100%;
  padding: 0 1rem;
}
</style>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { useAvatarStore, type Achievement } from "@/stores/avatar";
import type { TimelineItem } from "~/types/timeline";
import { storeToRefs } from "pinia";
definePageMeta({
  pageTransition: {
    name: "slide-left-fast-and-furious",
    mode: "out-in",
  },
});
const userStore = useUserStore();
const avatarStore = useAvatarStore();
const { pendingDonations, confirmedDonations } = storeToRefs(userStore);
const { achievements } = storeToRefs(avatarStore);

onMounted(() => {
  void avatarStore.fetchAchievements();
});

const pendingReviewDonationsCount = computed(
  () => pendingDonations.value.length
);

// Merges confirmed donations and unlocked achievements into a single
// chronological timeline. There is no backend link between a donation and an
// achievement, so both lists are interleaved purely by their own dates.
const timelineItems = computed<TimelineItem[]>(() => {
  const donationItems: TimelineItem[] = confirmedDonations.value.map(
    (donation) => ({
      type: "donation",
      date: new Date(Date.parse(String(donation.donationDate))),
      data: donation,
    })
  );
  const achievementItems: TimelineItem[] = achievements.value
    .filter(
      (achievement): achievement is Achievement & { unlockedAt: string } =>
        achievement.unlocked && !!achievement.unlockedAt
    )
    .map((achievement) => ({
      type: "achievement",
      date: new Date(Date.parse(achievement.unlockedAt)),
      data: achievement,
    }));

  return [...donationItems, ...achievementItems];
});

const itemsGroupedByYear = computed(() => {
  const groups: Record<string, TimelineItem[]> = {};
  for (const item of timelineItems.value) {
    const year = String(item.date.getFullYear());
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(item);
  }
  // Each year's items are sorted independently and explicitly, since the
  // merge doesn't assume donations/achievements arrive pre-sorted.
  for (const year of Object.keys(groups)) {
    groups[year].sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  return groups;
});

const sortedYears = computed(() =>
  Object.keys(itemsGroupedByYear.value).sort((a, b) => Number(b) - Number(a))
);

const endingText = computed(() => {
  if (!confirmedDonations.value.length) return "";

  const savedLives = confirmedDonations.value.length * 4;
  const donationsText =
    confirmedDonations.value.length === 1 ? "doação" : "doações";
  return `Parabéns! Você já realizou ${confirmedDonations.value.length} ${donationsText} de sangue e salvou até ${savedLives} vidas. Continue doando e ajudando a salvar vidas 🥰`;
});
</script>
