<template>
  <div class="last-donations">
    <div class="header">
      <h4>Últimas doações</h4>
      <!-- <span class="see-all">Ver todas</span> TODO: implement-->
    </div>
    <div class="donations" v-if="donations.length">
      <UserDonation
        v-for="donation in donations"
        :donation="donation"
        :key="donation.id.toString()"
      />
    </div>
    <div v-else>
      <NuxtImg src="/illustrations/noresults.svg" />
      <span>Nenhuma doação registrada</span>
    </div>
  </div>
</template>

<style scoped>
.header h4 {
  color: var(black-100);
  font-weight: 500;
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
}
</style>

<script setup lang="ts">
import { useUserStore } from "~/stores/user";
const userStore = useUserStore();

const donations = userStore.userWithMetrics?.donations ?? [];
</script>
