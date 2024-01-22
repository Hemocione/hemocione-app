<template>
  <NuxtLayout v-if="loggedIn && teuPaiLiberou">
    <NuxtPage />
  </NuxtLayout>
  <div class="hemocione-login-loading-wrapper" v-else>
    <NuxtImg src="/logos/principal-horizontal.svg" class="logo" />
    <ElButton
      v-if="attemptedAutoLogin && !loggedIn && teuPaiLiberou"
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
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const loggedIn = ref(false);
const attemptedAutoLogin = ref(false);
const config = useRuntimeConfig();
const urlToken = useRoute().query.token;
const teuPaiLiberou = ref(false);

useHead({ title: "Hemocione" });

const evaluateCurrentLogin = async () => {
  const currentUserCookie = useCookie(config.public.authLocalKey);
  const currentUserLocalStorage = localStorage.getItem(
    config.public.authLocalKey
  );

  const currentUserToken = currentUserCookie.value || currentUserLocalStorage;
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
      // always update local storage, unless it came from cookie - then update it as well
      localStorage.setItem(config.public.authLocalKey, newToken);
      console.log("new token", newToken);
      await userStore.setToken(newToken);
      console.log("new token", newToken);
      if (currentUserCookie.value) {
        currentUserCookie.value = newToken;
      }

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

// wait 3 seconds before doing anything
setTimeout(async () => {
  teuPaiLiberou.value = true;
  if (urlToken) {
    localStorage.setItem(config.public.authLocalKey, String(urlToken));
    await userStore.setToken(String(urlToken));
    loggedIn.value = true;
    window.history.replaceState({}, document.title, window.location.pathname);
  } else {
    await evaluateCurrentLogin();
    if (!loggedIn.value) {
      await doLogin();
      await evaluateCurrentLogin();
    }
  }
}, 1000);
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
