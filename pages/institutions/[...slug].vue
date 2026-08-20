<template><div style="display: none" /></template>
<script setup lang="ts">
definePageMeta({
  keepalive: false,
  allowFullscreen: true,
});

const iframeId = "institutions-iframe";

usePersistentIframe(iframeId, useRuntimeConfig().public.institutionsUrl, true);
</script>
