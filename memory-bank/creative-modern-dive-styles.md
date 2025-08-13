# 🐠 Modern Dive App Style Guide 2024

## 🎨 Design Philosophy

**"Deep Ocean Meets Modern Tech"** - Создаем иммерсивный опыт, который переносит пользователя в подводный мир, используя современные дизайн-тренды 2024 года.

### Core Principles
- **Иммерсивность** - Погружение в атмосферу дайвинга
- **Современность** - Glassmorphism, неоморфизм, градиенты
- **Интуитивность** - Плавные анимации и микровзаимодействия
- **Атмосферность** - Цвета и эффекты, имитирующие подводный мир

---

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

### Status Colors
- **Success**: `#10b981` - Зеленый для успеха
- **Warning**: `#f59e0b` - Янтарный для предупреждений
- **Error**: `#ef4444` - Красный для ошибок
- **Info**: `#3b82f6` - Синий для информации

---

## 🎭 Modern Typography

### Font Stack
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-display: 'Poppins', 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale (Modern)
- **Hero**: `text-6xl` (60px) - Главные заголовки
- **Display**: `text-5xl` (48px) - Крупные заголовки
- **Heading 1**: `text-4xl` (36px) - Заголовки страниц
- **Heading 2**: `text-3xl` (30px) - Заголовки секций
- **Heading 3**: `text-2xl` (24px) - Подзаголовки
- **Body Large**: `text-xl` (20px) - Важный текст
- **Body**: `text-lg` (18px) - Основной текст
- **Body Small**: `text-base` (16px) - Вторичный текст
- **Caption**: `text-sm` (14px) - Подписи

### Font Weights
- **Light**: `font-light` (300)
- **Regular**: `font-normal` (400)
- **Medium**: `font-medium` (500)
- **Semibold**: `font-semibold` (600)
- **Bold**: `font-bold` (700)
- **Extra Bold**: `font-extrabold` (800)

---

## 🎪 Modern Effects & Styles

### Glassmorphism
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### Neumorphism
```css
.neumorph {
  background: linear-gradient(145deg, #1e293b, #0f172a);
  box-shadow: 
    20px 20px 60px rgba(0, 0, 0, 0.5),
    -20px -20px 60px rgba(255, 255, 255, 0.05);
  border-radius: 20px;
}

.neumorph-inset {
  background: linear-gradient(145deg, #0f172a, #1e293b);
  box-shadow: 
    inset 20px 20px 60px rgba(0, 0, 0, 0.5),
    inset -20px -20px 60px rgba(255, 255, 255, 0.05);
}
```

### Modern Gradients
```css
.gradient-ocean {
  background: linear-gradient(135deg, #1B68A4 0%, #199BD7 50%, #1e40af 100%);
}

.gradient-coral {
  background: linear-gradient(135deg, #F47B25 0%, #ea580c 50%, #dc2626 100%);
}

.gradient-sunset {
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%);
}
```

---

## 🎨 Modern Component Styles

### Buttons (2024 Style)

#### Primary Button (Glassmorphism)
```css
.btn-primary-modern {
  background: linear-gradient(135deg, #1B68A4, #199BD7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px 32px;
  font-weight: 600;
  font-size: 16px;
  color: white;
  box-shadow: 
    0 8px 32px rgba(27, 104, 164, 0.3),
    0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary-modern:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(27, 104, 164, 0.4),
    0 6px 20px rgba(0, 0, 0, 0.15);
}
```

#### Secondary Button (Neumorphism)
```css
.btn-secondary-modern {
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border: none;
  border-radius: 16px;
  padding: 16px 32px;
  font-weight: 600;
  font-size: 16px;
  color: #1B68A4;
  box-shadow: 
    8px 8px 16px rgba(0, 0, 0, 0.3),
    -8px -8px 16px rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-secondary-modern:hover {
  transform: translateY(-2px);
  box-shadow: 
    12px 12px 24px rgba(0, 0, 0, 0.4),
    -12px -12px 24px rgba(255, 255, 255, 0.08);
}
```

#### Floating Action Button
```css
.btn-floating {
  background: linear-gradient(135deg, #F47B25, #ea580c);
  border: none;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  box-shadow: 
    0 8px 32px rgba(244, 123, 37, 0.4),
    0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-floating:hover {
  transform: scale(1.1) translateY(-4px);
  box-shadow: 
    0 12px 40px rgba(244, 123, 37, 0.5),
    0 6px 20px rgba(0, 0, 0, 0.15);
}
```

### Cards (Glassmorphism)
```css
.card-modern {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.1);
}
```

### Input Fields (Modern)
```css
.input-modern {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px 20px;
  font-size: 16px;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-modern:focus {
  border-color: #1B68A4;
  box-shadow: 0 0 0 4px rgba(27, 104, 164, 0.1);
  outline: none;
}
```

---

## 🌊 Map-Specific Modern Styles

### Dive Site Markers
```css
.marker-modern {
  background: linear-gradient(135deg, #1B68A4, #199BD7);
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  box-shadow: 
    0 8px 32px rgba(27, 104, 164, 0.4),
    0 4px 16px rgba(0, 0, 0, 0.2);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 8px 32px rgba(27, 104, 164, 0.4);
  }
  50% { 
    box-shadow: 0 8px 32px rgba(27, 104, 164, 0.6), 0 0 20px rgba(27, 104, 164, 0.3);
  }
}
```

### Info Windows (Glassmorphism)
```css
.info-window-modern {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.3),
    0 8px 24px rgba(0, 0, 0, 0.2);
}
```

### Map Controls (Neumorphism)
```css
.map-control-modern {
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border: none;
  border-radius: 16px;
  box-shadow: 
    8px 8px 16px rgba(0, 0, 0, 0.3),
    -8px -8px 16px rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.map-control-modern:hover {
  transform: translateY(-2px);
  box-shadow: 
    12px 12px 24px rgba(0, 0, 0, 0.4),
    -12px -12px 24px rgba(255, 255, 255, 0.08);
}
```

---

## 🎭 Advanced Animations

### Water Ripple Effect
```css
@keyframes water-ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(0, 212, 255, 0.3);
  transform: translate(-50%, -50%);
  animation: water-ripple 0.6s ease-out;
}
```

### Floating Animation
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.floating {
  animation: float 3s ease-in-out infinite;
}
```

### Glow Pulse
```css
@keyframes glow-pulse {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  }
  50% { 
    box-shadow: 0 0 40px rgba(0, 212, 255, 0.6);
  }
}

.glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}
```

---

## 📱 Responsive Modern Design

### Mobile-First Approach
```css
/* Mobile (320px+) */
.container-modern {
  padding: 16px;
  border-radius: 20px;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container-modern {
    padding: 24px;
    border-radius: 24px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container-modern {
    padding: 32px;
    border-radius: 32px;
  }
}
```

### Touch-Friendly Sizes
- **Minimum Touch Target**: 48px × 48px
- **Button Height**: 56px (mobile), 64px (desktop)
- **Icon Size**: 24px (mobile), 32px (desktop)

---

## 🌙 Dark Mode (Primary Theme)

### Dark Theme Colors
```css
:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #64748b;
  --border-light: rgba(255, 255, 255, 0.1);
  --border-medium: rgba(255, 255, 255, 0.2);
}
```

### Light Theme (Optional)
```css
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-muted: #64748b;
  --border-light: rgba(0, 0, 0, 0.1);
  --border-medium: rgba(0, 0, 0, 0.2);
}
```

---

## 🎨 Iconography & Imagery

### Modern Icon Style
- **Line Weight**: 2px для консистентности
- **Corner Radius**: 4px для современного вида
- **Size**: 24px базовый размер
- **Color**: Использовать градиенты и glow эффекты

### Dive-Specific Icons
- **Anchor**: Стилизованный якорь с градиентом
- **Fish**: Плавающая рыба с анимацией
- **Coral**: Органические формы коралла
- **Depth Gauge**: Современный датчик глубины
- **Compass**: Компас с glow эффектом

---

## 🚀 Implementation Guidelines

### CSS Custom Properties
```css
:root {
  /* Colors */
  --color-tropical-blue: #1B68A4;
  --color-deep-ocean: #199BD7;
  --color-coral: #F47B25;
  
  /* Gradients */
  --gradient-ocean: linear-gradient(135deg, #1B68A4, #199BD7);
  --gradient-coral: linear-gradient(135deg, #F47B25, #ea580c);
  
  /* Effects */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --blur-amount: 20px;
  
  /* Shadows */
  --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.1);
  --shadow-neo: 8px 8px 16px rgba(0, 0, 0, 0.3);
}
```

### Tailwind Integration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'tropical-blue': '#1B68A4',
        'deep-ocean': '#199BD7',
        'coral': '#F47B25',
      },
      backgroundImage: {
        'gradient-ocean': 'linear-gradient(135deg, #1B68A4, #199BD7)',
        'gradient-coral': 'linear-gradient(135deg, #F47B25, #ea580c)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

---

## 🎯 Design System Principles

1. **Иммерсивность** - Каждый элемент должен погружать в атмосферу дайвинга
2. **Современность** - Использование актуальных трендов 2024 года
3. **Консистентность** - Единообразие во всех компонентах
4. **Доступность** - WCAG AA стандарты для всех элементов
5. **Производительность** - Оптимизированные анимации и эффекты
6. **Масштабируемость** - Легкое добавление новых компонентов

---

## 🔄 Migration Strategy

### Phase 1: Foundation
- Обновить цветовую палитру
- Внедрить CSS custom properties
- Создать базовые glassmorphism компоненты

### Phase 2: Components
- Обновить кнопки с новыми стилями
- Создать современные карточки
- Обновить input поля

### Phase 3: Advanced Effects
- Добавить анимации и микровзаимодействия
- Внедрить неоморфизм элементы
- Создать уникальные эффекты для карты

### Phase 4: Polish
- Оптимизация производительности
- Тестирование доступности
- Финальные корректировки
