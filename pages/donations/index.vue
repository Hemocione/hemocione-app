<template>
  <div class="main">
    <CommonBackHeader title="Últimas doações" iconDirection="left" :custom-path="'/'" />
    <div class="donations-wrapper">
      <CommonDonationList :donations="donations" />
    </div>
    <RegisterDonationFooter />
  </div>
</template>

<style scoped>
.donations-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex-grow: 1;
  padding: 0 2em 2em 2em;
}
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100%;
}
</style>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
definePageMeta({
  pageTransition: {
    name: "slide-left-fast-and-furious",
    mode: "out-in",
  },
});
const userStore = useUserStore();
const donations = userStore.userWithMetrics?.donations || [];
</script>
