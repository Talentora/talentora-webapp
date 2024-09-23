const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: '#102C57',  // Primary color (dark blue)
          light: '#DAC0A3',    // Light shade of primary (light brown)
          dark: '#081C40',     // Darker shade of primary if needed
        },
        foreground: '#FEFAF6',  // Foreground (light color for text)
        background: '#EADBC8',  // Background (light beige)
        accent: {
          DEFAULT: '#DAC0A3',  // Accent color (light brown)
          light: '#EADBC8',    // Lighter version of accent
        },
        muted: '#F5F5F7',  // Muted, subtle color for less emphasis
      },
    },
  },
  plugins: [],
};
