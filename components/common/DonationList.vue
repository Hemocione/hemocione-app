<template>
  <div class="donations" v-if="donations.length">
    <UserDonation
      v-for="donation in donations"
      :donation="donation"
      :last="donations.indexOf(donation) === 0"
      :first="donations.indexOf(donation) === donations.length - 1"
      :key="donation.id.toString()"
    />
  </div>
  <div v-else class="wrap-missing">
    <img src="/illustrations/bloodDonation.svg" class="missing-img" />
    <span>Você ainda não registrou doações</span>
    <NuxtLink to="/donations/new" class="register-first-donation"
      >Registre sua primeira doação</NuxtLink
    >
  </div>
</template>

<style scoped>
.register-first-donation {
  color: var(--hemo-color-primary);
}
.wrap-missing span {
  color: var(--black-80);
}
.missing-img {
  width: 80%;
  max-width: 500px;
  height: auto;
  margin-bottom: 1rem;
}

.wrap-missing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
}

.donations {
  width: 100%;
}
</style>

<script setup lang="ts">
import type { Donation } from "#imports";

defineProps<{
  donations: Donation[];
}>();
</script>
