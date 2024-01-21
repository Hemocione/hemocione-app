import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
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
});
