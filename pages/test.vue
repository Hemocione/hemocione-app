<template>
  <div style="display: none" />
</template>

<script setup lang="ts">
definePageMeta({
  keepalive: false,
  allowFullscreen: true,
});

const iframeId = "test-iframe";
const config = useRuntimeConfig();

usePersistentIframe(iframeId, config.public.testUrl as string, true);
</script>
