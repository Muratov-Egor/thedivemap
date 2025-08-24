# Технический контекст

## Текущий стек технологий

- **Frontend Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS Modules
- **State Management:** React Context API
- **Mapping:** MapLibre GL JS
- **Testing:** Jest (unit), Playwright (e2e)
- **Package Manager:** pnpm
- **Build Tools:** Next.js встроенная система сборки

## Система стилей

### CSS архитектура

- **Глобальные стили:** `src/app/globals.css`
- **Tailwind конфигурация:** `tailwind.config.js`
- **CSS переменные:** используются для тем
- **Компонентные стили:** CSS modules + Tailwind классы

### Текущая палитра

```css
:root {
  --tropical-blue: 27, 104, 164;
  --deep-ocean: 25, 155, 215;
  --coral: 244, 123, 37;
  --sea-green: 17, 185, 129;
}
```

### Система тем

- Поддержка светлой/темной темы
- Переключение через `data-theme` атрибут
- Контекст тем в `src/contexts/ThemeContext.tsx`

## Компоненты для обновления

- UI компоненты в `src/components/ui/`
- Иконки в `src/components/icons/`
- Карта и маркеры в `src/components/map/`
- Панели фильтров и информации
