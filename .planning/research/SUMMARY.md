# Research Summary — v1.3.0 Image to Prompt

**Milestone:** v1.3.0 Image to Prompt
**Created:** 2026-04-28

---

## Stack Additions

| Component | Purpose | Notes |
|-----------|---------|-------|
| chrome.contextMenus API | Right-click menu integration | Built-in Chrome API, no external dependency |
| Vision AI API | Claude Vision / GPT-4V | External API calls from service worker |
| Image URL handling | Get image URL from context menu click | Native from `info.srcUrl` |

**No new external libraries needed** — use native Chrome APIs and direct fetch to Vision AI endpoints.

---

## Feature Categories

### Table Stakes (Every implementation has)
- Right-click menu item on images
- Image URL capture from context menu
- Vision API call for image analysis
- Generated prompt text output
- API key configuration

### Differentiators (Nice to have)
- Multiple Vision AI providers (Claude, OpenAI)
- First-use onboarding wizard
- Usage history/logs
- Custom prompt templates for output format
- Rate limiting feedback

### Anti-Features (Avoid)
- Free tier API calls (unpredictable costs)
- Storing images locally (storage limits)
- Auto-insert without user action (Lovart may not be active)

---

## Architecture Integration

**New Components:**
- `src/lib/vision-api.ts` — Vision API client (Claude/OpenAI)
- `src/lib/api-key-manager.ts` — Secure API key storage
- `src/background/context-menu-handler.ts` — Context menu registration + click handling
- `src/popup/components/VisionSettings.tsx` — API key configuration UI
- `src/content/first-use-dialog.tsx` — Onboarding dialog (Shadow DOM)

**Modified Components:**
- `manifest.json` — Add `contextMenus` permission
- `src/background/service-worker.ts` — Add context menu + Vision API handlers
- `src/shared/messages.ts` — Add Vision-related message types
- `src/popup/App.tsx` — Add Vision settings tab/section

**Data Flow:**
1. User right-clicks image → Context menu "转提示词" shown
2. User clicks menu item → Service worker receives `srcUrl`
3. Service worker checks API key → If missing, signal content script to show onboarding
4. Service worker calls Vision API with image URL
5. API returns prompt text → Service worker sends to content script
6. Content script inserts text into Lovart input (if on Lovart page)

---

## Pitfalls

### Security
- **API key exposure:** Never log keys, use chrome.storage.local (not sync), clear on uninstall
- **Image URL validation:** Some URLs may be blocked by CORS — need fallback to data URL

### UX
- **Lovart not active:** User may click on non-Lovart page — need graceful handling (copy to clipboard?)
- **API rate limits:** User may hit limits — show clear error message
- **Latency:** Vision API takes 2-10 seconds — show loading indicator

### Technical
- **CSP compliance:** Vision API calls must go through service worker (not content script)
- **Image format:** Some images may not be accessible (auth required) — handle errors
- **Prompt quality:** Different APIs give different results — user may want to switch

---

## Build Order Recommendation

1. **Phase 1: Context Menu Foundation**
   - Add permission, register menu, capture image URL
   
2. **Phase 2: API Key Management**
   - Storage schema, key manager, first-use onboarding
   
3. **Phase 3: Vision API Integration**
   - Claude Vision client, OpenAI client, error handling
   
4. **Phase 4: Popup Settings UI**
   - API key input, provider selection, usage display
   
5. **Phase 5: End-to-End Flow**
   - Connect all pieces, loading indicator, error handling, testing

---

*Research completed: 2026-04-28*
