# Codebase Structure

**Analysis Date:** 2026-04-25

## Directory Layout

```
/Users/panwenkang/workspace/projects/oh-my-prompt/
├── src/                     # Source code
│   ├── background/          # Service worker (Manifest V3)
│   ├── content/             # Content script for lovart.ai
│   ├── popup/               # Extension popup UI
│   ├── lib/                 # Shared business logic
│   ├── shared/              # Cross-context types/constants
│   ├── data/                # Built-in data and resource library
│   └── hooks/               # React hooks (popup)
├── dist/                    # Build output (loaded as extension)
├── assets/                  # Extension icons (16, 48, 128px)
├── scripts/                 # Build/utility scripts
├── docs/                    # Documentation
├── .planning/               # GSD workflow artifacts
├── manifest.json            # Chrome Extension manifest
├── vite.config.ts           # Build configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── package.json             # Dependencies and scripts
└── playwright.config.ts     # E2E test configuration
```

## Directory Purposes

**src/background:**
- Purpose: Service worker context (no DOM access)
- Contains: Message handler for all 19 MessageType operations
- Key files: `service-worker.ts` (single file, ~240 lines)

**src/content:**
- Purpose: Lovart page integration
- Contains: Input detection, Shadow DOM UI, React dropdown components, prompt insertion
- Key files: `content-script.ts` (entry), `input-detector.ts` (MutationObserver), `ui-injector.tsx` (Shadow DOM), `insert-handler.ts` (prompt insertion)
- Subdirectory: `components/` - React components (DropdownApp, DropdownContainer, modals, cards)

**src/content/components:**
- Purpose: React components for dropdown UI (Shadow DOM isolated)
- Contains: 19 component files including DropdownApp, DropdownContainer, modals, cards
- Key files: `DropdownApp.tsx`, `DropdownContainer.tsx` (~66KB, main logic), `ErrorBoundary.tsx`, `NetworkPromptCard.tsx`, `PromptPreviewModal.tsx`

**src/popup:**
- Purpose: Extension popup (backup management)
- Contains: React app, Zustand store integration, Tailwind styling
- Key files: `backup.html` (entry HTML), `backup.tsx` (entry script), `BackupApp.tsx` (~20KB, main logic), `index.css` (Tailwind styles)
- Subdirectories: `components/` (modal dialogs), `components/ui/` (Radix UI primitives)

**src/popup/components:**
- Purpose: Popup React components for dialogs and UI elements
- Contains: Radix UI wrappers, category/prompt dialogs, update guide
- Key files: `BaseModal.tsx`, `CategoryEditModal.tsx`, `CategorySelectDialog.tsx`, `DeleteConfirmModal.tsx`, `PromptEditModal.tsx`, `PromptPreviewModal.tsx`, `UpdateGuideModal.tsx`

**src/popup/components/ui:**
- Purpose: Radix UI primitive components (shadcn/ui style)
- Contains: Button, dialog, toast components
- Key files: `button.tsx`, `dialog.tsx`, `toast.tsx`

**src/lib:**
- Purpose: Business logic shared across contexts
- Contains: Zustand store, StorageManager singleton, import/export, version checker, sync modules, migrations
- Key files: `store.ts` (~10KB, Zustand CRUD), `storage.ts` (~6KB, StorageManager), `import-export.ts` (~8KB), `version-checker.ts` (~3KB)
- Subdirectories: `sync/` (file-sync, indexeddb, sync-manager), `migrations/` (index, register, v1.0)

**src/lib/sync:**
- Purpose: Local folder backup sync functionality
- Contains: File System Access API operations, IndexedDB handle storage, sync orchestration
- Key files: `sync-manager.ts` (~13KB), `file-sync.ts` (~10KB), `indexeddb.ts` (~6KB)

**src/lib/migrations:**
- Purpose: Storage schema migration handlers
- Contains: Migration registry, version-specific migrations
- Key files: `index.ts` (migration logic), `register.ts` (registration), `v1.0.ts` (legacy format conversion)

**src/shared:**
- Purpose: Cross-context types and constants
- Contains: TypeScript interfaces, message types enum, constants, utility functions
- Key files: `types.ts` (Prompt, Category, StorageSchema, SyncSettings), `messages.ts` (MessageType enum), `constants.ts` (STORAGE_KEY, PLATFORM_DOMAIN, backup file patterns), `utils.ts` (sorting, truncation)

**src/data:**
- Purpose: Default/built-in data for first-time users
- Contains: Built-in prompts and categories, curated resource library
- Key files: `built-in-data.ts` (~11KB, default prompts)
- Subdirectory: `resource-library/` - External prompt data JSON (`prompts.json`)

**src/hooks:**
- Purpose: React hooks for popup (currently minimal)
- Contains: `use-toast.ts` hook

## Key File Locations

**Entry Points:**
- `src/content/content-script.ts`: Content script entry (Lovart page integration)
- `src/background/service-worker.ts`: Service worker entry (message routing)
- `src/popup/backup.html`: Popup entry HTML (backup management UI)
- `src/popup/backup.tsx`: Popup entry script
- `src/popup/BackupApp.tsx`: Popup main React component

**Configuration:**
- `manifest.json`: Extension manifest (MV3, permissions, content_scripts matches)
- `vite.config.ts`: Build config with CRX plugin, React plugin, code splitting
- `tsconfig.json`: TypeScript config (strict mode, `@/*` alias)
- `tailwind.config.ts`: Tailwind theme config (dark mode, colors, animations)
- `playwright.config.ts`: E2E test config (Chromium only)

**Core Logic:**
- `src/lib/store.ts`: Zustand state (CRUD, storage sync, order management)
- `src/lib/storage.ts`: StorageManager singleton (get/save, migration)
- `src/lib/sync/sync-manager.ts`: Backup sync orchestration
- `src/lib/sync/file-sync.ts`: File System Access API operations
- `src/lib/import-export.ts`: JSON validation and merge logic
- `src/lib/version-checker.ts`: GitHub release checking

**Content Script Logic:**
- `src/content/input-detector.ts`: Lovart input detection (MutationObserver)
- `src/content/ui-injector.tsx`: Shadow DOM injection
- `src/content/insert-handler.ts`: Prompt text insertion
- `src/content/components/DropdownContainer.tsx`: Main dropdown logic

**Shared Types:**
- `src/shared/types.ts`: All TypeScript interfaces
- `src/shared/messages.ts`: MessageType enum (19 types)
- `src/shared/constants.ts`: Storage keys, backup patterns, limits

**Built-in Data:**
- `src/data/built-in-data.ts`: Default prompts/categories for new users

## Naming Conventions

**Files:**
- TypeScript logic: `*.ts` (camelCase, e.g., `storage.ts`, `sync-manager.ts`)
- React components: `*.tsx` (PascalCase, e.g., `DropdownApp.tsx`, `BackupApp.tsx`)
- UI primitives: lowercase with dashes (e.g., `button.tsx`, `scroll-area.tsx`)
- Constants: `constants.ts` (centralized)
- Types: `types.ts` (interfaces)

**Directories:**
- Context-based: `background/`, `content/`, `popup/`, `shared/`, `lib/`
- Feature subdirs: `components/`, `sync/`, `migrations/`, `data/`
- UI primitives: `ui/` (Radix/shadcn style)

**Imports:**
- Path alias: `@/` for src-relative imports (`import { foo } from '@/lib/utils'`)
- Relative: Same-directory imports (`import { Prompt } from '../shared/types'`)
- Configured in: `tsconfig.json` (paths), `vite.config.ts` (resolve.alias)

## Where to Add New Code

**New Feature (Lovart dropdown UI):**
- Primary code: `src/content/components/` - Add new React component
- Integration: `src/content/components/DropdownContainer.tsx` - Import and render
- Styles: Inline in component or `getStyles()` in `ui-injector.tsx`

**New Feature (Popup UI):**
- Primary code: `src/popup/components/` - Add new React component
- Integration: `src/popup/BackupApp.tsx` - Import and add to layout
- Dialogs: Use Radix UI primitives from `src/popup/components/ui/`

**New Storage Field:**
- Types: `src/shared/types.ts` - Add to `StorageSchema`, `UserData`, or `SyncSettings`
- Defaults: `src/lib/storage.ts` - Update `getDefaultData()` or `getDefaultSettings()`
- Migration: `src/lib/migrations/` - Create new migration if breaking change
- Store: `src/lib/store.ts` - Add state and actions if needed

**New Message Type:**
- Enum: `src/shared/messages.ts` - Add to `MessageType`
- Handler: `src/background/service-worker.ts` - Add switch case with async response
- Caller: Use `chrome.runtime.sendMessage({ type: MessageType.NEW_TYPE })`

**New Utility Function:**
- Cross-context: `src/shared/utils.ts` - Pure functions, no Chrome APIs
- Context-specific: `src/lib/` - For storage, sync, import/export

**New Built-in Prompt:**
- Data: `src/data/built-in-data.ts` - Add to `BUILT_IN_PROMPTS` array
- Ensure unique ID and correct `categoryId`, `order` field

**New Sync Feature:**
- Location: `src/lib/sync/` - Add to existing files or new module
- Manager: `src/lib/sync/sync-manager.ts` - Export new functions
- UI: `src/popup/BackupApp.tsx` - Add UI controls

## Special Directories

**dist:**
- Purpose: Production build output
- Generated: Yes (by `npm run build`)
- Committed: No (in `.gitignore`)
- Usage: Load as unpacked extension in `chrome://extensions`

**assets:**
- Purpose: Extension icons (PNG format)
- Files: `icon-16.png`, `icon-48.png`, `icon-128.png`
- Generated: No (manual design)
- Committed: Yes
- Referenced: In manifest.json icons and action.default_icon

**src/data/resource-library:**
- Purpose: External curated prompt library (JSON)
- Generated: Partially (by `scripts/extract-prompts.ts`)
- Committed: Yes
- Contains: `prompts.json` with ResourcePrompt data

**.planning:**
- Purpose: GSD workflow planning artifacts
- Generated: Yes (by GSD commands)
- Committed: Yes (STATE.md tracked)
- Contains: `phases/`, `codebase/`, `STATE.md`

**scripts:**
- Purpose: Build/utility scripts
- Contains: `extract-prompts.ts` (resource library extraction), `test-migration.js` (migration testing)
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-04-25*