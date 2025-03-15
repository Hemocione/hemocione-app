<template>
  <div style="display: none" />
</template>

<script setup lang="ts">
definePageMeta({
  keepalive: false,
  allowFullscreen: true,
});

const iframeId = "where-iframe";

usePersistentIframe(
  iframeId,
  useRuntimeConfig().public.whereToDonateUrl,
  false
);
</script>
