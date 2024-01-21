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
  aspect-ratio: 2.8;
  background-color: var(--white-100);
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: var(--black-20);
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
}

@media screen and (min-width: 768px) {
  .summary-box {
    aspect-ratio: 4;
  }
}
</style>

<script setup lang="ts">
const metrics = [
  {
    value: "3",
    label: "DOAÇÕES",
    iconSrc: "/icons/syringe.svg",
  },
  {
    value: "A+",
    label: "TIPO SANGUÍNEO",
    iconSrc: "/icons/droplet.svg",
  },
  {
    value: "12",
    label: "VIDAS SALVAS",
    iconSrc: "/icons/heartbeat.svg",
  },
];
</script>
