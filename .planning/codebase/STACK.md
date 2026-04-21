# Technology Stack

**Analysis Date:** 2026-04-21

## Languages

**Primary:**
- TypeScript 5.x - All source code (`src/**/*.ts`, `src/**/*.tsx`)

**Secondary:**
- JSON - Configuration files and data storage (manifest.json, resource-library JSON)

## Runtime

**Environment:**
- Chrome Extension Manifest V3 - Browser extension platform
- ES2020 target (per `tsconfig.json`)
- ESM modules (`"type": "module"` in package.json)

**Package Manager:**
- npm - Package management
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- React 19.x - UI framework for popup and content script UI
- Chrome Extension Manifest V3 - Extension platform (service worker, content scripts, popup)
- Vite 6.x - Build tool with hot reload for development

**Testing:**
- Playwright 1.59.1 - E2E testing framework
- Config: `playwright.config.ts`

**Build/Dev:**
- @crxjs/vite-plugin 2.x - Chrome extension bundler for Vite
- @vitejs/plugin-react 4.x - React support for Vite
- TypeScript 5.x - Type checking and compilation

## Key Dependencies

**Critical:**
- zustand 5.0.12 - State management for popup UI
- @radix-ui/react-* (multiple packages) - Headless UI components (dialog, dropdown-menu, select, toast, alert-dialog, scroll-area, separator, slot)
- lucide-react 1.8.0 - Icon library
- class-variance-authority 0.7.1 - CSS class utility for variants
- clsx 2.1.1 - Class name concatenation utility
- tailwind-merge 3.5.0 - Tailwind class merging utility
- @dnd-kit/* - Drag and drop functionality for sortable lists

**Infrastructure:**
- @types/chrome 0.0.260 - Chrome Extension API types
- tailwindcss 3.4.19 - CSS framework for popup styling
- tailwindcss-animate 1.0.7 - Animation utilities for Tailwind
- postcss 8.5.10 - CSS processing
- autoprefixer 10.5.0 - CSS vendor prefix automation

## Configuration

**Environment:**
- TypeScript: `tsconfig.json` (strict mode, path alias `@/*` -> `./src/*`)
- Vite: `vite.config.ts` (CRX plugin, React plugin, path alias)
- Tailwind: `tailwind.config.ts` (dark mode, custom colors, animations)
- PostCSS: `postcss.config.js` (Tailwind and autoprefixer plugins)
- Playwright: `playwright.config.ts` (Chromium only, base URL localhost:5173)

**Build:**
- Entry point: `manifest.json` (service worker, content scripts, popup)
- Output: `dist/` directory
- Sourcemaps: enabled

## Platform Requirements

**Development:**
- Node.js (ES2020 support required)
- npm package manager
- Chrome/Edge/Brave browser with Developer Mode enabled

**Production:**
- Chromium-based browser (Chrome 88+, Edge, Brave)
- Extension loaded via `chrome://extensions` page
- No server-side deployment required

---

*Stack analysis: 2026-04-21*