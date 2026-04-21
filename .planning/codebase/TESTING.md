# Testing Patterns

**Analysis Date:** 2026-04-21

## Test Framework

**Runner:**
- Playwright 1.59.x (E2E testing)
- Config: `playwright.config.ts`
- No unit test framework configured (no Jest, Vitest, or similar)

**Assertion Library:**
- Playwright's built-in assertions (expect)
- No separate assertion library detected

**Run Commands:**
```bash
npm run test              # Run all E2E tests
npm run test:ui           # Run tests with Playwright UI
npm run test:headed       # Run tests in headed mode (visible browser)
```

## Test File Organization

**Location:**
- Playwright test directory: `./tests` (configured in `playwright.config.ts`)
- No test files co-located with source code
- Current `tests/` directory contains JSON backup files only (no actual tests)

**Naming:**
- Expected: `.spec.ts` or `.test.ts` extension
- No test files found in project

**Structure:**
```
tests/
├── omps-backup-*.json    # Backup files (not test files)
└── omps-latest.json      # Latest backup (not test file)
```

**Note:** The `tests/` directory contains backup data files, not test code. No test files exist in the project currently.

## Test Structure

**Suite Organization:**
- No existing tests to analyze patterns
- Playwright standard pattern would be:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

**Expected Patterns:**
- Playwright's `test.describe` for grouping
- `test.beforeEach` for setup
- `test.afterEach` for teardown
- Page fixture from Playwright

## Mocking

**Framework:**
- No mocking framework configured
- Playwright runs against real browser/extension

**Expected Patterns for Extension Testing:**
- Mock Chrome APIs may require special setup
- Extension loading via Playwright's Chrome extension testing capabilities

**What to Mock (when tests added):**
- Storage operations for unit tests
- Chrome API responses
- Network requests for version checking

**What NOT to Mock:**
- UI rendering (test actual DOM)
- User interactions (use Playwright actions)

## Fixtures and Factories

**Test Data:**
- No test fixtures directory
- Built-in data in `src/data/built-in-data.ts` could serve as test fixtures

**Location:**
- Potential test data: `src/data/built-in-data.ts`
- Backup files in `tests/` could be sample data for import/export testing

## Coverage

**Requirements:** None enforced (no coverage tool configured)

**Coverage Tool:**
- Not configured
- TypeScript `noEmit: true` prevents standard coverage collection

**Recommendation:**
- Add Vitest for unit tests with coverage
- Use Playwright's built-in coverage for E2E

## Test Types

**Unit Tests:**
- Not implemented
- Recommendation: Add Vitest for store logic, utilities, and storage operations
- Target coverage: 80%+ for core logic

**Integration Tests:**
- Not implemented
- Potential scope: Chrome extension message flow, storage sync

**E2E Tests:**
- Playwright configured but no tests written
- Framework ready for:
  - Extension popup UI testing
  - Content script injection testing
  - Import/export functionality

**Playwright Configuration:**
```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

## Common Patterns

**Async Testing:**
- No existing patterns to reference
- Expected pattern for Playwright:
```typescript
test('async operation', async ({ page }) => {
  await page.click('button');
  await expect(page.locator('.result')).toBeVisible();
});
```

**Error Testing:**
- No existing patterns
- Expected pattern:
```typescript
test('handles error gracefully', async ({ page }) => {
  // Trigger error condition
  await expect(page.locator('.error-message')).toBeVisible();
});
```

## Testing Gaps

**Missing Tests:**
1. Store operations (`src/lib/store.ts`) - CRUD operations
2. Storage management (`src/lib/storage.ts`) - persistence and migration
3. Import/export (`src/lib/import-export.ts`) - file operations and validation
4. Input detection (`src/content/input-detector.ts`) - DOM observation
5. Insert handler (`src/content/insert-handler.ts`) - text insertion
6. Service worker (`src/background/service-worker.ts`) - message handling
7. UI components (`src/popup/App.tsx`, `src/content/components/*`)

**Priority Areas for Testing:**
1. StorageSchema validation (high - data integrity)
2. Migration logic (high - version upgrades)
3. Message handling (medium - cross-context communication)
4. Import/export validation (medium - user data operations)

## Recommended Test Setup

**Unit Tests (Vitest):**
```typescript
// vitest.config.ts (recommended addition)
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/'],
    },
  },
});
```

**Test File Locations:**
- Unit tests: `src/**/*.test.ts` (co-located)
- E2E tests: `tests/e2e/**/*.spec.ts` (separate)

**Chrome API Mocking:**
```typescript
// Recommended setup for unit tests
vi.stubGlobal('chrome', {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
  runtime: {
    sendMessage: vi.fn(),
    getManifest: vi.fn(() => ({ version: '1.0.0' })),
  },
});
```

---

*Testing analysis: 2026-04-21*