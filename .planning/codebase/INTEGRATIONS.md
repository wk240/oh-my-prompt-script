# External Integrations

**Analysis Date:** 2026-04-17

## APIs & External Services

**Chrome Extension APIs:**
- `chrome.runtime` - Message passing between contexts
  - `sendMessage()` for content->background communication
  - `onMessage.addListener()` for receiving messages
- `chrome.storage.local` - Data persistence
  - Single key: `prompt_script_data`
  - Quota: 10MB (100KB for sync, 10MB for local)
- `chrome.tabs` - Tab operations
  - `tabs.create()` for opening settings page
  - `tabs.sendMessage()` for popup->content communication
- `chrome.downloads` - File downloads
  - `downloads.download()` for JSON export

**Lovart AI Platform:**
- Target domain: `lovart.ai` and subdomains
- Input element selectors:
  - Primary: `[data-testid="agent-message-input"]`
  - Alternative: `[data-lexical-editor="true"]`
  - Fallback: `div[contenteditable="true"][role="textbox"]`
- UI injection target: `[data-testid="agent-input-bottom-more-button"]`
- Editor type: Lexical (React-based rich text editor)
- Integration method: MutationObserver + Shadow DOM

## Data Storage

**Databases:**
- Chrome storage.local (browser-provided)
  - Key: `prompt_script_data`
  - Schema: `StorageSchema` (prompts, categories, version)
  - Manager: `StorageManager` singleton in `src/lib/storage.ts`
  - Quota monitoring: `checkStorageQuota()` function

**File Storage:**
- Local filesystem only (via chrome.downloads)
- Export format: JSON file
- Import: User-selected JSON file

**Caching:**
- None - Data stored persistently in chrome.storage.local

## Authentication & Identity

**Auth Provider:**
- None - Extension does not require authentication
- User identity tied to browser profile

## Monitoring & Observability

**Error Tracking:**
- Console logging with `[Prompt-Script]` prefix
- ErrorBoundary components in React UIs
- No external error tracking service

**Logs:**
- Console.log with prefix filtering
- All logs prefixed: `[Prompt-Script]`
- Log locations:
  - Service worker: `src/background/service-worker.ts`
  - Content script: `src/content/content-script.ts`
  - UI injector: `src/content/ui-injector.tsx`
  - Input detector: `src/content/input-detector.ts`
  - Insert handler: `src/content/insert-handler.ts`

## CI/CD & Deployment

**Hosting:**
- Not applicable - Chrome Extension
- Distribution: Manual load from `dist/` directory
- Future: Chrome Web Store (not configured)

**CI Pipeline:**
- None configured
- Build command: `npm run build`
- Dev command: `npm run dev`

## Environment Configuration

**Required env vars:**
- None - Extension runs entirely in browser context

**Secrets location:**
- None - No secrets required

## Webhooks & Callbacks

**Incoming:**
- None - Extension operates client-side only

**Outgoing:**
- None - No external API calls

## Message Protocol

**Internal Message Types:**
| Type | Direction | Purpose |
|------|-----------|---------|
| `PING` | Content -> Background | Connection test |
| `GET_STORAGE` | Content/Popup -> Background | Fetch data |
| `SET_STORAGE` | Popup -> Background | Save data |
| `INSERT_PROMPT` | Content -> Background | Insert acknowledgment |
| `OPEN_SETTINGS` | Content -> Background | Open settings tab |

**Message Format:**
```typescript
interface Message<T = unknown> {
  type: MessageType
  payload?: T
}

interface MessageResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
```

---

*Integration audit: 2026-04-17*