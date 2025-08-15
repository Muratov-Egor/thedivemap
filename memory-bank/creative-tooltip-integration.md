# 🎨 Creative Phase: Tooltip Integration UI/UX Design

**Date**: 2025-01-09  
**Task**: Autocomplete to Map Tooltip Integration  
**Phase**: UI/UX Design Decisions

## 🎯 Problem Statement

После выбора дайв-сайта в автокомплите нужно определить оптимальное UX поведение tooltip:

- Время отображения tooltip
- Анимации появления/исчезновения
- Способы закрытия tooltip
- Приоритеты между hover и программным открытием
- Оптимизация производительности

## 🎨 UI/UX Design Decisions

### 1. Tooltip Behavior: Гибридный подход

**Decision**: Автоматическое закрытие через 8 секунд + возможность ручного закрытия

**Rationale**:

- ✅ Баланс между автоматизацией и контролем пользователя
- ✅ 8 секунд достаточно для прочтения информации о сайте
- ✅ Пользователь может закрыть tooltip в любой момент
- ✅ Соответствует современным UX паттернам

**Implementation**:

```typescript
// Автоматическое закрытие через 8 секунд
useEffect(() => {
  if (isActive && !isTooltipVisible) {
    setIsTooltipVisible(true);

    autoCloseTimerRef.current = setTimeout(() => {
      setIsTooltipVisible(false);
    }, 8000);
  }

  return () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
  };
}, [isActive, isTooltipVisible]);
```

### 2. Animation: Scale + fade с glassmorphism эффектами

**Decision**: Комбинация scale и fade анимаций с backdrop-blur и градиентами

**Rationale**:

- ✅ Соответствует glassmorphism стилю приложения
- ✅ Современный и профессиональный вид
- ✅ Улучшает визуальную иерархию
- ✅ Оптимальный баланс между красотой и производительностью

**Implementation**:

```css
.tooltip-enter {
  @apply opacity-0 scale-95 transform;
}

.tooltip-enter-active {
  @apply opacity-100 scale-100 transition-all duration-300 ease-out;
}

.tooltip-exit {
  @apply opacity-100 scale-100;
}

.tooltip-exit-active {
  @apply opacity-0 scale-95 transition-all duration-200 ease-in;
}

.tooltip-glass {
  @apply bg-white/90 backdrop-blur-sm border border-white/20;
  @apply shadow-lg shadow-black/10;
}
```

### 3. State Management: Memoization с React.memo

**Decision**: Использование React.memo с кастомной функцией сравнения

**Rationale**:

- ✅ Предотвращает лишние ререндеры маркеров
- ✅ Оптимальный баланс производительности и сложности
- ✅ Соответствует React best practices
- ✅ Легко масштабируется при росте приложения

**Implementation**:

```typescript
const DiveSiteMarker = React.memo<MarkerProps>(
  ({ site, onClick, onHover, isActive }) => {
    // Компонент логика
  },
  (prevProps, nextProps) => {
    return (
      prevProps.site.id === nextProps.site.id &&
      prevProps.isActive === nextProps.isActive &&
      prevProps.onClick === nextProps.onClick &&
      prevProps.onHover === nextProps.onHover
    );
  },
);
```

## 🎨 Visual Design Specifications

### Tooltip Styling (согласно style-guide.md)

**Background**: `bg-white/90 backdrop-blur-sm` (Glassmorphism эффект)
**Border**: `border border-white/20` (Тонкая прозрачная граница)
**Shadow**: `shadow-lg shadow-black/10` (Мягкая тень)
**Text Colors**:

- Заголовок: `text-gray-900 font-semibold`
- Координаты: `text-gray-600 text-xs`
- Тип сайта: `text-gray-600 text-xs`
- Рейтинг: `text-gray-600 text-xs`

### Animation Timing

**Enter Animation**: 300ms ease-out
**Exit Animation**: 200ms ease-in
**Auto-close Delay**: 8000ms (8 секунд)

### Responsive Behavior

**Mobile**: Уменьшенные отступы и размеры шрифтов
**Desktop**: Стандартные размеры согласно style-guide
**Touch Devices**: Увеличенная область для закрытия

## 🎯 Success Criteria

- [ ] Tooltip плавно появляется с анимацией scale + fade
- [ ] Автоматически закрывается через 8 секунд
- [ ] Пользователь может закрыть tooltip вручную
- [ ] Hover состояния работают корректно
- [ ] Производительность не ухудшается (React.memo)
- [ ] Соответствует glassmorphism стилю приложения

## 📋 Implementation Checklist

### Phase 1: Core Integration

- [ ] Обновить DiveSitesLayer для получения selectedSite из MapContext
- [ ] Обновить MapContainer для передачи selectedSite
- [ ] Удалить локальное состояние selectedSite из DiveSitesLayer

### Phase 2: Tooltip Behavior

- [ ] Добавить автоматическое закрытие через 8 секунд
- [ ] Реализовать ручное закрытие tooltip
- [ ] Добавить очистку таймеров при размонтировании

### Phase 3: Animation & Styling

- [ ] Добавить scale + fade анимации
- [ ] Применить glassmorphism стили
- [ ] Настроить responsive поведение

### Phase 4: Performance Optimization

- [ ] Обернуть DiveSiteMarker в React.memo
- [ ] Настроить кастомную функцию сравнения
- [ ] Протестировать производительность

## 🎨 Style Guide Compliance

Все решения соответствуют `memory-bank/style-guide.md`:

- ✅ Использование цветовой палитры Tropical Blue (#1B68A4)
- ✅ Glassmorphism эффекты с backdrop-blur
- ✅ Typography согласно Tailwind scale
- ✅ Spacing система (base unit: 4px)
- ✅ Transition timing (300ms ease-out)

## 🚀 Next Steps

1. **Переход в IMPLEMENT режим** для реализации решений
2. **Тестирование** анимаций и производительности
3. **E2E тестирование** полного flow
4. **Документирование** финальной реализации
