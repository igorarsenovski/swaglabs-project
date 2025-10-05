# Swag Labs – Playwright + TypeScript Thesis Project

- This project demonstrates a complete automated testing framework for the Swag Labs web application using Playwright and TypeScript, following the Page Object Model and integrated CI/CD with GitHub Actions and Allure reporting.


## Run locally

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
```


## Test coverage

| #   | Scenario                                   | File                             | Tag         |
| --- | ------------------------------------------ | -------------------------------- | ----------- |
| 1   | Valid login redirects to inventory         | tests/login.spec.ts              | @smoke      |
| 2   | Invalid login shows error                  | tests/login.spec.ts              | @regression |
| 3   | Locked-out user shows error                | tests/login.spec.ts              | @regression |
| 4   | Add item shows in cart                     | tests/cart.spec.ts               | @smoke      |
| 5   | Remove item updates contents               | tests/cart-remove.spec.ts        | @regression |
| 6   | Checkout happy path (two items)            | tests/checkout.spec.ts           | @smoke      |
| 7   | Checkout negative: missing first name      | tests/checkout-negative.spec.ts  | @regression |
| 8   | Open product details and return            | tests/product-details.spec.ts    | @regression |
| 9   | Sort by price low→high ascending           | tests/sorting.spec.ts            | @regression |
| 10  | Logout returns to login and cart persists  | tests/logout-persistence.spec.ts | @regression |
| 11  | Reset App State clears cart                | tests/reset-app-state.spec.ts    | @regression |
| 12  | Auth route protection (redirects & access) | tests/authz-routes.spec.ts       | @regression |
| 13  | Checkout summary totals are correct        | tests/checkout-totals.spec.ts    | @regression |

**AI-assisted** examples live in `tests/ai/` and prompts in `docs/ai-prompt.md`.

## CI Pipeline

- Smoke runs on push/PR, then full suite runs and uploads HTML and Allure reports as artifacts.
