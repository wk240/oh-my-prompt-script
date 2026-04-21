const LOG_PREFIX = "[Oh My Prompt Script]";
const DEBOUNCE_MS = 100;
const INPUT_SELECTORS = [
  // Lovart specific - Lexical editor (most reliable)
  '[data-testid="agent-message-input"]',
  '[data-lexical-editor="true"]',
  // Generic contenteditable textbox
  'div[contenteditable="true"][role="textbox"]',
  // Fallback patterns for other input types
  'textarea[placeholder*="prompt"]',
  'textarea[placeholder*="提示"]',
  ".input-area textarea",
  'textarea[class*="input"]',
  'textarea[class*="prompt"]'
];
export class InputDetector {
  observer = null;
  navObserver = null;
  debounceTimer;
  inputElement = null;
  onInputDetected;
  // Store original history methods for cleanup
  originalPushState = null;
  originalReplaceState = null;
  // Store bound popstate handler for cleanup
  boundPopstateHandler = null;
  // Periodic health check interval
  healthCheckInterval;
  constructor(callback) {
    this.onInputDetected = callback;
  }
  /**
   * Start observing the DOM for Lovart input element
   */
  start() {
    this.tryDetect();
    this.observer = new MutationObserver((_mutations) => {
      this.debouncedDetect();
    });
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
    });
    this.watchNavigation();
    this.healthCheckInterval = setInterval(() => {
      if (!this.inputElement) {
        this.tryDetect();
      }
    }, 3e4);
  }
  /**
   * Stop observing and cleanup
   */
  stop() {
    this.observer?.disconnect();
    this.navObserver?.disconnect();
    if (this.debounceTimer !== void 0) {
      clearTimeout(this.debounceTimer);
    }
    if (this.healthCheckInterval !== void 0) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = void 0;
    }
    if (this.originalPushState) {
      history.pushState = this.originalPushState;
    }
    if (this.originalReplaceState) {
      history.replaceState = this.originalReplaceState;
    }
    if (this.boundPopstateHandler) {
      window.removeEventListener("popstate", this.boundPopstateHandler);
    }
  }
  /**
   * Get the currently detected input element
   */
  getInputElement() {
    return this.inputElement;
  }
  debouncedDetect() {
    if (this.debounceTimer !== void 0) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this.tryDetect();
    }, DEBOUNCE_MS);
  }
  tryDetect() {
    const input = this.findLovartInput();
    if (input && input !== this.inputElement) {
      this.inputElement = input;
      console.log(LOG_PREFIX, "Input detected:", input);
      this.onInputDetected(input);
    }
  }
  findLovartInput() {
    for (const selector of INPUT_SELECTORS) {
      const element = document.querySelector(selector);
      if (element && this.isValidInputElement(element)) {
        return element;
      }
    }
    return null;
  }
  /**
   * Check if element is a valid input target
   */
  isValidInputElement(element) {
    if (element.offsetWidth === 0 || element.offsetHeight === 0) {
      return false;
    }
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      return true;
    }
    if (element.isContentEditable) {
      return true;
    }
    return false;
  }
  /**
   * Handle SPA navigation - reset and re-detect
   */
  handleNavigation() {
    console.log(LOG_PREFIX, "Navigation detected via history API");
    this.inputElement = null;
    this.tryDetect();
  }
  /**
   * Watch for SPA navigation (URL changes without page reload)
   */
  watchNavigation() {
    this.originalPushState = history.pushState;
    this.originalReplaceState = history.replaceState;
    history.pushState = (...args) => {
      this.originalPushState.apply(history, args);
      this.handleNavigation();
    };
    history.replaceState = (...args) => {
      this.originalReplaceState.apply(history, args);
      this.handleNavigation();
    };
    this.boundPopstateHandler = () => this.handleNavigation();
    window.addEventListener("popstate", this.boundPopstateHandler);
    let lastUrl = location.href;
    this.navObserver = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log(LOG_PREFIX, "Navigation detected:", lastUrl);
        this.inputElement = null;
        this.tryDetect();
      }
    });
    this.navObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}
