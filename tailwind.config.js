// tailwind.config.js
/** @type {import('tailwindcss').Config} */
const tailwindcssAnimate = require("tailwindcss-animate");

module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [tailwindcssAnimate],
};
