/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#58CCED', // Light Blue from logo
          400: '#3399cc',
          500: '#0C53A6', // Medium Blue from logo (main)
          600: '#094489',
          700: '#003366', // Dark Blue from logo
          800: '#002952',
          900: '#001f3d',
        },
        // Override default indigo to use logo colors
        indigo: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#58CCED',
          400: '#3399cc',
          500: '#0C53A6',
          600: '#094489',
          700: '#003366',
          800: '#002952',
          900: '#001f3d',
        }
      }
    },
  },
  plugins: [],
}
