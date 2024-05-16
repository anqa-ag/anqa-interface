// tailwind.config.js
import { colors, nextui } from "@nextui-org/react"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // ...
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            black: "#101010",
            background: "#101010",
            foreground: "#FFFFFF",
            primary: "#0079BF",
            primaryHover: "#0CA0EB",
            disable: "#3C4043",
          },
        },
      },
    }),
  ],
}
