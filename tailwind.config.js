/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f7fe',
          100: '#e8effd',
          200: '#d5e2fc',
          300: '#b6ccfa',
          400: '#90aff6',
          500: '#638bf0',
          600: '#3b6be8',
          700: '#2554d7',
          800: '#1f45b4',
          900: '#1e3c8f',
          950: '#122258',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
