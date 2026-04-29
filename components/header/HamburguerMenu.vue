<template>
  <img src="/icons/menu.svg" alt="Menu" @click="toggleDrawer" />
  <ElDrawer v-model="drawer" direction="rtl" size="300px">
    <HeaderNavigationMenu @navigate="toggleDrawer" @logout="toggleOutDialog" />
  </ElDrawer>
  <ElDialog
    :title="logoutText"
    v-model="confirmOutDialog"
    align-center
    width="300px"
  >
    <span>Tem certeza que deseja sair?</span>
    <div class="dialog-actions">
      <ElButton @click="toggleOutDialog">Cancelar</ElButton>
      <ElButton type="primary" @click="confirmLogout">Sair</ElButton>
    </div>
  </ElDialog>
</template>

<style scoped>
img {
  width: 2em;
  height: 2em;
}

.dialog-actions {
  margin-top: 1rem;
  display: flex;
  width: 100%;
  gap: 0.5rem;
}

.dialog-actions > * {
  width: 100%;
}
</style>

<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const drawer = ref(false);
const confirmOutDialog = ref(false);
const userStore = useUserStore();

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
const toggleOutDialog = () => {
  confirmOutDialog.value = !confirmOutDialog.value;
};

const logoutText = userStore.user?.givenName
  ? `Sair (${userStore.user.givenName})`
  : "Sair";

const confirmLogout = () => {
  confirmOutDialog.value = false;
  handleOut();
};

const handleOut = () => {
  userStore.logout();
};

const handlePopState = (_event: Event) => {
  if (drawer.value) {
    toggleDrawer();
  }
};

watch(drawer, (newValue) => {
  if (newValue) {
    window.addEventListener("popstate", handlePopState);
    window.history.pushState({ drawer: "open" }, "");
  } else {
    window.removeEventListener("popstate", handlePopState);
  }
});
</script>
