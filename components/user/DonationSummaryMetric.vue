<template>
  <div class="summary-metric">
    <NuxtImg class="icon" :src="iconSrc" alt="icon" />
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
  gap: 0.5em;
  width: 100%;
  height: 100%;
  text-transform: uppercase;
}

.value {
  font-size: 1.5em;
  font-weight: 600;
}

.label {
  width: 100%;
  text-align: center;
  font-size: 0.6em;
  letter-spacing: 0.05em;
  font-weight: 400;
}

.icon {
  width: 20%;
  aspect-ratio: 1/1;
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
