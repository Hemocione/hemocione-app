<template>
  <div class="last-donations">
    <div class="header">
      <h4>Últimas doações</h4>
      <span class="see-all">Ver todas</span>
    </div>
    <div class="donations"></div>
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
</style>

<script setup lang="ts">
import { getDonations } from "@/services/donations";
const donations = await useAsyncData(getDonations);
</script>