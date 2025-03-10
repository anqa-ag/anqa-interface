// tailwind.config.js
import { nextui } from '@nextui-org/react'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // ...
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{html,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        clashDisplay: ['ClashDisplay-Regular', 'serif'],
        clashDisplayBold: ['ClashDisplay-Bold', 'serif'],
        clashDisplayMedium: ['ClashDisplay-Medium', 'serif'],
      },
    },
    screens: {
      '2xl': { max: '1535px' },
      // => @media (max-width: 1535px) { ... }

      xl: { max: '1279px' },
      // => @media (max-width: 1279px) { ... }

      lg: { max: '1023px' },
      // => @media (max-width: 1023px) { ... }

      md: { max: '767px' },
      // => @media (max-width: 767px) { ... }

      sm: { max: '639px' },
      // => @media (max-width: 639px) { ... }
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            black: '#101010',
            background: '#101010',
            foreground: '#FFFFFF',
            primary: '#0079BF',
            primaryHover: '#0CA0EB',
            disable: '#3C4043',
            buttonSecondary: '#9AA0A6',
            buttonSecondaryHover: '#DADCE0',
            buttonDisabled: '#282A2D',
            buttonRed: '#F44646',
            buttonYellow: '#FF9901',
            buttonGreen: '#18CF6A',
            tooltipBg: '#80868B',
            black900: '#17181B',
            black600: '#3C4043',
            baseBlack: '#22242B',
            baseGrey: '#8B8D91',
            baseGrey1: '#1A1A1A',
            line: '#3787FF',
          },
        },
      },
    }),
  ],
}
