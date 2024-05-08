<template>
  <div class="application">
    <HemocioneHeader class="header" />
    <NuxtLoadingIndicator color="#bb0a08" />
    <div class="page">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  z-index: 2;
  height: var(--navbar-size);
  width: 100%;
}

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
}
</style>
