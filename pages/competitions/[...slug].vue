<template>
  <div style="display: none" />
</template>

<script setup lang="ts">
definePageMeta({
  keepalive: false,
  allowFullscreen: false,
});

const iframeId = "competitions-iframe";

usePersistentIframe(iframeId, useRuntimeConfig().public.competitionsUrl, true);
</script>
