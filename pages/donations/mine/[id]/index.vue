<template>
  <div class="main">
    <CommonBackHeader
      title="Detalhes da Doação"
      icon-direction="left"
      :custom-path="'/donations'"
    />
    <div
      class="content"
      v-if="donation"
      :style="
        donation?.reviewStatus === 'pending' ? { paddingBottom: '170px' } : {}
      "
    >
      <div class="donation-card">
        <div class="donation-card-content">
          <div class="donation-provider-logo">
            <img :src="logoSrc" />
          </div>
          <div class="donation-info">
            <span class="donation-date">{{ readableDate }}</span>
            <span class="donation-label">{{ donation.label }}</span>
          </div>
          <ElButton
            :icon="ElIconDelete"
            circle
            @click="showDeleteModal = true"
            class="delete-button"
          />
        </div>
        <div class="donation-status" :class="donation.reviewStatus">
          {{ statusText }}
        </div>
      </div>

      <div class="donation-details">
        <div class="detail-item">
          <span class="label">Data da doação</span>
          <span class="value">{{ readableDate }}</span>
        </div>
      </div>

      <div
        v-if="
          donation.bloodBanksLocationId &&
          !donation.donationProvider &&
          bloodBank
        "
        class="map-container"
      >
        <h3>Banco de Sangue</h3>
        <div class="blood-bank-info">
          <h4>{{ bloodBank.name }}</h4>
          <p>{{ bloodBank.address }}</p>
        </div>
        <div class="map-wrapper">
          <iframe
            :src="`https://www.google.com/maps/embed/v1/place?key=AIzaSyBBNG00QnQEqI9sMvDRGEUiq7ZqMHwY9cI&q=${bloodBank.latitude},${bloodBank.longitude}`"
            width="100%"
            height="300"
            style="border: 0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
    <CommonCoolFooter
      v-if="donation?.reviewStatus === 'pending'"
      hideToggle
      height="120"
    >
      <div class="pending-wrapper">
        <span class="confirmation-title">
          <img src="/icons/warning-emoji.svg" alt="Doação pendente" />
          Você confirma esta doação?
        </span>
        <div class="buttons-wrapper">
          <ElButton
            type="success"
            @click="showConfirmActionModal = true"
            :loading="updatingDonationStatus"
            :disabled="updatingDonationStatus"
          >
            Confirmar doação
          </ElButton>
          <CommonSecondaryButton
            @click="showCancelActionModal = true"
            :loading="updatingDonationStatus"
            :disabled="updatingDonationStatus"
          >
            Não realizei a doação
          </CommonSecondaryButton>
        </div>
      </div>
    </CommonCoolFooter>

    <ElDialog
      v-model="showConfirmActionModal"
      title="Confirmação de doação"
      align-center
      width="300px"
    >
      <span>Tem certeza que deseja confirmar esta doação?</span>
      <template #footer>
        <div class="buttons-wrapper">
          <ElButton type="success" @click="handleDonationConfirmation">
            Confirmar doação
          </ElButton>
          <ElButton
            type="default"
            @click="() => (showConfirmActionModal = false)"
          >
            Cancelar
          </ElButton>
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
          <ElButton type="primary" @click="handleDonationCancel">
            Rejeitar doação
          </ElButton>
          <ElButton
            type="default"
            @click="() => (showCancelActionModal = false)"
          >
            Mudei de ideia
          </ElButton>
        </div>
      </template>
    </ElDialog>

    <ElDialog
      v-model="showDeleteModal"
      title="Excluir doação"
      align-center
      width="300px"
    >
      <span
        >Tem certeza que deseja excluir esta doação? Esta ação é
        irreversível.</span
      >
      <template #footer>
        <div class="buttons-wrapper">
          <ElButton type="danger" @click="handleDelete" :loading="deleting">
            Excluir doação
          </ElButton>
          <ElButton type="default" @click="() => (showDeleteModal = false)">
            Cancelar
          </ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  padding: 1rem;
}

.donation-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--black-20);
  border-radius: 0.5rem;
  padding: 1rem;
  width: 100%;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  gap: 1rem;
}

.donation-card-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.donation-provider-logo {
  padding: 10px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
  aspect-ratio: 1;
  background-color: var(--black-5);
}

.donation-provider-logo img {
  aspect-ratio: 1;
  width: 100%;
}

.donation-info {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 0.5rem;
}

.donation-date {
  font-size: 0.7rem;
  color: var(--black-80);
}

.donation-label {
  font-size: 0.9rem;
  color: var(--black-100);
}

.donation-status {
  width: 100%;
  text-align: center;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.donation-status.pending {
  background-color: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}

.donation-status.confirmed {
  background-color: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.donation-status.rejected {
  background-color: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.donation-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--black-5);
  border-radius: 0.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item .label {
  font-size: 0.8rem;
  color: var(--black-60);
}

.detail-item .value {
  font-size: 1rem;
  color: var(--black-100);
}

.map-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.map-container h3 {
  font-size: 1.1rem;
  color: var(--black-100);
  margin: 0;
}

.map-wrapper {
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
}

.blood-bank-info {
  padding: 1rem;
  background-color: var(--black-5);
  border-radius: 0.5rem;
}

.blood-bank-info h4 {
  margin: 0 0 0.5rem 0;
  color: var(--black-100);
}

.blood-bank-info p {
  margin: 0;
  color: var(--black-80);
  font-size: 0.9rem;
}

.pending-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: 100%;
}

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

.delete-button {
  margin-left: auto;
}
</style>

<script setup lang="ts">
definePageMeta({
  pageTransition: {
    name: "slide-left-fast-and-furious",
    mode: "out-in",
  },
});

const route = useRoute();
const donationId = parseInt(String(route.params.id));
const userStore = useUserStore();
const bloodBankStore = useBloodBanksStore();
const bloodBank = ref<BloodBankLocation | undefined>();
const donation = ref(userStore.getDonationById(donationId));
const updatingDonationStatus = ref(false);

if (!donation.value) {
  await navigateTo("/donations");
}

const loadingBloodBank = ref(Boolean(donation.value?.bloodBanksLocationId));
if (donation.value?.bloodBanksLocationId) {
  bloodBankStore
    .getBloodBankById(donation.value?.bloodBanksLocationId, userStore.token)
    .then((bloodBankData) => {
      bloodBank.value = bloodBankData;
    })
    .catch((_e) => {
      // do nothing
    })
    .finally(() => (loadingBloodBank.value = false));
}

const logoSrc = computed(
  () => donation.value?.donationProvider?.logo || "/icons/syringe-provider.svg"
);

const readableDate = computed(() => {
  if (!donation.value?.donationDate) return "";
  const date = new Date(Date.parse(String(donation.value.donationDate)));
  return date.toLocaleDateString("pt-BR");
});

const readableReviewedDate = computed(() => {
  if (!donation.value?.reviewedAt) return "";
  const date = new Date(donation.value.reviewedAt);
  return date.toLocaleDateString("pt-BR");
});

const statusText = computed(() => {
  switch (donation.value?.reviewStatus) {
    case "pending":
      return "Aguardando confirmação";
    case "confirmed":
      return "Doação confirmada";
    case "rejected":
      return "Doação cancelada";
    default:
      return "";
  }
});

const showConfirmActionModal = ref(false);
const showCancelActionModal = ref(false);
const showDeleteModal = ref(false);
const deleting = ref(false);

const handleDonationConfirmation = async () => {
  if (!donation.value) return;
  updatingDonationStatus.value = true;
  try {
    await userStore.reviewDonation(donation.value, "confirmed");
    ElMessage.success("Doação confirmada com sucesso!");
    showConfirmActionModal.value = false;
  } catch (error) {
    ElMessage.error(
      "Erro ao confirmar a doação - por favor, tente novamente mais tarde."
    );
  }
  updatingDonationStatus.value = false;
};

const handleDonationCancel = async () => {
  if (!donation.value) return;
  updatingDonationStatus.value = true;
  try {
    await userStore.reviewDonation(donation.value, "rejected");
    ElMessage.success("Doação cancelada com sucesso!");
    showCancelActionModal.value = false;
  } catch (error) {
    ElMessage.error(
      "Erro ao cancelar a doação - por favor, tente novamente mais tarde."
    );
  }
  updatingDonationStatus.value = false;
};

const handleDelete = async () => {
  if (!donation.value) return;
  deleting.value = true;
  try {
    await userStore.deleteDonation(donation.value.id);
    ElMessage.success("Doação excluída com sucesso!");
    await navigateTo("/donations");
  } catch (error) {
    ElMessage.error(
      "Erro ao excluir a doação - por favor, tente novamente mais tarde."
    );
  }
  deleting.value = false;
};
</script>
