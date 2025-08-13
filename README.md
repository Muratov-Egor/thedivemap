# The Dive Map

The Dive Map is a map of the world that shows the locations of dive sites.

## Testing Configuration

### Playwright Test Setup

The project uses Playwright for both API and E2E testing with a custom configuration that separates test execution by browser:

#### Test Projects

- **API Tests** (`api-chromium`): Run only in Chromium browser
  - Located in `playwright-tests/api/`
  - 35 tests in 4 files
  - Tests API endpoints and data validation

- **E2E Tests** (`e2e-chromium`, `e2e-mobile-chrome`): Run in multiple browsers
  - Located in `playwright-tests/e2e/`
  - 4 tests in 3 files (8 total when running in both browsers)
  - Tests user interactions and accessibility

#### Available Test Commands

```bash
# Run all tests (API + E2E in all browsers)
pnpm test

# Run only API tests (Chromium only)
pnpm api
pnpm test:api

# Run only E2E tests (Desktop + Mobile Chrome)
pnpm e2e
pnpm test:e2e

# Run E2E tests separately
pnpm e2e:desktop    # Desktop Chrome only
pnpm e2e:mobile     # Mobile Chrome only

# Run tests with UI
pnpm e2e:ui         # E2E tests with Playwright UI
pnpm e2e:headed     # E2E tests in headed mode

# Generate and open Allure reports
pnpm report
pnpm report:clean   # Clean report files
```

#### Test Structure

```
playwright-tests/
├── api/                    # API tests (Chromium only)
│   ├── api-objects/        # Page Object classes for API
│   ├── dive-sites.spec.ts  # Dive sites API tests
│   ├── places.spec.ts      # Places API tests
│   └── test-data.ts        # Test data constants
├── e2e/                    # E2E tests (All browsers)
│   ├── page-objects/       # Page Object classes
│   ├── accessibility.testing.spec.ts
│   ├── clusters.spec.ts
│   └── markers.spec.ts
└── mocks/                  # Mock data files
```

#### Browser Configuration

- **API Tests**: Chromium only (no browser-specific behavior needed)
- **E2E Tests**: 
  - Desktop Chrome (1280x720)
  - Mobile Chrome (iPhone 13 - 375x812)

#### Adding New Browsers

To add new browsers for E2E testing, uncomment and modify the browser configurations in `playwright.config.ts`:

```typescript
// {
//   name: 'e2e-firefox',
//   testMatch: /.*e2e.*\.spec\.ts/,
//   use: { ...devices['Desktop Firefox'] },
// },
// {
//   name: 'e2e-webkit', 
//   testMatch: /.*e2e.*\.spec\.ts/,
//   use: { ...devices['Desktop Safari'] },
// },
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run linting
pnpm lint

# Format code
pnpm format
```

## Building

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```
