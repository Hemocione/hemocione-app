<template>
  <ElButton type="primary" :disabled="disabled" size="large">
    Registrar doação
    <template #icon>
      <img src="/icons/plus.svg" alt="plus" height="13" width="13" />
    </template>
  </ElButton>
</template>

<style scoped>
button {
  background-color: var(--red-negative-darker);
  border: 1px solid var(--red-negative-darker);
  height: 100%;
}
</style>

<script setup lang="ts">
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>
