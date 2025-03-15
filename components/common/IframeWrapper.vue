<template>
  <div class="iframe-wrapper">
    <iframe
      v-show="iframedLoaded"
      :src="iframeSrc"
      frameborder="0"
      allowfullscreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
  }, 300);
};

const routeSlug = props.route.params.slug;
const routeQuery = props.route.query;
const routeSlugPath = Array.isArray(routeSlug)
  ? routeSlug.filter(Boolean).join("/")
  : routeSlug;

const iframeSrc = computed(() => {
  const src = new URL(props.src);
  src.pathname = routeSlugPath || "/";
  // add query params to iframe
  for (const [key, value] of Object.entries(routeQuery)) {
    src.searchParams.set(key, value as string);
  }
  src.searchParams.delete("token"); // remove token from query params if present
  if (props.includeToken) {
    // build url correctly with token
    src.searchParams.set("token", userStore.token); // add token to query params
  }
  return src.toString();
});
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
