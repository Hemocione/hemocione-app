<template>
  <div ref="container" class="hemarcio-page" />
</template>
<script setup lang="ts">
import { createHemocioneChat } from "@hemocione/sdk";
import { useUserStore } from "~/stores/user";

definePageMeta({
  keepalive: false,
  allowFullscreen: true,
});

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const chatUrl = useRuntimeConfig().public.chatUrl;
const container = ref<HTMLElement | null>(null);
let page: ReturnType<typeof createHemarcioPage> | null = null;

// ask/ctx leave the app URL after use so a reload does not repeat the question.
const consumeQuery = () => {
  if (!page?.handleQuery(route.query)) return;
  const { ask: _ask, ctx: _ctx, ...rest } = route.query;
  router.replace({ query: rest });
};

onMounted(() => {
  if (!container.value) return;
  page = createHemarcioPage({
    createChat: createHemocioneChat,
    container: container.value,
    chatUrl,
    token: userStore.token || null,
    // The chat's login button must not navigate the WebView away: hand the
    // user to the app's own auth gate instead.
    onNavigateTop: () => {
      userStore.logout();
    },
    // Product buttons in the chat open the app page, not the product site.
    onNavigate: (path) => {
      navigateTo(path);
    },
  });
  consumeQuery();
});

// A new ask while the page is already open reuses the same chat.
watch(
  () => [route.query.ask, route.query.ctx],
  () => consumeQuery()
);

watch(
  () => userStore.token,
  (token) => page?.setToken(token || null)
);

onBeforeUnmount(() => {
  page?.destroy();
  page = null;
});
</script>
<style scoped>
.hemarcio-page {
  width: 100%;
  height: calc(var(--available-height) - var(--navbar-size));
}

.hemarcio-page :deep([data-hemocione-chat]) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
