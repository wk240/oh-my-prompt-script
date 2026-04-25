# Technology Stack

**Analysis Date:** 2026-04-25

## Languages

**Primary:**
- TypeScript 5.x - All source code (strict mode enabled)
- Target: ES2020 (per `tsconfig.json`)

**Secondary:**
- JSON - Configuration files, data files, resource library (`manifest.json`, `src/data/resource-library/prompts.json`)
- CSS - Tailwind CSS for popup styling

## Runtime

**Environment:**
- Chrome Extension Manifest V3 - Chromium-based browsers (Chrome, Edge, Brave)
- ES2020 target with ESM modules (`"type": "module"` in package.json)
- No Node.js runtime in production (extension runs entirely in browser)

**Package Manager:**
- npm - Package management
- Lockfile: `package-lock.json` (present, 154KB)

## Frameworks

**Core:**
- React 19.x - UI framework for popup and content script Shadow DOM components
- Chrome Extension Manifest V3 - Extension platform (service worker, content scripts, popup)
- Vite 6.x - Build tool with hot reload for development

**Testing:**
- Playwright 1.59.x - E2E testing framework
- Config: `playwright.config.ts` (Chromium only, base URL localhost:5173)
- Note: `tests/` directory not created yet - only config present

**Build/Dev:**
- @crxjs/vite-plugin 2.x - Chrome Extension bundler for Vite (handles manifest transformation)
- @vitejs/plugin-react 4.x - React support for Vite
- TypeScript 5.x - Type checking (`tsc --noEmit` before build)

## Key Dependencies

**Critical:**
- zustand 5.0.12 - State management for popup (CRUD operations, storage sync)
- @radix-ui/react-* (dialog, alert-dialog, dropdown-menu, select, scroll-area, separator, toast, slot) - Headless UI primitives
- lucide-react 1.8.0 - Icon library (Check, FolderOpen, RefreshCw, X, History, etc.)
- @dnd-kit/core 6.3.1, @dnd-kit/sortable 10.0.0 - Drag-and-drop for prompt/category reordering
- class-variance-authority 0.7.1, clsx 2.1.1, tailwind-merge 3.5.0 - CSS utility libraries

**Infrastructure:**
- @types/chrome 0.0.260 - Chrome Extension API TypeScript types
- tailwindcss 3.4.19 - CSS framework (popup only, not content script)
- tailwindcss-animate 1.0.7 - Animation utilities for Tailwind
- postcss 8.5.10 + autoprefixer 10.5.0 - CSS processing pipeline

## Configuration

**Environment:**
- TypeScript: `tsconfig.json` - Strict mode, path alias `@/*` -> `./src/*`
- Vite: `vite.config.ts` - CRX plugin, React plugin, code splitting (vendor-react, vendor-icons, vendor-dnd, vendor-zustand)
- Tailwind: `tailwind.config.ts` - Dark mode `class`, custom theme colors, animation keyframes
- PostCSS: `postcss.config.js` - Tailwind and autoprefixer plugins

**Build:**
- Entry point: `manifest.json` (service worker, content scripts, popup)
- Output: `dist/` directory
- Sourcemaps: enabled (`sourcemap: true` in vite.config.ts)
- Base path: `./` (relative paths for extension compatibility)
- Manual chunks: React ecosystem, lucide icons, dnd-kit, zustand separated

## Platform Requirements

**Development:**
- Node.js (ES2020 support required)
- npm package manager
- Chrome/Edge/Brave browser with Developer Mode enabled

**Production:**
- Chromium-based browser (Chrome 88+, Edge, Brave)
- Extension loaded via `chrome://extensions` (unpacked from `dist/`)
- No server-side deployment required
- Optional: Local filesystem for backup sync (File System Access API)

---

*Stack analysis: 2026-04-25*