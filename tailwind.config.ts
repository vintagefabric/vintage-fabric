import type { Config } from "tailwindcss";

/**
 * Brand tokens are locked from the logo / visiting card (plan §1).
 *   wine  #702040  primary  — header, brand bar, footer, headings
 *   gold  #D09030  accent   — rules, the "V" monogram, highlights
 *   ivory #F4F0DC  light    — text on wine, soft backgrounds
 *   ink   #2C2A2C  body text
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        wine: {
          DEFAULT: "#702040",
          dark: "#5a1a33",
          light: "#8a2c52",
        },
        gold: {
          DEFAULT: "#D09030",
          dark: "#a8721f",
          light: "#e0a850",
        },
        // Cream warm-white tones for large light surfaces (premium, not yellow).
        cream: {
          DEFAULT: "#FBF9F5",
          dark: "#F3EFE7",
        },
        // Ivory stays warm cream for text/accents ON the wine sections.
        ivory: {
          DEFAULT: "#F6F1E4",
          dark: "#e8e2c4",
        },
        ink: {
          DEFAULT: "#2C2A2C",
          soft: "#5b5760",
        },
        // Subtle warm hairline border for cards on cream.
        line: "#ECE6DA",
      },
      fontFamily: {
        // Display = elegant serif (matches the logo's italic wordmark).
        // Sans = Inter for body. Wired up via next/font in layout.tsx.
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      boxShadow: {
        // Soft, premium elevation (lighter and more diffuse than before).
        card: "0 10px 40px -18px rgba(44, 42, 44, 0.18)",
        "card-hover": "0 18px 50px -20px rgba(112, 32, 64, 0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
