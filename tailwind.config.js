/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin-slow 8s linear infinite',
      },
      keyframes: {
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      boxShadow: {
        'vinyl': '0 0 15px rgba(0, 0, 0, 0.2), 0 0 30px rgba(0, 0, 0, 0.1)',
      },
      transitionProperty: {
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
};