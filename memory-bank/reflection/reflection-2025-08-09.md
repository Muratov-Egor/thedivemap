# Bug Fix Reflection: ESLint unused vars/imports

## Summary

Удалены неиспользуемые переменные/импорты в HomePage и Header для устранения предупреждений линтера.

## Implementation

- src/app/page.tsx: удалён импорт useTranslation и переменная.
- src/components/Header.tsx: удалён неиспользуемый импорт Button.

## Testing

- pnpm lint: без предупреждений.
- pnpm build: успешно.
- Playwright API: 35 тестов пройдено.

## Additional Notes

- Без функциональных изменений UI/логики.
- Следующий шаг: ARCHIVE.
