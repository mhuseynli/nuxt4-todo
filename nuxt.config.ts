// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/test-utils/module'],
  typescript: {
    tsConfig: {
      include: ['../tests/**/*.ts']
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Todo',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'A production-ready Todo application for.'
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: 'https://dummyjson.com' // Automatically overridden by NUXT_PUBLIC_API_BASE env var
    }
  },
  css: ['~/assets/scss/main.scss'],
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit']
    }
  }
});
