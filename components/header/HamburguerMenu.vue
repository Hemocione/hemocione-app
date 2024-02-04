<template>
  <NuxtImg src="/icons/menu.svg" alt="Menu" @click="toggleDrawer" />
  <ElDrawer v-model="drawer" direction="rtl" size="200px">
    <div class="content">
      <NuxtLink to="/" :active="isCurrentRoute('/')" @click="toggleDrawer"
        >Início</NuxtLink
      >
      <NuxtLink
        to="/events"
        :active="isCurrentRoute('/events')"
        @click="toggleDrawer"
        >Eventos</NuxtLink
      >
      <NuxtLink
        to="/donations"
        :active="isCurrentRoute('/donations')"
        @click="toggleDrawer"
        >Minhas Doações</NuxtLink
      >
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
</style>

<script setup lang="ts">
const drawer = ref(false);
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
const currentRoute = useRoute();

const isCurrentRoute = (route: string) => {
  return currentRoute.path === route;
};
</script>
