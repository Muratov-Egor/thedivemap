# 🐠 Modern Dive App Style Guide 2024

## 🎨 Design Philosophy

**"Deep Ocean Meets Modern Tech"** - The Dive Map emphasizes immersive user experience, modern design trends, and ocean-inspired aesthetics while maintaining professional functionality for dive site exploration.

### Core Principles

- **Иммерсивность** - Погружение в атмосферу дайвинга
- **Современность** - Glassmorphism, неоморфизм, градиенты 2024
- **Интуитивность** - Плавные анимации и микровзаимодействия
- **Атмосферность** - Цвета и эффекты, имитирующие подводный мир

## 🌊 Color Palette 2024

### Primary Colors (Живые, яркие)

- **Tropical Blue**: `#1B68A4` - Основной цвет, имитирующий тропические воды
- **Deep Ocean**: `#199BD7` - Глубокий океан для акцентов
- **Coral Reef**: `#F47B25` - Яркий коралл для CTA
- **Sea Green**: `#11B981` - Морская зелень для успешных действий

### Secondary Colors (Градиенты)

- **Sunset Gradient**: `linear-gradient(135deg, #ff6b6b, #feca57)`
- **Ocean Gradient**: `linear-gradient(135deg, #1B68A4, #199BD7)`
- **Deep Sea Gradient**: `linear-gradient(135deg, #199BD7, #1e40af)`
- **Coral Gradient**: `linear-gradient(135deg, #F47B25, #ea580c)`

### Background Colors

- **Dark Ocean**: `#0f172a` - Основной фон (темная тема)
- **Deep Water**: `#1e293b` - Вторичный фон
- **Glass Background**: `rgba(255, 255, 255, 0.1)` - Стеклянные элементы
- **Frosted Glass**: `rgba(255, 255, 255, 0.05)` - Размытое стекло

### Secondary Colors

- **Sand Beige**: `#fef3c7` - Background and subtle elements
- **Sea Foam**: `#ecfdf5` - Light backgrounds and success states
- **Storm Gray**: `#374151` - Text and borders

### Status Colors

- **Success**: `#10b981` - Green for positive actions
- **Warning**: `#f59e0b` - Amber for warnings
- **Error**: `#ef4444` - Red for errors
- **Info**: `#3b82f6` - Blue for information

## Typography

### Font Families

- **Primary**: Inter, system-ui, sans-serif
- **Monospace**: JetBrains Mono, monospace (for code)

### Font Sizes (Tailwind Scale)

- **Display**: `text-4xl` (36px) - Page titles
- **Heading 1**: `text-3xl` (30px) - Section headers
- **Heading 2**: `text-2xl` (24px) - Subsection headers
- **Heading 3**: `text-xl` (20px) - Component headers
- **Body Large**: `text-lg` (18px) - Important text
- **Body**: `text-base` (16px) - Regular text
- **Body Small**: `text-sm` (14px) - Secondary text
- **Caption**: `text-xs` (12px) - Labels and metadata

### Font Weights

- **Light**: `font-light` (300)
- **Regular**: `font-normal` (400)
- **Medium**: `font-medium` (500)
- **Semibold**: `font-semibold` (600)
- **Bold**: `font-bold` (700)

## Spacing System

### Base Unit: 4px

- **xs**: `space-1` (4px)
- **sm**: `space-2` (8px)
- **md**: `space-3` (12px)
- **lg**: `space-4` (16px)
- **xl**: `space-6` (24px)
- **2xl**: `space-8` (32px)
- **3xl**: `space-12` (48px)

## Component Styles

### Buttons

```css
/* Primary Button */
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors;
}

/* Secondary Button */
.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg transition-colors;
}

/* Danger Button */
.btn-danger {
  @apply bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors;
}
```

### Cards

```css
.card {
  @apply bg-white rounded-lg shadow-md border border-gray-200 p-6;
}

.card-hover {
  @apply card hover:shadow-lg transition-shadow cursor-pointer;
}
```

### Input Fields

```css
.input {
  @apply border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.input-error {
  @apply border-red-300 focus:ring-red-500;
}
```

## Map-Specific Styles

### Markers

- **Dive Site Marker**: Ocean blue circle with white anchor icon
- **Cluster Marker**: Coral accent circle with white number
- **Hover State**: Scale 1.1 with shadow
- **Active State**: Deep sea blue with glow effect

### Info Windows

- **Background**: White with subtle shadow
- **Border**: Ocean blue accent
- **Typography**: Body text with clear hierarchy
- **Close Button**: Gray with hover state

### Map Controls

- **Background**: White with transparency
- **Border**: Light gray
- **Icons**: Ocean blue with hover states
- **Active State**: Coral accent

## Responsive Design

### Breakpoints

- **Mobile**: `sm:` (640px+)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)
- **Large Desktop**: `xl:` (1280px+)

### Mobile Considerations

- Touch targets minimum 44px
- Simplified navigation
- Optimized for one-handed use
- Reduced information density

## Accessibility

### Color Contrast

- All text meets WCAG AA standards (4.5:1 ratio)
- Interactive elements have clear focus states
- Color is not the only indicator of information

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Clear focus indicators
- Logical tab order

### Screen Readers

- Semantic HTML structure
- ARIA labels where appropriate
- Alt text for images and icons

## Animation Guidelines

### Transitions

- **Fast**: 150ms - Hover states, micro-interactions
- **Medium**: 300ms - Component state changes
- **Slow**: 500ms - Page transitions, major animations

### Easing

- **Standard**: `ease-in-out` - Most interactions
- **Bounce**: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` - Success states
- **Smooth**: `cubic-bezier(0.4, 0, 0.2, 1)` - Page transitions

## Iconography

### Style

- **Line Weight**: 2px for consistency
- **Corner Radius**: 2px for rounded corners
- **Size**: 20px base size, scalable

### Common Icons

- **Map**: Location pin, compass, zoom controls
- **Diving**: Anchor, fish, coral, depth gauge
- **Navigation**: Home, search, filter, settings
- **Status**: Success, warning, error, info

## Dark Mode Support

### Color Adaptations

- **Background**: Dark gray instead of white
- **Text**: Light gray instead of dark
- **Borders**: Medium gray for subtle separation
- **Accents**: Brighter versions of brand colors

### Implementation

- CSS custom properties for theme switching
- Respects user system preferences
- Manual toggle option available
