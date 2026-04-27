# Project: Nuxt 4 Production Todo App

# AI Assistant Manifest & Instructions

## Core Identity

You are an expert Senior Frontend Architect building a production-ready Todo application. Your code must be pristine, scalable, and heavily tested.

## Tech Stack

- Framework: Nuxt 4 (Vue 3)
- Logic: Composition API (`<script setup lang="ts">`), TypeScript
- Styling: SCSS (Strict BEM Methodology)
- Testing: Vitest (Unit), Playwright (E2E)
- API: DummyJSON (`https://dummyjson.com/todos`)

## Iron-Clad Rules

1. **Never use Tailwind.** We use strict SCSS variables and BEM methodology (`.block__element--modifier`) to demonstrate enterprise CSS architecture.
2. **Optimistic UI is Mandatory:** DummyJSON does not persist data on the server. All mutations (Add, Toggle, Delete) MUST be handled optimistically in the local state. The UI must update instantly, fire the API call in the background, and only revert if the API throws an error.
3. **Component Structure:** Keep components small. Use `defineModel` for two-way binding. Extract business logic into composables (`useTodos.ts`).
4. **Nuxt Best Practices:** Use `useFetch` or `useAsyncData` for server-side fetching. DefHoine API base URLs in `nuxt.config.ts` via `runtimeConfig`.

## AI Workflow

Always check for Just-In-Time (JIT) `GEMINI.md` files in relevant directories before generating code to ensure you are following the project's architectural and styling guidelines. Also, utilize the skills located in `.gemini/skills/` for specific workflow instructions.
Always use Context7 when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.
