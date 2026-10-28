import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ekonnet: {
          bg: "#0B0F19",
          card: "#111827",
          cardHover: "#161F33",
          border: "#1F293D",
          blue: {
            DEFAULT: "#2563EB",
            light: "#3B82F6",
            dark: "#1D4ED8",
            cyan: "#06B6D4",
          },
          violet: {
            DEFAULT: "#7C3AED",
            light: "#8B5CF6",
            dark: "#6D28D9",
          },
          purple: {
            DEFAULT: "#9333EA",
            light: "#A855F7",
            dark: "#7E22CE",
          },
          accent: "#38BDF8",
          emerald: "#10B981",
          rose: "#F43F5E",
          amber: "#F59E0B"
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-glow": "radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.18) 0%, rgba(37, 99, 235, 0.12) 40%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
