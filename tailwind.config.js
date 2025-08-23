/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      scale: {
        200: '2',
        300: '3',
        400: '4',
        500: '5',
        600: '6',
        700: '7',
        800: '8',
        900: '9',
        1000: '10',
      },
      colors: {
        // ===== НОВАЯ ПАСТЕЛЬНАЯ ПАЛИТРА =====
        // Контурный цвет - основной accent
        'outline-purple': '#4A3C5A',

        // Пастельные цвета - основная палитра
        'pastel-blue': '#A8DADC',
        'pastel-turquoise': '#80CED7',
        'pastel-green': '#C8E6C9',
        'pastel-pink': '#F8C8DC',
        'pastel-cream': '#FDFD96',
        'pastel-yellow': '#FFECB3',

        // ===== СТАРЫЕ ЦВЕТА (для rollback) =====
        // 'tropical-blue': '#1B68A4',
        // 'deep-ocean': '#199BD7',
        // coral: '#F47B25',
        // 'sea-green': '#11B981',

        // Основные фоны (универсальные для светлой и темной темы)
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',

        // Фоны - универсальные (используют CSS переменные)
        'deep-water': 'rgb(var(--deep-water))',
        'glass-bg': 'var(--glass-bg)',
        'frosted-glass': 'var(--frosted-glass)',

        // Адаптивные blue оттенки
        blue: {
          50: 'rgb(var(--blue-50))',
        },

        // Темная тема
        dark: {
          background: 'rgb(var(--background))',
          foreground: 'rgb(var(--foreground))',
          'deep-water': 'rgb(var(--deep-water))',
        },

        // Статусные цвета
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      backgroundImage: {
        // ===== УБИРАЕМ ГРАДИЕНТЫ (плоский дизайн) =====
        // 'gradient-ocean': 'linear-gradient(135deg, #1B68A4, #199BD7)',
        // 'gradient-coral': 'linear-gradient(135deg, #F47B25, #ea580c)',
        // 'gradient-sunset': 'linear-gradient(135deg, #ff6b6b, #feca57)',
        // 'gradient-deep-sea': 'linear-gradient(135deg, #199BD7, #1e40af)',
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
        // Основные тени (минималистичные)
        glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-hover': '0 16px 48px rgba(0, 0, 0, 0.15)',
        neumorph: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)',
        'neumorph-hover':
          '12px 12px 24px rgba(0, 0, 0, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9)',

        // ===== НОВЫЕ МИНИМАЛИСТИЧНЫЕ ТЕНИ =====
        simple: '0 2px 8px rgba(74, 60, 90, 0.1)',
        'simple-hover': '0 4px 12px rgba(74, 60, 90, 0.15)',

        // ===== СТАРЫЕ GLOW ЭФФЕКТЫ (убираем) =====
        // 'glow-blue': '0 8px 32px rgba(27, 104, 164, 0.2)',
        // 'glow-coral': '0 8px 32px rgba(244, 123, 37, 0.2)',
        // 'glow-hover': '0 12px 40px rgba(27, 104, 164, 0.3)',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
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
            // СОЛНЕЧНОЕ СИЯНИЕ - белый цвет
            boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)',
          },
          '50%': {
            boxShadow: '0 8px 32px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.3)',
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
