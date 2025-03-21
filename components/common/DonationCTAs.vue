<template>
  <section class="cta-wrapper">
    <NuxtLink to="/donations/new" class="cta">
      <CommonRegisterDonationButton style="width: 100%" />
    </NuxtLink>
    <NuxtLink to="/events" class="cta">
      <CommonSecondaryButton>Ver próximos eventos</CommonSecondaryButton>
    </NuxtLink>
    <NuxtLink to="/can-donate" class="cta" v-if="ableToDonate">
      <CommonSecondaryButton
        >Quero saber se posso doar sangue</CommonSecondaryButton
      >
    </NuxtLink>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/user";
const userStore = useUserStore();

const ableToDonate = computed(
  () => userStore.userDonationStatus.status === "able-to-donate"
);
</script>

<style scoped>
.cta {
  width: 100%;
  height: 2.5rem;
}

.cta-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

@media (min-width: 768px) {
  .cta-wrapper {
    flex-direction: row;
  }
}
</style>
