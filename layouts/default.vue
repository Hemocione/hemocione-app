<template>
  <div class="application">
    <HemocioneHeader class="header" />
    <div class="page">
      <slot />
    </div>
    <slot name="sticky-footer" />
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  z-index: 1;
  height: 65px;
}

.application {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  align-items: center;
}

.page {
  background-color: white;
  max-width: 1270px;
  min-height: calc(100dvh - 65px);
  margin-top: 65px;
}
</style>
