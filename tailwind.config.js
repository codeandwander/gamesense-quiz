/** @type {import('tailwindcss').Config} */
module.exports = {
  important: "#quiz-app",
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'fort': ['Fort', 'sans-serif'],
        'gameSense-hand': ['GameSense-Hand', 'sans-serif'],
      },
    },
  },
  corePlugins: {
    preflight: false,
  }
}