// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  modules: [
    "@vueuse/nuxt",
    ["@pinia/nuxt", { autoImports: ["defineStore", "defineStore"] }],
    "dayjs-nuxt",
    "@nuxt/ui",
    "@samk-dev/nuxt-vcalendar",
    "@nuxtjs/google-fonts",
    "@nuxt/image",
  ],
  devServer: {
    port: 8800,
  },
  spaLoadingTemplate: "spa-loading-template.html",
  css: [
    "@/assets/app.css",
    "vue-advanced-cropper/dist/style.css",
    "vue-advanced-cropper/dist/theme.compact.css",
  ],
  googleFonts: {
    prefetch: true,
    families: {
      Lato: [100, 200, 300, 400, 500, 600, 700],
      "DM Sans": [100, 200, 300, 400, 500, 600, 700],
    },
  },
  ui: {
    safelistColors: ["red", "green", "blue", "white", "gray", "slate", "orage"],
  },

  imports: {
    dirs: ["stores", "utils", "types"],
  },

  dayjs: {
    plugins: [
      "isSameOrAfter",
      "isSameOrBefore",
      "isBetween",
      "isToday",
      "customParseFormat",
      "relativeTime",
      "utc",
      "timezone",
    ],
  },
  colorMode: { preference: "dark", fallback: "light", classSuffix: "" },
  app: {
    head: {
      title: "Notix",
      viewport: "width=device-width,initial-scale=1",
      link: [
        { rel: "icon", href: "/favicon.ico", sizes: "any" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap",
        },
      ],
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        { name: "description", content: "learn-it applicaion" },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black-translucent",
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      REFRESH_TOKEN_KEY: "NOTIX_REFRESHTOKEN_STORAGE_KEY",
      API_BASE_URL: "http://localhost:3000/api",
      WS_BASE_URL: "http://localhost:3000/event",
      FILE_URL: "http://localhost:3000/img/",
      FILE_MAX_SIZE: 5_000_000, // 5MB
    },
  },
});
