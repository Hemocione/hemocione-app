<template>
  <div class="summary-box">
    <UserDonationSummaryMetric
      v-for="metric in metrics"
      :key="metric.label"
      :value="metric.value"
      :label="metric.label"
      :iconSrc="metric.iconSrc"
    />
  </div>
</template>

<style scoped>
.summary-box {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 1em;
  width: 100%;
  aspect-ratio: 2.5;
  background-color: var(--white-100);
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: var(--black-20);
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .summary-box {
    aspect-ratio: 5;
  }
}
</style>

<script setup lang="ts">
import { useUserStore } from "~/stores/user";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { userWithMetrics } = storeToRefs(userStore);
const metrics = computed(() => [
  {
    value: String(userWithMetrics.value?.totalDonations || "-"),
    label: userWithMetrics.value?.totalDonations === 1 ? "DOAÇÃO" : "DOAÇÕES",
    iconSrc: "/icons/syringe.svg",
  },
  {
    value: String(userWithMetrics.value?.bloodType ?? "N/A"),
    label: "TIPO SANGUÍNEO",
    iconSrc: "/icons/droplet.svg",
  },
  {
    value: String(userWithMetrics.value?.livesSaved || "-"),
    label: "VIDAS SALVAS",
    iconSrc: "/icons/heartbeat.svg",
  },
]);
</script>
