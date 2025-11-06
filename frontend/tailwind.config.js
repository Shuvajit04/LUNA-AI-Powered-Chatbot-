/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'slide': 'slide 4s ease-in-out infinite',
      },
      keyframes: {
        slide: {
          '0%, 33%': { transform: 'translateY(0)' },
          '40%, 73%': { transform: 'translateY(-33.33%)' },
          '80%, 100%': { transform: 'translateY(-66.66%)' },
        }
      }
    },
  },
  plugins: [],
}