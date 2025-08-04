import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    globals: true,
    exclude: ['e2e/**', '**/*.e2e.spec.ts', 'node_modules/**', '**/node_modules/**'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'src/__tests__/**',
        'src/__mocks__/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/setup.ts',
        '**/test-utils.tsx',
        // Next.js generated files
        '.next/**',
        '**/.next/**',
        // Allure reports
        'allure-report/**',
        '**/allure-report/**',
        // Playwright tests
        'playwright-tests/**',
        '**/playwright-tests/**',
        // API routes (server-side code)
        'src/app/api/**',
        // Supabase client/server files (configuration)
        'src/lib/supabase/**',
        // Type definitions
        'src/lib/types/**',
        // UI index files (just re-exports)
        'src/components/ui/index.ts',
        // Build artifacts
        'dist/**',
        'build/**',
        'out/**',
        // Coverage reports
        'coverage/**',
        '**/coverage/**',
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
});
