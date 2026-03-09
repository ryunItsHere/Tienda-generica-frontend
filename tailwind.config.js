/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Syne", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#090C10",
          900: "#0E1117",
          800: "#161B24",
          700: "#1E2533",
          600: "#28334A",
          500: "#3A4D6B",
          400: "#5A7396",
        },
        accent: { 500: "#3B82F6", 400: "#60A5FA", 300: "#93C5FD" },
        jade: { 500: "#10B981", 400: "#34D399" },
        amber: { 500: "#F59E0B", 400: "#FBBF24" },
        rose: { 500: "#EF4444", 400: "#F87171" },
        surface: { 100: "#F8FAFC", 200: "#F1F5F9", 300: "#E2E8F0" },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,.06), 0 4px 16px 0 rgba(0,0,0,.04)",
        "card-hover": "0 4px 20px 0 rgba(0,0,0,.10)",
        sidebar: "4px 0 24px 0 rgba(0,0,0,.25)",
      },
    },
  },
  plugins: [],
};
