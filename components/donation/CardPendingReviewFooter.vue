<template>
  <div class="pending-wrapper">
    <span class="confirmation-title">
      <img src="/icons/warning-emoji.svg" alt="Doação pendente" />
      Você confirma esta doação?</span
    >
    <div class="buttons-wrapper">
      <ElButton
        type="success"
        @click="confirm"
        :loading="loading"
        :disabled="loading"
        >Confirmar doação</ElButton
      >
      <CommonSecondaryButton
        @click="cancel"
        :loading="loading"
        :disabled="loading"
        >Não realizei a doação</CommonSecondaryButton
      >
    </div>
  </div>
  <ElDialog
    v-model="showConfirmActionModal"
    title="Confirmação de doação"
    align-center
    width="300px"
  >
    <span>Tem certeza que deseja confirmar esta doação?</span>
    <template #footer>
      <div class="buttons-wrapper">
        <ElButton type="success" @click="modalConfirm"
          >Confirmar doação</ElButton
        >
        <ElButton
          type="secondary"
          @click="() => (showConfirmActionModal = false)"
          >Cancelar</ElButton
        >
      </div>
    </template>
  </ElDialog>
  <ElDialog
    v-model="showCancelActionModal"
    title="Cancelamento de doação"
    align-center
    width="300px"
  >
    <span>Tem certeza que deseja rejeitar esta doação?</span>
    <template #footer>
      <div class="buttons-wrapper">
        <ElButton type="primary" @click="modalCancel">Rejeitar doação</ElButton>
        <ElButton
          type="secondary"
          @click="() => (showCancelActionModal = false)"
          >Mudei de ideia</ElButton
        >
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import type { Donation } from "@/stores/user";
defineProps<{
  donation: Donation;
  loading?: boolean;
}>();
const showConfirmActionModal = ref(false);
const showCancelActionModal = ref(false);

const emit = defineEmits(["confirm", "cancel"]);

const confirm = () => {
  showConfirmActionModal.value = true;
};

const cancel = () => {
  showCancelActionModal.value = true;
};

const modalConfirm = () => {
  emit("confirm");
  showConfirmActionModal.value = false;
};

const modalCancel = () => {
  emit("cancel");
  showCancelActionModal.value = false;
};
</script>

<style scoped>
.confirmation-title {
  display: flex;
  align-self: flex-start;
  gap: 0.5rem;
  color: var(--black-80);
}

.confirmation-title img {
  width: 1rem;
  aspect-ratio: 1;
}

.pending-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: 100%;
  padding-top: 1rem;
  border-top: 1px solid var(--black-20);
}

.buttons-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.buttons-wrapper > * {
  width: 100%;
  height: 2.5rem;
}
</style>
