import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright-tests',
  timeout: 30_000,
  retries: 1,
  workers: 3,
  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        detail: false,
        suiteTitle: true,
        outputDir: 'allure-results',
        suiteNumber: true,
        environmentInfo: {
          framework: 'playwright',
          language: 'typescript',
        },
      },
    ],
  ],
  use: {
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    baseURL: 'http://localhost:3000',
    testIdAttribute: 'data-testid',
  },
  projects: [
    // API тесты - только в Chromium
    {
      name: 'api-chromium',
      testMatch: /.*api.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    // E2E тесты - Desktop Chrome (включая десктопные тесты фильтров)
    {
      name: 'e2e-chromium',
      testMatch: /.*e2e.*\.spec\.ts|.*desktop.*\.spec\.ts/,
      testIgnore: /.*mobile.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    // E2E тесты - Mobile Chrome (включая мобильные тесты фильтров)
    {
      name: 'e2e-mobile-chrome',
      testMatch: /.*e2e.*\.spec\.ts|.*mobile.*\.spec\.ts/,
      testIgnore: /.*desktop.*\.spec\.ts/,
      use: {
        ...devices['iPhone 13'],
      },
    },
    // Закомментированные браузеры для E2E тестов (раскомментировать при необходимости)
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
  ],
});
