import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bamboo: {
          green: "#4a7c59",
          "green-dark": "#3a6347",
          brown: "#8b6914",
          "brown-light": "#a07d2e",
          cream: "#faf7f0",
          "cream-dark": "#f0ebe0",
        },
      },
    },
  },
  plugins: [],
};
export default config;
