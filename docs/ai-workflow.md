# Agentic AI Workflow

## Centralized Brain: The `.gemini` Directory
The intelligence of the project is centralized within the `.gemini` directory. The goal here was to create an AI workflow that is as **controllable and scalable as possible**. While I utilized the Gemini CLI for this execution, this exact folder structure (Skills, Context, Agents) is tool-agnostic and applies equally to Claude or other advanced LLMs.

### 1. Context Rules (`GEMINI.md`)
The root `GEMINI.md` file serves as the core Assistant Manifest. It defines the absolute "Iron-Clad Rules" of the project:
- Strict use of the Vue 3 Composition API.
- Total prohibition of Tailwind CSS in favor of Vanilla SCSS & BEM.
- Mandatory implementation of Optimistic UI.

The Gemini CLI uses a **Context Hierarchy**. Before modifying any file, the AI automatically scans for Just-In-Time (JIT) context files to ensure its actions align with the project's macro-goals.

### 2. Vercel AI Skills (`.gemini/skills/`)
Instead of relying on outdated training data, the agent was equipped with highly specialized, up-to-date knowledge bases (Skills) downloaded directly into the workspace.
- `vue-best-practices`: Enforces `<script setup>`, strict reactivity, and explicit component data flow.
- `scss-best-practices`: Mandates strict BEM conventions (`.block__element--modifier`), variable usage, and clean nesting.
- `playwright-best-practices` & `vitest`: Provides the exact syntax and patterns required to build modern, isolated test suites.

## Specialized Subagents
To prevent the main orchestrator's context window from degrading, complex tasks were delegated to specialized expert agents:

- **`feature-builder`**: Responsible for the heavy lifting of Vue component generation and complex state refactoring (e.g., implementing the Hybrid Store logic).
- **`test-engineer`**: Specifically invoked to write 100% logic coverage unit tests in Vitest and map out Native BDD E2E scenarios in Playwright.
- **`qa-engineer`**: An autonomous auditing agent. Using the `chrome-devtools` Model Context Protocol (MCP), this agent physically opened a hidden browser, navigated to `localhost:3000`, clicked the actual DOM buttons, monitored the Network tab for 404 errors, and ran Lighthouse accessibility audits to verify the code mathematically before any tests were even written.
