/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Тропическая палитра
        'tropical-blue': '#1B68A4',
        'deep-ocean': '#199BD7',
        coral: '#F47B25',
        'sea-green': '#11B981',

        // Фоны - светлая тема
        'dark-ocean': '#f8fafc', // Slate 50
        'deep-water': '#f1f5f9', // Slate 100
        'glass-bg': 'rgba(255, 255, 255, 0.8)',
        'frosted-glass': 'rgba(255, 255, 255, 0.6)',

        // Статусные цвета
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      backgroundImage: {
        'gradient-ocean': 'linear-gradient(135deg, #1B68A4, #199BD7)',
        'gradient-coral': 'linear-gradient(135deg, #F47B25, #ea580c)',
        'gradient-sunset': 'linear-gradient(135deg, #ff6b6b, #feca57)',
        'gradient-deep-sea': 'linear-gradient(135deg, #199BD7, #1e40af)',
        'gradient-neumorph': 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
        'gradient-neumorph-inset': 'linear-gradient(145deg, #e2e8f0, #f8fafc)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-hover': '0 16px 48px rgba(0, 0, 0, 0.15)',
        neumorph: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)',
        'neumorph-hover':
          '12px 12px 24px rgba(0, 0, 0, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9)',
        'glow-blue': '0 8px 32px rgba(27, 104, 164, 0.2)',
        'glow-coral': '0 8px 32px rgba(244, 123, 37, 0.2)',
        'glow-hover': '0 12px 40px rgba(27, 104, 164, 0.3)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'water-ripple': 'water-ripple 0.6s ease-out',
        'water-shimmer': 'water-shimmer 1.5s ease-in-out',
        'multiple-shimmers': 'multiple-shimmers 1.5s ease-in-out',
        'button-shine': 'button-shine 1s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 8px 32px rgba(27, 104, 164, 0.2)',
          },
          '50%': {
            boxShadow: '0 8px 32px rgba(27, 104, 164, 0.4), 0 0 20px rgba(27, 104, 164, 0.2)',
          },
        },
        'water-ripple': {
          '0%': {
            transform: 'scale(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0',
          },
        },
        'water-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '25%': { backgroundPosition: '-150% 0' },
          '50%': { backgroundPosition: '100% 0' },
          '75%': { backgroundPosition: '150% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'multiple-shimmers': {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)' },
        },
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      fontFamily: {
        display: ['Poppins', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
