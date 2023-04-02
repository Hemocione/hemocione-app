import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  css: ["assets/css/globals.css"],
  buildModules: ["@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      Lato: true,
      Roboto: true,
    },
  },
});
