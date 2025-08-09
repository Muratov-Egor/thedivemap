## Project Style Guide

### Languages and Frameworks

- TypeScript with strict types
- Next.js 15, React 19

### Linting & Formatting

- ESLint: pnpm lint
- Prettier: pnpm format

### React Patterns

- Hooks, Context, custom hooks
- Performance: React.memo, useMemo, useCallback
- Encapsulated, reusable, typed components

### Testing

- Playwright E2E with Page Objects under playwright-tests/e2e/page-objects
- Use data-testid selectors; avoid CSS class selectors
- Allure reports enabled
- Tests should fail on unexpected API fields; no skip on empty DB

### Structure

- Feature-based organization
- Avoid inline styles; keep styles consistent

### Naming

- Files: kebab-case; Components: PascalCase; hooks: useXxx
