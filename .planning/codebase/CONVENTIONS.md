# Coding Conventions

**Analysis Date:** 2026-04-17

## Naming Patterns

**Files:**
- TypeScript files: `kebab-case.ts` (e.g., `input-detector.ts`, `service-worker.ts`)
- React components: `PascalCase.tsx` (e.g., `Header.tsx`, `PromptCard.tsx`, `DropdownApp.tsx`)
- UI primitives: lowercase with dash (e.g., `button.tsx`, `dialog.tsx`, `scroll-area.tsx`)
- Barrel/index files: Not used - direct imports from component files

**Functions:**
- Regular functions: `camelCase` (e.g., `truncateText`, `sortCategoriesByOrder`, `handleInputDetected`)
- React event handlers: `handle` prefix + action (e.g., `handleToggle`, `handleSelect`, `handleImport`, `handleEditPrompt`)
- Utility functions: descriptive verb-based names (e.g., `generateId`, `validateImportData`)
- Class methods: `camelCase` (e.g., `getData`, `saveData`, `insertPrompt`, `tryDetect`)

**Variables:**
- Constants: `UPPER_SNAKE_CASE` for module-level (e.g., `LOG_PREFIX`, `STORAGE_KEY`, `HOST_ID`, `DEBOUNCE_MS`)
- Local constants: `camelCase` (e.g., `allCategoryId`, `targetElement`)
- State variables: `camelCase` (e.g., `isLoading`, `isOpen`, `selectedCategoryId`)
- Refs: descriptive names with semantic meaning (e.g., `insertHandlerRef`, `observer`, `reactRoot`)

**Types:**
- Interfaces: `PascalCase` with descriptive noun (e.g., `Prompt`, `Category`, `StorageSchema`, `PromptStore`, `DropdownAppProps`)
- Type aliases: `PascalCase` (e.g., `MessageResponse`, `ValidationResult`)
- Enums: `PascalCase` for enum name, `UPPER_SNAKE_CASE` for values (e.g., `MessageType.PING`, `MessageType.GET_STORAGE`)
- Props interfaces: Component name + `Props` suffix (e.g., `HeaderProps`, `PromptListProps`, `PromptEditDialogProps`, `ButtonProps`)

## Code Style

**Formatting:**
- TypeScript strict mode enabled in `tsconfig.json`
- No explicit formatter config (no `.prettierrc` detected)
- Uses TypeScript compiler options: `noUnusedLocals: true`, `noUnusedParameters: true`, `noFallthroughCasesInSwitch: true`
- Indentation: 2 spaces (consistent across files)
- Quotes: Single quotes for strings, double quotes for JSX attributes
- Trailing commas: Used in multiline structures

**Linting:**
- No ESLint configuration detected
- TypeScript compiler provides type checking via `tsc --noEmit`
- Build includes TypeScript check: `"build": "tsc && vite build"`

## Import Organization

**Order:**
1. React imports first (e.g., `import { useState, useEffect } from 'react'`)
2. Third-party libraries (e.g., `import { create } from 'zustand'`, `import { Download } from 'lucide-react'`)
3. Internal type imports with `type` keyword (e.g., `import type { Prompt, Category } from '../shared/types'`)
4. Internal module imports using `@/` alias (e.g., `import { cn } from '@/lib/utils'`)
5. Relative imports for same-directory files (e.g., `import Header from './Header'`)

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json` and `vite.config.ts`)
- Used primarily for lib imports: `import { cn } from '@/lib/utils'`
- Relative imports used for same-module references: `import type { Prompt } from '../../shared/types'`

**Type Imports:**
- Use `import type` for type-only imports: `import type { Prompt, Category, StorageSchema } from '../shared/types'`
- Distinguishes type imports from value imports for better tree-shaking

## Error Handling

**Patterns:**
- Async/await with try-catch blocks
- Type narrowing with `error: unknown` parameter
- Console logging with prefix `[Prompt-Script]`
- Error responses use `{ success: boolean, error?: string }` format

**Example from `src/lib/storage.ts`:**
```typescript
async getData(): Promise<StorageSchema> {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const data = result[STORAGE_KEY] as StorageSchema | undefined
    if (!data) {
      const defaultData = this.getDefaultData()
      await this.saveData(defaultData)
      return defaultData
    }
    return data
  } catch (error: unknown) {
    console.error('[Prompt-Script] Failed to get storage data:', error)
    return this.getDefaultData()
  }
}
```

**Message Response Pattern:**
```typescript
interface MessageResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
```

**Extension Context Handling:**
- Check `chrome.runtime?.id` before messaging to detect invalidated context
- Check `chrome.runtime?.lastError` after messaging operations
- Return `true` from `onMessage` listeners for async responses

## Logging

**Framework:** Console with structured prefix

**Patterns:**
```typescript
const LOG_PREFIX = '[Prompt-Script]'
console.log(LOG_PREFIX, 'Content script loaded on:', window.location.href)
console.error(LOG_PREFIX, 'Failed to get storage data:', error)
console.warn(LOG_PREFIX, 'Storage usage warning:', percentage)
```

**When to Log:**
- Lifecycle events: script load, component mount/unmount
- Error conditions: storage failures, API errors
- Warning conditions: storage quota approaching limit, large datasets
- Navigation events: SPA URL changes detected

**Log Levels:**
- `console.log`: Normal operations, debugging info
- `console.warn`: Warning conditions (e.g., storage quota > 80%)
- `console.error`: Error conditions with error object

## Comments

**When to Comment:**
- JSDoc/TSDoc for exported functions and class methods
- Block comments explaining complex logic or design decisions
- Inline comments for non-obvious operations

**JSDoc/TSDoc:**
```typescript
/**
 * StorageManager class for managing extension data persistence
 */
export class StorageManager {
  /**
   * Get singleton instance of StorageManager
   */
  static getInstance(): StorageManager { ... }
}

/**
 * Truncate text to a maximum length with ellipsis suffix
 */
export function truncateText(text: string, maxLength: number = 50): string { ... }
```

**Section Comments:**
```typescript
// Phase 2: Prompt types
export interface Prompt { ... }

// Phase 3: Category types
export interface Category { ... }
```

## Function Design

**Size:** Functions kept focused and small (typically 10-30 lines)

**Parameters:**
- Use objects for multiple related parameters
- Provide default values where appropriate: `maxLength: number = 50`
- Use `Omit<T, 'id'>` for creation functions: `addPrompt(prompt: Omit<Prompt, 'id'>)`

**Return Values:**
- Return `{ success: boolean, data?: T, error?: string }` for async operations
- Return `boolean` for success/failure operations (e.g., `insertPrompt` returns `boolean`)
- Return `Promise<T>` for async data retrieval

**Callback Pattern:**
```typescript
constructor(callback: (element: HTMLElement) => void) {
  this.onInputDetected = callback
}
```

## Module Design

**Exports:**
- Named exports preferred: `export function ...`, `export class ...`, `export const ...`
- Default exports for React components: `export default Header`
- Named exports for utility functions: `export function truncateText(...)`
- Singleton pattern: `export const storageManager = StorageManager.getInstance()`

**Barrel Files:** Not used - direct imports from source files

**Class Pattern:**
- Singleton classes: `StorageManager.getInstance()`
- Instance classes: `new InputDetector(callback)`, `new InsertHandler()`
- Private methods prefixed with `_` convention or marked `private`

## React Patterns

**Component Structure:**
```typescript
interface DropdownAppProps {
  inputElement: HTMLElement
}

export function DropdownApp({ inputElement }: DropdownAppProps) {
  // Hooks at top
  const [isOpen, setIsOpen] = useState(false)
  const insertHandlerRef = useRef<InsertHandler>(new InsertHandler())

  useEffect(() => { ... }, [])

  // Callbacks with useCallback
  const handleToggle = useCallback(() => { ... }, [])
  const handleSelect = useCallback((prompt: Prompt) => { ... }, [inputElement])

  // Return JSX
  return ( ... )
}
```

**State Management:**
- Zustand store with selectors: `usePromptStore(state => state.prompts)`
- Local state for component-specific concerns
- useRef for mutable values that don't trigger re-renders

**useMemo for Derived Data:**
```typescript
const filteredPrompts = useMemo(() => {
  if (selectedCategoryId === ALL_CATEGORY_ID) {
    return prompts
  }
  return prompts.filter(p => p.categoryId === selectedCategoryId)
}, [prompts, selectedCategoryId])
```

## CSS/Styling Patterns

**Popup (Tailwind):**
- Use Tailwind utility classes for styling
- Custom color values inline: `bg-[#171717]`, `text-[#64748B]`, `border-[#E5E5E5]`
- Radix UI primitives for complex components
- `cn()` utility for class merging: `cn(buttonVariants({ variant, size, className }))`

**Content Script (Shadow DOM):**
- Inline styles in `UIInjector.getStyles()` method
- Full CSS isolation via Shadow DOM
- No Tailwind - raw CSS for content script UI

---

*Convention analysis: 2026-04-17*