<template>
  <div class="main">
    <CommonBackHeader title="Registrar Doação" :custom-path="'/donations'" />
    <transition name="slow-blur" mode="out-in">
      <div class="content" v-if="!donationRegistered">
        <div>
          <p>Olá, {{ userName ?? "doador" }}!</p>
          <p>Adicione mais informações para registrarmos sua doação</p>
        </div>
        <ElForm
          :model="form"
          class="form"
          label-width="auto"
          label-position="top"
          size="large"
        >
          <ElFormItem label="Banco de Sangue" required>
            <TransitionGroup name="slide-fade-down" mode="out-in" appear>
              <ElSelect
                placeholder="Selecione o banco de sangue"
                v-model="form.bloodBanksLocationId"
                filterable
                clearable
                key="blood-bank-select"
                v-if="bloodBanks.length"
              >
                <ElOption
                  v-for="bank in bloodBanks"
                  :key="bank.id"
                  :label="bank.name"
                  :value="bank.id"
                />
              </ElSelect>
              <ElCheckbox
                v-model="bloodbankNotFound"
                key="blood-bank-checkbox"
                v-if="bloodBanks.length"
              >
                Não encontrei meu banco de sangue 😔
              </ElCheckbox>
              <ElInput
                v-model="form.bloodBankName"
                placeholder="Nome do banco de sangue"
                key="blood-bank-input"
                v-if="bloodbankNotFound"
              />
            </TransitionGroup>
          </ElFormItem>
          <ElFormItem label="Data da Doação" required>
            <ElDatePicker
              v-model="form.date"
              type="date"
              format="DD/MM/YYYY"
              placeholder="Selecione a data"
              large
              style="width: 100%"
              :disabled-date="disabledDate"
            />
          </ElFormItem>
        </ElForm>
      </div>
      <div class="success" v-else>
        <img
          src="/icons/check-circle-red.svg"
          alt="check"
          width="200"
          height="200"
        />
        <span>Doação registrada com sucesso!</span>
      </div>
    </transition>
    <CommonCoolFooter hideToggle>
      <ElButton
        class="confirm-button"
        type="primary"
        size="large"
        :disabled="
          !donationRegistered && (!donationLabel || !form.date || isDateInvalid)
        "
        :loading="loading"
        @click="handleClick"
        >{{ buttonText }}</ElButton
      >
    </CommonCoolFooter>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { useBloodBanksStore } from "@/stores/bloodBanks";
import { ref, reactive, computed } from "vue";
import { ElMessage } from "element-plus";

const userStore = useUserStore();
const userName = userStore.userWithMetrics!.name;
const token = userStore.token!;
const lastDonationBloodBankLocationId =
  userStore.lastDonationBloodBankLocationId;
const bloodBanksStore = useBloodBanksStore();
const donationRegistered = ref(false);
const loading = ref(false);

definePageMeta({
  pageTransition: {
    name: "slide-top-fast-and-furious",
    mode: "out-in",
  },
});

const form = reactive({
  bloodBankName: "",
  bloodBanksLocationId: "",
  date: new Date(),
});

if (lastDonationBloodBankLocationId) {
  form.bloodBanksLocationId = lastDonationBloodBankLocationId;
}

const bloodBanks = await bloodBanksStore.getBloodBanks(token);

const bloodbankNotFound = ref(!bloodBanks.length);

const isDateInvalid = computed(() => {
  return form.date > new Date();
});

const buttonText = computed(() => {
  return donationRegistered.value ? "Voltar para o início" : "Registrar doação";
});

const handleClick = () => {
  if (donationRegistered.value) {
    navigateTo("/");
  } else {
    submitForm();
  }
};

const donationLabel = computed(() => {
  let bloodBankName = bloodbankNotFound.value
    ? form.bloodBankName.trim()
    : null;
  if (form.bloodBanksLocationId) {
    bloodBankName =
      bloodBanks
        .find((bank) => bank.id === form.bloodBanksLocationId)
        ?.name?.trim() || bloodBankName;
  }

  if (!bloodBankName) {
    return null;
  }

  return "Doação para " + bloodBankName;
});

const submitForm = async () => {
  if (loading.value) return;
  loading.value = true;

  if (!form.date) {
    return ElMessage.error("Por favor, informe a data da doação.");
  }

  if (isDateInvalid.value) {
    return ElMessage.error("A data da doação não pode ser no futuro.");
  }

  if (!donationLabel.value) {
    return ElMessage.error("Por favor, informe o banco de sangue.");
  }

  const donationData = {
    bloodBanksLocationId: form.bloodBanksLocationId || null,
    label: donationLabel.value,
    donationDate: new Date(form.date.setHours(12)).toISOString(),
  };

  try {
    await userStore.createUserDonation(donationData);
    donationRegistered.value = true;
  } catch (error) {
    let errorMessage =
      "Erro ao registrar doação. Por favor, tente novamente mais tarde.";
    if ((error as any).statusCode === 409) {
      errorMessage = (error as any).data?.message || errorMessage;
    }
    ElMessage({
      message: errorMessage,
      type: "error",
      duration: 5000,
      grouping: true,
      showClose: true,
    });
  }

  loading.value = false;
};

const onSubmit = () => {
  submitForm();
};

watch(
  () => bloodbankNotFound.value,
  (value) => {
    if (value) {
      form.bloodBanksLocationId = "";
    }
  }
);

watch(
  () => form.bloodBanksLocationId,
  (value) => {
    if (value) {
      bloodbankNotFound.value = false;
    }
  }
);

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};
</script>

<style scoped>
.success {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1em;
  width: 100%;
  top: 30%;
}

.success span {
  font-size: 1.5em;
  color: var(--black-80);
  margin-top: 1em;
}

.confirm-button {
  height: 100%;
  width: 100%;
  margin-top: 0px !important;
}

p {
  font-size: 1em;
  margin: 1em 0;
  color: var(--black-80);
}

.form {
  width: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2em;
  align-items: flex-start;
  width: 100%;
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

.el-form-item {
  width: 100%;
  margin-bottom: 1.5em;
}

.el-input,
.el-select,
.el-date-picker,
.el-autocomplete {
  border-radius: 16px;
}

.el-button {
  width: 100%;
  margin-top: 1em;
  border-radius: 12px;
}
</style>
