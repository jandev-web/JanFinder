import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        drawCircle: {
          'to': { strokeDashoffset: '0' },
        },
        drawCheck: {
          'to': { strokeDashoffset: '0', opacity: '1' },
        },
        fadeIn: {
          'to': { opacity: '1' },
        },
      },
      animation: {
        drawCircle: 'drawCircle 1s forwards',
        drawCheck: 'drawCheck 0.5s forwards',
        fadeIn: 'fadeIn 0.5s forwards',
      },
    },
  },
  plugins: [],
};
export default config;

