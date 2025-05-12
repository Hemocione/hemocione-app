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
      oneSignalAppId: process.env.NUXT_ONE_SIGNAL_APP_ID,
      cookieDomain: process.env.NUXT_COOKIE_DOMAIN || "hemocione.com.br",
      hemocioneIdApiUrl:
        process.env.NUXT_HEMOCIONE_ID_API_URL ||
        "https://hemocione-id.cpt.hemocione.com.br",
      hemocioneIdUrl:
        process.env.NUXT_HEMOCIONE_ID_URL || "https://id.hemocione.com.br",
      authLocalKey: process.env.NUXT_AUTH_LOCAL_KEY || "hemocioneId",
      userDataLocalKey: "userData",
      siteUrl: getSiteUrl(),
      eventsUrl:
        process.env.NUXT_EVENTS_URL || "https://eventos.hemocione.com.br",
      competitionsUrl:
        process.env.NUXT_COMPETITIONS_URL || "https://copa.hemocione.com.br",
      whereToDonateUrl:
        process.env.NUXT_WHERE_TO_DONATE_URL ||
        "https://ondedoar.hemocione.com.br",
      canDonateUrl:
        process.env.NUXT_CAN_DONATE_URL || "https://possodoar.hemocione.com.br",
      testUrl: process.env.NUXT_TEST_URL || "https://wxmmdm-5173.csb.app",
      posthogPublicKey: process.env.NUXT_POSTHOG_PUBLIC_KEY || "",
      posthogHost: process.env.NUXT_POSTHOG_HOST || "https://us.i.posthog.com",
    },
  },

  ssr: false,

  css: [
    "assets/css/globals.css",
    "assets/css/transitions.css",
    "assets/css/animations.css",
  ],

  modules: [
    "@nuxtjs/google-fonts",
    "@element-plus/nuxt",
    "@pinia/nuxt",
    "nuxt-vercel-analytics",
    "@zadigetvoltaire/nuxt-well-known",
    "@vueuse/nuxt",
    "@formkit/auto-animate/nuxt",
  ],

  googleFonts: {
    families: {
      Lato: [100, 300, 400, 700, 900],
    },
  },

  app: {
    pageTransition: { name: "blur", mode: "out-in", appear: true },
  },

  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
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
        path: "apple-app-site-association",
        content: JSON.stringify({
          applinks: {
            apps: [],
            details: [
              {
                appID: "JGY96PPKZK.br.com.hemocione.app",
                paths: ["*"],
              },
            ],
          },
        }),
      },
      {
        path: "assetlinks.json",
        content: JSON.stringify([
          {
            relation: [
              "delegate_permission/common.handle_all_urls",
              "delegate_permission/common.get_login_creds",
            ],
            target: {
              namespace: "android_app",
              package_name: "br.com.hemocione.app",
              sha256_cert_fingerprints: [
                "14:05:77:CA:7C:70:36:FA:58:45:05:80:7D:C7:87:AC:C7:C4:49:B3:CB:79:C6:BC:56:6E:97:42:9D:D1:2C:4D",
                "5D:9A:87:BF:EE:BF:D5:CF:71:CA:F8:3F:52:34:12:7C:68:53:AA:7A:E7:07:24:33:CD:9C:24:BF:0D:34:8B:D4",
              ],
            },
          },
        ]),
      },
    ],
  },

  compatibilityDate: "2025-05-07",
});
