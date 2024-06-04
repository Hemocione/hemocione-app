<template>
  <div class="main">
    <CommonBackHeader
      title="Histórico de Doações"
      iconDirection="left"
      :custom-path="'/'"
    />
    <div class="donations-wrapper">
      <DonationYearGrouping
        v-for="(year, index) in sortedYears"
        :key="year"
        :year="year"
        :is-last="index === sortedYears.length - 1"
        :is-first="index === 0"
        :donations="donationsGroupedByYear[year]"
      />
    </div>
    <RegisterDonationFooter />
  </div>
</template>

<style scoped>
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
</style>

<script setup lang="ts">
import { useUserStore, type Donation } from "@/stores/user";
definePageMeta({
  pageTransition: {
    name: "slide-left-fast-and-furious",
    mode: "out-in",
  },
});
await setTimeout(() => {}, 5000);
const userStore = useUserStore();
const donations = userStore.userWithMetrics?.donations || [];
const donationsGroupedByYear = donations.reduce(
  (acc: Record<string, Donation[]>, donation) => {
    console.log(donation.donationDate);
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
);
const sortedYears = Object.keys(donationsGroupedByYear).sort(
  (a, b) => Number(b) - Number(a)
);
</script>
