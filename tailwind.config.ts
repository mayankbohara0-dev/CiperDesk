import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          50: "#EEEDFB",
          100: "#D4D2F6",
          200: "#A9A5EE",
          300: "#7E78E5",
          400: "#6660EC",
          500: "#4F46E5",
          600: "#3730B3",
          700: "#2A2487",
          800: "#1C185A",
          900: "#0E0C2D",
        },
        accent: {
          DEFAULT: "#22D3EE",
          50: "#E8FBFE",
          100: "#BAF3FB",
          200: "#7DEAF7",
          300: "#40E0F3",
          400: "#22D3EE",
          500: "#0EA5C9",
          600: "#0C83A1",
          700: "#096178",
          800: "#063E50",
          900: "#031F28",
        },
        danger: "#EF4444",
        dark: {
          DEFAULT: "#0F172A",
          50: "#1E293B",
          100: "#334155",
          200: "#475569",
          300: "#64748B",
        },
        surface: {
          DEFAULT: "#1E293B",
          muted: "#0F172A",
          raised: "#263248",
          border: "#334155",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "cipher-gradient": "linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)",
        "dark-mesh": "radial-gradient(at 40% 20%, hsla(228,100%,74%,0.05) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.05) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.03) 0px, transparent 50%)",
      },
      boxShadow: {
        "glow-primary": "0 0 20px rgba(79, 70, 229, 0.3)",
        "glow-accent": "0 0 20px rgba(34, 211, 238, 0.3)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 40px rgba(0, 0, 0, 0.6)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
