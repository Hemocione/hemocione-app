<template><div style="display: none" /></template>
<script setup lang="ts">
definePageMeta({
  keepalive: false,
  allowFullscreen: true,
});

const iframeId = "events-iframe";

usePersistentIframe(iframeId, useRuntimeConfig().public.eventsUrl, true);
</script>
