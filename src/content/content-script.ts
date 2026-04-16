import { MessageType } from '../shared/messages'

console.log('[Lovart Injector] Content script loaded on:', window.location.href)

// Phase 1: Test message routing with ping
chrome.runtime.sendMessage(
  { type: MessageType.PING },
  (response) => {
    if (chrome.runtime.lastError) {
      console.error('[Lovart Injector] Ping failed:', chrome.runtime.lastError.message)
      return
    }
    console.log('[Lovart Injector] Ping response:', response)
  }
)

// Phase 2 will add:
// - InputDetector: MutationObserver for Lovart input box
// - Dropdown UI: Shadow DOM menu
// - InsertHandler: Prompt insertion logic