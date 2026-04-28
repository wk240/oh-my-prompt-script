# Phase 11: Vision API Integration - Pattern Map

**Mapped:** 2026-04-28
**Files analyzed:** 6 (3 new, 3 modify)
**Analogs found:** 6 / 6

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/popup/loading.html` | popup/config | static | `src/popup/settings.html` | exact |
| `src/popup/loading.tsx` | popup/config | static | `src/popup/settings.tsx` | exact |
| `src/popup/LoadingApp.tsx` | popup/UI | request-response | `src/popup/SettingsApp.tsx` | exact |
| `src/background/service-worker.ts` | service-worker | request-response | `src/background/service-worker.ts` | self-modify |
| `src/shared/messages.ts` | shared/config | static | `src/shared/messages.ts` | self-modify |
| `src/lib/vision-api.ts` | lib | request-response | `src/lib/version-checker.ts` | role-match |
| `vite.config.ts` | config | static | `vite.config.ts` | self-modify |

## Pattern Assignments

### `src/popup/loading.html` (popup/config, static)

**Analog:** `src/popup/settings.html` (lines 1-12)

**Imports pattern** (lines 1-12):
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>图片转提示词 - Oh My Prompt</title>
  <link rel="stylesheet" href="./index.css">
</head>
<body class="bg-gray-50">
  <div id="root"></div>
  <script type="module" src="./loading.tsx"></script>
</body>
</html>
```

---

### `src/popup/loading.tsx` (popup/config, static)

**Analog:** `src/popup/settings.tsx` (lines 1-13)

**React entry point pattern** (lines 1-13):
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import LoadingApp from './LoadingApp'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LoadingApp />
    </ErrorBoundary>
  </React.StrictMode>
)
```

---

### `src/popup/LoadingApp.tsx` (popup/UI, request-response)

**Analog:** `src/popup/SettingsApp.tsx` (lines 1-287)

**Imports pattern** (lines 1-14):
```typescript
import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './components/ui/dialog'
import { Loader2, Check, X, RefreshCw, Settings } from 'lucide-react'
import { MessageType } from '../shared/messages'
```

**State management pattern** (lines 16-23):
```typescript
const [state, setState] = useState<LoadingAppState>({ status: 'loading' })
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
const [success, setSuccess] = useState<string | null>(null)

// Load config on mount
useEffect(() => {
  requestApiCall()
}, [])
```

**Chrome runtime message pattern** (lines 33-52):
```typescript
const loadConfig = async () => {
  setLoading(true)
  try {
    const response = await chrome.runtime.sendMessage({ type: MessageType.GET_API_CONFIG })
    if (response.success && response.data) {
      setConfig(response.data)
      // ... handle success
    } else {
      // ... handle null/error
    }
    setError(null)
  } catch (err) {
    setError('获取配置失败')
    // SECURITY: Log error only, never apiKey (AUTH-02)
    console.error('[Oh My Prompt] GET_API_CONFIG error:', err)
  } finally {
    setLoading(false)
  }
}
```

**Validation pattern** (lines 55-70):
```typescript
const validateInputs = (): string | null => {
  const trimmedUrl = baseUrl.trim()
  const trimmedKey = apiKey.trim()
  const trimmedModel = modelName.trim()

  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return 'API Base URL 必须以 http:// 或 https:// 开头'
  }
  if (!trimmedKey) {
    return 'API Key 不能为空'
  }
  if (!trimmedModel) {
    return 'Model Name 不能为空'
  }
  return null
}
```

**UI layout pattern** (lines 149-170):
```typescript
return (
  <div className="w-full h-full flex items-center justify-center p-6 bg-gray-50">
    <div className="w-[480px] max-w-[90vw] bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div>
          <h1 className="text-base font-semibold text-gray-900">API 配置</h1>
          {/* ... */}
        </div>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500"
          aria-label="关闭"
        >
          <X style={{ width: 16, height: 16 }} />
        </button>
      </div>
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* ... */}
      </div>
    </div>
  </div>
)
```

**Error handling pattern** (lines 230-241):
```typescript
{/* Error message */}
{error && (
  <p className="text-sm text-red-500" role="alert">
    {error}
  </p>
)}

{/* Success message */}
{success && (
  <p className="text-sm text-green-600">
    {success}
  </p>
)}
```

**Button pattern with icons** (lines 244-255):
```typescript
<Button onClick={handleSave} disabled={loading}>
  <Check style={{ width: 16, height: 16 }} />
  {loading ? '保存中...' : '保存配置'}
</Button>
<Button variant="outline" onClick={handleDeleteClick} disabled={loading}>
  <Trash2 style={{ width: 16, height: 16 }} />
  {loading ? '删除中...' : '删除配置'}
</Button>
```

---

### `src/background/service-worker.ts` (service-worker, request-response)

**Self-modify:** Add Vision API handlers following existing patterns at lines 417-463.

**Message handler switch pattern** (lines 36-470):
```typescript
chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    console.log('[Oh My Prompt] Received message:', message.type)

    switch (message.type) {
      case MessageType.GET_API_CONFIG:
        // ... handler
        return true // Required for async response

      // Add VISION_API_CALL handler here:
      case MessageType.VISION_API_CALL:
        const callPayload = message.payload as { imageUrl: string }
        if (!callPayload || !callPayload.imageUrl) {
          sendResponse({ success: false, error: { type: 'network', message: '无效的图片URL' } })
          return true
        }
        executeVisionApiCall(callPayload.imageUrl)
          .then(prompt => sendResponse({ success: true, data: { prompt } }))
          .catch(error => {
            const classified = classifyApiError(error)
            sendResponse({ success: false, error: classified })
          })
        return true

      default:
        sendResponse({ success: false, error: `Unknown message type: ${message.type}` })
    }
    return true // Required for async sendResponse
  }
)
```

**API config handler pattern** (lines 417-463):
```typescript
// Phase 10: API configuration handlers (AUTH-01, AUTH-02, AUTH-04)
case MessageType.GET_API_CONFIG:
  // Get Vision API configuration from storage
  chrome.storage.local.get(VISION_API_CONFIG_STORAGE_KEY)
    .then((result) => {
      const config = result[VISION_API_CONFIG_STORAGE_KEY] as VisionApiConfig | undefined
      sendResponse({ success: true, data: config || null } as MessageResponse<VisionApiConfig | null>)
    })
    .catch(error => {
      console.error('[Oh My Prompt] GET_API_CONFIG error:', error)
      sendResponse({ success: false, error: String(error) })
    })
  return true // Required for async response

case MessageType.SET_API_CONFIG:
  // Save Vision API configuration with timestamp
  const apiConfigPayload = message.payload as VisionApiConfig
  if (!apiConfigPayload || !apiConfigPayload.baseUrl || !apiConfigPayload.apiKey || !apiConfigPayload.modelName) {
    sendResponse({ success: false, error: 'Invalid payload: baseUrl, apiKey, and modelName required' })
    return true
  }
  // SECURITY: Log baseUrl and modelName only, never apiKey (AUTH-02, T-10-01)
  console.log('[Oh My Prompt] SET_API_CONFIG: baseUrl=', apiConfigPayload.baseUrl, 'modelName=', apiConfigPayload.modelName)
  const configWithTimestamp: VisionApiConfig = {
    ...apiConfigPayload,
    configuredAt: Date.now()
  }
  chrome.storage.local.set({ [VISION_API_CONFIG_STORAGE_KEY]: configWithTimestamp })
    .then(() => sendResponse({ success: true } as MessageResponse))
    .catch(error => {
      console.error('[Oh My Prompt] SET_API_CONFIG error:', error)
      sendResponse({ success: false, error: String(error) })
    })
  return true // Required for async response
```

**Context menu click handler pattern** (lines 473-522):
```typescript
// Phase 9: Handle context menu click - capture image URL (MENU-03, D-05)
chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  if (info.menuItemId === 'convert-to-prompt') {
    if (!info.srcUrl) {
      console.warn('[Oh My Prompt] No srcUrl in context menu click data')
      return
    }

    // Double-check URL type (targetUrlPatterns should handle this, but validate defensively)
    if (!info.srcUrl.startsWith('http://') && !info.srcUrl.startsWith('https://')) {
      console.warn('[Oh My Prompt] Invalid URL type (not http/https):', info.srcUrl)
      return
    }

    // Phase 10: Check API config before proceeding (AUTH-03)
    chrome.storage.local.get(VISION_API_CONFIG_STORAGE_KEY)
      .then((result) => {
        const config = result[VISION_API_CONFIG_STORAGE_KEY] as VisionApiConfig | undefined
        if (!config || !config.apiKey) {
          // Open settings page for onboarding
          chrome.tabs.create({ url: chrome.runtime.getURL('src/popup/settings.html') })
          console.log('[Oh My Prompt] No API config found, opened settings for onboarding')
          return
        }

        // API config exists, proceed with URL capture for Phase 11 Vision API processing (D-05, D-08)
        chrome.storage.local.set({
          [CAPTURED_IMAGE_STORAGE_KEY]: {
            url: info.srcUrl,
            capturedAt: Date.now(),
            tabId: tab?.id // Store tab ID for Phase 12 insert vs clipboard decision
          }
        })

        console.log('[Oh My Prompt] Captured image URL:', info.srcUrl, 'from tab:', tab?.id)
      })
      .catch((error) => {
        console.error('[Oh My Prompt] API config check error:', error)
      })
  }
})
```

---

### `src/shared/messages.ts` (shared/config, static)

**Self-modify:** Add new MessageType entries following pattern at lines 27-30.

**MessageType enum pattern** (lines 1-30):
```typescript
export enum MessageType {
  PING = 'PING',
  GET_STORAGE = 'GET_STORAGE',
  // ... existing entries ...
  
  // Phase 10: API configuration operations
  GET_API_CONFIG = 'GET_API_CONFIG',
  SET_API_CONFIG = 'SET_API_CONFIG',
  DELETE_API_CONFIG = 'DELETE_API_CONFIG',

  // Phase 11: Vision API operations (NEW)
  VISION_API_CALL = 'VISION_API_CALL',     // Request API call from loading page
  VISION_API_RESULT = 'VISION_API_RESULT', // Response with generated prompt
  VISION_API_ERROR = 'VISION_API_ERROR'    // Error classification for UI
}

export interface Message<T = unknown> {
  type: MessageType
  payload?: T
}

export interface MessageResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
```

---

### `src/lib/vision-api.ts` (lib, request-response)

**Analog:** `src/lib/version-checker.ts` (lines 1-127)

**API fetch pattern** (lines 37-78):
```typescript
async function fetchLatestRelease(): Promise<{
  version: string
  downloadUrl: string
  releaseNotes?: string
} | null> {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        console.log('[Oh My Prompt] No releases found in repository')
        return null
      }
      console.error('[Oh My Prompt] GitHub API error:', response.status)
      return null
    }

    const data = await response.json()
    // ... process response
    return {
      version,
      downloadUrl: asset?.browser_download_url || data.html_url,
      releaseNotes: data.body
    }
  } catch (error) {
    console.error('[Oh My Prompt] Failed to fetch release:', error)
    return null
  }
}
```

**Console log prefix pattern** (lines 10, 51, 75, 105):
```typescript
// All console logs must use [Oh My Prompt] prefix
console.log('[Oh My Prompt] ...')
console.error('[Oh My Prompt] ...')
console.warn('[Oh My Prompt] ...')
```

---

### `vite.config.ts` (config, static)

**Self-modify:** Add loading.html to input entries following pattern at lines 25-28.

**Extension page input pattern** (lines 25-28):
```typescript
rollupOptions: {
  input: {
    backup: 'src/popup/backup.html',
    settings: 'src/popup/settings.html',
    loading: 'src/popup/loading.html'  // NEW - Phase 11
  },
  // ...
}
```

---

## Shared Patterns

### Authentication / API Key Security
**Source:** `src/background/service-worker.ts` lines 438-439, `src/popup/SettingsApp.tsx` lines 48-49
**Apply to:** All files that handle API key

```typescript
// SECURITY: Log baseUrl and modelName only, never apiKey (AUTH-02)
console.log('[Oh My Prompt] SET_API_CONFIG: baseUrl=', apiConfigPayload.baseUrl, 'modelName=', apiConfigPayload.modelName)
// Never log: apiConfigPayload.apiKey
```

### Error Handling with MessageResponse
**Source:** `src/shared/messages.ts` lines 37-41
**Apply to:** All service worker handlers and popup responses

```typescript
export interface MessageResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// Usage:
sendResponse({ success: true, data: result } as MessageResponse<T>)
sendResponse({ success: false, error: 'Error message' })
```

### Async Response Pattern
**Source:** `src/background/service-worker.ts` lines 48, 99, 132, etc.
**Apply to:** All service worker message handlers with async operations

```typescript
case MessageType.SOME_MESSAGE:
  someAsyncOperation()
    .then(result => sendResponse({ success: true, data: result }))
    .catch(error => sendResponse({ success: false, error: String(error) }))
  return true // Required for async response
```

### Console Log Prefix
**Source:** `src/shared/constants.ts` line 2, service-worker.ts line 10
**Apply to:** All console output

```typescript
// Convention: All logs must use [Oh My Prompt] prefix
console.log('[Oh My Prompt] Service Worker started')
console.error('[Oh My Prompt] ...')
console.warn('[Oh My Prompt] ...')
```

### Storage Key Pattern
**Source:** `src/shared/constants.ts` lines 34-37
**Apply to:** All new storage keys

```typescript
// Captured image URL storage key (for Phase 9 context menu)
export const CAPTURED_IMAGE_STORAGE_KEY = '_capturedImageUrl'

// Vision API configuration storage key (for Phase 10)
export const VISION_API_CONFIG_STORAGE_KEY = '_visionApiConfig'

// Convention: Private storage keys use underscore prefix: _keyName
```

### Button Component Usage
**Source:** `src/popup/components/ui/button.tsx` lines 7-35
**Apply to:** All popup UI buttons

```typescript
// Button variants available:
// - default: black background
// - outline: white with border
// - destructive: red background
// - ghost: transparent hover
// - link: underline text

<Button onClick={handleAction} disabled={loading}>
  <Icon style={{ width: 16, height: 16 }} />
  {loading ? 'Loading...' : 'Action'}
</Button>
<Button variant="outline" onClick={handleCancel}>
  Cancel
</Button>
```

---

## No Analog Found

None — all files have direct or role-match analogs in the existing codebase.

---

## Metadata

**Analog search scope:**
- `src/popup/` — Extension pages (settings, backup patterns)
- `src/background/` — Service worker message handlers
- `src/shared/` — Types, messages, constants
- `src/lib/` — Utility modules (version-checker for API patterns)

**Files scanned:** 12
**Pattern extraction date:** 2026-04-28