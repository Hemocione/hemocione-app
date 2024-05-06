<template>
  <div class="header">
    <ElIcon @click="navigate" size="25" class="back-icon">
      <ElIconArrowDown v-if="iconDirection === 'down'" />
      <ElIconArrowLeft v-else />
    </ElIcon>
    <h4 class="title">{{ title }}</h4>
  </div>
</template>

<style scoped>
.header {
  width: 100%;
  display: flex;
  height: var(--navbar-size);
  align-items: center;
  color: var(--black-100);
}

.back-icon {
  cursor: pointer;
  color: var(--black-100);
  margin: 0 2rem;
}

.title {
  font-size: 1.5em;
  margin: 0;
  display: flex;
  align-items: center;
  font-weight: 400;
}
</style>

<script setup lang="ts">
const props = defineProps({
  title: String,
  fallBack: {
    type: String,
    default: "/",
  },
  iconDirection: {
    type: String as PropType<"down" | "left">,
    default: "down",
  },
  customPath: String,
});

const router = useRouter();
const navigate = async () => {
  if (props.customPath) {
    return await navigateTo(props.customPath);
  }

  try {
    router.back();
  } catch (error) {
    console.error(error);
    await navigateTo(props.fallBack);
  }
};
</script>
