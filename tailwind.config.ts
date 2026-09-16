import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./games/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0F2D3A", // used by the dark share card
        teal: "#1FA39C",
        tealdeep: "#0F7A74", // for buttons needing white text
        gold: "#FFB627",
        coral: "#FF6B6B",
        sky: "#C7D9EB",
        paper: "#F2F4F7",
        cream: "#FFF7EF",
        ink: "#17323B",
      },
      fontFamily: {
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
