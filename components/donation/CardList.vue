<template>
  <div class="card-list">
    <transition-group name="list">
      <DonationCard
        v-for="donation in donations"
        :key="donation.id"
        :donation="donation"
      />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import type { Donation } from "@/stores/user";
defineProps<{
  donations: Donation[];
}>();
</script>

<style scoped>
.card-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}
</style>
