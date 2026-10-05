<template><div style="display: none" /></template>
<script setup lang="ts">
definePageMeta({
  keepalive: false,
  allowFullscreen: true,
});

const iframeId = "ask-for-help-iframe";

usePersistentIframe(iframeId, useRuntimeConfig().public.askForHelpUrl, true);
</script>
