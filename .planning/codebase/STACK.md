# Technology Stack

**Analysis Date:** 2026-04-17

## Languages

**Primary:**
- TypeScript 5.x - Main language for all extension code (content script, background, popup)

**Secondary:**
- CSS - Inline styles in Shadow DOM, Tailwind CSS for popup UI

## Runtime

**Environment:**
- Chrome Browser Extension (Manifest V3)
- Node.js (development only)

**Package Manager:**
- npm (lockfile: `package-lock.json` present)
- Package manifest: `package.json`

## Frameworks

**Core:**
- React 19.0.0 - UI framework for popup and content script dropdown
- @crxjs/vite-plugin 2.0.0 - Chrome Extension bundler for Vite
- Vite 6.0.0 - Build tool and dev server

**State Management:**
- Zustand 5.0.12 - Lightweight state management (popup only)

**UI Components:**
- Radix UI primitives - Accessible component primitives
  - `@radix-ui/react-alert-dialog` ^1.1.15
  - `@radix-ui/react-dialog` ^1.1.15
  - `@radix-ui/react-dropdown-menu` ^2.1.16
  - `@radix-ui/react-scroll-area` ^2.2.10
  - `@radix-ui/react-select` ^2.2.6
  - `@radix-ui/react-separator` ^1.1.8
  - `@radix-ui/react-slot` ^1.2.4
  - `@radix-ui/react-toast` ^1.2.15

**Styling:**
- Tailwind CSS 3.4.19 - Utility-first CSS (popup only)
- tailwindcss-animate 1.0.7 - Animation utilities
- class-variance-authority 0.7.1 - Component variant styling
- clsx 2.1.1 + tailwind-merge 3.5.0 - Class name utilities

**Icons:**
- lucide-react 1.8.0 - Icon library

## Key Dependencies

**Type Definitions:**
- `@types/chrome` 0.0.260 - Chrome Extension API types
- `@types/node` 25.6.0 - Node.js types
- `@types/react` 19.0.0 - React types
- `@types/react-dom` 19.0.0 - React DOM types

**Build Plugins:**
- `@vitejs/plugin-react` 4.0.0 - React support for Vite
- autoprefixer 10.5.0 - CSS vendor prefixes
- postcss 8.5.10 - CSS transformations

## Configuration

**TypeScript:**
- Target: ES2020
- Module: ESNext
- Module resolution: bundler
- Strict mode enabled
- Path alias: `@/*` -> `./src/*`
- Config file: `tsconfig.json`

**Vite:**
- Base path: `./`
- Output directory: `dist/`
- Sourcemaps enabled
- Path alias: `@` -> `./src`
- Config file: `vite.config.ts`

**Tailwind:**
- Dark mode: class-based
- Content: `./src/**/*.{js,ts,jsx,tsx}`
- Custom color system with CSS variables
- Custom radius variables
- Config file: `tailwind.config.ts`

**PostCSS:**
- Config file: `postcss.config.js`

## Platform Requirements

**Development:**
- Node.js (for npm, Vite dev server)
- Chrome/Edge/Brave browser with Developer Mode enabled

**Production:**
- Chromium-based browser (Chrome, Edge, Brave)
- Manifest V3 compatible browser
- Extension loaded from `dist/` directory

**Extension Permissions:**
- `activeTab` - Access to active tab
- `downloads` - File download for export
- `storage` - Local data persistence
- `tabs` - Tab management

**Content Script Matches:**
- `*://lovart.ai/*`
- `*://*.lovart.ai/*`
- `file:///*` (for local testing)

---

*Stack analysis: 2026-04-17*