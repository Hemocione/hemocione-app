import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  css: ["assets/css/globals.css"],
  buildModules: ["@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      Lato: [300, 500, 700, 900],
      Roboto: [300, 500, 700, 900],
    },
  },
  app: {
    layoutTransition: { name: "layout", mode: "out-in" },
  },
});
