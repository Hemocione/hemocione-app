<template>
  <div class="main">
    <CommonBackHeader
      title="Conquistas de doador"
      iconDirection="left"
      :custom-path="'/'"
    />
    <AvatarAchievementsList />
  </div>
</template>

<style scoped>
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  min-height: 100%;
  padding: 1rem;
}
</style>

<script setup lang="ts">
definePageMeta({
  pageTransition: {
    name: "slide-left-fast-and-furious",
    mode: "out-in",
  },
});
</script>
