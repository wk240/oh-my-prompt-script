# Architecture

**Analysis Date:** 2026-04-21

## Pattern Overview

**Overall:** Chrome Extension Three-Context Architecture

**Key Characteristics:**
- Manifest V3 service worker (background) with no DOM access
- Content script injected into Lovart pages with Shadow DOM isolation
- Popup UI for prompt management with React + Tailwind
- Single storage source of truth via chrome.storage.local
- Message-based communication between contexts

## Layers

**Content Script Layer:**
- Purpose: Runs on Lovart.ai pages, detects input elements, injects dropdown UI
- Location: `src/content/`
- Contains: Input detection, UI injection, prompt insertion handlers, React dropdown components
- Depends on: Service worker for storage (via `chrome.runtime.sendMessage`)
- Used by: Lovart platform page (as injected script)

**Background/Service Worker Layer:**
- Purpose: Central message router, storage operations, update checking, alarm-based periodic tasks
- Location: `src/background/service-worker.ts`
- Contains: Message handlers for all `MessageType` enums, storage manager singleton, update checker
- Depends on: chrome.storage.local, chrome.alarms, chrome.tabs
- Used by: Content script, popup, backup page (via `chrome.runtime.sendMessage`)

**Popup Layer:**
- Purpose: Extension management UI for CRUD operations, import/export, settings
- Location: `src/popup/`
- Contains: React app with Zustand store, Radix UI dialogs, Tailwind styling, category/prompt management
- Depends on: Service worker for storage sync, chrome.tabs for opening backup/settings pages
- Used by: User via extension toolbar icon click

**Shared/Utility Layer:**
- Purpose: Cross-context types, constants, message definitions, utility functions
- Location: `src/shared/`, `src/lib/`
- Contains: TypeScript interfaces, enums, storage manager, import/export utilities, sync manager, resource library loader
- Depends on: No context-specific APIs
- Used by: All other layers

## Data Flow

**Prompt Insertion Flow:**

1. User clicks trigger button in dropdown (content script)
2. `DropdownApp.handleSelect()` calls `InsertHandler.insertPrompt()`
3. `InsertHandler` uses `execCommand('insertText')` for Lexical/React compatibility
4. Input/change events dispatched for Lovart recognition
5. Dropdown closes, prompt text appears in Lovart input

**Data Persistence Flow:**

1. User modifies prompts/categories in popup or dropdown
2. Zustand store action (`addPrompt`, `updatePrompt`, etc.) updates local state
3. `saveToStorage()` sends `SET_STORAGE` message to service worker
4. Service worker merges with existing settings and saves to `chrome.storage.local`
5. `triggerSync()` optionally syncs to local folder (if syncEnabled)

**Storage Initialization Flow:**

1. Extension first install or `getData()` called
2. Service worker checks `chrome.storage.local` for existing data
3. If empty: Initialize with `BUILT_IN_PROMPTS` and `BUILT_IN_CATEGORIES`
4. If legacy format: Run migration from flat structure to nested `StorageSchema`
5. Return `StorageSchema` to caller

**State Management:**
- Zustand store (`usePromptStore`) provides reactive state for popup and content script dropdown
- All state derives from `chrome.storage.local` via `loadFromStorage()`
- CRUD operations persist immediately via `saveToStorage()` (no debouncing - popup may close)

## Key Abstractions

**StorageSchema:**
- Purpose: Single source of truth for all extension data
- Examples: `src/shared/types.ts` defines `StorageSchema`, `UserData`, `SyncSettings`
- Pattern: Nested structure with version, userData, settings, migration flag

**InsertHandler:**
- Purpose: Insert prompt text into Lovart's Lexical editor with React compatibility
- Examples: `src/content/insert-handler.ts`
- Pattern: `execCommand('insertText')` + native value setter + event dispatch for React tracking

**InputDetector:**
- Purpose: MutationObserver-based detection of Lovart input element with SPA navigation handling
- Examples: `src/content/input-detector.ts`
- Pattern: Debounced detection, history API interception, periodic health check

**UIInjector:**
- Purpose: Shadow DOM container for CSS isolation, React mount point
- Examples: `src/content/ui-injector.tsx`
- Pattern: Create host element, attach Shadow DOM, inject inline styles, mount React root

**StorageManager:**
- Purpose: Singleton managing all chrome.storage.local operations with migration support
- Examples: `src/lib/storage.ts`
- Pattern: getInstance(), getData(), saveData(), updateSettings(), migration handling

**Zustand Store:**
- Purpose: Reactive state management with CRUD actions and storage sync
- Examples: `src/lib/store.ts`
- Pattern: `create()` with prompts, categories, selectedCategoryId, CRUD actions, computed getters

## Entry Points

**Content Script Entry:**
- Location: `src/content/content-script.ts`
- Triggers: Lovart page load (matches `*://lovart.ai/*`, `file:///*`)
- Responsibilities: Initialize InputDetector and UIInjector, handle REFRESH_DATA messages

**Service Worker Entry:**
- Location: `src/background/service-worker.ts`
- Triggers: Extension install, startup, message from content/popup
- Responsibilities: Message routing, storage ops, update checking alarms, badge updates

**Popup Entry:**
- Location: `src/popup/settings.html` -> `src/popup/App.tsx`
- Triggers: User clicks extension toolbar icon
- Responsibilities: Load data, render category sidebar + prompt list, handle CRUD dialogs, import/export

**Backup Page Entry:**
- Location: `src/popup/backup.html` -> `src/popup/BackupApp.tsx`
- Triggers: User clicks "备份数据" from dropdown or popup
- Responsibilities: Folder sync setup, backup history, restore from versions

## Error Handling

**Strategy:** Console logging with prefix, graceful fallbacks

**Patterns:**
- All console logs prefixed with `[Oh My Prompt Script]` for filtering
- Storage errors return default data without persisting (avoid data loss on transient error)
- Insert failures log error and return false (UI can show toast)
- Message handlers use `return true` for async `sendResponse` (Chrome requirement)
- Error responses use `{ success: false, error: string }` format

## Cross-Cutting Concerns

**Logging:** Console with `[Oh My Prompt Script]` prefix, warn for large datasets (>500 prompts), warn for storage quota (>80%)

**Validation:** Import data validated via `validateImportData()` - checks structure, required fields, types; supports legacy format conversion

**Authentication:** No auth required - extension uses local storage only; update checks use GitHub API (no auth)

**CSS Isolation:** Content script uses Shadow DOM; dropdown uses Portal to document.body with scoped CSS

---

*Architecture analysis: 2026-04-21*