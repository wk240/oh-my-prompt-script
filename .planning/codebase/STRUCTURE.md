# Codebase Structure

**Analysis Date:** 2026-04-17

## Directory Layout

```
prompt-script/
├── src/                    # Source code (TypeScript/React)
│   ├── content/            # Content script (runs on Lovart pages)
│   ├── background/         # Service worker (background context)
│   ├── popup/              # Extension popup (management UI)
│   ├── lib/                # Shared utilities and state
│   ├── shared/             # Cross-context types and constants
│   ├── data/               # Built-in prompt data
│   └── hooks/              # React hooks (use-toast)
├── assets/                 # Extension icons (PNG)
├── dist/                   # Build output (loaded as extension)
├── public/                 # Static assets
├── .planning/              # GSD planning artifacts
├── .claude/                # Claude Code configuration
├── package.json            # npm dependencies
├── manifest.json           # Chrome Extension manifest (MV3)
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── components.json         # shadcn/ui component config
├── BUILD.md                # Build instructions
├── README.md               # Project documentation
└── CLAUDE.md               # Claude Code project instructions
```

## Directory Purposes

**src/content/:**
- Purpose: Runs on Lovart AI platform pages
- Contains: Content script, input detector, UI injector, dropdown components
- Key files:
  - `content-script.ts` - Entry point, coordinates components
  - `input-detector.ts` - MutationObserver for Lovart input
  - `ui-injector.tsx` - Shadow DOM container + React mount
  - `insert-handler.ts` - Prompt text insertion
  - `components/DropdownApp.tsx` - Root dropdown component

**src/background/:**
- Purpose: Service worker (background context)
- Contains: Message routing, storage operations
- Key files:
  - `service-worker.ts` - Message handler, storage access

**src/popup/:**
- Purpose: Extension popup management UI
- Contains: React app, CRUD dialogs, UI primitives
- Key files:
  - `settings.html` - HTML entry point
  - `popup.tsx` - React mount entry
  - `App.tsx` - Main component, import/export handlers
  - `components/` - Dialogs, sidebar, list components
  - `components/ui/` - Radix UI primitives (shadcn style)

**src/lib/:**
- Purpose: Shared utilities and state management
- Contains: Zustand store, storage manager, import/export
- Key files:
  - `store.ts` - Zustand store with CRUD + storage sync
  - `storage.ts` - StorageManager singleton
  - `import-export.ts` - JSON download/upload utilities
  - `utils.ts` - General utility functions

**src/shared/:**
- Purpose: Cross-context shared definitions
- Contains: Types, message definitions, constants
- Key files:
  - `types.ts` - Prompt, Category, StorageSchema interfaces
  - `messages.ts` - MessageType enum, Message/Response interfaces
  - `constants.ts` - STORAGE_KEY, PLATFORM_DOMAIN, etc.

**src/data/:**
- Purpose: Default/initial data for new users
- Contains: Built-in prompts and categories
- Key files:
  - `built-in-data.ts` - 42 built-in prompts across 7 categories

**src/hooks/:**
- Purpose: React hooks for popup
- Contains: Toast notification hook
- Key files:
  - `use-toast.ts` - Toast state management

## Key File Locations

**Entry Points:**
- `src/content/content-script.ts`: Content script entry (Lovart page)
- `src/background/service-worker.ts`: Service worker entry (background)
- `src/popup/settings.html`: Popup HTML entry
- `src/popup/popup.tsx`: Popup React entry

**Configuration:**
- `manifest.json`: Chrome Extension manifest (permissions, matches)
- `vite.config.ts`: Build configuration with CRX plugin
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `components.json`: shadcn/ui configuration

**Core Logic:**
- `src/lib/store.ts`: Zustand state management
- `src/lib/storage.ts`: Chrome storage operations
- `src/content/input-detector.ts`: Input element detection
- `src/content/insert-handler.ts`: Prompt insertion

**Types & Messages:**
- `src/shared/types.ts`: Core data types
- `src/shared/messages.ts`: Message protocol definitions
- `src/shared/constants.ts`: Extension constants

**Built-in Data:**
- `src/data/built-in-data.ts`: Default prompts and categories

## Naming Conventions

**Files:**
- TypeScript: `*.ts` for logic, `*.tsx` for React components
- React components: PascalCase (e.g., `DropdownApp.tsx`, `PromptCard.tsx`)
- Utility files: camelCase (e.g., `store.ts`, `storage.ts`)
- UI primitives: lowercase with dashes (e.g., `button.tsx`, `scroll-area.tsx`)

**Directories:**
- Feature directories: lowercase (e.g., `content`, `popup`, `lib`)
- Component directories: lowercase (e.g., `components`, `ui`)

**Imports:**
- Path alias: `@/` prefix (e.g., `import { foo } from '@/lib/utils'`)
- Relative imports for same-directory files

## Where to Add New Code

**New Feature (Content Script):**
- Primary code: `src/content/` (new component or handler)
- UI components: `src/content/components/`
- Styles: Add to `UIInjector.getStyles()` in `ui-injector.tsx`

**New Feature (Popup):**
- Primary code: `src/popup/components/` (new dialog or component)
- UI primitives: `src/popup/components/ui/`
- Styles: Use Tailwind CSS classes (no new CSS files)

**New Prompt/Category (Built-in):**
- Data: `src/data/built-in-data.ts`

**New Message Type:**
- Definition: `src/shared/messages.ts` (add to MessageType enum)
- Handler: `src/background/service-worker.ts` (add case in switch)
- Usage: Import from messages.ts in calling context

**New Utility:**
- Shared utilities: `src/lib/` (if used by multiple contexts)
- Context-specific: Same directory as usage

**New Type:**
- Shared types: `src/shared/types.ts`
- Context-specific: Same file as usage (if not shared)

**New Constant:**
- Shared constants: `src/shared/constants.ts`

## Special Directories

**dist/:**
- Purpose: Build output directory
- Generated: Yes (by Vite build)
- Committed: Yes (included for direct download per commit history)
- Load: Chrome loads extension from this directory

**node_modules/:**
- Purpose: npm dependencies
- Generated: Yes (by npm install)
- Committed: No (in .gitignore)

**assets/:**
- Purpose: Extension icons
- Contains: icon-16.png, icon-48.png, icon-128.png
- Generated: No
- Committed: Yes

**.planning/:**
- Purpose: GSD workflow planning artifacts
- Contains: codebase analysis, phase plans, config
- Generated: Yes (by GSD commands)
- Committed: Should be committed for workflow continuity

**public/:**
- Purpose: Static assets copied to dist
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-04-17*