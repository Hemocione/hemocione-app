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
        process.env.NUXT_COMPETITIONS_URL || "https://copa.hemocione.com.br",
    },
  },
  routeRules: {
    "**": { ssr: false },
    "/.well-known/**": { ssr: true },
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
    "nuxt-vercel-analytics",
    "@zadigetvoltaire/nuxt-well-known",
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
  wellKnown: {
    devtools: true,
    contentUris: [
      {
        path: "apple-developer-merchantid-domain-association",
        content: "merchantid",
      },
      {
        path: "assetlinks.json",
        content: JSON.stringify([
          {
            relation: ["delegate_permission/common.handle_all_urls"],
            target: {
              namespace: "android_app",
              package_name: "br.com.hemocione.app",
              sha256_cert_fingerprints: [
                "C3:04:BD:47:17:D4:29:76:D1:6D:CC:F1:FC:F3:99:A1:40:04:AA:DE:41:A7:A0:53:7F:20:65:1A:29:8C:16:1D",
              ],
            },
          },
        ]),
      },
    ],
  },
});
