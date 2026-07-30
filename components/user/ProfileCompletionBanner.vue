<template>
  <ElAlert
    v-if="visible"
    class="banner"
    type="warning"
    :closable="true"
    show-icon
    @close="dismiss"
  >
    <template #title>Complete seu cadastro</template>
    <div class="content">
      <span>Falta {{ readableMissingFields }} no seu perfil.</span>
      <NuxtLink to="/account" class="cta">Completar cadastro</NuxtLink>
    </div>
  </ElAlert>
</template>

<script setup lang="ts">
import { Preferences } from "@capacitor/preferences";

const LABELS: Record<string, string> = {
  document: "seu CPF",
  gender: "seu gênero",
  address: "seu endereço",
};

const userStore = useUserStore();
const dismissedAt = ref<number | null>(null);
const loaded = ref(false);

const missingFields = computed(() => userStore.missingProfileFields);

// Only render once Preferences has been read, otherwise the banner flashes for
// a frame before a previous dismissal is known.
const visible = computed(
  () =>
    loaded.value &&
    shouldShowBanner({
      missingFields: missingFields.value,
      dismissedAt: dismissedAt.value,
      now: Date.now(),
    })
);

const readableMissingFields = computed(() => {
  const labels = missingFields.value.map((field) => LABELS[field] ?? field);
  if (labels.length <= 1) return labels[0] ?? "";

  return `${labels.slice(0, -1).join(", ")} e ${labels[labels.length - 1]}`;
});

async function dismiss() {
  dismissedAt.value = Date.now();
  await Preferences.set({
    key: PROFILE_BANNER_DISMISSED_KEY,
    value: String(dismissedAt.value),
  });
}

onMounted(async () => {
  const { value } = await Preferences.get({ key: PROFILE_BANNER_DISMISSED_KEY });
  dismissedAt.value = value ? Number(value) : null;
  loaded.value = true;
});
</script>

<style scoped>
.banner {
  width: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.cta {
  font-weight: 600;
  color: #d1151a;
  text-decoration: underline;
}
</style>
