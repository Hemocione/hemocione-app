<template>
  <transition-group name="slide-top">
    <footer v-if="isOpen">
      <div class="wrapper">
        <CommonRegisterDonationButton />
        <CommonAbleToDonateButton />
        <el-icon @click="isOpen = false" size="30" class="close">
          <ElIconClose />
        </el-icon>
      </div>
    </footer>
    <el-icon v-else @click="isOpen = true" size="30" class="open">
      <ElIconArrowUp />
    </el-icon>
  </transition-group>
</template>

<style scoped>
footer {
  border-top: 1px solid var(--black-40);
  position: fixed;
  bottom: 0;
  background-color: white;
  height: 17.5%;
  width: 100%;
  max-width: 1270px;
}
.wrapper {
  position: relative;
  padding: 1em 2em;
  display: grid;
  gap: 1em;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-items: stretch;
}

.close {
  position: absolute;
  top: -1.5em;
  left: 1rem;
  cursor: pointer;
  border-radius: 50%;
  background-color: white;
  border: 1px solid var(--black-40);
  padding: 2px;
}

.open {
  position: fixed;
  bottom: 0.5em;
  left: 1rem;
  cursor: pointer;
  border-radius: 50%;
  background-color: white;
  border: 1px solid var(--black-40);
  padding: 2px;
}
</style>

<script setup lang="ts">
const isOpen = ref(true);
</script>
