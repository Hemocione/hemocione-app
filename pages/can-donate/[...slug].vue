<template><div style="display: none" /></template>
<script setup lang="ts">
definePageMeta({
  keepalive: false,
  allowFullscreen: true,
});

const iframeId = "can-donate-iframe";

usePersistentIframe(iframeId, useRuntimeConfig().public.canDonateUrl, true);
</script>
