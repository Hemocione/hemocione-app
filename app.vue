<template>
  <ElConfigProvider :locale="ptBr">
    <HemocioneHeader class="header" v-show="userStore.loggedIn" size="10" />
    <NuxtLayout v-if="userStore.loggedIn">
      <div id="iframe-page-wrapper" style="display: none" />
      <NuxtPage />
    </NuxtLayout>
    <div class="hemocione-login-loading-wrapper" v-else>
      <img src="/logos/baseLogo.svg" class="logo" />
      <ElButton
        :disabled="!attemptedLogin || userStore.loggedIn || executingLogin"
        @click="doLogin"
        type="primary"
        size="large"
        :loading="!attemptedLogin || executingLogin"
      >
        {{ loginButtonText }}
      </ElButton>
    </div>
  </ElConfigProvider>
</template>

<script lang="ts" setup>
import "dayjs/locale/pt-br";
import ptBr from "element-plus/dist/locale/pt-br.mjs";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const config = useRuntimeConfig();
const route = useRoute();
const { token: urlToken, noAuto } = route.query;

const attemptedLogin = ref(Boolean(noAuto));
const executingLogin = ref(false);
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { App } from "@capacitor/app";
import type { URLOpenListenerEvent } from "@capacitor/app";
import OneSignal from "onesignal-cordova-plugin";

useHead({
  title: "Hemocione",
  meta: [
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no",
    },
    {
      name: "description",
      content:
        "Plataforma de doação de sangue do Hemocione. Acompanhe suas doações de sangue, seja notificado quando puder doar novamente e muito mais! 🩸",
    },
  ],
});

if (Capacitor.isNativePlatform() && config.public.oneSignalAppId) {
  OneSignal.initialize(config.public.oneSignalAppId);
}

OneSignal.Notifications.addEventListener("click", async (event) => {
  const url = event.notification.launchURL;
  if (url) {
    const parsedUrl = new URL(url);
    await handleLoginFlowForUrl(parsedUrl);
  }
});

const navigateAfterLogin = ref<string | null>(null);

let loginEvaluatedOnLoginFlow = false;
const handleLoginFlowForUrl = async (url: URL) => {
  if (url.protocol.includes("http")) {
    // deep link origin
    const path = url.pathname;
    const slug = path + url.search;
    navigateAfterLogin.value = slug;
  }

  // TODO: handle own app deeplinks in the future maybe
  const token = url.searchParams.get("token");
  if (token && !loginEvaluatedOnLoginFlow) {
    executingLogin.value = true;
    attemptedLogin.value = false;
    loginEvaluatedOnLoginFlow = true;
    await evaluateCurrentLogin(token);
  }
};

const recheckAppOpenedUrl = async () => {
  if (navigateAfterLogin.value) {
    return;
  }

  const appLaunchUrl = await App.getLaunchUrl();

  if (appLaunchUrl?.url) {
    const url = appLaunchUrl.url;
    const parsedUrl = new URL(url);
    await handleLoginFlowForUrl(parsedUrl);
  }
};

const confirmLogin = async () => {
  await Browser.removeAllListeners();
  await recheckAppOpenedUrl();
  if (navigateAfterLogin.value) {
    navigateTo(navigateAfterLogin.value);
  }
};

App.addListener("appUrlOpen", async function (event: URLOpenListenerEvent) {
  // IOS NEVER GETS HERE :((
  await Browser.close(); // ensure browser is closed. IOS doesn't close it automatically as android does
  const url = new URL(event.url);
  await handleLoginFlowForUrl(url);
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
      await confirmLogin();
    } catch (e) {
      console.error(e);
    } finally {
      attemptedLogin.value = true;
      executingLogin.value = false;
    }
    if (attemptedLogin.value && !userStore.loggedIn) {
      userStore.$reset();
      await Preferences.remove({ key: config.public.authLocalKey });
    }
  }

  if (!userStore.loggedIn && !noAuto) {
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

  const url =
    Capacitor.getPlatform() === "ios"
      ? `${baseUrl}${encodeURIComponent("apphemocione:auth")}`
      : `${baseUrl}${encodeURIComponent(
          "br.com.hemocione.app://app.hemocione.com.br/"
        )}`;
  Browser.addListener("browserFinished", async () => {
    attemptedLogin.value = true;
  });
  await Browser.open({
    url,
    toolbarColor: "#bb0a08",
    windowName: "_self",
    presentationStyle: "popover",
  });
};

const loginButtonText = computed(() => {
  if (executingLogin.value || !attemptedLogin.value) {
    return "Entrando...";
  }

  return "Entrar";
});

if (urlToken) {
  executingLogin.value = true;
  await Preferences.set({
    key: config.public.authLocalKey,
    value: String(urlToken),
  });
  await userStore.setToken(String(urlToken));
  await confirmLogin();
  executingLogin.value = false;
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

#iframe-page-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
