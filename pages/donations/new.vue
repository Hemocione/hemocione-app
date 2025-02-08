<template>
  <div class="main">
    <CommonBackHeader title="Registrar Doação" :custom-path="'/donations'" />
    <transition name="slow-blur" mode="out-in">
      <div class="content" v-if="!donationRegistered">
        <div>
          <p>Olá, {{ userName ?? "doador" }}!</p>
          <p>Adicione mais informações para registrarmos sua doação</p>
        </div>
        <ElForm :model="form" class="form" label-width="auto" label-position="top" size="large">
          <ElFormItem label="Banco de Sangue">
            <ElAutocomplete
              v-model="form.bloodBank"
              :fetch-suggestions="searchBloodBanks"
              placeholder="Digite o nome do banco de sangue"
              @select="handleSelect"
            />
          </ElFormItem>
          <ElFormItem label="Data da Doação">
            <ElDatePicker
              v-model="form.date"
              type="date"
              format="DD/MM/YYYY"
              placeholder="Selecione a data"
            />
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" @click="onSubmit">Registrar</ElButton>
            <ElButton @click="navigateTo('/donations')">Voltar</ElButton>
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
          !donationRegistered &&
          (!form.bloodBank || !form.date || isDateInvalid)
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
import { ref, reactive, computed } from "vue";
import { ElMessage } from "element-plus";

const userStore = useUserStore();
const userName = userStore.userWithMetrics?.name;
const donationRegistered = ref(false);
const loading = ref(false);

definePageMeta({
  pageTransition: {
    name: "slide-top-fast-and-furious",
    mode: "out-in",
  },
});

const form = reactive({
  bloodBank: "",
  date: new Date(),
});

const bloodBanks = ref([
  { value: "Hemorio" },
  { value: "Hemocentro de São Paulo" },
  { value: "Hemominas" },
  { value: "Hemope" },
  { value: "Outro Banco" },
  { value: "Hemonorte" },
  { value: "Hemoce" },
  { value: "Hemoba" },
  { value: "Hemopa" },
  { value: "Hemocentro do Rio Grande do Sul" },
  { value: "Hemocentro de Campinas" },
  { value: "Hemocentro de Ribeirão Preto" },
  { value: "Hemocentro de Brasília" },
  { value: "Hemocentro de Santa Catarina" },
  { value: "Hemocentro de Pernambuco" },
  { value: "Hemocentro de Goiás" },
  { value: "Hemocentro do Amazonas" },
  { value: "Hemocentro do Maranhão" },
  { value: "Hemocentro do Paraná" },
  { value: "Hemocentro do Espírito Santo" },
]);

const searchBloodBanks = (query: string, cb: (suggestions: { value: string }[]) => void) => {
  const results = query
    ? bloodBanks.value.filter((bank) =>
        bank.value.toLowerCase().includes(query.toLowerCase())
      )
    : bloodBanks.value;
  cb(results);
};

const handleSelect = (item: { value: string }) => {
  form.bloodBank = item.value;
};

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

const submitForm = async () => {
  if (loading.value) return;
  loading.value = true;

  if (!form.date) {
    return ElMessage.error("Por favor, informe a data da doação.");
  }

  if (!form.bloodBank) {
    return ElMessage.error("Por favor, informe o banco de sangue.");
  }

  if (isDateInvalid.value) {
    return ElMessage.error("A data da doação não pode ser no futuro.");
  }

  const donationData = {
    bloodbankName: form.bloodBank,
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
  border-radius: 12px;
}

p {
  font-size: 1em;
  margin: 1em 0;
  color: var(--black-80);
}

.form {
  width: 100%;
  max-width: 500px;
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
