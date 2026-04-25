# Architecture

**Analysis Date:** 2026-04-25

## Pattern Overview

**Overall:** Chrome Extension Three-Context Architecture

**Key Characteristics:**
- Manifest V3 service worker (background) - no DOM access, message routing
- Content script injected into lovart.ai pages - Shadow DOM isolation for CSS
- Popup extension UI - React + Tailwind + Zustand for state management
- Single storage source of truth - `chrome.storage.local` key `prompt_script_data`
- Message-based communication - `MessageType` enum with typed payloads

## Layers

**Content Script Layer:**
- Purpose: Runs on lovart.ai pages, detects input elements, injects dropdown UI, inserts prompts
- Location: `src/content/`
- Contains: `content-script.ts` (entry), `input-detector.ts`, `ui-injector.tsx`, `insert-handler.ts`, `components/`
- Depends on: Service worker for storage (via `chrome.runtime.sendMessage` with `GET_STORAGE`)
- Used by: Lovart platform page (as injected script via manifest matches)
- Communication: Receives `REFRESH_DATA`, `SYNC_FAILED` from service worker

**Background/Service Worker Layer:**
- Purpose: Central message router, storage operations, version checking
- Location: `src/background/service-worker.ts`
- Contains: Message handlers for all `MessageType` enums (19 message types)
- Depends on: chrome.storage.local, IndexedDB, GitHub API (for version check)
- Used by: Content scripts, popup pages (via `chrome.runtime.sendMessage`)
- Communication: Responds with `{ success: boolean, data?: T, error?: string }`

**Popup Layer:**
- Purpose: Backup management UI, settings, sync status display
- Location: `src/popup/`
- Contains: `backup.html` -> `backup.tsx` -> `BackupApp.tsx`, `components/`, `components/ui/`
- Depends on: Service worker for storage sync, `src/lib/sync/sync-manager.ts`
- Used by: User via extension toolbar icon click (manifest `action.default_popup`)
- Communication: Sends `GET_SYNC_STATUS`, `CHECK_UPDATE`, etc.

**Shared Layer:**
- Purpose: Cross-context types, constants, message definitions, utilities
- Location: `src/shared/`
- Contains: `types.ts` (interfaces), `messages.ts` (MessageType enum), `constants.ts`, `utils.ts`
- Depends on: None (pure TypeScript, no Chrome APIs)
- Used by: All other layers

**Library Layer:**
- Purpose: Business logic, storage management, sync operations, migrations
- Location: `src/lib/`
- Contains: `store.ts` (Zustand), `storage.ts` (StorageManager), `import-export.ts`, `version-checker.ts`, `sync/`, `migrations/`
- Depends on: chrome APIs, shared types
- Used by: Popup and background contexts

## Data Flow

**Storage Read Flow:**

1. Popup calls `usePromptStore.getState().loadFromStorage()`
2. Store sends `GET_STORAGE` message to service worker
3. Service worker calls `storageManager.getData()`
4. StorageManager reads from `chrome.storage.local`, handles migration if needed
5. Data returned through message response
6. Zustand store updates state with prompts, categories, selectedCategoryId

**Storage Write Flow:**

1. User modifies data (CRUD operation in popup or dropdown)
2. Zustand store action updates local state immediately
3. Store calls `saveToStorage()` internally (no debounce - popup may close)
4. Store sends `SET_STORAGE` message with `userData` payload
5. Service worker merges with existing settings, saves to chrome.storage.local
6. Service worker calls `triggerSync(userData)` if syncEnabled
7. Response includes `{ syncSuccess: boolean }` for UI feedback

**Prompt Insertion Flow:**

1. User selects prompt from dropdown on lovart.ai
2. `DropdownContainer` or `DropdownApp` calls `insertHandler.insertPrompt()`
3. InsertHandler checks element type (form control vs contenteditable)
4. For Lexical editor: Uses `document.execCommand('insertText', false, text)`
5. Dispatches `input` and `change` events for Lovart recognition
6. Calls native value setter for React tracking (form controls)
7. Lovart platform receives prompt text in input

**Sync Flow:**

1. `saveToStorage()` triggers `triggerSync()` via service worker
2. If `syncEnabled` and folder handle exists: `syncToLocalFolder()`
3. File-sync creates `omps-latest.json` and history backup
4. Updates `lastSyncTime` in settings
5. If sync fails: Sets `hasUnsyncedChanges: true`, broadcasts `SYNC_FAILED`

**State Management:**
- Zustand store (`usePromptStore`) in popup context only
- Content script queries storage via messages (no local Zustand state)
- All CRUD operations in popup persist immediately
- Order field managed for sorting (migration if missing)

## Key Abstractions

**StorageSchema:**
- Purpose: Root data structure for all extension data
- Location: `src/shared/types.ts`
- Pattern: Single-key storage `{ version, userData: { prompts, categories }, settings: SyncSettings, _migrationComplete }`

**StorageManager:**
- Purpose: Singleton for storage operations with migration handling
- Location: `src/lib/storage.ts`
- Pattern: `getInstance()` -> `getData()` (handles migration), `saveData()`, `updateSettings()`, `updateUserData()`

**MessageType:**
- Purpose: Typed message enum for cross-context communication
- Location: `src/shared/messages.ts`
- Pattern: Enum with 19 types, `Message<T>` payload interface, `MessageResponse<T>` with success/error

**InsertHandler:**
- Purpose: Insert prompt text with React/Lexical compatibility
- Location: `src/content/insert-handler.ts`
- Pattern: `execCommand('insertText')` + native value setter + event dispatch

**InputDetector:**
- Purpose: MutationObserver for detecting Lovart input element
- Location: `src/content/input-detector.ts`
- Pattern: Debounced detection (100ms), SPA navigation handling (history API interception), periodic health check (30s)

**UIInjector:**
- Purpose: Shadow DOM container for CSS isolation
- Location: `src/content/ui-injector.tsx`
- Pattern: Create host element, attach Shadow DOM, inject inline styles, mount React root before target element

**SyncManager:**
- Purpose: Orchestrate local folder backup sync
- Location: `src/lib/sync/sync-manager.ts`
- Pattern: `triggerSync()` after storage writes, `enableSync()`, `restorePermission()`, permission state tracking

## Entry Points

**Content Script Entry:**
- Location: `src/content/content-script.ts`
- Triggers: Lovart page load (manifest `content_scripts` matches `*://lovart.ai/*`, `file:///*`)
- Responsibilities: Initialize InputDetector, UIInjector, handle `REFRESH_DATA`/`SYNC_FAILED` messages

**Service Worker Entry:**
- Location: `src/background/service-worker.ts`
- Triggers: Extension install, browser start, messages from content/popup
- Responsibilities: Message routing (19 handlers), storage ops, version checking, sync triggering

**Popup Entry:**
- Location: `src/popup/backup.html` -> `src/popup/backup.tsx` -> `BackupApp.tsx`
- Triggers: Extension icon click (manifest `action.default_popup`)
- Responsibilities: Sync status display, folder selection, backup history, restore operations

## Error Handling

**Strategy:** Console logging with prefix, graceful fallbacks

**Patterns:**
- All console logs prefixed: `[Oh My Prompt]` for filtering
- Storage errors: Return default data WITHOUT persisting (avoid data loss on transient error)
- Message handlers: `return true` for async `sendResponse` (Chrome requirement)
- Response format: `{ success: false, error: 'message' }` for failures
- Insert errors: Return boolean `false`, log to console
- Sync errors: Set `hasUnsyncedChanges: true`, notify UI

**Error Boundaries:**
- Content script: `ErrorBoundary` component wraps `DropdownApp` (`src/content/components/ErrorBoundary.tsx`)
- Popup: Error states in UI (error variable, retry buttons)

## Cross-Cutting Concerns

**Logging:** `[Oh My Prompt]` prefix throughout all contexts

**Validation:**
- Import validation: `validateImportData()` in `src/lib/import-export.ts` (checks structure, fields, types)
- Legacy format support: Converts flat prompts/categories to nested userData
- Storage validation: Check required fields in `StorageManager.getData()`

**Migration:**
- Legacy format detection: `isLegacyFormat()` checks for flat structure (no userData)
- Migration registry: `src/lib/migrations/register.ts` for version-specific handlers
- Version comparison: Semver-style for ordering (`semverCompare()`)

**CSS Isolation:**
- Content script: Shadow DOM with inline styles (`UIInjector.getStyles()`)
- Dropdown portal: Uses Portal with `mousedown.preventDefault()` to preserve focus
- Popup: Tailwind CSS (no isolation needed)

---

*Architecture analysis: 2026-04-25*