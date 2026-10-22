<template>
  <div class="iframe-wrapper">
    <iframe
      v-show="iframedLoaded"
      :src="iframeSrc"
      frameborder="0"
      allowfullscreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; geolocation; gyroscope; picture-in-picture"
      @load="setLoaded"
      class="iframe"
    ></iframe>
    <transition name="quick-fade">
      <div class="loader-wrapper" v-if="!iframedLoaded">
        <CommonLogoLoader />
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();
const props = defineProps<{
  src: string;
  includeToken?: boolean;
  route?: any;
}>();

const iframedLoaded = ref(false);
const setLoaded = () => {
  setTimeout(() => {
    iframedLoaded.value = true;
  }, 500);
};

const routeSlug = props.route.params.slug;
const routeQuery = props.route.query;

const iframeSrc = computed(() =>
  buildChatUrl(props.src, {
    slug: routeSlug,
    query: routeQuery,
    token: userStore.token,
    includeToken: props.includeToken,
  })
);
</script>
<style scoped>
.iframe-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.loader-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
