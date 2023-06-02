<template>
  <div class="summary-metric">
    <img class="icon" :src="iconSrc" alt="icon" />
    <span class="value">{{ value }}</span>
    <span class="label">{{ label }}</span>
  </div>
</template>

<style scoped>
.summary-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
}

.icon {
  height: 1rem;
}
</style>
<script setup lang="ts">
defineProps({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  iconSrc: {
    type: String,
    required: true,
  },
});
</script>
