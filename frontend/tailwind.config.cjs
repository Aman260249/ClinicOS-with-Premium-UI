/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'mobile': '480px',   
        'tablet': '834px',   
        'laptop': '1440px',  
      },
    },
  },
  plugins: [],
}