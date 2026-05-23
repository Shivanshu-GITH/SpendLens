# TESTS.md — SpendLens

## Test Framework: Vitest
We use Vitest for its speed, ESM-native support, and seamless integration with TypeScript.

## Test Files
### 1. `__tests__/audit-engine.test.ts`
- **Redundancy Test:** Verifies that GitHub Copilot is identified as redundant when Cursor Pro is present.
- **Downgrade Test:** Verifies that Team plans are flagged for downgrade if seat count is below the optimal threshold (e.g., < 3 seats).
- **Switch Test:** Verifies that ChatGPT is suggested for replacement by Cursor in a coding-focused use case.
- **Optimal Stack Test:** Verifies that `isAlreadyOptimal` is true when no savings are found.
- **Math Verification:** Ensures that `totalMonthlySavings` and `totalAnnualSavings` are calculated correctly.

## Running Tests
To run the full test suite, use the following command:

```bash
npm run test
# or
npx vitest run
```

## CI/CD Integration
Tests are automatically run on every push and pull request to the `main` branch via GitHub Actions (`.github/workflows/ci.yml`).
