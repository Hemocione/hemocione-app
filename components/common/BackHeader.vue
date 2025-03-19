<template>
  <div class="header">
    <ElIcon @click="navigate" size="15" class="back-icon">
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
  height: var(--subheader-size);
  align-items: center;
  color: var(--black-100);
  border-bottom: 1px solid var(--black-20);
  padding: 1rem;
  gap: 1rem;
}

.back-icon {
  cursor: pointer;
  color: var(--black-100);
}

.title {
  font-size: 1.1rem;
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

defineExpose({ navigate });
</script>
