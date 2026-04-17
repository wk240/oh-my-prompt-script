# Architecture

**Analysis Date:** 2026-04-17

## Pattern Overview

**Overall:** Chrome Extension Three-Context Architecture

**Key Characteristics:**
- **Context Isolation** - Content script, background (service worker), popup are separate execution contexts
- **Shadow DOM Isolation** - Content script UI uses Shadow DOM to prevent host page CSS conflicts
- **Storage-First State** - All state derives from chrome.storage.local via StorageSchema
- **Message-Based Communication** - Contexts communicate via chrome.runtime.sendMessage
- **Singleton Pattern** - StorageManager uses singleton for centralized data access

## Layers

**Content Script Layer:**
- Purpose: Inject UI into Lovart pages, detect input, insert prompts
- Location: `src/content/`
- Contains: Input detector, UI injector, insert handler, dropdown components
- Depends on: chrome.runtime.sendMessage, chrome.storage (via messages)
- Used by: Lovart AI platform pages
- Isolation: Shadow DOM for style isolation from host page

**Background Layer (Service Worker):**
- Purpose: Message routing, storage operations, extension lifecycle
- Location: `src/background/service-worker.ts`
- Contains: Message handler, storage manager calls
- Depends on: chrome.storage.local (direct access)
- Used by: Content scripts and popup via messages
- Note: No DOM access, runs as service worker (MV3)

**Popup Layer:**
- Purpose: Management UI for prompts and categories
- Location: `src/popup/`
- Contains: React app, Zustand store, CRUD dialogs, import/export
- Depends on: chrome.storage.local (via store), chrome.runtime.sendMessage
- Used by: User via extension icon click
- Styling: Tailwind CSS (no Shadow DOM needed)

**Shared Layer:**
- Purpose: Cross-context types, constants, message definitions
- Location: `src/shared/`
- Contains: Type definitions, MessageType enum, constants
- Depends on: Nothing (pure TypeScript)
- Used by: All other layers

**Library Layer:**
- Purpose: Reusable utilities and state management
- Location: `src/lib/`
- Contains: Zustand store, storage manager, import/export utilities
- Depends on: chrome APIs, shared types
- Used by: Popup and background

## Data Flow

**Prompt Insertion Flow:**

1. User clicks trigger button in content script dropdown
2. `DropdownApp` calls `InsertHandler.insertPrompt()`
3. `InsertHandler` uses `execCommand('insertText')` for Lexical compatibility
4. Input/change events dispatched for Lovart recognition
5. Prompt content appears in Lovart input field

**Storage Sync Flow:**

1. Popup performs CRUD operation via Zustand store action
2. Store action updates local state
3. Store calls `saveToStorage()` automatically
4. `saveToStorage()` sends `SET_STORAGE` message to service worker
5. Service worker calls `StorageManager.saveData()`
6. Data persisted to chrome.storage.local

**Initial Load Flow:**

1. Content script or popup initializes
2. Calls `loadFromStorage()` or sends `GET_STORAGE` message
3. Service worker retrieves data via `StorageManager.getData()`
4. If empty, `StorageManager` initializes with built-in data
5. Data returned to caller, state populated

**State Management:**
- Zustand store in popup (`src/lib/store.ts`)
- Reactive state with automatic storage sync
- Content script maintains local state (not Zustand, no reactivity needed)
- Single source of truth: chrome.storage.local

## Key Abstractions

**StorageManager:**
- Purpose: Centralized chrome.storage.local access
- Pattern: Singleton class
- Location: `src/lib/storage.ts`
- Features:
  - Default data initialization with built-in prompts
  - Error handling with fallback
  - Quota monitoring utility

**InputDetector:**
- Purpose: Detect Lovart input element with MutationObserver
- Pattern: Observer class with callbacks
- Location: `src/content/input-detector.ts`
- Features:
  - Debounced detection (100ms)
  - SPA navigation handling (history API interception)
  - Periodic health check (30 seconds)
  - Multiple selector fallbacks

**UIInjector:**
- Purpose: Create Shadow DOM container for React UI
- Pattern: Manager class
- Location: `src/content/ui-injector.tsx`
- Features:
  - Shadow DOM isolation
  - Inline CSS injection (no external styles)
  - React root management
  - Cleanup on removal

**InsertHandler:**
- Purpose: Insert text into Lovart input element
- Pattern: Utility class
- Location: `src/content/insert-handler.ts`
- Features:
  - execCommand for Lexical compatibility
  - Fallback DOM manipulation
  - Event dispatching for React tracking
  - Native value setter invocation

## Entry Points

**Content Script Entry:**
- Location: `src/content/content-script.ts`
- Triggers: Lovart page load (matches manifest content_scripts)
- Responsibilities:
  - Initialize InputDetector and UIInjector
  - Handle input detection callback
  - Listen for background messages
  - Cleanup on page unload

**Service Worker Entry:**
- Location: `src/background/service-worker.ts`
- Triggers: Extension install/update, message received
- Responsibilities:
  - Route messages to appropriate handlers
  - Execute storage operations
  - Open settings page on request

**Popup Entry:**
- Location: `src/popup/settings.html` -> `src/popup/popup.tsx`
- Triggers: Extension icon click
- Responsibilities:
  - Render management UI
  - CRUD operations via Zustand store
  - Import/export functionality

## Error Handling

**Strategy:** Graceful degradation with fallbacks

**Patterns:**
- **ErrorBoundary components** in React UIs (`src/popup/components/ErrorBoundary.tsx`, `src/content/components/ErrorBoundary.tsx`)
- **Console logging** with `[Prompt-Script]` prefix for debugging
- **Storage fallback** to default data on read failure
- **Extension context validation** in content script (checks `chrome.runtime?.id`)
- **execCommand fallback** to direct DOM manipulation on failure

**Error Response Format:**
```typescript
interface MessageResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
```

## Cross-Cutting Concerns

**Logging:** 
- Console.log with `[Prompt-Script]` prefix
- Filterable in browser console
- No production logging service

**Validation:**
- TypeScript strict mode for compile-time checks
- Import data validation in `src/lib/import-export.ts`
- Schema validation: prompts/categories array structure, required fields

**Authentication:**
- None required - browser-local extension

**Style Isolation:**
- Shadow DOM for content script UI (host page CSS isolation)
- Tailwind CSS for popup (self-contained context)
- Inline styles defined in `UIInjector.getStyles()`

---

*Architecture analysis: 2026-04-17*