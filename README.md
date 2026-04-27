# Nuxt 4 Todo Application

![Nuxt](https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxt.js&logoColor=#00DC82)
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-729B1B?style=for-the-badge&logo=vitest&logoColor=FCC72B)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

A production-ready, Todo application.

**Live Demo:** [nuxt4-todo.vercel.app](https://nuxt4-todo.vercel.app/)

## Tech Stack
- **Framework:** Nuxt 4 & Vue 3 (Composition API)
- **Styling:** Vanilla SCSS (Strict BEM Methodology)
- **Language:** TypeScript (Strict Mode)
- **State Management:** Hybrid Optimistic Store (Local + Server)

## 🏗️ The Engineering Philosophy
While the baseline requirements for this assignment were straightforward, the prompt specifically requested a project structured **"as if it were going into a real production environment."** I took this to heart. 

What might appear at first glance as over-engineering is actually a deliberate demonstration of scalable, production-grade frontend architecture. I took initiative in three key areas beyond the basic requirements:

1. **Scalable AI Architecture:** The job description emphasized AI-assisted development. Instead of just using AI to write code, I architected a highly controllable, tool-agnostic AI workspace (using the `.gemini` directory, though the structure applies to Claude or any modern LLM). By defining strict Contexts, Skills, and Agents, the project scales safely with AI without degrading codebase quality.
2. **Product & UX Initiative:** DummyJSON presents a unique challenge: POST requests succeed, but data isn't actually saved. If mixed with paginated server data, newly added tasks would float awkwardly on Page 3, looking like a bug. I turned this technical limitation into a UX advantage by designing an "Inbox vs. Backlog" pattern. User-added tasks stay pinned at the top, while server tasks paginate below.
3. **Automated Quality Assurance:** A true production environment requires CI/CD. While not explicitly requested, I implemented Vitest for logic, Playwright for E2E browser testing, and a GitHub Actions pipeline to ensure the application is mathematically verifiable before deployment to Vercel.

## Quick Start

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Development Server
Start the Nuxt 4 development server on `http://localhost:3000`:
```bash
npm run dev
```

### 3. Testing
Execute the isolated unit logic tests via Vitest:
```bash
npx vitest run
```

Execute the full Cross-Browser E2E User Journeys & Visual Regressions via Playwright:
```bash
npx playwright test
```

## Documentation

For a deeper dive into the architectural decisions, AI workflows, and testing strategies that power this application, please refer to the detailed guides below:

- 🏗️ **[Architecture & Hybrid Store](./docs/architecture.md):** How we solved read-only API constraints using an "Inbox vs Backlog" UX.
- 🤖 **[Agentic AI Workflow](./docs/ai-workflow.md):** The framework of skills, context rules, and subagents used to autonomously build this app.
- 🧪 **[Testing & CI/CD Pipeline](./docs/testing-and-ci.md):** Our strategy for Vitest mocking, Playwright BDD, and GitHub Actions integration.
