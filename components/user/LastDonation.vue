<template>
  <div class="last-donation-menu">
    <div class="header">
      <h4>Última doação</h4>
      <span class="see-all" @click="goToDonations">Ver todas</span>
    </div>
    <DonationCard :donation="donation" v-if="donation" />
    <CommonNoDonationsRegistered v-else />
  </div>
</template>

<style scoped>
.register-first-donation {
  color: var(--hemo-color-primary);
}

.header h4 {
  color: var(black-100);
  font-weight: 400;
  font-size: 1.2rem;
  margin: 0;
}

.see-all {
  font-size: 1rem;
  font-weight: 500;
  color: var(--black-100);
}

.see-all:hover {
  cursor: pointer;
  color: var(--black-80);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.last-donation-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1em;
}

.donations {
  width: 100%;
}
</style>

<script setup lang="ts">
import { useUserStore } from "~/stores/user";
const userStore = useUserStore();
const donation = userStore.lastDonation;

const goToDonations = () => {
  navigateTo("/donations");
};

const goRegisterDonation = () => {
  navigateTo("/donations/new");
};

const goToEvents = () => {
  navigateTo("/events");
};
</script>
