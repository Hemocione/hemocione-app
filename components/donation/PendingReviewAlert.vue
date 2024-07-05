<template>
  <NuxtLink to="/donations/pending" class="pending-donations-alert">
    <h4 class="title">
      <img src="/icons/warning-emoji.svg" alt="pending donations warning" />
      {{ pendingDonationsText }}
    </h4>
    <span
      >Clique aqui para acessar suas doações passadas pendentes de
      confirmação.</span
    >
  </NuxtLink>
</template>
<script setup lang="ts">
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
import { storeToRefs } from "pinia";

const { pendingDonations } = storeToRefs(userStore);
const pendingDonationsCount = computed(() => pendingDonations.value.length);

const pendingDonationsText = computed(() => {
  const count = pendingDonationsCount.value;
  return count === 1
    ? "Você tem 1 confirmação pendente"
    : `Você tem ${count} confirmações pendentes`;
});
</script>

<style scoped>
.pending-donations-alert {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 1rem;
  background-color: var(--yellow-light);
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.title {
  display: flex;
  gap: 0.5rem;
  color: var(--black-100);
  font-size: 0.9rem;
  margin: 0;
  align-items: center;
}

.title img {
  height: 1rem;
  aspect-ratio: 1;
}

span {
  font-size: 0.75rem;
  color: var(--black-100);
}
</style>
