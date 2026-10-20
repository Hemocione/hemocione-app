<template>
  <div style="display: none" />
</template>

<script setup lang="ts">
definePageMeta({
  keepalive: false,
  allowFullscreen: true,
});

const iframeId = "jogos-iframe";

// Mesmo contrato dos outros serviços embutidos: a sessão do app vai em `?token=` e os
// jogos entram sozinhos (o jogos valida o token no Hemocione ID e tira da URL).
usePersistentIframe(iframeId, useRuntimeConfig().public.jogosUrl, true);
</script>
