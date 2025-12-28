# Swag Labs – Playwright + TypeScript Thesis Project

Automated testing framework for Swag Labs using Playwright, TypeScript, Page Object Model, CI/CD with GitHub Actions, and Allure reporting. Includes AI-assisted test scenario generation using Ollama.

## Prerequisites

- Node.js
- Java JDK 17 (for Allure reporting)

## Quick Start

```bash
npm install
npx playwright install

# Run tests
npm run test:smoke      # Quick subset
npm test                # Full suite
npm run test:headed     # Run with browser visible
npm run test:ui         # Interactive UI mode
npm run test:regression # Regression tests only

# View reports
npm run report:open     # Playwright report
npm run allure:full     # Clean, test, and generate Allure report
npm run allure:open     # Open Allure report

# AI test generation (requires Ollama)
npm run ai:generate -- "As a user, I want to filter products by price"
```

## AI Test Scenario Generator

See [ai/README.md](ai/README.md) for details.
