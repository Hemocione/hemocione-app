<template>
  <div class="application">
    <div class="page">
      <slot />
    </div>
  </div>
</template>

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
  max-width: var(--app-max-width);
  width: 100%;
  min-height: calc(var(--available-height) - var(--navbar-size));
  margin-top: var(--navbar-size);
  overflow-y: auto;
  scroll-behavior: smooth;
}
</style>
