# Testing & CI/CD Strategy

## Overview
While the assignment requirements did not explicitly ask for automated testing or CI/CD pipelines, building a "production-ready" application mandates them. I took the initiative to implement a robust quality assurance layer operating at two critical levels of the testing pyramid, ensuring that both the underlying JavaScript logic and the final rendered user experience are flawless.

## 1. Unit Testing (Vitest)
We use **Vitest** to isolate and test the pure state logic of our application, specifically targeting the `useTodos` composable.

- **Nuxt Test Environment:** By configuring `vitest.config.ts` to use the `@nuxt/test-utils` module, our tests run inside a fully simulated Nuxt environment. This allows Vitest to natively understand auto-imported Nuxt composables like `useState` and `useRuntimeConfig` without requiring massive boilerplate mocks.
- **Global Mocking:** We utilize `vi.stubGlobal('$fetch', mockFetch)` to intercept all network requests. This allows us to mathematically prove that our Optimistic UI logic works—specifically testing the "Rollback" scenarios by intentionally forcing `$fetch` to reject and verifying the local arrays revert to their previous states.

## 2. End-to-End Testing (Playwright)
We use **Playwright** to execute cross-browser E2E user journeys across Chromium, Firefox, and WebKit. 

- **Native BDD:** Instead of adding the overhead of Cucumber, we utilize Playwright's native `test.step()` API. Every action is wrapped in a `Given/When/Then` block, resulting in a beautiful, Gherkin-style HTML report that non-technical stakeholders can read.
- **Real Network Execution:** Unlike the unit tests, our E2E tests do not mock the network. The tests hit the real DummyJSON API via the local Nuxt dev server.
- **Visual Regression:** We utilize `expect(page).toHaveScreenshot()` to capture pixel-perfect baseline images of the components. To prevent the dynamic DummyJSON data from causing flaky visual failures, we explicitly mask the `.todo-list__items` container during the snapshot phase, ensuring we only test the layout and CSS rendering.

## 3. GitHub Actions CI Pipeline
The repository includes a strict `.github/workflows/ci.yml` pipeline that triggers on all pushes and pull requests to `main`.

It executes a "Fail Fast" strategy:
1. **Typecheck:** `npm run typecheck` ensures no implicit `any`s or strict null violations exist.
2. **Lint:** `npm run lint` ensures Prettier and ESLint formatting rules are respected.
3. **Unit Tests:** `npx vitest run` verifies the core state machine.
4. **E2E Tests:** `npx playwright test` installs the OS-level browser dependencies, spins up the Nuxt server, and runs the visual user journeys.
5. **Artifact Upload:** Regardless of pass/fail, the `playwright-report/` and visual diff images are uploaded as downloadable GitHub Artifacts. This is critical for debugging visual regressions caused by Linux/Ubuntu font-rendering differences in the cloud.
