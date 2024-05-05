<template>
  <CommonIframeWrapper :src="$config.public.eventsUrl" include-token />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "external-page",
});
</script>
