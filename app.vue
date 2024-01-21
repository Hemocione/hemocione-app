<template>
  <NuxtLayout v-if="loggedIn">
    <NuxtPage />
  </NuxtLayout>
  <div class="hemocione-login-loading-wrapper" v-else>
    <NuxtImg src="/logos/principal-horizontal.svg" class="logo" />
    <ElButton
      v-if="attemptedAutoLogin && !loggedIn"
      @click="doLogin"
      type="primary"
      size="large"
    >
      Entrar
    </ElButton>
  </div>
</template>

<script lang="ts" setup>
import { Browser } from "@capacitor/browser";
const loggedIn = ref(false);
const attemptedAutoLogin = ref(false);
const config = useRuntimeConfig();
const urlToken = useRoute().query.token;
useHead({ title: "Hemocione" });

const evaluateCurrentLogin = async () => {
  const currentUserCookie = useCookie(config.public.authLocalKey);
  const currentUserLocalStorage = localStorage.getItem(
    config.public.authLocalKey
  );

  const currentUserToken = currentUserCookie.value || currentUserLocalStorage;
  console.log("currentUserToken", currentUserToken);
  if (currentUserToken) {
    try {
      const { data }: { data: Ref<{ token: string; user: any }> } =
        await useFetch(
          `${config.public.hemocioneIdApiUrl}/users/regenerate-token`,
          {
            headers: {
              Authorization: `Bearer ${currentUserToken}`,
            },
          }
        );
      const newToken = data.value.token;
      localStorage.setItem(config.public.authLocalKey, newToken);
      loggedIn.value = true;
    } catch (e) {
      console.error(e);
    } finally {
      attemptedAutoLogin.value = true;
    }
    if (attemptedAutoLogin.value && !loggedIn.value) {
      localStorage.removeItem(config.public.authLocalKey);
    }
  }
};

Browser.addListener("browserFinished", async () => {
  await evaluateCurrentLogin();
});

const doLogin = async () => {
  await Browser.open({
    url: encodeURI(
      `${config.public.hemocioneIdUrl}/?redirect=${window.location.href}`
    ),
    windowName: "_self",
    toolbarColor: "#bb0a08",
  });
};

if (urlToken) {
  localStorage.setItem(config.public.authLocalKey, String(urlToken));
  loggedIn.value = true;
  window.history.replaceState({}, document.title, window.location.pathname);
} else {
  await evaluateCurrentLogin();
  if (!loggedIn.value) {
    await doLogin();
    await evaluateCurrentLogin();
  }
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
  width: 80%;
  height: auto;
}
</style>
