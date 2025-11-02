/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#1a2332',
        slate: '#5A6A7A',
        silver: '#C0C0C0',
        light: '#F4F6F8',
        blue: '#D8E1E8',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}