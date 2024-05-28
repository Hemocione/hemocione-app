<template>
  <div class="main">
    <CommonBackHeader
      title="Histórico de Doações"
      iconDirection="left"
      :custom-path="'/'"
    />
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
  padding: 0 1rem 2rem 1rem;
}
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
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
await setTimeout(() => {}, 5000);
const userStore = useUserStore();
const donations = userStore.userWithMetrics?.donations || [];
</script>
