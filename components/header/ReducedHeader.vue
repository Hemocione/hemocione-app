<template>
  <header>
    <img src="/logos/baseLogo.svg" alt="Hemocione" class="logo" />
  </header>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: var(--reduced-navbar-size);
  background-color: var(--black-100);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 1rem calc(env(safe-area-inset-top) + 0.25rem);
}

.logo {
  height: calc(var(--reduced-navbar-content-height) - 12px);
  object-fit: contain;
}
</style>

<script setup lang="ts"></script>
