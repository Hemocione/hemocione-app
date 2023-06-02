<template>
  <div>
    <HemocioneHeader />
    <slot />
    <HemocioneFooter />
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: white;
  overflow: hidden;
}
</style>