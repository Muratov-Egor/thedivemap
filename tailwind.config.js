/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-150%) skewX(-2deg)', opacity: '0' },
          '35%': { opacity: '1' },
          '100%': { transform: 'translateX(250%) skewX(-150deg)', opacity: '0' },
        },
        shineReverse: {
          '0%': { transform: 'translateX(300%) skewX(-42deg)', opacity: '0' },
          '35%': { opacity: '1' },
          '100%': { transform: 'translateX(-250%) skewX(-20deg)', opacity: '0' },
        },
      },
      animation: {
        shine: 'shine 500ms ease-in-out',
        shineReverse: 'shineReverse 500ms ease-in-out',
      },
    },
  },
  plugins: [],
};
