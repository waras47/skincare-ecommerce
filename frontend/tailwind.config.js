/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cabin", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#fdf2f3",
          100: "#fbe4e7",
          200: "#f6c8ce",
          300: "#efa3ac",
          400: "#ea8690",
          500: "#e56574",
          600: "#d84d5d",
          700: "#c13646",
          800: "#9f2a38",
          900: "#7a212c",
        },
      },
    },
  },
  plugins: [],
};
