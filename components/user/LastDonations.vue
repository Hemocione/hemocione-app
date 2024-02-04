<template>
  <div class="last-donations">
    <div class="header" v-if="donations.length">
      <h4>Últimas doações</h4>
      <span class="see-all" @click="goToDonations">Ver todas</span>
    </div>
    <CommonDonationList :donations="donations" />
  </div>
</template>

<style scoped>
.header h4 {
  color: var(black-100);
  font-weight: 400;
  margin: 0;
  font-size: 1.2em;
}

.see-all {
  font-size: 1em;
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

.last-donations {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1em;
  flex-grow: 1;
}

.donations {
  width: 100%;
}
</style>

<script setup lang="ts">
import { useUserStore } from "~/stores/user";
const userStore = useUserStore();
const donations = userStore.userWithMetrics?.donations.slice(0, 5) ?? []; // only last 5 donations

const goToDonations = () => {
  navigateTo("/donations");
};
</script>
