<template>
  <CommonIframeWrapper :src="'https://ondedoar.hemocione.com.br'" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "external-page",
  keepalive: true,
});
</script>
