<template>
  <div class="last-donations">
    <div class="header" v-if="donations.length">
      <h4>Últimas doações</h4>
      <!-- <span class="see-all">Ver todas</span> TODO: implement-->
    </div>
    <div class="donations" v-if="donations.length">
      <UserDonation
        v-for="donation in donations"
        :donation="donation"
        :backgroundColor="
          donations.indexOf(donation) % 2 === 0 ? '#DBDDE0' : '#F9F9FA'
        "
        :borderTop="donations.indexOf(donation) === 0"
        :borderBottom="donations.indexOf(donation) === donations.length - 1"
        :key="donation.id.toString()"
      />
    </div>
    <div v-else class="wrap-missing">
      <NuxtImg src="/illustrations/bloodDonation.svg" class="missing-img" />
      <span>Você ainda não registrou doações</span>
      <span>Que tal doar hoje?</span>
    </div>
  </div>
</template>

<style scoped>
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

.header h4 {
  color: var(black-100);
  font-weight: 400;
  margin: 0;
  font-size: 1.2em;
}

.see-all {
  font-size: 0.8em;
  font-weight: 700;
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

const donations = userStore.userWithMetrics?.donations.slice(0, 5) ?? [];
</script>
