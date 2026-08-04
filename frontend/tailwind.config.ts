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
        accentYellow: "#ecad0a",
        goldenPrimary: "#d4a373",
        boldSecondary: "#4361ee",
        darkNavy: "#032147",
        grayText: "#888888",
        surfaceNavy: "#021630",
        cardNavy: "#082a56",
        borderNavy: "#0d386f",
      },
    },
  },
  plugins: [],
};

export default config;
