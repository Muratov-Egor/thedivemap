# The Dive Map

A Next.js application that displays a world map with dive sites, filters, and localized UI.

## Overview

The app renders a MapLibre GL map and displays dive sites from a Supabase database via Next.js Route Handlers. API endpoints expose filtered data for tests and potential integrations. UI supports English and Russian via i18next.

## Tech Stack

- Next.js 15 (App Router)
- React 19, TypeScript
- MapLibre GL
- Supabase JS + SSR helpers
- Tailwind CSS
- Playwright + Allure (API/E2E tests)
- ESLint 9, Prettier 3

## Prerequisites

- Node.js 20+
- pnpm (project uses lockfile; prefer pnpm for all commands)

## Getting Started

1. Install deps:

```bash
pnpm install
```

2. Configure environment:
   Create `.env.local` with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

3. Start dev server (http://localhost:3000):

```bash
pnpm dev
```

## Scripts

- `pnpm dev` — start Next.js dev server
- `pnpm build` — production build
- `pnpm start` — start production server
- `pnpm lint` — run ESLint (Next.js config)
- `pnpm format` — format with Prettier
- `pnpm format:check` — check formatting
- `pnpm api` — run Playwright API tests (`playwright-tests/api`)
- `pnpm e2e` — run Playwright UI tests (`playwright-tests/e2e`)
- `pnpm e2e:ui` — Playwright UI mode
- `pnpm e2e:headless` — headed run for e2e
- `pnpm report` — generate & open Allure report
- `pnpm report:clean` — clean test reports

## Testing

- Base URL: `http://localhost:3000` (see `playwright.config.ts`)
- Before running tests, ensure the dev server is running in another terminal: `pnpm dev`
- API tests:

```bash
pnpm api
```

- E2E tests:

```bash
pnpm e2e
```

- Allure report:

```bash
pnpm report
```

## API Endpoints (App Router)

- `GET /api/dive-sites` — list/filter dive sites. Query params include: `id`, `country_id`, `region_id`, `location_id`, `site_type_id`, `difficulty_id`, `depth_min`, `visibility_min`, `rating_min`, `status`.
- `GET /api/places` — geo names for countries/regions/locations with `lang` support (`ru`, `en`).

## Internationalization

- i18next + react-i18next
- Languages: `en`, `ru`
- Locale files: `src/i18n/locales/{en,ru}/common.json`
- Client-side init: `src/i18n/i18n.client.ts`

## Mapping

- MapLibre GL renders the base map and markers.
- Map style example: `public/map-styles/arcgis_hybrid.json`.

## Project Structure

```
.
├── src/
│  ├── app/
│  │  ├── api/
│  │  │  ├── dive-sites/route.ts
│  │  │  └── places/route.ts
│  │  ├── layout.tsx
│  │  └── page.tsx
│  ├── components/
│  │  ├── Header.tsx
│  │  ├── MapContainer.tsx
│  │  ├── MapMarkers.tsx
│  │  └── ui/Button.tsx
│  ├── contexts/
│  │  ├── DiveSitesContext.tsx
│  │  └── MapContext.tsx
│  ├── i18n/
│  └── lib/
│     └── supabase/
├── playwright-tests/
│  ├── api/
│  └── e2e/
├── public/
│  └── map-styles/
├── memory-bank/
└── README.md
```

## Quality & Conventions

- Follow ESLint and Prettier configs.
- Prefer modular, typed React components (hooks, contexts).
- For E2E: Page Object pattern with `data-testid` selectors (no CSS class selectors).
- Use pnpm exclusively; do not modify the lockfile manually.

## Troubleshooting

- Supabase env variables are required by API routes. If missing, `/api/dive-sites` may fail.
- Ensure port 3000 is available before running tests.

## License

ISC
