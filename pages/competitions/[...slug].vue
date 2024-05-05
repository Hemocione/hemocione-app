<template>
  <CommonIframeWrapper :src="$config.public.competitionsUrl" include-token />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "external-page",
});
</script>
