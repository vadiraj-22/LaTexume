/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A6FF5D',
        dark: '#1e2939',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'rotate': 'rotate 4s linear infinite',
      },
      keyframes: {
        rotate: {
          '100%': { transform: 'rotate(1turn)' },
        },
      },
    },
  },
  plugins: [],
}
