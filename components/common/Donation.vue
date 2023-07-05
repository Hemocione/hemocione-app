<template>
  <div class="donation">
    <img
      class="icon"
      src="/icons/competition.svg"
      alt="Competition Donation"
      v-if="donation.origin === 'competitions'"
    />
    <img class="icon" src="/icons/syringe.svg" alt="Blood Donation" v-else />
    <span class="name">{{ donation.name }}</span>
    <span class="date">{{ readableDate }}</span>
  </div>
</template>

<style scoped>
.donation {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon {
  width: 10%;
  aspect-ratio: 1/1;
}

.name {
  white-space: nowrap;
}
</style>

<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { Donation } from "@/services/donations";

const props = defineProps({
  donation: {
    type: Object as PropType<Donation>,
    required: true,
  },
});

const readableDate = computed((date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("pt-BR");
});
</script>