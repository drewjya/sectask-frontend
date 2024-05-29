import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        green: {
          50: "#EFFDF5",
          100: "#D9FBE8",
          200: "#B3F5D1",
          300: "#75EDAE",
          400: "#00DC82",
          500: "#00C16A",
          600: "#00A155",
          700: "#007F45",
          800: "#016538",
          900: "#0A5331",
          950: "#052e16",
        },
        utama: {
          50: "#F2F2F2",
          100: "#DBDBDB",
          200: "#B5B5B5",
          300: "#8F8F8F",
          400: "#696969",
          500: "#434343",
          600: "#1D1D1D",
          700: "#000000",
          800: "#000000",
          900: "#000000",
          950: "#000000",
        },
      },
      flex: {
        "2": "2 2 0%",
      },
    },
  },

  plugins: [require("@tailwindcss/typography")],
};
