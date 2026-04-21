# Coding Conventions

**Analysis Date:** 2026-04-21

## Naming Patterns

**Files:**
- TypeScript source files: kebab-case (e.g., `content-script.ts`, `input-detector.ts`, `insert-handler.ts`)
- React components: PascalCase (e.g., `PromptCard.tsx`, `DropdownApp.tsx`, `ErrorBoundary.tsx`)
- UI primitives: lowercase with dot separation (e.g., `button.tsx`, `dialog.tsx`)
- Constants files: kebab-case (e.g., `constants.ts`, `built-in-data.ts`)
- Migration files: version-based (e.g., `v1.0.ts`)

**Functions:**
- camelCase for all functions (e.g., `truncateText`, `sortCategoriesByOrder`, `handleInputDetected`)
- Handler functions prefixed with `handle` (e.g., `handleToggle`, `handleSelect`, `handleDeletePrompt`)
- Private methods prefixed with `private` keyword (class-based code)

**Variables:**
- camelCase for local/state variables (e.g., `prompts`, `categories`, `inputElement`)
- UPPER_SNAKE_CASE for constants (e.g., `STORAGE_KEY`, `PLATFORM_DOMAIN`, `LOG_PREFIX`, `HOST_ID`)
- React hooks: `useState`, `useCallback`, `useEffect` patterns

**Types:**
- PascalCase for all interfaces and types (e.g., `Prompt`, `Category`, `StorageSchema`, `MessageResponse`)
- Props interfaces: ComponentName + "Props" (e.g., `PromptCardProps`, `DropdownAppProps`)
- Store interfaces: descriptive names (e.g., `PromptStore`, `ValidationResult`)

**Classes:**
- PascalCase (e.g., `StorageManager`, `InputDetector`, `UIInjector`, `InsertHandler`)
- Singleton pattern uses `getInstance()` static method

## Code Style

**Formatting:**
- No Prettier configuration file detected in project root
- Indentation: 2 spaces (TypeScript standard)
- Quotes: single quotes for imports, double quotes in JSX attributes
- Semi-colons: used consistently

**Linting:**
- No ESLint configuration file detected in project root
- TypeScript compiler enforces strict mode via `tsconfig.json`

**TypeScript Configuration:**
- `strict: true` - full type checking
- `noUnusedLocals: true` - no unused variable warnings
- `noUnusedParameters: true` - no unused parameter warnings
- `noFallthroughCasesInSwitch: true` - exhaustive switch checks
- Target: `ES2020` with `ESNext` modules

## Import Organization

**Order:**
1. React and external packages (e.g., `import { useEffect, useState } from 'react'`)
2. Third-party libraries (e.g., `import { create } from 'zustand'`)
3. Internal shared modules using `@/` alias (e.g., `import { MessageType } from '@/shared/messages'`)
4. Relative imports (e.g., `import { InputDetector } from './input-detector'`)

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in both `vite.config.ts` and `tsconfig.json`)
- Example: `import { cn } from '@/lib/utils'`

**Import Style:**
- Named imports preferred over namespace imports
- Type imports use `import type { ... }` syntax
- Example: `import type { StorageSchema } from '../shared/types'`

## Error Handling

**Patterns:**
- Try-catch blocks with typed error handling using `error: unknown`
- Async/await pattern for all async operations
- Error narrowing with `instanceof Error` checks
- Consistent error propagation via `MessageResponse` interface

**Example from `src/lib/storage.ts`:**
```typescript
try {
  const result = await chrome.storage.local.get(STORAGE_KEY)
  // ...
} catch (error: unknown) {
  console.error('[Oh My Prompt Script] Failed to get storage data:', error)
  // Return fallback without persisting
  return this.getDefaultData()
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

**Service Worker Pattern:**
- Always `return true` for async `sendResponse` to keep message channel open
- Example from `src/background/service-worker.ts`:
```typescript
storageManager.getData()
  .then(data => sendResponse({ success: true, data }))
  .catch(error => {
    sendResponse({ success: false, error: 'Storage retrieval failed' })
  })
return true // Required for async response
```

## Logging

**Framework:** Console API (no external logging library)

**Prefix Pattern:**
- All logs prefixed with `[Oh My Prompt Script]`
- Defined as constant: `const LOG_PREFIX = '[Oh My Prompt Script]'`
- Used consistently across all modules

**Log Levels:**
- `console.log` for informational messages
- `console.warn` for warnings (e.g., storage quota warnings)
- `console.error` for errors with context

**Example:**
```typescript
console.log('[Oh My Prompt Script] Content script loaded on:', window.location.href)
console.warn('[Oh My Prompt Script] Storage usage warning:', percentage + '%')
console.error('[Oh My Prompt Script] Failed to save storage:', error)
```

## Comments

**When to Comment:**
- JSDoc-style comments for class methods and exported utilities
- Block comments at file top explaining module purpose
- Inline comments for non-obvious logic or Chrome extension specifics

**JSDoc Pattern:**
```typescript
/**
 * Get singleton instance of StorageManager
 */
static getInstance(): StorageManager

/**
 * Insert prompt content at cursor position (D-10)
 * Dispatches events for Lovart recognition (CORE-04)
 */
insertPrompt(inputElement: HTMLElement, content: string): boolean
```

**File Header Comments:**
```typescript
/**
 * Content Script - Main entry point for Lovart page integration
 * Coordinates input detection, UI injection, and prompt insertion
 */
```

**TSDoc:** Not used; standard JSDoc style for documentation

## Function Design

**Size:**
- Functions typically 10-30 lines
- Complex logic split into helper methods (e.g., `insertIntoFormControl`, `insertIntoRichText`)

**Parameters:**
- Typed parameters for all functions
- Optional parameters use `?:` with default handling
- Props interfaces for React components

**Return Values:**
- Explicit return types for exported functions
- `Promise<T>` for async functions
- `void` for handlers that don't return data

**React Component Props Pattern:**
```typescript
interface DropdownAppProps {
  inputElement: HTMLElement
}

export function DropdownApp({ inputElement }: DropdownAppProps) {
  // ...
}
```

## Module Design

**Exports:**
- Named exports preferred for utilities (e.g., `export function truncateText`)
- Default exports for main components (e.g., `export default App`)
- Class exports: `export class StorageManager`

**Barrel Files:**
- Limited use; only `src/lib/migrations/index.ts` as barrel file
- Direct imports preferred over barrel imports

**Singleton Pattern:**
- `StorageManager.getInstance()` for single instance access
- Export both class and convenience instance:
```typescript
export class StorageManager { ... }
export const storageManager = StorageManager.getInstance()
```

## React Patterns

**Component Structure:**
- Functional components with hooks
- No `React.FC` usage (direct function definitions)
- Props destructuring in function signature

**State Management:**
- Zustand for global state (`src/lib/store.ts`)
- Local state with `useState` for UI-specific state
- Store selector pattern: `usePromptStore((state) => state.prompts)`

**Hooks:**
- Custom hooks in `src/hooks/` (e.g., `use-toast.ts`)
- useCallback for event handlers
- useEffect for lifecycle and side effects

**Event Handling:**
- useCallback to memoize handlers
- stopPropagationHandler utility for dropdown interactions:
```typescript
export function stopPropagationHandler<T extends (...args: unknown[]) => void>(fn: T): (e: React.MouseEvent) => void {
  return (e: React.MouseEvent) => {
    e.stopPropagation()
    fn()
  }
}
```

## Shadow DOM Isolation

**Content Script UI:**
- All content script UI uses Shadow DOM for CSS isolation
- Styles defined inline in `UIInjector.getStyles()`
- No external CSS files for content script components
- Container ID: `oh-my-prompt-script-host`

## Chrome Extension Specifics

**Message Types:**
- Enum-based message types: `MessageType.GET_STORAGE`, `MessageType.SET_STORAGE`
- Typed payload in message interface

**Storage:**
- Single storage key: `prompt_script_data` (defined as `STORAGE_KEY`)
- Entire `StorageSchema` stored as one object
- `chrome.storage.local` for persistence (not `chrome.storage.sync`)

**Manifest Version:**
- Manifest V3 (modern Chrome extension standard)
- Service worker instead of background page

---

*Convention analysis: 2026-04-21*