<template>
  <NuxtPwaManifest />
  <ElConfigProvider :locale="ptBr">
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
      await useAsyncData("setUserToken", () => userStore.setToken(newToken));
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
  if (!loggedIn.value) {
    doLogin();
  }
};

const doLogin = () => {
  window.location.href = `${config.public.hemocioneIdUrl}/?redirect=${window.location.href}`;
};

if (urlToken) {
  localStorage.setItem(config.public.authLocalKey, String(urlToken));
  await useAsyncData("setUserToken", () =>
    userStore.setToken(String(urlToken))
  );
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
