---
phase: 12-prompt-insertion
plan: 02
status: complete
completed_at: 2026-04-28T14:35:00.000Z
requirements: [INSERT-01]
---

# Plan 12-02: Content Script INSERT Handler

## Summary

Added INSERT_PROMPT_TO_CS message handler in content script to insert prompt into Lovart input field. This enables service worker to route insertion requests to content script which has DOM access.

## Changes

### Imports (src/content/content-script.ts)
- Added `InsertHandler` import from './insert-handler'
- Added `InsertResultPayload` type import from '../shared/types'

### Handler Implementation
- Created `insertHandler` instance alongside existing `inputDetector` and `uiInjector`
- Added INSERT_PROMPT_TO_CS message handler in `chrome.runtime.onMessage.addListener`:
  - Validates prompt payload
  - Finds Lovart input element using selectors: `[data-testid="agent-message-input"]` or `[data-lexical-editor="true"]`
  - Returns `INPUT_NOT_FOUND` error if element not found
  - Calls `insertHandler.insertPrompt()` for insertion
  - Returns success/failure response to service worker

## Key Files

| File | Change |
|------|--------|
| src/content/content-script.ts | Added imports, insertHandler instance, INSERT_PROMPT_TO_CS handler |

## Verification

- TypeScript compiles: `npx tsc --noEmit` — PASS (no output)
- grep verification: Handler with insertHandler.insertPrompt and INPUT_NOT_FOUND — PASS

## Self-Check

- [x] Content script has INSERT_PROMPT_TO_CS message handler
- [x] Handler finds Lovart input element using selectors
- [x] Handler calls InsertHandler.insertPrompt() and sends response