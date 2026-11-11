const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./dist/**/*.html', './dist/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { 50: '#f4f8ed', 100: '#e5efd8', 200: '#cde0b5', 300: '#abc989', 400: '#83ab60', 500: '#638d43', 600: '#4b7132', 700: '#3c582b', 800: '#304625', 900: '#283b23' },
        cream: '#fffaf1',
        ink: '#203127',
        semantic: { success: '#32855b', warning: '#b96d24', danger: '#b64f4a', info: '#467fa7' }
      },
      fontFamily: { display: ['Georgia', 'serif'], sans: ['Inter', 'Arial', 'sans-serif'] },
      boxShadow: { soft: '0 18px 50px rgba(41, 62, 36, .12)' },
      animation: { rise: 'rise .7s ease-out both' },
      keyframes: { rise: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    plugin(({ addUtilities }) => addUtilities({
      '.text-balance': { textWrap: 'balance' },
      '.scrollbar-thin': { scrollbarWidth: 'thin', scrollbarColor: '#abc989 transparent' }
    }))
  ]
};
