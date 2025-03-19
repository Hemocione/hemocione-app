<template>
  <div class="main">
    <CommonBackHeader title="Minha conta" icon-direction="left" />
    <ElForm :model="form" class="form" label-position="top" size="large">
      <ElFormItem :show-message="false" class="item" label="Nome" prop="givenName" required>
        <ElInput v-model="form.givenName" placeholder="Nome" />
      </ElFormItem :show-message="false" class="item">
      <ElFormItem :show-message="false" class="item" label="Sobrenome" prop="surName" required>
        <ElInput v-model="form.surName" placeholder="Sobrenome" />
      </ElFormItem :show-message="false" class="item">
      <ElFormItem :show-message="false" class="item" label="Email" prop="email" required>
        <ElInput v-model="form.email" placeholder="Email" />
      </ElFormItem :show-message="false" class="item">
      <ElFormItem :show-message="false" class="item" label="CPF" prop="document" required>
        <CommonMaskedInput mask="###.###.###-##" v-model="form.document" placeholder="123.456.789-10" />
      </ElFormItem :show-message="false" class="item">
      <ElDivider />
      <ElFormItem :show-message="false" class="item" label="Tipo sanguíneo" prop="bloodType" required>
        <AccountBloodTypeSelector v-model="form.bloodType" />
        <ElCheckbox
          v-model="unknownBloodType"
          label="Não sei meu tipo sanguíneo"
        />
      </ElFormItem :show-message="false" class="item">
      <ElDivider />
      <div class="two-columns">
        <ElFormItem :show-message="false" class="item" label="Gênero" prop="gender" required>
          <ElSelect v-model="form.gender" placeholder="Gênero">
            <ElOption label="Masculino" value="M" />
            <ElOption label="Feminino" value="F" />
            <ElOption label="Prefiro não informar" value="O" />
          </ElSelect>
        </ElFormItem :show-message="false" class="item">
        <ElFormItem :show-message="false" class="item" label="Data de nascimento" prop="birthDate" required>
          <ElDatePicker
            v-model="form.birthDate"
            type="date"
            format="DD/MM/YYYY"
          />
        </ElFormItem :show-message="false" class="item">
      </div>
      <ElFormItem :show-message="false" class="item" label="Telefone" prop="phone" required>
        <CommonMaskedInput mask="(##) #####-####" v-model="form.phone" placeholder="(21) 99999-9999"/>
      </ElFormItem :show-message="false" class="item">
      <ElDivider />
      <div class="two-columns">
        <ElFormItem :show-message="false" class="item" label="CEP" prop="address_postalCode" required>
          <CommonMaskedInput mask="#####-###" v-model="form.address_postalCode" placeholder="CEP" />
        </ElFormItem :show-message="false" class="item">
        <ElFormItem :show-message="false" class="item" label="Estado" prop="address_state" required>
          <ElSelect
            class="item"
            v-model="form.address_state"
            placeholder="Estado"
            :disabled="loadingCepChange"
            :loading="loadingCepChange"
            required
          >
            <ElOption
              v-for="state in states"
              :key="state.value"
              :label="state.label"
              :value="state.value"
            />
          </ElSelect>
        </ElFormItem :show-message="false">
        <ElFormItem :show-message="false" class="item" label="Cidade" prop="address_city" required>
          <ElSelect
            class="item"
            v-model="form.address_city"
            placeholder="Cidade"
            :disabled="searchingCities || !form.address_state || !cities?.length || loadingCepChange"
            :loading="searchingCities || loadingCepChange"
            required
          >
            <ElOption
              v-for="city in cities"
              :key="city"
              :label="city"
              :value="city"
            />
          </ElSelect>
        </ElFormItem :show-message="false">
        <ElFormItem :show-message="false" class="item" label="Bairro" prop="address_neighborhood" required>
          <ElInput v-model="form.address_neighborhood" placeholder="Bairro" />
        </ElFormItem :show-message="false" class="item">
        <ElFormItem :show-message="false" class="item" label="Rua" prop="address_street" required>
          <ElInput v-model="form.address_street" placeholder="Rua" :disabled="loadingCepChange" />
        </ElFormItem :show-message="false" class="item">
        <ElFormItem :show-message="false" class="item" label="Número" prop="address_number" required>
          <ElInput v-model="form.address_number" placeholder="Número" />
        </ElFormItem :show-message="false" class="item">
        <ElFormItem :show-message="false" class="item" label="Complemento" prop="address_complement">
          <ElInput v-model="form.address_complement" placeholder="Complemento" />
        </ElFormItem :show-message="false" class="item">
      </div>
    </ElForm>
    <CommonCoolFooter hideToggle>
      <ElButton
        class="confirm-button"
        type="primary"
        size="large"
        :disabled="invalidChanges || loading"
        :loading="loading"
        @click="handleClick"
        >Salvar alterações</ElButton
      >
    </CommonCoolFooter>
  </div>
</template>

<style scoped>
.confirm-button {
  height: 100%;
}

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  width: 100%;
}

p {
  font-size: 1em;
  margin: 1em 0;
  color: var(--black-80);
}

.form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;  
  width: 100%;
  padding: 1rem 1rem 1rem 1rem;
  height: calc(100dvh - var(--subheader-size) - 90px - var(--navbar-size) );
  overflow-y: auto;
}
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100%;
}

.item {
  width: 100%;
  margin-bottom: 0;
}

.item:deep(.el-form-item__label) {
  margin-bottom: 6px !important;
}
</style>

<script setup lang="ts">
import { cloneDeep } from "lodash";
import { useUserStore, type UserUpdate } from "@/stores/user";

definePageMeta({
  pageTransition: {
    name: "slide-left-fast-and-furious",
    mode: "out-in",
  },
});

const userStore = useUserStore();
const userCopy = cloneDeep(userStore.user);
const addressCopy = userCopy?.addresses?.[0];

const phoneNoCountryCode = userCopy?.phone?.replace("+55", "");

if (!userCopy) {
  throw new Error("User not found");
}

const cities = ref<string[]>([]);
onMounted(async () => {
  if (!form.address_state) {
    return;
  }

  if (form.address_state) {
    cities.value = await getCidadesFromEstado(form.address_state);
  }
});

const form = reactive({
  id: userCopy.id,
  givenName: userCopy.givenName,
  surName: userCopy.surName,
  email: userCopy.email,
  document: userCopy.document || "",
  gender: userCopy.gender,
  birthDate: new Date(userCopy.birthDate || ""),
  bloodType: userCopy.bloodType,
  phone: phoneNoCountryCode || "",
  address_postalCode: addressCopy?.postalCode || "",
  address_state: addressCopy?.state,
  address_city: addressCopy?.city,
  address_neighborhood: addressCopy?.neighborhood,
  address_street: addressCopy?.street,
  address_number: addressCopy?.number,
  address_complement: addressCopy?.complement,
});

let persistedStateHash = encodeBase64(form)

const validAddress = computed(() => {
  return (
    form.address_postalCode &&
    form.address_state &&
    form.address_city
  );
});

const getUserUpdatePayload = (): UserUpdate => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Converte a data para o início do dia no fuso do usuário
  const birthDate = form.birthDate
    ? new Date(
        new Date(form.birthDate).toLocaleString("en-US", { timeZone: userTimezone })
      )
    : null;

  return {
    ...form,
    email: form.email.trim().toLowerCase(),
    phone: `+55${form.phone}`,
    birthDate: birthDate?.toISOString() || userCopy.birthDate, // this is a brazilian "date" - we should handle the timezone here as well and store the correct day (AKA we should store the start of the brazilian day or the user's timezone)
   ...(validAddress.value ? { addresses: [{
      id: addressCopy?.id || undefined,
      userId: addressCopy?.userId || userCopy.id,
      postalCode: form.address_postalCode,
      state: form.address_state,
      city: form.address_city,
      neighborhood: form.address_neighborhood,
      street: form.address_street,
      number: form.address_number,
      complement: form.address_complement
    }] } : {}),
  };
};

const loading = ref(false);

const requiredFields: (keyof typeof form)[] = [
  "givenName",
  "surName",
  "email",
  "document",
  "phone"
];

const documentCorrectLength = computed(() => form.document.length === 11);
const phoneCorrectLength = computed(() => form.phone.length === 11);
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(form.email);
});

const invalidChanges = computed(() => {
  return persistedStateHash === encodeBase64(form) || !validAddress.value || requiredFields.some(field => !form[field]) || !documentCorrectLength.value || !phoneCorrectLength.value || !isValidEmail.value;
});

const handleClick = async () => {
  loading.value = true;
  persistedStateHash = encodeBase64(form);
  // in the future, use the persisted state hash for adding a confirmation thing
  try {
    await userStore.updateUser(getUserUpdatePayload());
    ElMessage.success("Alterações salvas com sucesso.");
    nextTick(async () => {
      await navigateTo("/") // go to home after successfull update
    });
  } catch (error) {
    ElMessage.error("Erro ao salvar alterações.");
  }
  loading.value = false;
};

const states = getEstadosListWithLabel();

const unknownBloodType = ref(userStore.user?.bloodType === "-");

const loadingCepChange = ref(false);
const debouncedHandleCepChange = useDebounceFn(async (cep: string) => {
  try {
    if (cep.length !== 8) {
      throw new Error("CEP inválido");
    }
    const data = await getCepData(cep);
    form.address_state = data.state ?? form.address_state;
    form.address_city = data.city ?? form.address_city;
    form.address_neighborhood = data.neighborhood ?? form.address_neighborhood;
    form.address_street = data.street ?? form.address_street;
  } catch (error) {
    // do nothing
  }
  loadingCepChange.value = false;
}, 300);

const searchingCities = ref(false);
const debouncedSearchCities = useDebounceFn(async (state: string) => {
  const currentSelectedCity = form.address_city;
  try {
    cities.value = await getCidadesFromEstado(state);
    if (cities.value.length === 1) {
      form.address_city = cities.value[0];
    }

    if (currentSelectedCity && !cities.value.includes(currentSelectedCity)) {
      form.address_city = "";
    }
  } catch (error) {
    // do nothing
  }
  searchingCities.value = false;
}, 300);

watch(() => form.address_postalCode, (newVal) => {
  loadingCepChange.value = true;
  debouncedHandleCepChange(newVal);
});

watch(() => form.address_state, (newVal) => {
  if (!newVal) {
    return;
  }
  searchingCities.value = true;
  debouncedSearchCities(newVal);
});
 
</script>
