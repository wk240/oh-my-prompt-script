# Codebase Structure

**Analysis Date:** 2026-04-21

## Directory Layout

```
D:/workspace/projects/prompt-script/
├── .claude/              # Claude Code skills and rules
├── .planning/            # GSD planning artifacts (phases, research, codebase docs)
├── assets/               # Extension icons (icon-16.png, icon-48.png, icon-128.png)
├── dist/                 # Production build output (loaded as extension)
├── docs/                 # Documentation and superpowers specs
├── node_modules/         # Dependencies
├── scripts/              # Build scripts (extract-prompts.ts)
├── src/                  # Source code
│   ├── background/       # Service worker (Manifest V3)
│   ├── content/          # Content script for Lovart pages
│   ├── data/             # Built-in prompts and resource library JSON
│   ├── hooks/            # Shared React hooks (use-toast.ts)
│   ├── lib/              # Shared utilities (store, storage, sync, migrations)
│   ├── popup/            # Extension popup UI
│   └── shared/           # Cross-context types, messages, constants
│   └── tests/            # Playwright E2E tests (currently backup JSON files)
├── manifest.json         # Chrome Extension manifest (MV3)
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite build config with @crxjs/vite-plugin
├── tsconfig.json         # TypeScript config with @ alias
└── playwright.config.ts  # E2E test configuration
```

## Directory Purposes

**src/background:**
- Purpose: Service worker for Manifest V3
- Contains: Message handler, storage operations, update checker
- Key files: `src/background/service-worker.ts`

**src/content:**
- Purpose: Content script injected into Lovart pages
- Contains: Input detection, UI injection, prompt insertion, React dropdown components
- Key files: `src/content/content-script.ts`, `src/content/input-detector.ts`, `src/content/ui-injector.tsx`, `src/content/insert-handler.ts`

**src/content/components:**
- Purpose: React components for dropdown UI (Shadow DOM isolated)
- Contains: DropdownApp, DropdownContainer, modals, cards, tooltips
- Key files: `src/content/components/DropdownApp.tsx`, `src/content/components/DropdownContainer.tsx`

**src/data:**
- Purpose: Default prompt data and resource library
- Contains: Built-in prompts/categories for first install, curated resource library JSON
- Key files: `src/data/built-in-data.ts`, `src/data/resource-library/prompts.json`

**src/lib:**
- Purpose: Shared utilities and state management
- Contains: Zustand store, storage manager, import/export, sync manager, migrations, version checker
- Key files: `src/lib/store.ts`, `src/lib/storage.ts`, `src/lib/import-export.ts`

**src/lib/migrations:**
- Purpose: Storage schema migration handlers
- Contains: Migration registration and version-specific migrations
- Key files: `src/lib/migrations/index.ts`, `src/lib/migrations/v1.0.ts`

**src/lib/sync:**
- Purpose: Local folder sync functionality
- Contains: File sync, IndexedDB handle storage, sync manager
- Key files: `src/lib/sync/sync-manager.ts`, `src/lib/sync/file-sync.ts`, `src/lib/sync/indexeddb.ts`

**src/popup:**
- Purpose: Extension popup UI for prompt management
- Contains: React app, dialogs, category sidebar, prompt list, backup page
- Key files: `src/popup/App.tsx`, `src/popup/settings.html`, `src/popup/backup.html`

**src/popup/components:**
- Purpose: Popup React components
- Contains: Header, CategorySidebar, PromptList, dialogs, Radix UI primitives
- Key files: `src/popup/components/Header.tsx`, `src/popup/components/CategorySidebar.tsx`

**src/popup/components/ui:**
- Purpose: Radix UI primitive components
- Contains: Button, dialog, input, textarea, select, alert-dialog, toast
- Key files: `src/popup/components/ui/button.tsx`, `src/popup/components/ui/dialog.tsx`

**src/shared:**
- Purpose: Cross-context shared definitions
- Contains: TypeScript interfaces, message types, constants, utility functions
- Key files: `src/shared/types.ts`, `src/shared/messages.ts`, `src/shared/constants.ts`, `src/shared/utils.ts`

## Key File Locations

**Entry Points:**
- `src/content/content-script.ts`: Content script entry (Lovart page)
- `src/background/service-worker.ts`: Service worker entry
- `src/popup/App.tsx`: Popup main UI entry
- `src/popup/BackupApp.tsx`: Backup page entry

**Configuration:**
- `manifest.json`: Extension manifest (MV3, permissions, content_scripts)
- `vite.config.ts`: Build config with CRX plugin
- `tsconfig.json`: TypeScript config with `@/*` alias
- `playwright.config.ts`: E2E test config

**Core Logic:**
- `src/lib/store.ts`: Zustand state management (CRUD, storage sync)
- `src/lib/storage.ts`: StorageManager singleton
- `src/content/insert-handler.ts`: Prompt insertion logic
- `src/content/input-detector.ts`: Lovart input detection
- `src/content/ui-injector.tsx`: Shadow DOM injection

**Testing:**
- `tests/`: Contains backup JSON files (no test code present)
- `playwright.config.ts`: Test runner configuration

## Naming Conventions

**Files:**
- TypeScript: `*.ts` for logic, `*.tsx` for React components
- React components: PascalCase (`DropdownApp.tsx`, `CategorySidebar.tsx`)
- Utilities: camelCase (`storage.ts`, `import-export.ts`)
- UI primitives: lowercase with dashes (`button.tsx`, `scroll-area.tsx`)

**Directories:**
- Feature-based: `content/`, `popup/`, `background/`, `shared/`
- Sub-features: `components/`, `migrations/`, `sync/`
- Radix UI: `ui/` for primitive components

**Imports:**
- Path alias: `@/` for src-relative imports (`import { foo } from '@/lib/utils'`)
- Relative: For same-directory imports (`import { Prompt } from '../shared/types'`)

## Where to Add New Code

**New Feature (UI in dropdown):**
- Primary code: `src/content/components/` - Add new React component
- Integration: `src/content/components/DropdownContainer.tsx` - Import and render
- Styles: Inline in component or `getDropdownStyles()` in DropdownContainer

**New Feature (UI in popup):**
- Primary code: `src/popup/components/` - Add new React component
- Integration: `src/popup/App.tsx` - Import and add to layout
- Dialog: Use Radix UI primitives from `src/popup/components/ui/`

**New Storage Field:**
- Types: `src/shared/types.ts` - Add to `StorageSchema`, `UserData`, or `SyncSettings`
- Migration: `src/lib/migrations/` - Create new version migration if breaking change
- Store: `src/lib/store.ts` - Add state and actions if needed

**New Message Type:**
- Types: `src/shared/messages.ts` - Add to `MessageType` enum
- Handler: `src/background/service-worker.ts` - Add switch case handler
- Caller: Content script or popup - Use `chrome.runtime.sendMessage()`

**New Utility Function:**
- Shared: `src/shared/utils.ts` - For cross-context utilities
- Context-specific: `src/lib/` - For storage, sync, import/export

**New Built-in Prompt:**
- Data: `src/data/built-in-data.ts` - Add to `BUILT_IN_PROMPTS` array
- Resource library: `src/data/resource-library/prompts.json` - For curated library

## Special Directories

**dist:**
- Purpose: Production build output
- Generated: Yes (by `npm run build`)
- Committed: No (in .gitignore)

**tests:**
- Purpose: Currently contains backup JSON files, Playwright config expects test files here
- Generated: No
- Committed: Yes
- Note: No actual test code present - only backup JSON files

**assets:**
- Purpose: Extension icons
- Generated: No
- Committed: Yes
- Referenced: In manifest.json icons and action.default_icon

**.planning:**
- Purpose: GSD workflow planning artifacts
- Generated: Yes (by GSD commands)
- Committed: Yes
- Contains: phases/, codebase/, milestones/, debug/, research/

---

*Structure analysis: 2026-04-21*