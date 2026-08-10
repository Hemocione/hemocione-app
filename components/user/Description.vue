<template>
  <section class="header">
    <div class="wrapper">
      <AvatarWidget />
      <div class="user-profile">
        <h4>{{ userData?.name }}</h4>
        <span>{{ description }}</span>
      </div>
    </div>
    <button
      v-if="unseenItems.length > 0"
      type="button"
      class="avatar-unseen-cta"
      @click="avatarStore.openEditor('ACHIEVEMENTS')"
    >
      <span class="avatar-unseen-cta__icon" aria-hidden="true">🎉</span>
      <span>
        Você desbloqueou {{ unseenItems.length }}
        {{ unseenItems.length === 1 ? "item novo" : "itens novos" }}! Toque para ver ✨
      </span>
    </button>
    <NuxtLink
      v-if="showProfileNudge"
      to="/account"
      class="profile-nudge-cta"
    >
      <span class="profile-nudge-cta__icon" aria-hidden="true">📋</span>
      <span>
        Seu cadastro está incompleto{{
          profileAchievement?.rewardItem
            ? ` — complete e ganhe ${profileAchievement.rewardItem.name}`
            : ""
        }}. Toque para completar
      </span>
    </NuxtLink>
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

.avatar-unseen-cta {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 0;
  border-radius: 1rem;
  background: var(--hemo-color-primary);
  box-shadow: 0 3px 0 var(--hemo-color-primary-dark);
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 0.86rem;
  font-weight: 800;
  line-height: 1.25;
  text-align: left;
  animation: avatar-cta-breathe 2.8s ease-in-out infinite;
}

.avatar-unseen-cta:hover {
  background: var(--hemo-color-primary-dark);
}

.avatar-unseen-cta:focus-visible {
  outline: 3px solid var(--hemo-color-primary-light);
  outline-offset: 3px;
}

.avatar-unseen-cta__icon {
  flex: 0 0 auto;
  font-size: 1.35rem;
}

.profile-nudge-cta {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 2px solid var(--hemo-color-warn);
  border-radius: 1rem;
  background: var(--yellow-light);
  color: var(--black-100);
  cursor: pointer;
  font-size: 0.86rem;
  font-weight: 700;
  line-height: 1.25;
  text-align: left;
  text-decoration: none;
}

.profile-nudge-cta:hover {
  background: #f3dfb8;
}

.profile-nudge-cta:focus-visible {
  outline: 3px solid var(--hemo-color-warn);
  outline-offset: 3px;
}

.profile-nudge-cta__icon {
  flex: 0 0 auto;
  font-size: 1.35rem;
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

@media (prefers-reduced-motion: reduce) {
  .avatar-unseen-cta {
    animation: none;
  }
}

@keyframes avatar-cta-breathe {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.015);
  }
}
</style>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAvatarStore } from "~/stores/avatar";
import { useUserStore } from "~/stores/user";
const userStore = useUserStore();
const avatarStore = useAvatarStore();
const userData = userStore.userWithMetrics;
const { unseenItems, achievements } = storeToRefs(avatarStore);

const ableToDonate = computed(
  () => userStore.userDonationStatus.status === "able-to-donate"
);

const profileAchievement = computed(() =>
  achievements.value.find((a) => a.key === "cadastro_completo")
);
const showProfileNudge = computed(
  () => profileAchievement.value?.unlocked === false
);

const description = computed(() =>
  [userStore.userAge, userStore.userReadableGender].filter(Boolean).join(", ")
);
</script>
