<template>
  <div class="main">
    <CommonBackHeader title="Minha conta" icon-direction="left" />
    <ElForm :model="form" class="form" label-position="top" size="large">
      <ElFormItem class="item" label="Nome" prop="givenName" required>
        <ElInput v-model="form.givenName" placeholder="Nome" />
      </ElFormItem class="item">
      <ElFormItem class="item" label="Sobrenome" prop="surName" required>
        <ElInput v-model="form.surName" placeholder="Sobrenome" />
      </ElFormItem class="item">
      <ElFormItem class="item" label="Email" prop="email" required>
        <ElInput v-model="form.email" placeholder="Email" />
      </ElFormItem class="item">
      <ElFormItem class="item" label="CPF" prop="document" required>
        <CommonMaskedInput mask="###.###.###-##" v-model="form.document" placeholder="123.456.789-10" />
      </ElFormItem class="item">
      <ElDivider />
      <ElFormItem class="item" label="Tipo sanguíneo" prop="bloodType" required>
        <AccountBloodTypeSelector v-model="form.bloodType" />
        <ElCheckbox
          v-model="unknownBloodType"
          label="Não sei meu tipo sanguíneo"
        />
      </ElFormItem class="item">
      <ElDivider />
      <div class="two-columns">
        <ElFormItem class="item" label="Gênero" prop="gender" required>
          <ElSelect v-model="form.gender" placeholder="Gênero">
            <ElOption label="Masculino" value="M" />
            <ElOption label="Feminino" value="F" />
            <ElOption label="Prefiro não informar" value="O" />
          </ElSelect>
        </ElFormItem class="item">
        <ElFormItem class="item" label="Data de nascimento" prop="birthDate" required>
          <ElDatePicker
            v-model="form.birthDate"
            type="date"
            format="DD/MM/YYYY"
          />
        </ElFormItem class="item">
      </div>
      <ElFormItem class="item" label="Telefone" prop="phone" required>
        <CommonMaskedInput mask="(##) #####-####" v-model="form.phone" placeholder="(21) 99999-9999"/>
      </ElFormItem class="item">
      <ElDivider />
      <div class="two-columns">
        <ElFormItem class="item" label="CEP" prop="address_postalCode" required>
          <CommonMaskedInput mask="#####-###" v-model="form.address_postalCode" placeholder="CEP" />
        </ElFormItem class="item">
        <ElFormItem class="item" label="Estado" prop="address_state" required>
          <ElSelect
            class="item"
            v-model="form.address_state"
            placeholder="Estado"
            required
          >
            <ElOption
              v-for="state in states"
              :key="state.value"
              :label="state.label"
              :value="state.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem class="item" label="Cidade" prop="address_city" required>
          <ElInput v-model="form.address_city" placeholder="Cidade" />
        </ElFormItem class="item">
        <ElFormItem class="item" label="Bairro" prop="address_neighborhood" required>
          <ElInput v-model="form.address_neighborhood" placeholder="Bairro" />
        </ElFormItem class="item">
        <ElFormItem class="item" label="Rua" prop="address_street" required>
          <ElInput v-model="form.address_street" placeholder="Rua" />
        </ElFormItem class="item">
        <ElFormItem class="item" label="Número" prop="address_number" required>
          <ElInput v-model="form.address_number" placeholder="Número" />
        </ElFormItem class="item">
        <ElFormItem class="item" label="Complemento" prop="address_complement">
          <ElInput v-model="form.address_complement" placeholder="Complemento" />
        </ElFormItem class="item">
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
import { useUserStore } from "@/stores/user";

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

const form = reactive({
  id: userCopy?.id,
  givenName: userCopy?.givenName,
  surName: userCopy?.surName,
  email: userCopy?.email,
  document: userCopy?.document || "",
  gender: userCopy?.gender,
  birthDate: new Date(userCopy?.birthDate || ""),
  bloodType: userCopy?.bloodType,
  phone: phoneNoCountryCode || "",
  address_id: addressCopy?.id,
  address_postalCode: addressCopy?.postalCode || "",
  address_state: addressCopy?.state,
  address_city: addressCopy?.city,
  address_neighborhood: addressCopy?.neighborhood,
  address_street: addressCopy?.street,
  address_number: addressCopy?.number,
  address_complement: addressCopy?.complement,
});

const handleClick = () => {
  console.log('form', form);
};

const states = getEstadosListWithLabel();

// HANDLE ADDRESS IN THE END AGAIN
/**
 * TODOS:
 * - [ ] Handle address in the end of the call
 * - [ ] Handle submit (API call)
 * - [ ] Add overall field validation (valid cpf and valid email, mostly.)
 */
 

const unknownBloodType = ref(userStore.user?.bloodType === "-");

watchEffect(() => {
  if (unknownBloodType.value) {
    form.bloodType = "-";
  }
});

watchEffect(() => {
  if (form.bloodType !== "-") {
    unknownBloodType.value = false;
  }
});
</script>
