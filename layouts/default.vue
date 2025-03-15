<template>
  <div class="application">
    <div class="page" :style="pageStyle">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const allowFullscreen = computed(() => route.meta.allowFullscreen);
const pageStyle = ref({
  maxWidth: allowFullscreen.value ? "100%" : "var(--app-max-width)",
});

const computePageStyle = () => {
  pageStyle.value = {
    maxWidth: allowFullscreen.value ? "100%" : "var(--app-max-width)",
  };
};

watch(allowFullscreen, (value) => {
  pageStyle.value = {
    maxWidth: value ? "100%" : "var(--app-max-width)",
  };
});
</script>

<style scoped>
.application {
  position: relative;
  display: flex;
  flex-direction: column;
  height: var(--available-height);
  width: var(--available-width);
  overflow: hidden;
  align-items: center;
}

.page {
  background-color: white;
  width: 100%;
  min-height: calc(var(--available-height) - var(--navbar-size));
  margin-top: var(--navbar-size);
  overflow-y: auto;
  scroll-behavior: smooth;
  transition: max-width 0.3s ease-in-out; /* Adiciona a transição */
}
</style>
