/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "3rem",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Inter"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ['"Cormorant Garamond"', '"Playfair Display"', "Georgia", "serif"],
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
      },
      fontSize: {
        // Fluid sizes for headings
        "fluid-h1": ["clamp(2.25rem, 5vw + 0.5rem, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "fluid-h2": ["clamp(1.75rem, 3vw + 0.5rem, 3rem)", { lineHeight: "1.1",  letterSpacing: "-0.015em" }],
        "fluid-h3": ["clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem)", { lineHeight: "1.2" }],
        "hero":   ["clamp(2.75rem, 7vw + 0.5rem, 6.25rem)", { lineHeight: "1.0", letterSpacing: "-0.025em" }],
      },
      colors: {
        ink: {
          50:  "#fbfaf7",
          100: "#f3f1ec",
          200: "#e3dfd6",
          300: "#c4beb1",
          400: "#928c7d",
          500: "#6e6759",
          600: "#4f493e",
          700: "#36312a",
          800: "#1f1c18",
          900: "#0f0d0a",
        },
        // Champagne / muted gold — quiet luxury
        accent: {
          50:  "#fbf6ec",
          100: "#f4ead0",
          200: "#e9d4a3",
          300: "#d9b974",
          400: "#c69b4e",
          500: "#b08236",
          600: "#8c6628",
          700: "#6a4d1f",
          800: "#4a3618",
          900: "#2d2110",
        },
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(15 13 10 / 0.04), 0 12px 32px -12px rgb(15 13 10 / 0.10)",
        lux:  "0 1px 2px 0 rgb(15 13 10 / 0.04), 0 24px 48px -16px rgb(15 13 10 / 0.18)",
        ring: "0 0 0 4px rgb(198 155 78 / 0.18)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      letterSpacing: {
        luxe: "0.22em",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s cubic-bezier(.22,.61,.36,1)",
        "shimmer": "shimmer 2.4s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { transform: "translateY(14px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-1200px 0" },
          "100%": { backgroundPosition: "1200px 0" },
        },
      },
    },
  },
  plugins: [],
};
