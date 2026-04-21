# External Integrations

**Analysis Date:** 2026-04-21

## APIs & External Services

**GitHub Releases API:**
- Purpose: Check for extension updates from repository releases
- Endpoint: `https://api.github.com/repos/wk240/oh-my-prompt-script/releases/latest`
- SDK/Client: Native `fetch()` API
- Auth: None (public repository)
- Implementation: `src/lib/version-checker.ts`

**Lovart AI Platform:**
- Purpose: Target platform for prompt insertion
- Domain: `lovart.ai` and subdomains
- Integration: Content script injection via manifest matches
- Manifest permissions: `"*://lovart.ai/*", "*://*.lovart.ai/*"`

## Data Storage

**Databases:**
- chrome.storage.local - Primary data persistence
  - Connection: Chrome Extension API
  - Client: Custom `StorageManager` singleton in `src/lib/storage.ts`
  - Quota: 10MB maximum
  - Key: `prompt_script_data` (single key for entire schema)

- IndexedDB - Secondary storage for sync folder handles
  - Database: `oh-my-prompt-script-sync`
  - Store: `handles`
  - Key: `syncFolderHandle`
  - Implementation: `src/lib/sync/indexeddb.ts`

**File Storage:**
- File System Access API - Local folder backup/sync
  - Implementation: `src/lib/sync/file-sync.ts`
  - Files: `omps-latest.json` (current), `omps-backup-*.json` (history)
  - History limit: 10 backup files
  - Requires user folder selection and read/write permission

**Caching:**
- None - All data persisted to chrome.storage.local

## Authentication & Identity

**Auth Provider:**
- Not applicable - Extension runs locally without user authentication
- No login/registration required

## Monitoring & Observability

**Error Tracking:**
- None - Console logging only with `[Oh My Prompt Script]` prefix

**Logs:**
- Browser console with prefixed messages
- All modules use `console.log`, `console.warn`, `console.error` with consistent prefix
- Pattern: `console.log('[Oh My Prompt Script] message')`

## CI/CD & Deployment

**Hosting:**
- GitHub Pages - Project website/landing page
- Chrome Web Store - Extension distribution (manual upload)
- GitHub Releases - .crx/.zip download files

**CI Pipeline:**
- None detected - No GitHub Actions or other CI workflows found

**Build Process:**
- Manual: `npm run build` produces `dist/` directory
- Development: `npm run dev` with hot reload via Vite

## Environment Configuration

**Required env vars:**
- None - Extension does not use environment variables
- All configuration in `manifest.json` and source code constants

**Secrets location:**
- Not applicable - No secrets or API keys required
- GitHub API uses public endpoint without authentication

## Webhooks & Callbacks

**Incoming:**
- None - Extension does not receive external webhooks

**Outgoing:**
- GitHub API GET request for release information
- No outbound webhooks or callbacks to external services

## Chrome Extension APIs Used

**Storage:**
- `chrome.storage.local.get()` - Read data
- `chrome.storage.local.set()` - Write data
- `chrome.storage.local.remove()` - Clear specific keys
- `chrome.storage.local.getBytesInUse()` - Check quota usage

**Runtime:**
- `chrome.runtime.getManifest()` - Get extension version
- `chrome.runtime.sendMessage()` - Message to service worker
- `chrome.runtime.onMessage` - Receive messages in service worker
- `chrome.runtime.onInstalled` - Extension install/update event
- `chrome.runtime.onStartup` - Browser startup event

**Tabs:**
- `chrome.tabs.create()` - Open new tabs
- `chrome.tabs.sendMessage()` - Message to content script

**Action:**
- `chrome.action.setBadgeText()` - Show update indicator
- `chrome.action.setBadgeBackgroundColor()` - Badge color

**Downloads:**
- `chrome.downloads.download()` - Export JSON files

**Alarms:**
- `chrome.alarms.create()` - Periodic update check (60 minute interval)
- `chrome.alarms.onAlarm` - Alarm trigger handler

---

*Integration audit: 2026-04-21*