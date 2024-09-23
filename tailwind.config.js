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
        poppins: ["Poppins", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: '#1A73E8',  // Primary color (blue, clean and professional)
          light: '#4A90E2',    // Lighter shade for hover/focus (light blue)
          dark: '#174EA6',     // Darker shade for buttons/important elements (dark blue)
        },
        foreground: '#FFFFFF',  // Foreground (pure white for text readability)
        background: '#F5F6FA',  // Background (very light grey for a clean feel)
        accent: {
          DEFAULT: '#FFB74D',  // Accent color (warm yellow/orange for highlights)
          light: '#FFD180',    // Lighter accent for hover states
          dark: '#F57C00',     // Darker accent for contrast
        },
        muted: '#E0E0E0',  // Muted, subtle color for borders and less emphasis (light grey)
      },
    },
  },
  plugins: [],
};
