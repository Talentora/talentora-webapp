const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'black',
          light: '#white',
          dark: '#174EA6'
        },
        foreground: '#FFFFFF',
        background: '#F5F6FA',
        accent: {
          DEFAULT: '#8B8BF4',
          light: '#FFD180',
          dark: '#F57C00'
        },
        muted: '#E0E0E0'
      },
      textColor: {
        link: '#FFFFFF'
      },
      // Extend default styles
      spacing: {
        '0': '0px'
      }
    }
  },
  plugins: [],
  // Add the following block for body and html styling
  corePlugins: {
    preflight: true
  }
};
