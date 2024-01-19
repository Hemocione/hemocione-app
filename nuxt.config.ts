import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  css: ["assets/css/globals.css"],
  modules: ["@nuxtjs/google-fonts"],
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
});
