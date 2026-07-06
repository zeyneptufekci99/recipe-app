/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#FFF8F0",
        surface: "#FFFFFF",

        primary: "#E85D04",
        primaryDark: "#C2410C",
        secondary: "#FAA307",

        text: "#2B2B2B",
        muted: "#7A7A7A",

        border: "#E8DED2",

        success: "#2F9E44",
        danger: "#D9480F",
        favorite: "#E03131",
      },
    },
  },
  plugins: [],
};
