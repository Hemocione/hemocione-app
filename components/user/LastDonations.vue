<template>
  <div class="last-donations">
    <div class="header">
      <h4>Últimas doações</h4>
      <!-- <span class="see-all">Ver todas</span> -->
    </div>
    <div class="donations" v-if="donations?.length"></div>
    <div v-else class="no-donations">
      <NuxtImg src="/illustrations/noresults.svg" class="no-donations-ilu" />
      <h4>Nenhuma doação encontrada :(</h4>
    </div>
  </div>
</template>

<style scoped>
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

.no-donations {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

.no-donations-ilu {
  width: 50%;
  max-width: 300px;
  height: auto;
}
</style>

<script setup lang="ts">
import { getDonations } from "@/services/donations";
const donations: any[] = [];
</script>
