<template>
  <transition-group name="slide-top">
    <footer v-if="isOpen" key="footer">
      <div class="wrapper">
        <slot />
        <el-icon
          @click="handleClick"
          size="30"
          class="toggler"
          v-if="!hideToggle"
        >
          <ElIconClose />
        </el-icon>
      </div>
    </footer>
    <div class="fake-div" v-else-if="!hideToggle && !isOpen" key="fake-div">
      <el-icon @click="handleClick" size="30" class="toggler">
        <ElIconArrowUp />
      </el-icon>
    </div>
  </transition-group>
</template>

<style scoped>
footer {
  border-top: 1px solid var(--black-40);
  position: fixed;
  bottom: 0;
  background-color: white;
  height: v-bind("height");
  width: 100%;
  max-width: var(--app-max-width);
}
.wrapper {
  position: relative;
  padding: 1em 2em;
  display: flex;
  gap: 1em;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-items: stretch;
}

.fake-div {
  border-top: 1px solid var(--black-40);
  position: fixed;
  bottom: 0;
  background-color: white;
  width: 100%;
  max-width: var(--app-max-width);
}
.toggler {
  position: absolute;
  top: -1.5em;
  left: 1rem;
  cursor: pointer;
  border-radius: 50%;
  background-color: white;
  border: 1px solid var(--black-40);
  padding: 2px;
}
</style>

<script setup lang="ts">
const props = defineProps({
  height: {
    type: String,
    default: "12%",
  },
  hideToggle: {
    type: Boolean,
    default: false,
  },
  animationEntranceDelay: {
    type: Number,
    default: 0,
  },
});


const entranceDelay = Math.max(props.animationEntranceDelay, 0);
const isOpen = ref(!Boolean(entranceDelay));
const interacted = ref(false);

const handleClick = () => {
  interacted.value = true;
  isOpen.value = !isOpen.value;  
};

onMounted(() => {
  if (!entranceDelay) return
  
  setTimeout(() => {
    if (interacted.value) return;

    isOpen.value = true;
  }, entranceDelay);
});
</script>
