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

const isProduction = process.env.VERCEL_ENV === "production";

export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      cookieDomain: process.env.NUXT_COOKIE_DOMAIN || "hemocione.com.br",
      hemocioneIdApiUrl:
        process.env.NUXT_HEMOCIONE_ID_API_URL ||
        "https://hemocione-id-dev.cpt.hemocione.com.br",
      hemocioneIdUrl:
        process.env.NUXT_HEMOCIONE_ID_URL || "https://id.d.hemocione.com.br",
      authLocalKey: process.env.NUXT_AUTH_LOCAL_KEY || "devHemocioneId",
      userDataLocalKey: "userData",
      siteUrl: getSiteUrl(),
      eventsUrl:
        process.env.NUXT_EVENTS_URL || "https://eventos.hemocione.com.br",
      competitionsUrl:
        process.env.NUXT_COMPETITIONS_URL ||
        "https://competicao.hemocione.com.br",
    },
  },
  css: [
    "assets/css/globals.css",
    "assets/css/transitions.css",
    "assets/css/animations.css",
  ],
  modules: [
    "@nuxtjs/google-fonts",
    "@element-plus/nuxt",
    "@nuxt/image",
    "@pinia/nuxt",
    "@vite-pwa/nuxt",
    "nuxt-vercel-analytics",
  ],
  googleFonts: {
    families: {
      Roboto: [100, 300, 400, 500, 700, 900],
    },
  },
  app: {
    layoutTransition: { name: "layout", mode: "out-in" },
    pageTransition: { name: "blur", mode: "out-in", appear: true },
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
  future: {
    typescriptBundlerResolution: true,
  },
  experimental: {
    payloadExtraction: true,
    watcher: "parcel",
  },
  imports: {
    autoImport: true,
  },
  appConfig: {
    // you don't need to include this: only for testing purposes
    buildDate: new Date().toISOString(),
  },
  // TODO: use custom service worker to handle web push and ADD PWA
  pwa: {
    // registerType: "autoUpdate",
    // manifest: {
    //   name: "Hemocione",
    //   short_name: "Hemocione",
    //   theme_color: "#bb0a08",
    //   background_color: "#F9F9FA",
    //   icons: [
    //     {
    //       src: "pwa/pwa-64x64.png",
    //       sizes: "64x64",
    //       type: "image/png",
    //     },
    //     {
    //       src: "pwa/pwa-192x192.png",
    //       sizes: "192x192",
    //       type: "image/png",
    //     },
    //     {
    //       src: "pwa/pwa-512x512.png",
    //       sizes: "512x512",
    //       type: "image/png",
    //     },
    //     {
    //       src: "pwa/apple-touch-icon-180x180.png",
    //       sizes: "180x180",
    //       type: "image/png",
    //     },
    //     {
    //       src: "pwa/maskable-icon-512x512.png",
    //       sizes: "512x512",
    //       type: "image/png",
    //       purpose: "maskable",
    //     },
    //   ],
    //   description:
    //     "App do Hemocione - a maior rede de doadores de sangue do Brasil. Acompanhe suas doações, veja quantas vidas salvou, participe de eventos e campanhas de doação de sangue e muito mais!",
    //   // TODO: add screenshots
    // },
    // workbox: {
    //   globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    // },
    // client: {
    //   installPrompt: true,
    //   // you don't need to include this: only for testing purposes
    //   // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
    //   periodicSyncForUpdates: isProduction ? 3600 : 20,
    // },
    // devOptions: {
    //   enabled: true,
    //   suppressWarnings: true,
    //   navigateFallbackAllowlist: [/^\/$/],
    //   type: "module",
    // },
  },
});
