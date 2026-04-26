import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    environment: 'nuxt' // Runs tests inside a full Nuxt environment (auto-imports composables/components)
  }
});
