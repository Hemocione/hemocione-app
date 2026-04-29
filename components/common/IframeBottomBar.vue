<template>
  <nav class="bottom-bar">
    <button class="nav-button" @click="goBack">
      <ElIcon :size="20"><ElIconArrowLeft /></ElIcon>
      <span>Voltar</span>
    </button>
    <button class="nav-button" @click="goHome">
      <img src="/icons/house.svg" alt="Home" class="nav-icon" />
      <span>Home</span>
    </button>
    <button class="nav-button" @click="toggleDrawer">
      <img src="/icons/menu.svg" alt="Menu" class="nav-icon" />
      <span>Menu</span>
    </button>

    <ElDrawer v-model="drawer" direction="rtl" size="300px">
      <HeaderNavigationMenu @navigate="toggleDrawer" @logout="handleOut" />
    </ElDrawer>

    <ElDialog
      title="Sair"
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
  </nav>
</template>

<style scoped>
.bottom-bar {
  position: fixed;
  bottom: 0;
  z-index: 2;
  width: 100%;
  height: var(--bottom-bar-size);
  background-color: var(--black-100);
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  padding: 0.5rem 0 calc(env(safe-area-inset-bottom) + 0.25rem);
  border-top: 1px solid var(--black-80);
}

.nav-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: var(--hemo-color-text-primary);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.25rem 1rem;
}

.nav-button img,
.nav-button .el-icon {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
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
const router = useRouter();

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const toggleOutDialog = () => {
  confirmOutDialog.value = !confirmOutDialog.value;
};

const handleOut = () => {
  userStore.logout();
};

const confirmLogout = () => {
  confirmOutDialog.value = false;
  handleOut();
};

const goBack = () => {
  router.back();
};

const goHome = () => {
  navigateTo("/");
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
