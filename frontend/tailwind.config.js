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
          light: '#34d399',  // Emerald 400
          DEFAULT: '#10b981',// Emerald 500
          dark: '#047857',   // Emerald 700
          bg: '#02120c',     // Main Dark Background
          card: '#022c22',   // Card/Navbar Background
        }
      }
    },
  },
  plugins: [],
}