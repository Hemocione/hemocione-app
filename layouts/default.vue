<template>
  <div class="application">
    <HemocioneHeader class="header" />
    <div class="page">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  z-index: 1;
  height: 65px;
  width: 100%;
}

.application {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  width: 100dvw;
  overflow: hidden;
  align-items: center;
}

.page {
  background-color: white;
  max-width: 1270px;
  min-height: calc(100dvh - 65px);
  margin-top: 65px;
  overflow-y: auto;
  scroll-behavior: smooth;
}
</style>
