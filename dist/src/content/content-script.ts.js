import { MessageType } from "/src/shared/messages.ts.js";
import { InputDetector } from "/src/content/input-detector.ts.js";
import { UIInjector } from "/src/content/ui-injector.tsx.js";
import { usePromptStore } from "/src/lib/store.ts.js";
console.log("[Oh My Prompt Script] Content script loaded on:", window.location.href);
const inputDetector = new InputDetector(handleInputDetected);
const uiInjector = new UIInjector();
function handleInputDetected(inputElement) {
  if (uiInjector.isInjected()) {
    console.log("[Oh My Prompt Script] Cleaning up existing UI before re-injection");
  }
  console.log("[Oh My Prompt Script] Injecting UI near input element");
  uiInjector.inject(inputElement);
}
inputDetector.start();
chrome.runtime.sendMessage(
  { type: MessageType.PING },
  (response) => {
    if (chrome.runtime.lastError) {
      console.error("[Oh My Prompt Script] Ping failed:", chrome.runtime.lastError.message);
      return;
    }
    console.log("[Oh My Prompt Script] Ping response:", response);
  }
);
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("[Oh My Prompt Script] Received message:", message.type);
  if (message.type === MessageType.GET_STORAGE) {
    sendResponse({ success: true });
  }
  if (message.type === MessageType.REFRESH_DATA) {
    console.log("[Oh My Prompt Script] Refreshing data from backup...");
    usePromptStore.getState().loadFromStorage().then(() => {
      console.log("[Oh My Prompt Script] Data refreshed successfully");
      sendResponse({ success: true });
    }).catch((err) => {
      console.error("[Oh My Prompt Script] Failed to refresh data:", err);
      sendResponse({ success: false, error: String(err) });
    });
    return true;
  }
  return true;
});
window.addEventListener("unload", () => {
  inputDetector.stop();
  uiInjector.remove();
  console.log("[Oh My Prompt Script] Cleanup complete");
});
