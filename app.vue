<template>
  <ElConfigProvider :locale="ptBr">
    <NuxtLoadingIndicator color="#bb0a08" />
    <NuxtLayout v-if="loggedIn">
      <NuxtPage />
    </NuxtLayout>
    <div class="hemocione-login-loading-wrapper" v-else>
      <NuxtImg src="/logos/baseLogo.svg" class="logo" />
      <ElButton
        :disabled="!attemptedAutoLogin || loggedIn"
        @click="doLogin"
        type="primary"
        size="large"
        :loading="!attemptedAutoLogin"
      >
        {{ !attemptedAutoLogin ? "Entrando..." : "Entrar" }}
      </ElButton>
    </div>
  </ElConfigProvider>
</template>

<script lang="ts" setup>
import "dayjs/locale/pt-br";
import ptBr from "element-plus/dist/locale/pt-br.mjs";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const loggedIn = ref(false);
const attemptedAutoLogin = ref(false);
const config = useRuntimeConfig();
const urlToken = useRoute().query.token;

useHead({
  title: "Hemocione",
  meta: [
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
    },
    {
      name: "description",
      content:
        "Plataforma de doação de sangue do Hemocione. Acompanhe suas doações de sangue, seja notificado quando puder doar novamente e muito mais! 🩸",
    },
  ],
});

const evaluateCurrentLogin = async () => {
  const currentUserCookie = useCookie(config.public.authLocalKey, {
    domain: config.public.cookieDomain,
  });
  const currentUserLocalStorage = localStorage.getItem(
    config.public.authLocalKey
  );

  // prefer local storage over cookie
  const currentUserToken = currentUserLocalStorage || currentUserCookie.value;
  if (currentUserToken) {
    try {
      await $fetch(`${config.public.hemocioneIdApiUrl}/users/validate-token`, {
        headers: {
          Authorization: `Bearer ${currentUserToken}`,
        },
      });
      localStorage.setItem(config.public.authLocalKey, currentUserToken);
      await userStore.setToken(currentUserToken);
      loggedIn.value = true;
    } catch (e) {
      console.error(e);
    } finally {
      attemptedAutoLogin.value = true;
    }
    if (attemptedAutoLogin.value && !loggedIn.value) {
      userStore.$reset();
      localStorage.removeItem(config.public.authLocalKey);
    }
  }

  if (!loggedIn.value) {
    doLogin();
  }
};

const doLogin = () => {
  window.location.href = `${config.public.hemocioneIdUrl}/?redirect=${window.location.href}`;
};

if (urlToken) {
  localStorage.setItem(config.public.authLocalKey, String(urlToken));
  await userStore.setToken(String(urlToken));
  loggedIn.value = true;
  window.history.replaceState({}, document.title, window.location.pathname);
} else {
  evaluateCurrentLogin();
}
</script>

<style scoped>
.hemocione-login-loading-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 3em;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.logo {
  height: 300px;
  animation: zoom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
