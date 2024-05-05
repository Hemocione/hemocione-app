<template>
  <img src="/icons/menu.svg" alt="Menu" @click="toggleDrawer" />
  <ElDrawer v-model="drawer" direction="rtl" size="200px">
    <div class="content">
      <NuxtLink
        v-for="page in pages"
        :key="page.path"
        :to="page.path"
        :active="isCurrentRoute(page)"
        @click="toggleDrawer"
        >{{ page.name }}
      </NuxtLink>
      <span class="out" @click="toggleOutDialog">Sair</span>
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
  gap: 1em;
  background-color: var(--black-100);
  color: var(--hemo-color-text-primary);
  font-size: 1.2em;
}

a[active="true"] {
  color: var(--hemo-color-primary-light);
}

.out {
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
import { useUserStore } from "~/stores/user";
const userStore = useUserStore();
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
const toggleOutDialog = () => {
  confirmOutDialog.value = !confirmOutDialog.value;
};
const currentRoute = useRoute();

type Page = {
  path: string;
  name: string;
  priority: number;
};

const pages: Page[] = [
  {
    path: "/",
    name: "Início",
    priority: 0,
  },
  {
    path: "/events",
    name: "Eventos",
    priority: 1,
  },
  {
    path: "/competitions",
    name: "Copas Hemocione",
    priority: 1,
  },
  {
    path: "/donations",
    name: "Minhas Doações",
    priority: 1,
  },
];

const isCurrentRoute = (page: Page) => {
  const pagesCopy = [...pages];
  const posiblePages = pagesCopy.filter((page) =>
    currentRoute.path.startsWith(page.path)
  );
  if (!posiblePages) return false;

  const pagesSortedByPriority = posiblePages.sort(
    (a, b) => b.priority - a.priority
  );
  const highestPriorityPage = pagesSortedByPriority[0];
  return page.name === highestPriorityPage.name;
};

const handleOut = () => {
  userStore.logout();
};

const logoutText = userStore.user?.givenName
  ? `Sair (${userStore.user.givenName})`
  : "Sair";
</script>
