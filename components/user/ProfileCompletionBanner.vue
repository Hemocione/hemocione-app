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
// Date.now() is not reactive, so the expiry is driven by this ref instead.
const now = ref(Date.now());
let expiryTimer: ReturnType<typeof setTimeout> | null = null;

const userId = computed(() => userStore.user?.id ?? null);
const missingFields = computed(() => userStore.missingProfileFields);

// Held back until Preferences has been read, otherwise the banner flashes for a
// frame before a previous dismissal is known.
const visible = computed(
  () =>
    loaded.value &&
    shouldShowBanner({
      missingFields: missingFields.value,
      dismissedAt: dismissedAt.value,
      now: now.value,
    })
);

const readableMissingFields = computed(() => {
  const labels = missingFields.value.map((field) => LABELS[field] ?? field);
  if (labels.length <= 1) return labels[0] ?? "";

  return `${labels.slice(0, -1).join(", ")} e ${labels[labels.length - 1]}`;
});

function clearExpiryTimer() {
  if (expiryTimer) {
    clearTimeout(expiryTimer);
    expiryTimer = null;
  }
}

// Brings the banner back the moment the window ends, without waiting for a
// remount — mobile keeps this screen alive across days of suspend/resume.
function scheduleExpiry() {
  clearExpiryTimer();
  const delay = nextDismissalExpiry({
    dismissedAt: dismissedAt.value,
    now: Date.now(),
  });
  if (delay === null) return;

  expiryTimer = setTimeout(() => {
    now.value = Date.now();
    scheduleExpiry();
  }, delay + 1);
}

async function loadDismissal() {
  loaded.value = false;
  const { value } = await Preferences.get({
    key: getDismissalKey(userId.value),
  });
  dismissedAt.value = value ? Number(value) : null;
  now.value = Date.now();
  loaded.value = true;
  scheduleExpiry();
}

async function dismiss() {
  const at = Date.now();
  dismissedAt.value = at;
  now.value = at;
  await Preferences.set({
    key: getDismissalKey(userId.value),
    value: String(at),
  });
  scheduleExpiry();
}

onMounted(loadDismissal);
// A shared device can switch donors without a remount.
watch(userId, loadDismissal);
onUnmounted(clearExpiryTimer);
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
