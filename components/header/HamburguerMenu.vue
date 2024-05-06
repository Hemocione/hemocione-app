<template>
  <img src="/icons/menu.svg" alt="Menu" @click="toggleDrawer" />
  <ElDrawer v-model="drawer" direction="rtl" size="300px">
    <div class="content">
      <div
        class="menu-item"
        v-for="(internalPage, index) in internalPages"
        :key="internalPage.name"
        @click="() => handleInternalPageClick(internalPage)"
      >
        <img
          :src="`/icons/${internalPage.icon}${
            isCurrentRoute(index) ? '.active' : ''
          }.svg`"
          class="icon"
        />
        <NuxtLink
          :key="internalPage.path"
          :to="internalPage.path"
          :active="isCurrentRoute(index)"
          @click="toggleDrawer"
          >{{ internalPage.name }}
        </NuxtLink>
      </div>
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
        <span @click="toggleOutDialog">{{ logoutText }}</span>
      </div>
    </div>
  </ElDrawer>
  <ElDialog :title="logoutText" v-model="confirmOutDialog" align-center>
    <span>Tem certeza que deseja sair?</span>
    <div class="dialog-actions">
      <ElButton @click="toggleOutDialog">Cancelar</ElButton>
      <ElButton type="primary" @click="handleOut">Sair</ElButton>
    </div>
  </ElDialog>
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

a[active="true"] {
  color: var(--hemo-color-primary-light);
}

.custom-item {
  cursor: pointer;
}

.dialog-actions {
  margin-top: 1rem;
  display: flex;
  width: 100%;
}

.dialog-actions > * {
  width: 100%;
}
</style>

<script setup lang="ts">
const drawer = ref(false);
const confirmOutDialog = ref(false);
import { Browser } from "@capacitor/browser";
import { useUserStore } from "~/stores/user";
const userStore = useUserStore();
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
const toggleOutDialog = () => {
  confirmOutDialog.value = !confirmOutDialog.value;
};
const currentRoute = useRoute();

interface Page {
  name: string;
  icon: string;
}

interface InternalPage extends Page {
  priority: number;
  path: string;
}

const internalPages: InternalPage[] = [
  {
    path: "/",
    name: "Início",
    priority: 0,
    icon: "house",
  },
  {
    path: "/events",
    name: "Eventos",
    priority: 1,
    icon: "calendar",
  },
  {
    path: "/competitions",
    name: "Copas Hemocione",
    priority: 1,
    icon: "trophy",
  },
  {
    path: "/donations",
    name: "Minhas Doações",
    priority: 1,
    icon: "syringe-light",
  },
  {
    path: "/where",
    name: "Onde Doar",
    priority: 1,
    icon: "location",
  },
];

interface ExternalPage extends Page {
  url: string;
}

const externalPages: ExternalPage[] = [
  {
    url: "https://loja.hemocione.com.br",
    name: "Vestir a Camisa",
    icon: "shirt.svg",
  },
  {
    url: "https://apoie.hemocione.com.br",
    name: "Apoiar Financeiramente",
    icon: "help.svg",
  },
];

const currentRouteIndex = computed(() => {
  const pagesCopy = [...internalPages];
  const posiblePages = pagesCopy.filter((page) =>
    currentRoute.path.startsWith(page.path)
  );
  if (!posiblePages) return -1;

  const pagesSortedByPriority = posiblePages.sort(
    (a, b) => b.priority - a.priority
  );
  const highestPriorityPage = pagesSortedByPriority[0];
  return internalPages.indexOf(highestPriorityPage);
});

const isCurrentRoute = (pageIndex: number) => {
  return pageIndex === currentRouteIndex.value;
};

const handleOut = () => {
  userStore.logout();
};

const logoutText = userStore.user?.givenName
  ? `Sair (${userStore.user.givenName})`
  : "Sair";

async function openExternalPage(externalPage: ExternalPage) {
  await Browser.open({
    url: externalPage.url,
    toolbarColor: "#bb0a08",
  });
}

function handleInternalPageClick(internalPage: InternalPage) {
  if (isCurrentRoute(internalPages.indexOf(internalPage))) {
    toggleDrawer();
  } else {
    navigateTo(internalPage.path);
  }
}
</script>
