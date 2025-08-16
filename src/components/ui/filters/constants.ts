/**
 * Константы для унифицированных стилей компонентов фильтров
 * Обеспечивают консистентность дизайна и упрощают поддержку
 */

export const FILTER_STYLES = {
  // Заголовки секций
  sectionTitle: 'text-sm font-medium text-gray-700',
  sectionSubtitle: 'text-xs text-gray-500',

  // Цветовая палитра (соответствует style guide)
  colors: {
    primary: 'text-tropical-blue',
    secondary: 'text-deep-ocean',
    accent: 'text-coral-reef',
    neutral: 'text-slate-400',
    success: 'text-sea-green',
    warning: 'text-amber-500',
    error: 'text-red-500',
  },

  // Фоны
  backgrounds: {
    primary: 'bg-tropical-blue',
    secondary: 'bg-deep-ocean',
    accent: 'bg-coral-reef',
    neutral: 'bg-slate-100',
    white: 'bg-white',
    glass: 'bg-white/80 backdrop-blur-sm',
  },

  // Границы
  borders: {
    primary: 'border-tropical-blue',
    secondary: 'border-deep-ocean',
    accent: 'border-coral-reef',
    neutral: 'border-slate-300',
    focus: 'border-coral-reef',
  },

  // Размеры элементов
  sizes: {
    // Кнопки и чипы
    button: 'px-4 py-2 min-h-10',
    buttonSmall: 'px-3 py-1.5 min-h-8',
    buttonLarge: 'px-6 py-3 min-h-12',

    // Иконки
    icon: 'w-5 h-5',
    iconSmall: 'w-4 h-4',
    iconLarge: 'w-6 h-6',

    // Звезды рейтинга
    star: 'w-10 h-10',
    starMobile: 'w-8 h-8',
    starLarge: 'w-12 h-12',

    // Слайдеры
    sliderTrack: 'h-4',
    sliderThumb: 'w-8 h-8',
    sliderThumbMobile: 'w-6 h-6',
  },

  // Радиусы скругления
  radius: {
    default: 'rounded-2xl',
    small: 'rounded-lg',
    large: 'rounded-3xl',
    full: 'rounded-full',
  },

  // Анимации и переходы
  transitions: {
    default: 'transition-all duration-200 ease-in-out',
    fast: 'transition-all duration-150 ease-in-out',
    slow: 'transition-all duration-300 ease-in-out',
    bounce: 'transition-all duration-200 cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Состояния
  states: {
    hover: 'hover:scale-105 hover:shadow-md',
    focus: 'focus:ring-2 focus:ring-coral-reef focus:ring-offset-2 focus:outline-none',
    active: 'active:scale-95',
    disabled: 'opacity-50 cursor-not-allowed',
    selected: 'ring-2 ring-coral-reef ring-offset-2',
  },

  // Тени
  shadows: {
    default: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg',
    glow: 'shadow-glow',
    glowCoral: 'shadow-glow-coral',
  },
} as const;

// Типы для TypeScript
export type FilterColor = keyof typeof FILTER_STYLES.colors;
export type FilterSize = keyof typeof FILTER_STYLES.sizes;
export type FilterRadius = keyof typeof FILTER_STYLES.radius;
export type FilterTransition = keyof typeof FILTER_STYLES.transitions;

// Утилиты для создания классов
export const createFilterClasses = {
  button: (color: FilterColor = 'primary', size: FilterSize = 'button') =>
    `${FILTER_STYLES.sizes[size]} ${FILTER_STYLES.colors[color]} ${FILTER_STYLES.radius.default} ${FILTER_STYLES.transitions.default}`,

  icon: (size: FilterSize = 'icon') => `${FILTER_STYLES.sizes[size]}`,

  star: (size: FilterSize = 'star') =>
    `${FILTER_STYLES.sizes[size]} ${FILTER_STYLES.transitions.default}`,

  section: () => `space-y-3`,
};

// Responsive утилиты
export const RESPONSIVE_FILTERS = {
  star: 'w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12',
  button: 'px-3 py-1.5 md:px-4 md:py-2 lg:px-6 lg:py-3',
  icon: 'w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6',
  title: 'text-xs md:text-sm lg:text-base font-medium',
} as const;
