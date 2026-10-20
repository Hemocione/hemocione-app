<template>
  <div style="display: none" />
</template>

<script setup lang="ts">
definePageMeta({
  keepalive: false,
  allowFullscreen: true,
});

const iframeId = "jogos-iframe";

usePersistentIframe(iframeId, useRuntimeConfig().public.jogosUrl, false);
</script>
