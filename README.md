# 🗺️ The Dive Map

**The Dive Map** — это интерактивная карта дайв-сайтов по всему миру, которая помогает дайверам находить интересные места для погружений. Приложение предоставляет подробную информацию о каждом дайв-сайте, включая глубину, видимость, сложность и рейтинг.

[![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MapLibre](https://img.shields.io/badge/MapLibre_GL-5.6.2-green?logo=maplibre)](https://maplibre.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.52.0-green?logo=supabase)](https://supabase.com/)

## ✨ Основные возможности

- 🗺️ **Интерактивная карта** - MapLibre GL с поддержкой кластеризации маркеров
- 🔍 **Умный поиск** - автокомплит с поиском по странам, регионам и локациям
- 🎛️ **Продвинутые фильтры** - по типу сайта, сложности, глубине, видимости и рейтингу
- 📱 **Адаптивный дизайн** - оптимизировано для десктопа и мобильных устройств
- 🌐 **Многоязычность** - поддержка русского и английского языков
- 🌓 **Темы оформления** - светлая и темная темы
- 💾 **База данных** - интеграция с Supabase для хранения данных
- 📊 **Детальная информация** - координаты, глубина, видимость, ссылки на дайв-центры

## 🛠️ Технологический стек

### Frontend

- **Next.js 15.4.2** - React фреймворк с SSR/SSG
- **React 19.1.0** - библиотека для создания пользовательских интерфейсов
- **TypeScript 5.8.3** - типизированный JavaScript
- **Tailwind CSS 3.4.17** - утилитарный CSS фреймворк
- **MapLibre GL 5.6.2** - библиотека для интерактивных карт

### Backend & Database

- **Supabase** - Backend-as-a-Service с PostgreSQL
- **Next.js API Routes** - серверные эндпоинты

### Локализация

- **i18next 25.3.2** - система интернационализации
- **react-i18next 15.6.1** - React интеграция для i18next

### Тестирование

- **Jest 30.0.5** - unit тестирование
- **Playwright 1.54.1** - E2E и API тестирование
- **Testing Library** - утилиты для тестирования React компонентов
- **Allure** - отчеты о тестировании

### Инструменты разработки

- **ESLint** - линтер кода
- **Prettier** - форматтер кода
- **pnpm 10.14.0** - менеджер пакетов

## 📁 Структура проекта

```
thedivemap/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API эндпоинты
│   │   │   ├── dive-sites/    # Дайв-сайты
│   │   │   ├── places/        # Места (страны/регионы)
│   │   │   ├── filters/       # Фильтры
│   │   │   └── bounds/        # Границы карты
│   │   ├── globals.css        # Глобальные стили
│   │   ├── layout.tsx         # Корневой layout
│   │   └── page.tsx           # Главная страница
│   ├── components/            # React компоненты
│   │   ├── ui/                # Переиспользуемые UI компоненты
│   │   │   ├── Autocomplete/  # Компонент автокомплита
│   │   │   ├── Button.tsx     # Кнопка
│   │   │   ├── Chip/          # Чипы для фильтров
│   │   │   ├── icons/         # SVG иконки
│   │   │   ├── Notification/  # Уведомления
│   │   │   └── Slider/        # Слайдеры для фильтров
│   │   ├── map/               # Компоненты карты
│   │   │   ├── MapContainer.tsx     # Основной контейнер карты
│   │   │   ├── DiveSitesLayer.tsx   # Слой с дайв-сайтами
│   │   │   ├── DiveSiteMarker.tsx   # Маркеры сайтов
│   │   │   └── MarkerCluster.tsx    # Кластеризация маркеров
│   │   ├── FiltersPanel/      # Панель фильтров
│   │   ├── InfoPanel/         # Информационная панель
│   │   └── Header/            # Заголовок приложения
│   ├── contexts/              # React контексты
│   │   ├── MapContext.tsx     # Контекст карты
│   │   ├── FiltersContext.tsx # Контекст фильтров
│   │   ├── PanelContext.tsx   # Контекст панелей
│   │   └── ThemeContext.tsx   # Контекст темы
│   ├── hooks/                 # Пользовательские хуки
│   ├── i18n/                  # Локализация
│   │   └── locales/           # Переводы (ru/en)
│   ├── lib/                   # Утилиты и библиотеки
│   │   ├── supabase/          # Настройка Supabase
│   │   ├── clustering/        # Алгоритмы кластеризации
│   │   └── utils/             # Вспомогательные функции
│   └── types/                 # TypeScript типы
├── playwright-tests/          # Тесты Playwright
│   ├── api/                   # API тесты
│   └── e2e/                   # E2E тесты
├── docs/                      # Документация
└── memory-bank/               # Архитектурная документация
```

## 🛠️ Разработка

### Требования

- Node.js 18+
- pnpm 10+

### Установка и запуск

```bash
# Клонирование репозитория
git clone <repository-url>
cd thedivemap

# Установка зависимостей
pnpm install

# Запуск в режиме разработки
pnpm dev

# Открыть http://localhost:3000
```

### Переменные окружения

Создайте файл `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Команды разработки

```bash
# Разработка
pnpm dev              # Запуск dev сервера
pnpm build            # Сборка для продакшена
pnpm start            # Запуск продакшен сервера
pnpm lint             # Проверка ESLint
pnpm format           # Форматирование кода

# Unit тестирование (Jest)
pnpm test             # Запуск всех unit тестов
pnpm test:watch       # Запуск в watch режиме
pnpm test:coverage    # Запуск с покрытием

# E2E тестирование (Playwright)
pnpm api              # API тесты
pnpm e2e              # E2E тесты (все браузеры)
pnpm e2e:desktop      # E2E тесты (только desktop)
pnpm e2e:mobile       # E2E тесты (только mobile)
pnpm e2e:ui           # E2E тесты с UI
pnpm e2e:headed       # E2E тесты в браузере

# Отчеты тестирования
pnpm report           # Генерация и открытие Allure отчетов
pnpm report:clean     # Очистка файлов отчетов
```

## 🔌 API

### Эндпоинты

#### Дайв-сайты

```
GET /api/dive-sites           # Получить все дайв-сайты с фильтрами
GET /api/dive-sites/[id]      # Получить конкретный дайв-сайт
```

**Параметры фильтрации:**

- `country_id` - ID страны
- `region_id` - ID региона
- `location_id` - ID локации
- `site_type_id` - ID типа сайта
- `difficulty_id` - ID сложности
- `depth_min` - минимальная глубина
- `visibility_min` - минимальная видимость
- `rating_min` - минимальный рейтинг

#### Места

```
GET /api/places               # Получить страны, регионы, локации
```

#### Фильтры

```
GET /api/filters              # Получить доступные фильтры
```

#### Границы карты

```
GET /api/bounds               # Получить границы для текущих фильтров
```

### Типы данных

```typescript
interface Site {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  country_id: number;
  depth_max: number;
  visibility: number;
  rating: number;
  site_type_id: number;
  difficulty_id: number;
  info_links?: string[];
  dive_center_links?: string[];
}

interface Country {
  id: number;
  name_en: string;
  name_ru: string;
  region_id: number;
  iso_code: string;
}

interface SiteType {
  id: number;
  label_en: string;
  label_ru: string;
}
```

## 🧪 Тестирование

### Структура тестов

```
playwright-tests/
├── api/                      # API тесты (35 тестов)
│   ├── api-objects/          # Page Object классы для API
│   ├── dive-sites.spec.ts    # Тесты API дайв-сайтов
│   ├── places.spec.ts        # Тесты API мест
│   └── test-data.ts          # Тестовые данные
├── e2e/                      # E2E тесты (8 тестов)
│   ├── page-objects/         # Page Object классы
│   ├── accessibility.*.spec.ts  # Тесты доступности
│   ├── autocomplete.*.spec.ts   # Тесты автокомплита
│   ├── clusters.spec.ts         # Тесты кластеризации
│   └── markers.spec.ts          # Тесты маркеров
└── mocks/                    # Моковые данные
```

### Конфигурация браузеров

- **API тесты**: только Chromium (не требуют браузерной специфики)
- **E2E тесты**:
  - Desktop Chrome (1280x720)
  - Mobile Chrome iPhone 13 (375x812)

### Паттерны тестирования

- **Page Object Pattern** - для E2E тестов
- **API Objects Pattern** - для API тестов
- **data-testid** атрибуты - для селекторов элементов
- **Allure отчеты** - для детализированных результатов

## 🎨 Дизайн-система

### Цветовая палитра

```css
:root {
  --tropical-blue: 27, 104, 164;
  --deep-ocean: 25, 155, 215;
  --coral: 244, 123, 37;
  --sea-green: 17, 185, 129;
}
```

### Особенности

- 🔮 **Glassmorphism** эффекты
- 🎭 **Neumorphism** стили
- 🌗 **Dual themes** - светлая/темная тема
- ✨ **Animations** - плавные переходы
- 📱 **Responsive** - адаптивный дизайн

## 🌐 Интернационализация

Поддерживаемые языки:

- 🇷🇺 **Русский** (по умолчанию)
- 🇺🇸 **English**

Переводы расположены в `src/i18n/locales/`:

- `common.json` - общие переводы
- `filters.json` - фильтры
- `autocomplete.json` - автокомплит
- `infoPanel.json` - информационная панель
- `footer.json` - подвал

## 🚀 Развертывание

### Продакшен сборка

```bash
pnpm build
pnpm start
```

### Docker (если настроен)

```bash
docker build -t thedivemap .
docker run -p 3000:3000 thedivemap
```

### Vercel (рекомендуется)

```bash
# Установить Vercel CLI
npm i -g vercel

# Развернуть
vercel
```

## 📋 TODO

- [ ] Мобильное приложение (React Native)
- [ ] Система пользователей и избранного
- [ ] Интеграция с социальными сетями

## 🤝 Вклад в разработку

1. Fork репозитория
2. Создайте feature ветку (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в ветку (`git push origin feature/amazing-feature`)
5. Создайте Pull Request

## 📄 Лицензия

Проект распространяется под лицензией ISC.

## 👤 Автор

**Egor Muratov** - [GitHub](https://github.com/egormuratov)

---

Создано с ❤️ для сообщества дайверов 🤿
