const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}'
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			poppins: ['Poppins', 'sans-serif']
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
  			muted: '#E0E0E0',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		textColor: {
  			link: '#FFFFFF'
  		},
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
