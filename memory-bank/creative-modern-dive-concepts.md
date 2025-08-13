# 🎨 Modern Dive App - Концептуальные макеты и компоненты

## 🖼️ Концепция главной страницы

### Современный интерфейс карты

```
┌─────────────────────────────────────────────────────────────────┐
│ 🐠 The Dive Map                    [🌙] [RU] [👤]              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  🌊 Интерактивная карта с glassmorphism эффектами      │   │
│  │                                                         │   │
│  │  ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐     │   │
│  │  │+│ │-│ │⟲│ │⟳│ │⊞│ │⊟│ │⌂│ │🔍│ │⭐│ │❤│ │⚙│ │?│     │   │
│  │  └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘     │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ 🚢 King Cruiser Wreck                          │   │   │
│  │  │ 📍 7.8117°N, 98.6449°E                         │   │   │
│  │  │ 🏴‍☠️ Тип: Затонувший корабль                   │   │   │
│  │  │ ⭐ 4.8/5                                        │   │   │
│  │  │ [Подробнее] [Добавить в избранное] [×]         │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔍 Поиск дайв-сайтов...                                │   │
│  │ [📍 Моё местоположение] [🗺️ Карта мира] [⭐ Избранное] │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Правая панель с современными компонентами

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎨 Современные компоненты                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🌊 Быстрые действия                                        │ │
│ │                                                             │ │
│ │ [🔍 Поиск] [📍 Моё место] [⭐ Избранное] [⚙️ Настройки]   │ │
│ │                                                             │ │
│ │ ┌─────────────────────────────────────────────────────────┐ │ │
│ │ │ 🚢 Последние дайв-сайты                                │ │ │
│ │ │                                                         │ │ │
│ │ │ ┌─────────────────────────────────────────────────────┐ │ │ │
│ │ │ │ 🚢 King Cruiser Wreck                              │ │ │ │
│ │ │ │ ⭐ 4.8/5 • 🏴‍☠️ Затонувший корабль                  │ │ │ │
│ │ │ │ [Посмотреть] [❤️]                                   │ │ │ │
│ │ │ └─────────────────────────────────────────────────────┘ │ │ │
│ │ │                                                         │ │ │
│ │ │ ┌─────────────────────────────────────────────────────┐ │ │ │
│ │ │ │ 🐠 Coral Garden                                    │ │ │ │
│ │ │ │ ⭐ 4.6/5 • 🌊 Коралловый риф                        │ │ │ │
│ │ │ │ [Посмотреть] [❤️]                                   │ │ │ │
│ │ │ └─────────────────────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 📊 Статистика                                              │ │
│ │                                                             │ │
│ │ 🗺️ Просмотрено: 1,247 дайв-сайтов                          │ │
│ │ ⭐ В избранном: 23 сайта                                   │ │
│ │ 🏆 Посещено: 8 сайтов                                      │ │
│ │                                                             │ │
│ │ [📈 Подробная статистика]                                  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Современные компоненты

### 1. Кнопки с Glassmorphism эффектами

```css
/* Primary Button - Тропический градиент */
.btn-primary-ocean {
  background: linear-gradient(135deg, #1B68A4, #199BD7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 16px 32px;
  font-weight: 600;
  font-size: 16px;
  color: white;
  box-shadow: 
    0 8px 32px rgba(27, 104, 164, 0.4),
    0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary-ocean:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 16px 48px rgba(27, 104, 164, 0.5),
    0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Secondary Button - Неоморфизм */
.btn-secondary-neumorph {
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border: none;
  border-radius: 20px;
  padding: 16px 32px;
  font-weight: 600;
  font-size: 16px;
  color: #1B68A4;
  box-shadow: 
    12px 12px 24px rgba(0, 0, 0, 0.4),
    -12px -12px 24px rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-secondary-neumorph:hover {
  transform: translateY(-2px);
  box-shadow: 
    16px 16px 32px rgba(0, 0, 0, 0.5),
    -16px -16px 32px rgba(255, 255, 255, 0.08);
}

/* Floating Action Button */
.btn-floating-coral {
  background: linear-gradient(135deg, #F47B25, #ea580c);
  border: none;
  border-radius: 50%;
  width: 72px;
  height: 72px;
  box-shadow: 
    0 12px 40px rgba(244, 123, 37, 0.5),
    0 6px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-floating-coral:hover {
  transform: scale(1.15) translateY(-6px);
  box-shadow: 
    0 20px 60px rgba(244, 123, 37, 0.6),
    0 10px 30px rgba(0, 0, 0, 0.2);
}
```

### 2. Карточки дайв-сайтов

```css
.dive-site-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 24px;
  margin: 16px 0;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 6px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.dive-site-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.6s;
}

.dive-site-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 24px 60px rgba(0, 0, 0, 0.2),
    0 12px 30px rgba(0, 0, 0, 0.15);
}

.dive-site-card:hover::before {
  left: 100%;
}

.dive-site-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.dive-site-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #00d4ff, #0ea5e9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.3);
}

.dive-site-info h3 {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.dive-site-info p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 4px 0 0 0;
}

.dive-site-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #fbbf24;
  font-size: 18px;
}

.dive-site-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.action-btn {
  flex: 1;
  padding: 12px 16px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.action-btn-primary {
  background: linear-gradient(135deg, #1B68A4, #199BD7);
  color: white;
  border: none;
}

.action-btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### 3. Поисковая панель

```css
.search-panel {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 24px;
  margin: 20px;
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.3),
    0 8px 24px rgba(0, 0, 0, 0.2);
}

.search-input {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 16px 20px;
  font-size: 16px;
  color: white;
  width: 100%;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #1B68A4;
  box-shadow: 0 0 0 4px rgba(27, 104, 164, 0.1);
  outline: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-filters {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.filter-chip {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-chip:hover {
  background: rgba(27, 104, 164, 0.2);
  border-color: #1B68A4;
  transform: translateY(-2px);
}

.filter-chip.active {
  background: linear-gradient(135deg, #1B68A4, #199BD7);
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(27, 104, 164, 0.3);
}
```

### 4. Навигационная панель

```css
.nav-panel {
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 16px;
  margin: 16px;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.25),
    0 6px 20px rgba(0, 0, 0, 0.15);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(135deg, #1B68A4, #199BD7);
  color: white;
  box-shadow: 0 4px 16px rgba(27, 104, 164, 0.3);
}

.nav-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
```

### 5. Статистические карточки

```css
.stats-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.stats-number {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #1B68A4, #199BD7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.stats-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 20px;
}
```

---

## 🎭 Анимации и микровзаимодействия

### 1. Плавающие элементы

```css
@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-10px) rotate(2deg); 
  }
}

.floating-element {
  animation: float 4s ease-in-out infinite;
}

.floating-element:nth-child(2) {
  animation-delay: -1s;
}

.floating-element:nth-child(3) {
  animation-delay: -2s;
}
```

### 2. Волновые эффекты

```css
@keyframes wave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.wave-effect {
  position: relative;
  overflow: hidden;
}

.wave-effect::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 212, 255, 0.2),
    transparent
  );
  animation: wave 2s ease-in-out infinite;
}
```

### 3. Пульсирующие маркеры

```css
@keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 40px rgba(0, 212, 255, 0.8);
    transform: scale(1.1);
  }
}

.pulse-marker {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

---

## 📱 Адаптивный дизайн

### Mobile First подход

```css
/* Mobile (320px+) */
.container {
  padding: 16px;
  margin: 8px;
}

.search-panel {
  margin: 12px;
  padding: 16px;
}

.nav-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 20px 20px 0 0;
  z-index: 1000;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    margin: 16px;
  }
  
  .search-panel {
    margin: 20px;
    padding: 24px;
  }
  
  .nav-panel {
    position: static;
    border-radius: 20px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    margin: 24px;
  }
  
  .search-panel {
    margin: 24px;
    padding: 32px;
  }
}
```

---

## 🌊 Уникальные элементы для дайвинга

### 1. Индикатор глубины

```css
.depth-indicator {
  background: linear-gradient(180deg, #1B68A4 0%, #199BD7 50%, #1e40af 100%);
  border-radius: 20px;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.depth-meter {
  width: 20px;
  height: 120px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  position: relative;
  margin: 0 auto;
}

.depth-level {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(180deg, #1B68A4, #199BD7);
  border-radius: 10px;
  transition: height 0.5s ease;
}

.depth-value {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 700;
  color: white;
  font-size: 18px;
}
```

### 2. Компас с анимацией

```css
.compass {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border: 2px solid rgba(27, 104, 164, 0.3);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.compass-needle {
  width: 4px;
  height: 60px;
  background: linear-gradient(180deg, #ef4444 0%, #1B68A4 50%, #10b981 100%);
  border-radius: 2px;
  position: absolute;
  transform-origin: center;
  animation: compass-spin 4s linear infinite;
}

@keyframes compass-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### 3. Термометр воды

```css
.thermometer {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.temp-display {
  font-size: 24px;
  font-weight: 700;
  color: #1B68A4;
  text-align: center;
  margin-bottom: 8px;
}

.temp-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.temp-fill {
  height: 100%;
  background: linear-gradient(90deg, #1B68A4, #199BD7);
  border-radius: 4px;
  transition: width 0.5s ease;
}
```

---

## 🎯 Итоговая концепция

### Основные принципы нового дизайна:

1. **Иммерсивность** - Каждый элемент погружает в атмосферу дайвинга
2. **Современность** - Glassmorphism, неоморфизм, градиенты 2024
3. **Интуитивность** - Плавные анимации и микровзаимодействия
4. **Атмосферность** - Цвета и эффекты имитируют подводный мир
5. **Функциональность** - Все элементы служат цели навигации по дайв-сайтам

### Ключевые отличия от CRM-стиля:

- ✅ **Живые цвета** вместо корпоративных
- ✅ **Современные эффекты** вместо плоских элементов
- ✅ **Анимации** вместо статичных элементов
- ✅ **Атмосферность** вместо утилитарности
- ✅ **Иммерсивность** вместо функциональности

Этот дизайн превратит The Dive Map из корпоративного CRM в современное, атмосферное приложение для дайверов! 🐠✨
