# Phase 9: Context Menu Foundation - Pattern Map

**Mapped:** 2026-04-28
**Files analyzed:** 3 (modified)
**Analogs found:** 3 / 3

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `manifest.json` | config | N/A | `manifest.json` (self-modification) | exact |
| `src/background/service-worker.ts` | controller | event-driven | `src/background/service-worker.ts` | exact |
| `src/shared/constants.ts` | config | N/A | `src/shared/constants.ts` | exact |

## Pattern Assignments

### `manifest.json` (config)

**Analog:** `manifest.json` (self-modification)

**Current permissions structure** (lines 35):
```json
"permissions": ["activeTab", "downloads", "storage", "tabs", "alarms"]
```

**Change pattern:** Add "contextMenus" to permissions array:
```json
"permissions": ["activeTab", "downloads", "storage", "tabs", "alarms", "contextMenus"]
```

---

### `src/background/service-worker.ts` (controller, event-driven)

**Analog:** `src/background/service-worker.ts`

**Console log prefix pattern** (line 10):
```typescript
console.log('[Oh My Prompt] Service Worker started')
```

**Listener pattern for Chrome events** (lines 14-404):
```typescript
chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    console.log('[Oh My Prompt] Received message:', message.type)

    switch (message.type) {
      case MessageType.PING:
        sendResponse({ success: true, data: 'pong' } as MessageResponse<string>)
        break
      // ... other cases
    }

    return true // Required for async sendResponse
  }
)
```

**Async storage write pattern** (lines 288-295 from RESEARCH.md example):
```typescript
chrome.storage.local.set({
  _capturedImageUrl: {
    url: info.srcUrl,
    capturedAt: Date.now(),
    tabId: tab?.id
  }
})
```

**Error handling pattern** (lines 77-80):
```typescript
.catch(error => {
  console.error('[Oh My Prompt] SET_STORAGE error:', error)
  sendResponse({ success: false, error: 'Storage save failed' })
})
```

**Context menu creation pattern** (from RESEARCH.md verified pattern):
```typescript
// Add after the initial console.log at top of file
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'convert-to-prompt',
    title: '转提示词',
    contexts: ['image'],
    targetUrlPatterns: ['http://*/*', 'https://*/*']
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('[Oh My Prompt] Context menu creation error:', chrome.runtime.lastError)
    } else {
      console.log('[Oh My Prompt] Context menu created successfully')
    }
  })
})
```

**Context menu click handler pattern** (from RESEARCH.md verified pattern):
```typescript
// Add separate listener after message handler
chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  if (info.menuItemId === 'convert-to-prompt') {
    if (!info.srcUrl) {
      console.warn('[Oh My Prompt] No srcUrl in click data')
      return
    }

    // Validate URL is http/https (targetUrlPatterns should handle this, but double-check)
    if (!info.srcUrl.startsWith('http://') && !info.srcUrl.startsWith('https://')) {
      console.warn('[Oh My Prompt] Invalid URL type (not http/https):', info.srcUrl)
      return
    }

    // Store captured URL for Phase 11 Vision API processing
    chrome.storage.local.set({
      _capturedImageUrl: {
        url: info.srcUrl,
        capturedAt: Date.now(),
        tabId: tab?.id
      }
    })

    console.log('[Oh My Prompt] Captured image URL:', info.srcUrl, 'from tab:', tab?.id)
  }
})
```

---

### `src/shared/constants.ts` (config)

**Analog:** `src/shared/constants.ts`

**Existing storage key pattern** (line 10):
```typescript
export const STORAGE_KEY = 'prompt_script_data'
```

**Underscore prefix for internal keys** (lines 17-18):
```typescript
export const SYNC_DB_NAME = 'oh-my-prompt-sync'
export const SYNC_STORE_NAME = 'handles'
export const SYNC_HANDLE_KEY = 'syncFolderHandle'
```

**New constant pattern** (add after line 31):
```typescript
// Captured image URL storage key (for Phase 9 context menu)
export const CAPTURED_IMAGE_STORAGE_KEY = '_capturedImageUrl'
```

---

## Shared Patterns

### Console Log Prefix
**Source:** `src/background/service-worker.ts`, `src/lib/storage.ts`, `src/lib/version-checker.ts`
**Apply to:** All new code in service-worker.ts
```typescript
console.log('[Oh My Prompt] ...')
console.error('[Oh My Prompt] ...:', error)
console.warn('[Oh My Prompt] ...')
```

### Async Response Pattern
**Source:** `src/background/service-worker.ts` (line 30, 81, etc.)
**Apply to:** All Chrome API event handlers with async operations
```typescript
// For async operations in addListener callbacks, return true to keep channel open
return true // Required for async sendResponse
```

### Storage Key Naming Convention
**Source:** `src/shared/constants.ts`
**Apply to:** New storage keys for transient/internal data
- Use underscore prefix for internal/transient data (e.g., `_capturedImageUrl`)
- Use `UPPER_SNAKE_CASE` naming
- Export as `const` from constants.ts

### Chrome API Error Handling
**Source:** `src/background/service-worker.ts`
**Apply to:** All Chrome API calls that can fail
```typescript
if (chrome.runtime.lastError) {
  console.error('[Oh My Prompt] Operation error:', chrome.runtime.lastError)
} else {
  console.log('[Oh My Prompt] Operation successful')
}
```

---

## No Analog Found

All files have exact or close analogs in the existing codebase. The context menu implementation follows established Chrome Extension patterns verified in the RESEARCH.md.

---

## Metadata

**Analog search scope:**
- `manifest.json` (project root)
- `src/background/service-worker.ts`
- `src/shared/constants.ts`
- `src/shared/messages.ts`
- `src/lib/storage.ts`
- `src/lib/version-checker.ts`

**Files scanned:** 6
**Pattern extraction date:** 2026-04-28

**Key insights from research:**
1. Context menu must be created in `chrome.runtime.onInstalled` listener (Chrome persists menus)
2. Cannot use `onclick` callback in CreateProperties for service workers - must use `onClicked.addListener()`
3. Use `targetUrlPatterns` to filter http/https URLs only (Vision API requirement)
4. Store captured URL in separate storage key (not in `StorageSchema`) to reduce coupling