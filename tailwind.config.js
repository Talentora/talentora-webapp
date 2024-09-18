const { fontFamily } = require('tailwindcss/defaultTheme');

let colors = require('tailwindcss/colors');
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        primary: {
          ...colors.gray,
          DEFAULT: colors.gray[900],
          foreground: colors.white,
          hairline: colors.gray[100],
          accent: colors.red
        },
        ring: colors.gray[500]
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans]
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      },
      boxShadow: {
        short:
          '0px 7px 2px 0px rgba(0, 0, 0, 0), 0px 5px 2px 0px rgba(0, 0, 0, 0.01), 0px 3px 2px 0px rgba(0, 0, 0, 0.03), 0px 1px 1px 0px rgba(0, 0, 0, 0.04), 0px 0px 1px 0px rgba(0, 0, 0, 0.05)',
        mid: '0px 100px 28px 0px rgba(0, 0, 0, 0), 0px 64px 26px 0px rgba(0, 0, 0, 0.01), 0px 36px 22px 0px rgba(0, 0, 0, 0.03), 0px 16px 16px 0px rgba(0, 0, 0, 0.04), 0px 4px 9px 0px rgba(0, 0, 0, 0.05)',
        long: '0px 360px 101px 0px rgba(0, 0, 0, 0), 0px 231px 92px 0px rgba(0, 0, 0, 0), 0px 130px 78px 0px rgba(0, 0, 0, 0.02),0px 58px 58px 0px rgba(0, 0, 0, 0.03), 0px 14px 32px 0px rgba(0, 0, 0, 0.03)',
        stats: '0px -2px 15px 0px rgba(0, 0, 0, 0.07)'
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
