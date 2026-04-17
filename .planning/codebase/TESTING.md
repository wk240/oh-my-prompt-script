# Testing Patterns

**Analysis Date:** 2026-04-17

## Test Framework

**Runner:**
- Not configured
- No test files detected in `src/` directory
- No `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx` files found

**Assertion Library:**
- Not configured

**Run Commands:**
```bash
# No test commands available
npm run build    # TypeScript check included via tsc
npx tsc --noEmit # Type check only
```

## Test File Organization

**Location:**
- Tests not implemented
- Expected pattern: co-located test files next to source (e.g., `utils.test.ts` next to `utils.ts`)
- Alternative: dedicated `src/__tests__/` directory

**Naming:**
- Expected: `*.test.ts` or `*.spec.ts` for TypeScript
- Expected: `*.test.tsx` or `*.spec.tsx` for React components

**Structure:**
```
# Current state: No tests
src/
├── lib/
│   ├── store.ts        # No test file
│   ├── storage.ts      # No test file
│   └── import-export.ts # No test file
├── popup/
│   └── App.tsx         # No test file
│   └── components/     # No test files
└── content/
    └── content-script.ts # No test file
```

## Test Structure

**Suite Organization:**
Tests not implemented. Expected pattern based on project conventions:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { truncateText, sortCategoriesByOrder } from '../shared/utils'

describe('shared/utils', () => {
  describe('truncateText', () => {
    it('returns original text when under max length', () => {
      expect(truncateText('short', 10)).toBe('short')
    })

    it('truncates with ellipsis when over max length', () => {
      expect(truncateText('very long text here', 10)).toBe('very long ...')
    })
  })
})
```

## Recommended Test Setup

**Framework Choice: Vitest**
- Matches existing Vite build system
- ESM-first, TypeScript support built-in
- Fast watch mode for development

**Installation:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Configuration (`vitest.config.ts`):**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.d.ts', 'src/**/index.ts']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Scripts to add:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Mocking

**Framework:** Not configured (vitest recommended)

**Chrome API Mocking:**
Essential for extension testing. Use `chrome` global mock:

```typescript
// setup.ts
import { vi } from 'vitest'

// Mock chrome APIs
global.chrome = {
  runtime: {
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn()
    },
    id: 'test-extension-id',
    lastError: null
  },
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
      getBytesInUse: vi.fn()
    }
  },
  downloads: {
    download: vi.fn()
  },
  tabs: {
    create: vi.fn(),
    sendMessage: vi.fn()
  }
} as unknown as typeof chrome
```

**What to Mock:**
- `chrome.runtime.sendMessage` - message passing
- `chrome.storage.local` - storage operations
- `chrome.downloads.download` - export functionality
- `document.execCommand` - content script insertion
- `window.getSelection` - rich text operations

**What NOT to Mock:**
- Pure utility functions (`truncateText`, `sortCategoriesByOrder`)
- Type definitions and interfaces
- Constants

## Fixtures and Factories

**Test Data:**
```typescript
// fixtures/prompts.ts
import type { Prompt, Category, StorageSchema } from '@/shared/types'

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Category One', order: 1 },
  { id: 'cat-2', name: 'Category Two', order: 2 }
]

export const mockPrompts: Prompt[] = [
  { id: 'p1', name: 'Test Prompt', content: 'test content', categoryId: 'cat-1' },
  { id: 'p2', name: 'Another Prompt', content: 'more content', categoryId: 'cat-2', description: 'Optional' }
]

export const mockStorageData: StorageSchema = {
  prompts: mockPrompts,
  categories: mockCategories,
  version: '1.0.0'
}
```

**Location:**
- Create `src/__tests__/fixtures/` directory
- Export typed mock data for consistent testing

## Coverage

**Requirements:** None enforced

**Recommended Targets:**
- Utility functions: 100% (`src/shared/utils.ts`, `src/lib/utils.ts`)
- Store operations: 80%+ (`src/lib/store.ts`)
- Storage manager: 80%+ (`src/lib/storage.ts`)
- Import/export validation: 90%+ (`src/lib/import-export.ts`)
- React components: 70%+ (user interactions, state changes)

**View Coverage:**
```bash
# After adding vitest
npm run test:coverage
```

## Test Types

**Unit Tests:**
- Scope: Pure functions, utility classes, validation logic
- Approach: Direct function calls with various inputs
- Priority areas:
  - `src/shared/utils.ts` - text truncation, category sorting
  - `src/lib/import-export.ts` - validation logic
  - `src/lib/storage.ts` - StorageManager methods

**Integration Tests:**
- Scope: Store + storage interaction, message passing
- Approach: Mock chrome APIs, test full workflows
- Priority areas:
  - `src/lib/store.ts` - CRUD operations with storage sync
  - `src/background/service-worker.ts` - message routing
  - `src/content/content-script.ts` - component coordination

**E2E Tests:**
- Not used
- Framework recommendation: Playwright with Chrome extension testing
- Challenge: Testing extension in actual browser context
- Alternative: Manual testing with hot reload (`npm run dev`)

## Common Patterns

**Async Testing:**
```typescript
// Testing async storage operations
it('loads data from storage', async () => {
  const mockData = { prompts: [], categories: [], version: '1.0.0' }
  vi.mocked(chrome.storage.local.get).mockResolvedValue({ prompt_script_data: mockData })

  const result = await sendStorageMessage(MessageType.GET_STORAGE)

  expect(result).toEqual(mockData)
})
```

**Error Testing:**
```typescript
// Testing error conditions
it('handles storage errors gracefully', async () => {
  vi.mocked(chrome.storage.local.get).mockRejectedValue(new Error('Quota exceeded'))

  const result = await storageManager.getData()

  // Should return default data on error
  expect(result).toEqual(storageManager.getDefaultData())
})
```

**React Component Testing:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PromptCard from './PromptCard'

describe('PromptCard', () => {
  const mockPrompt = {
    id: 'p1',
    name: 'Test Prompt',
    content: 'test content',
    categoryId: 'cat-1'
  }

  it('renders prompt name', () => {
    render(<PromptCard prompt={mockPrompt} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Test Prompt')).toBeInTheDocument()
  })

  it('calls onEdit when clicked', () => {
    const onEdit = vi.fn()
    render(<PromptCard prompt={mockPrompt} onEdit={onEdit} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByText('Test Prompt'))
    expect(onEdit).toHaveBeenCalledWith(mockPrompt)
  })
})
```

## Test Coverage Gaps

**Untested Areas:**

| Area | Files | Risk | Priority |
|------|-------|------|----------|
| Utility functions | `src/shared/utils.ts` | Low | High |
| Import validation | `src/lib/import-export.ts` | Medium | High |
| Store CRUD operations | `src/lib/store.ts` | High | High |
| Storage operations | `src/lib/storage.ts` | High | High |
| Message routing | `src/background/service-worker.ts` | High | Medium |
| Insert handler | `src/content/insert-handler.ts` | High | Medium |
| Input detector | `src/content/input-detector.ts` | Medium | Low |
| React components | `src/popup/components/*.tsx` | Medium | Medium |
| Dropdown UI | `src/content/components/*.tsx` | Medium | Medium |

**What could break unnoticed:**
- Import validation accepting malformed JSON
- Store operations failing to sync with storage
- Insert handler failing on specific editor types
- Extension context invalidation handling

## Manual Testing

**Current Approach:**
- Hot reload via `npm run dev`
- Load extension from `dist/` in Chrome Dev Mode
- Test on Lovart AI platform (production or `file:///*`)

**Testing Checklist:**
1. Trigger button appears next to Lovart input
2. Dropdown opens/closes correctly
3. Prompt insertion works in Lexical editor
4. Category filtering functions
5. Settings popup CRUD operations
6. Import/export file operations
7. Storage persistence across reloads

---

*Testing analysis: 2026-04-17*