/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        display: ['"Playfair Display"', "serif"],
      },
      colors: {
        ink: {
          50: "#f8f8f7",
          100: "#efeeec",
          200: "#dad7d2",
          300: "#bcb6ac",
          400: "#928a7c",
          500: "#6f6759",
          600: "#534d42",
          700: "#3d3933",
          800: "#272421",
          900: "#15130f",
        },
        accent: {
          50: "#fdf6ef",
          100: "#f7e2c8",
          200: "#ecbd87",
          300: "#dd9550",
          400: "#cf7727",
          500: "#b85f1a",
          600: "#974914",
          700: "#783911",
          800: "#5a2b0f",
          900: "#3d1d0a",
        },
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 8px 24px -8px rgb(0 0 0 / 0.10)",
        ring: "0 0 0 4px rgb(207 119 39 / 0.15)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
