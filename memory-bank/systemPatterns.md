# System Patterns

## Component Architecture
- **Atomic Design** - компоненты организованы по уровням сложности
- **Composition over Inheritance** - предпочтение композиции
- **Single Responsibility** - каждый компонент отвечает за одну задачу

## State Management
- **React Context** - глобальное состояние приложения
- **Local State** - состояние компонентов
- **Custom Hooks** - переиспользуемая логика состояния

## Data Flow
- **Unidirectional** - данные текут сверху вниз
- **Props Down, Events Up** - стандартный React паттерн
- **Context Providers** - для глобального состояния

## Testing Strategy
- **Unit Tests** - Jest для компонентов и утилит
- **Integration Tests** - Playwright для API
- **E2E Tests** - Playwright для пользовательских сценариев
- **Page Object Pattern** - для E2E тестов

## Code Organization
- **Feature-based** - компоненты сгруппированы по функциональности
- **Shared Components** - переиспользуемые UI компоненты
- **Hooks** - переиспользуемая логика
- **Types** - TypeScript типы и интерфейсы

## Performance Patterns
- **Code Splitting** - Next.js автоматическое разделение кода
- **Lazy Loading** - для тяжелых компонентов
- **Memoization** - React.memo, useMemo, useCallback
- **Image Optimization** - Next.js Image компонент

---
*This file documents architectural patterns and design decisions.*
