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
const config = useRuntimeConfig();
const route = useRoute();
const { token: urlToken, noAuto } = route.query;
const attemptedAutoLogin = ref(Boolean(noAuto));
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

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
  const currentUserLocalToken = await Preferences.get({
    key: config.public.authLocalKey,
  });

  // prefer local storage over cookie
  const currentUserToken = currentUserLocalToken || currentUserCookie.value;
  if (currentUserToken && !noAuto) {
    try {
      await $fetch(`${config.public.hemocioneIdApiUrl}/users/validate-token`, {
        headers: {
          Authorization: `Bearer ${currentUserToken}`,
        },
      });
      await Preferences.set({
        key: config.public.authLocalKey,
        value: currentUserToken,
      });
      await userStore.setToken(currentUserToken);
      loggedIn.value = true;
    } catch (e) {
      console.error(e);
    } finally {
      attemptedAutoLogin.value = true;
    }
    if (attemptedAutoLogin.value && !loggedIn.value) {
      userStore.$reset();
      await Preferences.remove({ key: config.public.authLocalKey });
    }
  }

  if (!loggedIn.value && !noAuto) {
    doLogin();
  }
};

const doLogin = async () => {
  const url = `${config.public.hemocioneIdUrl}/?redirect=${window.location.href}`;
  if (!Capacitor.isNativePlatform()) {
    await Browser.open({ url, toolbarColor: "#bb0a08", windowName: "_self" });
    return;
  }

  Browser.addListener("browserFinished", async () => {
    await evaluateCurrentLogin();
    Browser.removeAllListeners();
  });
  await Browser.open({ url, toolbarColor: "#bb0a08", windowName: "_self" });
};

if (urlToken) {
  await Preferences.set({
    key: config.public.authLocalKey,
    value: String(urlToken),
  });
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
