import { defineNuxtConfig } from "nuxt/config";

const getSiteUrl = () => {
  if (process.env.VERCEL_ENV === "development") {
    return "https://app.d.hemocione.com.br";
  }

  if (process.env.VERCEL_ENV === "preview") {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.VERCEL_ENV === undefined) {
    return "http://localhost:3000";
  }

  return "https://app.hemocione.com.br";
};

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      hemocioneIdApiUrl:
        process.env.NUXT_HEMOCIONE_ID_API_URL ||
        "https://hemocione-id-dev.cpt.hemocione.com.br",
      hemocioneIdUrl:
        process.env.NUXT_HEMOCIONE_ID_URL || "https://id.d.hemocione.com.br",
      authLocalKey: process.env.NUXT_AUTH_LOCAL_KEY || "devHemocioneId",
      userDataLocalKey: "userData",
      siteUrl: getSiteUrl(),
    },
  },
  ssr: false,
  css: ["assets/css/globals.css", "assets/css/transitions.css"],
  modules: ["@nuxtjs/google-fonts", "@element-plus/nuxt", "@nuxt/image"],
  googleFonts: {
    families: {
      Roboto: [100, 300, 400, 500, 700, 900],
    },
  },
  app: {
    layoutTransition: { name: "layout", mode: "out-in" },
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  image: {
    domains: ["cdn.hemocione.com.br"],
    alias: {
      cdn: "https://cdn.hemocione.com.br",
    },
  },
  nitro: {
    preset: "vercel",
  },
});
