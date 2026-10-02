<template>
  <div class="main">
    <CommonBackHeader
      title="Conquistas de doador"
      iconDirection="left"
      :custom-path="'/'"
    />
    <div class="content">
      <AvatarAchievementsList />
    </div>
  </div>
</template>

<style scoped>
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  height: calc(100dvh - var(--subheader-size) - var(--navbar-size));
  overflow-y: auto;
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
