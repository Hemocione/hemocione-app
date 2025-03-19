<template>
  <section class="header">
    <div class="wrapper">
      <img class="user-image" :src="userImgSrc" alt="User Profile Image" />
      <div class="user-profile">
        <h4>{{ userData?.name }}</h4>
        <span>{{ description }}</span>
      </div>
    </div>
    <div class="status">
      <div
        :class="{
          ball: true,
          redBall: !ableToDonate,
          greenBall: ableToDonate,
        }"
      />
      <span
        >{{ userStore.userDonationStatus.label
        }}<NuxtLink to="/can-donate" class="cta" v-if="ableToDonate">
          Descubra se você pode doar sangue
        </NuxtLink></span
      >
    </div>
  </section>
</template>
<style scoped>
.header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}
.wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 4rem;
  gap: 1rem;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  font-size: 0.75rem;
}
.ball {
  height: 0.6rem;
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
  height: 100%;
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
  padding: 0.2rem 0;
  width: 70%;
  font-weight: 400;
  color: var(--black-80);
}

.user-profile h4 {
  margin: 0;
  color: var(--black-100);
  font-size: 1.5rem;
  font-weight: 400;
}

.cta {
  color: var(--hemo-color-primary);
  text-decoration: underline;
  text-decoration-color: var(--hemo-color-primary);
}

@media screen and (min-width: 768px) {
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

const bloodType = computed(() => userData?.bloodType ?? "-");

const userImgSrc = computed(
  () =>
    `/illustrations/bloodCharacters/${
      bloodType.value === "-" ? "O-" : bloodType.value
    }.svg`
);

const description = computed(() =>
  [userStore.userAge, userStore.userReadableGender].filter(Boolean).join(", ")
);
</script>
