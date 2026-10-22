<template><div style="display: none" /></template>
<script setup lang="ts">
import { useUserStore } from "~/stores/user";

definePageMeta({
  keepalive: false,
  allowFullscreen: true,
});

const iframeId = "hemarcio-iframe";
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const chatUrl = useRuntimeConfig().public.chatUrl;

// The persistent iframe survives navigation. If it already exists, a new
// `?ask=` must be pushed into it by changing its src. If it is created now,
// IframeWrapper reads the route query itself.
const iframeExisted = import.meta.client && !!document.getElementById(iframeId);

usePersistentIframe(iframeId, chatUrl, true);

const reloadChatWithAsk = () => {
  const iframe = document
    .getElementById(iframeId)
    ?.querySelector("iframe") as HTMLIFrameElement | null;
  if (!iframe) return;
  iframe.src = buildChatUrl(chatUrl, {
    slug: route.params.slug,
    query: route.query as Record<string, string>,
    token: userStore.token,
    includeToken: true,
  });
};

// Drop ask/ctx from the app URL so a reload does not repeat the question.
const stripAsk = () => {
  const { ask: _ask, ctx: _ctx, ...rest } = route.query;
  router.replace({ query: rest });
};

const handleAsk = (navigateIframe: boolean) => {
  if (typeof route.query.ask !== "string" || !route.query.ask) return;
  if (navigateIframe) reloadChatWithAsk();
  setTimeout(stripAsk, 0);
};

onMounted(() => handleAsk(iframeExisted));

// Page already open and a new ask arrives (same route, new query).
watch(
  () => [route.query.ask, route.query.ctx],
  () => handleAsk(true)
);
</script>
