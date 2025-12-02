# Swag Labs – Playwright + TypeScript Thesis Project

- This project demonstrates a complete automated testing framework for the Swag Labs web application using Playwright and TypeScript, following the Page Object Model and integrated CI/CD with GitHub Actions and Allure reporting.
- **AI-Assisted Test Generation**: Includes an AI tool that supports test scenario generation using Ollama (local LLM).

## Run locally

**Note:** Works on Windows, macOS, and Linux.  
 Allure reporting requires Java JDK 17.

```bash
npm install
npx playwright install

# quick subset
npm run test:smoke

# full suite
npm test

# open Playwright report
npm run report:open

# generate & open Allure
npm run allure:gen
npm run allure:open

# AI test scenario generation (requires Ollama)
npm run ai:generate -- "As a user, I want to filter products by price"
```

## AI Test Scenario Generator

This project includes an AI tool that demonstrates how AI can support test scenario generation. See [ai/README.md](ai/README.md) for details.
