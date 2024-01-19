<template>
  <div>
    <HemocioneHeader />
    <slot />
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: white;
  overflow: hidden;
}
</style>
