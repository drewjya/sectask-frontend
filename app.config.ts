export default defineAppConfig({
  ui: {
    primary: "blue",
    gray: "slate",

    icons: {
      dynamic: true,
    },

    avatar: {
      wrapper: "border border-gray-300 dark:border-gray-600",
    },

    modal: {
      overlay: {
        background: "bg-gray-800/75",
      },
    },

    skeleton: {
      background: "bg-gray-300 dark:bg-gray-700",
      rounded: "rounded",
    },

    card: {
      body: { padding: "px-4 py-5 sm:p-4" },
      header: { padding: "px-4 py-5 sm:px-4" },
      footer: { padding: "px-4 py-5 sm:px-4" },
    },
  },
});
