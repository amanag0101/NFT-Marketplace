import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      spacing: {
        xsmall: "0.25rem",
        small: "0.5rem",
        medium: "1rem",
        large: "2rem",
        xlarge: "4rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        green: "#22c35d",
        gray: "#566377",
        red: "#e0403d",

        "primary-100-light": "#f8f8f8",
        "primary-200-light": "#ffffff",
        "primary-300-light": "#e5e5e5",
        "txt-primary-light": "#193251",
        "txt-secondary-light": "#34aae1",
        "hover-bg-light": "#f2f2f2",
        "focus-border-light": "#34aae1",
        "active-light": "#34aae1",

        "primary-100-dark": "#181818",
        "primary-200-dark": "#1f1f1f",
        "primary-300-dark": "#313131",
        "txt-primary-dark": "#ffffff",
        "txt-secondary-dark": "#34aae1",
        "hover-bg-dark": "#2a2d2e",
        "focus-border-dark": "#34aae1",
        "active-dark": "#34aae1",
      },
    },
  },
  plugins: [],
};

export default config;
