<template>
  <div class="wrapper">
    <NuxtImg class="user-image" :src="userImgSrc" alt="User Profile Image" />
    <div class="user-profile">
      <h3>{{ userData?.name }}</h3>
      <span>{{ description }}</span>
      <div class="status">
        <div
          :class="{
            ball: true,
            redBall: !ableToDonate,
            greenBall: ableToDonate,
          }"
        />
        <span>{{ userStore.userDonationStatus.label }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  font-size: 0.8em;
}
.ball {
  height: 0.8em;
  aspect-ratio: 1/1;
  border-radius: 50%;
}

.redBall {
  background-color: var(--red-negative-default);
}

.greenBall {
  background-color: var(--hemo-color-success);
}

.user-image {
  width: 30%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--hemo-color-primary);
  background-color: var(--light-purple);
}

.user-profile {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-left: 1em;
  gap: 0.5em;
  width: 70%;
  font-weight: 400;
  color: var(--black-80);
}

.user-profile h3 {
  font-weight: 600;
  color: var(--black-100);
}

@media screen and (min-width: 768px) {
  .user-image {
    width: 20%;
  }

  .user-profile {
    width: 80%;
  }
}
</style>

<script setup lang="ts">
import { useUserStore } from "~/stores/user";
const userStore = useUserStore();
const userData = userStore.userWithMetrics;

const ableToDonate = computed(
  () => userStore.userDonationStatus.status === "able-to-donate"
);

const userImgSrc = computed(
  () => `/illustrations/bloodCharacters/${userData?.bloodType}.svg`
);

const description = computed(() =>
  [userStore.userAge, userStore.userReadableGender].filter(Boolean).join(", ")
);
</script>
