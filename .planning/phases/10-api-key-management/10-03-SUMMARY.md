---
phase: 10-api-key-management
plan: 03
subsystem: build
tags: [manifest, vite-config, onboarding, context-menu]

requires:
  - plan: 10-02
    provides: settings.html, settings.tsx, SettingsApp.tsx, API config handlers
provides:
  - settings.html as default popup (manifest.json action.default_popup)
  - settings entry in vite.config.ts rollupOptions.input
  - Onboarding trigger in context menu handler (opens settings if no API config)
affects: [manifest, build-config, service-worker]
---

# Phase 10: API Key Management - Plan 03 Summary

**Configured build system for settings popup entry and implemented onboarding trigger when context menu detects no API configuration**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-04-28T09:25:00Z
- **Completed:** 2026-04-28T09:35:00Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Extension popup icon now opens Settings UI (not Backup)
- Vite builds both settings.html and backup.html
- Context menu checks API config before capturing image URL
- First-time users without API config are directed to settings page
- Graceful error fallback ensures URL capture continues on storage errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Update manifest.json default_popup** - `c4f1dca` (feat)
2. **Task 2: Add settings entry to vite.config.ts** - `1eafad7` (feat)
3. **Task 3: Add onboarding trigger in context menu** - `d42d00d` (feat)

## Files Modified

- `manifest.json` - Changed action.default_popup from backup.html to settings.html
- `vite.config.ts` - Added settings: 'src/popup/settings.html' to rollupOptions.input
- `src/background/service-worker.ts` - Added API config check in context menu handler

## Security Compliance

| Threat ID | Mitigation | Status |
|-----------|------------|--------|
| T-10-06 | chrome.runtime.getURL for internal URL | PASS |
| T-10-07 | Onboarding cannot be bypassed | PASS |

## Key Patterns Established

- Chrome extension URL pattern: `chrome.runtime.getURL('src/popup/settings.html')`
- Async config check with early return pattern
- Graceful degradation on storage errors (fallback to proceed)

## Decisions Made

- Error fallback: On storage.get error, proceed with URL capture (graceful degradation)
  - Rationale: Storage errors should not block user workflow entirely

## Deviations from Plan

None - all tasks executed as specified.

## Issues Encountered

None - straightforward configuration changes.

## User Setup Required

None - settings popup now default action, onboarding automatic.

## Next Phase Readiness

- Settings popup is default extension action
- Build system outputs both popup HTML files
- Context menu triggers onboarding for unconfigured users
- Phase 11 can proceed with Vision API integration (API config available)

## Verification Results

```bash
# Task 1 verification
grep -n '"default_popup": "src/popup/settings.html"' manifest.json
# Line 23: "default_popup": "src/popup/settings.html",

# Task 2 verification
grep -n "settings:" vite.config.ts
# Line 27: settings: 'src/popup/settings.html'

# Task 3 verification
grep -n "VISION_API_CONFIG_STORAGE_KEY" src/background/service-worker.ts | grep -v "import"
# Line 483: chrome.storage.local.get(VISION_API_CONFIG_STORAGE_KEY)

grep -n "chrome.tabs.create" src/background/service-worker.ts | grep "settings.html"
# Line 487: chrome.tabs.create({ url: chrome.runtime.getURL('src/popup/settings.html') })
```

---
*Phase: 10-api-key-management*
*Completed: 2026-04-28*