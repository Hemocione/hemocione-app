<template>
  <div class="content">
    <NuxtLink
      class="menu-item"
      v-for="(internalPage, index) in internalPages"
      :key="internalPage.name"
      :to="internalPage.path"
      @click="$emit('navigate')"
    >
      <img
        :src="`/icons/${internalPage.icon}${
          isCurrentRoute(index) ? '.active' : ''
        }.svg`"
        class="icon"
      />
      <span :active="isCurrentRoute(index)">{{ internalPage.name }}</span>
    </NuxtLink>
    <ElDivider />
    <NuxtLink
      class="menu-item"
      v-for="(donationPage, index) in donationPages"
      :key="donationPage.name"
      :to="donationPage.path"
      @click="$emit('navigate')"
    >
      <img
        :src="`/icons/${donationPage.icon}${
          isCurrentRoute(index, 'donations') ? '.active' : ''
        }.svg`"
        class="icon"
      />
      <span :active="isCurrentRoute(index, 'donations')">{{
        donationPage.name
      }}</span>
    </NuxtLink>
    <ElDivider />
    <div
      class="menu-item"
      v-for="externalPage in externalPages"
      :key="externalPage.name"
      @click="() => openExternalPage(externalPage)"
    >
      <img :src="`/icons/${externalPage.icon}`" class="icon" />
      <span>{{ externalPage.name }}</span>
      <img src="/icons/external-link.svg" class="external-link-icon" />
    </div>
    <div class="menu-item out">
      <img src="/icons/logout.svg" class="icon" />
      <span @click="$emit('logout')">{{ logoutText }}</span>
      <span class="version" @click="handleVersionClick">v{{ version }}</span>
    </div>
  </div>
</template>

<style scoped>
img {
  width: 2em;
  height: 2em;
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: var(--black-100);
  color: var(--hemo-color-text-primary);
  font-size: 1.2em;
}

.menu-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
}

.out {
  margin-top: auto;
}

.icon {
  object-fit: contain;
  width: 1.2rem;
}

.external-link-icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 0.6rem;
}

span[active="true"] {
  color: var(--hemo-color-primary-light);
}

.version {
  margin-top: 0.5rem;
  color: var(--black-40);
  font-size: 0.6rem;
  justify-content: center;
  margin-left: auto;
}
</style>

<script setup lang="ts">
import { AppLauncher } from "@capacitor/app-launcher";
import { useUserStore } from "~/stores/user";
import { storeToRefs } from "pinia";
import pkg from "~/package.json";

const emit = defineEmits<{
  navigate: [];
  logout: [];
}>();

const userStore = useUserStore();
const { pendingDonations, rejectedDonations } = storeToRefs(userStore);

const pendingDonationsCount = computed(() => pendingDonations.value.length);
const rejectedDonationsCount = computed(() => rejectedDonations.value.length);

const logoutText = userStore.user?.givenName
  ? `Sair (${userStore.user.givenName})`
  : "Sair";

interface Page {
  name: string;
  icon: string;
  disabled?: boolean;
}

interface InternalPage extends Page {
  priority: number;
  path: string;
}

const internalPages: InternalPage[] = [
  { path: "/", name: "Início", priority: 0, icon: "house" },
  { path: "/events", name: "Eventos", priority: 1, icon: "calendar" },
  { path: "/competitions", name: "Copas Hemocione", priority: 1, icon: "trophy" },
  { path: "/where", name: "Onde Doar", priority: 1, icon: "location" },
  { path: "/can-donate", name: "Posso Doar?", priority: 1, icon: "question" },
  { path: "/account", name: "Minha Conta", priority: 1, icon: "account" },
];

const donationPages = computed((): InternalPage[] => {
  return [
    { path: "/donations", name: "Histórico de doações", priority: 1, icon: "syringe-light" },
    { path: "/donations/pending", name: "Confirmações pendentes", priority: 2, icon: "alert-pending", disabled: pendingDonationsCount.value === 0 },
    { path: "/donations/rejected", name: "Doações rejeitadas", priority: 2, icon: "donation-canceled", disabled: rejectedDonationsCount.value === 0 },
  ].filter((page) => !page.disabled);
});

interface ExternalPage extends Page {
  url: string;
}

const externalPages: ExternalPage[] = [
  { url: "https://vista.hemocione.com.br", name: "Vestir a Camisa", icon: "shirt.svg" },
  { url: "https://apoie.hemocione.com.br", name: "Apoiar o Hemocione", icon: "help.svg" },
];

const currentRoute = useRoute();

const currentRouteIndex = computed(() => {
  const pagesCopy = [...internalPages, ...donationPages.value];
  const posiblePages = pagesCopy.filter((page) =>
    currentRoute.path.startsWith(page.path)
  );
  if (!posiblePages.length) return -1;

  const pagesSortedByPriority = posiblePages.sort(
    (a, b) => b.priority - a.priority
  );
  const highestPriorityPage = pagesSortedByPriority[0];
  return pagesCopy.indexOf(highestPriorityPage);
});

const isCurrentRoute = (
  pageIndex: number,
  pageType: "internal" | "donations" = "internal"
) => {
  if (pageType === "internal") {
    return pageIndex === currentRouteIndex.value;
  }

  const internalPagesLength = internalPages.length;
  return pageIndex === currentRouteIndex.value - internalPagesLength;
};

async function openExternalPage(externalPage: ExternalPage) {
  await AppLauncher.openUrl({ url: externalPage.url });
}

const version = ref(pkg.version);
const CLICKS_REQUIRED = 5;
const TIME_WINDOW = 3000;
const clicks = ref<number[]>([]);

const handleVersionClick = () => {
  const now = Date.now();
  clicks.value = clicks.value.filter((time) => now - time < TIME_WINDOW);
  clicks.value.push(now);

  if (clicks.value.length >= CLICKS_REQUIRED) {
    clicks.value = [];
    navigateTo("/test");
  }
};
</script>
