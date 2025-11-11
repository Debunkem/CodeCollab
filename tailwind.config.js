/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      // 1. Tell Tailwind to use "Space Mono" as the default monospaced font
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
      },
      // 2. We remove the old 'aurora' animations
      animation: {},
      keyframes: {},
    },
  },
  plugins: [],
};