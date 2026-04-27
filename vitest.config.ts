import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    environment: 'nuxt', // Runs tests inside a full Nuxt environment (auto-imports composables/components)
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/e2e/**' // Ignore Playwright E2E tests so Vitest does not crash
    ]
  }
});
