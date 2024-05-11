<template>
  <img
    class="logo"
    src="/logos/principal-horizontal-cionebranco.svg"
    alt="Hemocione Logo"
    @click="navigateTo('/')"
  />
</template>

<style scoped>
.logo {
  width: auto;
  object-fit: contain;
  height: 100%;
  max-width: 150px;
  cursor: pointer;
}
</style>
