<template>
  <div class="last-donation-menu">
    <div class="header">
      <h4>Última doação</h4>
      <span class="see-all" @click="goToDonations">Ver todas</span>
    </div>
    <DonationCard :donation="donation" v-if="donation" />
    <div v-else class="wrap-missing">
      <img src="/illustrations/bloodDonation.svg" class="missing-img" />
      <h4>Você ainda não tem doações registradas</h4>
      <span
        >Registre sua primeira doação ou confira os próximos eventos para doar
        😊</span
      >
    </div>
  </div>
</template>

<style scoped>
.register-first-donation {
  color: var(--hemo-color-primary);
}

.missing-img {
  width: 80%;
  height: auto;
  margin-bottom: 0.5rem;
}

.wrap-missing {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  max-width: 400px;
  color: var(--black-80);
  gap: 0.5rem;
  text-align: center;
}

.wrap-missing span {
  font-size: 0.9 rem;
}

h4 {
  margin: 0;
}

.header h4 {
  color: var(black-100);
  font-weight: 400;
  font-size: 1.2rem;
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
