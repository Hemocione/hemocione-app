<template>
  <ElConfigProvider :locale="ptBr">
    <NuxtLayout v-if="loggedIn">
      <NuxtPage />
    </NuxtLayout>
    <div class="hemocione-login-loading-wrapper" v-else>
      <img src="/logos/baseLogo.svg" class="logo" />
      <ElButton
        :disabled="!attemptedLogin || loggedIn"
        @click="doLogin"
        type="primary"
        size="large"
        :loading="!attemptedLogin"
      >
        {{ !attemptedLogin ? "Entrando..." : "Entrar" }}
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

const attemptedLogin = ref(Boolean(noAuto));
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { App } from "@capacitor/app";
import type { URLOpenListenerEvent } from "@capacitor/app";

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

const navigateAfterLogin = ref<string | null>(null);
const confirmLogin = async () => {
  await Browser.removeAllListeners();
  loggedIn.value = true;
  if (navigateAfterLogin.value) {
    navigateTo(navigateAfterLogin.value);
  }
};

App.addListener("appUrlOpen", async function (event: URLOpenListenerEvent) {
  const url = new URL(event.url);
  if (url.protocol.includes("http")) {
    // deep link origin
    const path = url.pathname;
    const slug = path + url.search;
    navigateAfterLogin.value = slug;
  }

  const token = url.searchParams.get("token");
  if (token) {
    attemptedLogin.value = false;
    await evaluateCurrentLogin(token);
  }
});

const evaluateCurrentLogin = async (enforcedToken?: string) => {
  const currentUserCookie = useCookie(config.public.authLocalKey, {
    domain: config.public.cookieDomain,
  });
  const currentUserLocalToken = (
    await Preferences.get({
      key: config.public.authLocalKey,
    })
  ).value;

  // prefer local storage over cookie
  const currentUserToken =
    enforcedToken || currentUserLocalToken || currentUserCookie.value;
  if (currentUserToken && (enforcedToken || !noAuto)) {
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
      confirmLogin();
    } catch (e) {
      console.error(e);
    } finally {
      attemptedLogin.value = true;
    }
    if (attemptedLogin.value && !loggedIn.value) {
      userStore.$reset();
      await Preferences.remove({ key: config.public.authLocalKey });
    }
  }

  if (!loggedIn.value && !noAuto) {
    doLogin();
  }
};

const doLogin = async () => {
  const baseUrl = `${config.public.hemocioneIdUrl}/?redirect=`;
  if (!Capacitor.isNativePlatform()) {
    const url = `${baseUrl}${encodeURIComponent(window.location.href)}`;
    await Browser.open({ url, toolbarColor: "#bb0a08", windowName: "_self" });
    return;
  }

  const url = `${baseUrl}${encodeURIComponent(
    "br.com.hemocione.app://app.hemocione.com.br/"
  )}`;
  Browser.addListener("browserFinished", async () => {
    attemptedLogin.value = true;
  });
  await Browser.open({ url, toolbarColor: "#bb0a08", windowName: "_self" });
};

if (urlToken) {
  await Preferences.set({
    key: config.public.authLocalKey,
    value: String(urlToken),
  });
  await userStore.setToken(String(urlToken));
  confirmLogin();
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

.header {
  position: fixed;
  top: 0;
  z-index: 2;
  height: var(--navbar-size);
  width: 100%;
}
</style>
