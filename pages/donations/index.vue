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
        :donations="donationsGroupedByYear[year]"
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
import { useUserStore, type Donation } from "@/stores/user";
import { storeToRefs } from "pinia";
definePageMeta({
  pageTransition: {
    name: "slide-left-fast-and-furious",
    mode: "out-in",
  },
});
await setTimeout(() => {}, 5000);
const userStore = useUserStore();
const { pendingDonations, confirmedDonations } = storeToRefs(userStore);
const pendingReviewDonationsCount = computed(
  () => pendingDonations.value.length
);
const donationsGroupedByYear = computed(() =>
  confirmedDonations.value.reduce(
    (acc: Record<string, Donation[]>, donation) => {
      const year = String(
        donation.donationDate instanceof Date
          ? donation.donationDate.getFullYear()
          : new Date(String(donation.donationDate)).getFullYear()
      );
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(donation);
      return acc;
    },
    {}
  )
);
const sortedYears = computed(() =>
  Object.keys(donationsGroupedByYear.value).sort(
    (a, b) => Number(b) - Number(a)
  )
);

const endingText = computed(() => {
  if (!confirmedDonations.value.length) return "";

  const savedLives = confirmedDonations.value.length * 4;
  const donationsText =
    confirmedDonations.value.length === 1 ? "doação" : "doações";
  return `Parabéns! Você já realizou ${confirmedDonations.value.length} ${donationsText} de sangue e salvou até ${savedLives} vidas. Continue doando e ajudando a salvar vidas 🥰`;
});
</script>
