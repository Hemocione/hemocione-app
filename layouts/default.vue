<template>
  <div class="application">
    <div class="page" :style="pageStyle">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const allowFullscreen = computed(() => Boolean(route.meta.allowFullscreen));

const pageStyle = computed(() => ({
  maxWidth: allowFullscreen.value ? "100%" : "var(--app-max-width)",
  paddingTop: allowFullscreen.value
    ? "var(--reduced-navbar-size)"
    : "var(--navbar-size)",
  paddingBottom: allowFullscreen.value ? "var(--bottom-bar-size)" : "0",
}));
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
  min-height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
  transition: max-width 0.3s ease-in-out;
  box-sizing: border-box;
}
</style>
