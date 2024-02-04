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
}>();
const iframedLoaded = ref(false);
const setLoaded = () => {
  iframedLoaded.value = true;
};

const iframeSrc = computed(() => {
  if (props.includeToken) {
    // build url correctly with oken
    const src = new URL(props.src);
    src.searchParams.append("token", userStore.token);
    return src.toString();
  }
  return props.src;
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
