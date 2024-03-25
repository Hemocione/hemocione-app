<template>
  <NuxtImg src="/icons/menu.svg" alt="Menu" @click="toggleDrawer" />
  <ElDrawer v-model="drawer" direction="rtl" size="200px">
    <div class="content">
      <NuxtLink v-for="page in pages" :key="page.path" :to="page.path" :active="isCurrentRoute(page)"
        @click="toggleDrawer"
        >{{ page.name }}
      </NuxtLink>
    </div>
  </ElDrawer>
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
</style>

<script setup lang="ts">
const drawer = ref(false);
const toggleDrawer = () => {
  drawer.value = !drawer.value;
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
    path: "/donations",
    name: "Minhas Doações",
    priority: 1,
  }
];

const isCurrentRoute = (page: Page) => {
  const pagesCopy = [...pages];
  const posiblePages = pagesCopy.filter((page) => currentRoute.path.startsWith(page.path));
  if (!posiblePages) return false;

  const pagesSortedByPriority = posiblePages.sort((a, b) => b.priority - a.priority);
  const highestPriorityPage = pagesSortedByPriority[0];
  return page.name === highestPriorityPage.name;
};
</script>
