const LOG_PREFIX = "[Oh My Prompt Script]";
export class InsertHandler {
  /**
   * Insert prompt content at cursor position (D-10)
   * Dispatches events for Lovart recognition (CORE-04)
   */
  insertPrompt(inputElement, content) {
    try {
      if (inputElement instanceof HTMLInputElement || inputElement instanceof HTMLTextAreaElement) {
        this.insertIntoFormControl(inputElement, content);
      } else {
        this.insertIntoRichText(inputElement, content);
      }
      this.dispatchInputEvents(inputElement);
      console.log(LOG_PREFIX, "Prompt inserted:", content);
      return true;
    } catch (error) {
      console.error(LOG_PREFIX, "Insert failed:", error);
      return false;
    }
  }
  /**
   * Insert into form control (input/textarea) at cursor position
   */
  insertIntoFormControl(element, text) {
    const start = element.selectionStart ?? element.value.length;
    const end = element.selectionEnd ?? start;
    element.value = element.value.substring(0, start) + text + element.value.substring(end);
    const newPosition = start + text.length;
    element.selectionStart = newPosition;
    element.selectionEnd = newPosition;
  }
  /**
   * Insert into rich text element (contenteditable)
   * Uses execCommand for Lexical/React compatibility
   */
  insertIntoRichText(element, text) {
    if (document.activeElement !== element) {
      element.focus();
    }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !element.contains(selection.getRangeAt(0).commonAncestorContainer)) {
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    const success = document.execCommand("insertText", false, text);
    if (!success) {
      console.warn(LOG_PREFIX, "execCommand failed, using fallback method");
      this.insertIntoRichTextFallback(element, text);
    }
  }
  /**
   * Fallback for rich text insertion when execCommand fails
   */
  insertIntoRichTextFallback(element, text) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      element.textContent += text;
      return;
    }
    const range = selection.getRangeAt(0);
    if (!element.contains(range.commonAncestorContainer)) {
      const newRange = document.createRange();
      newRange.selectNodeContents(element);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
    const currentRange = selection.getRangeAt(0);
    currentRange.deleteContents();
    const textNode = document.createTextNode(text);
    currentRange.insertNode(textNode);
    currentRange.setStartAfter(textNode);
    currentRange.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(currentRange);
  }
  /**
   * Dispatch input/change events for Lovart recognition (CORE-04, Pitfall 6)
   */
  dispatchInputEvents(element) {
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    if (element instanceof HTMLInputElement) {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )?.set;
      if (nativeSetter) {
        nativeSetter.call(element, element.value);
        element.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } else if (element instanceof HTMLTextAreaElement) {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        "value"
      )?.set;
      if (nativeSetter) {
        nativeSetter.call(element, element.value);
        element.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    if (element.isContentEditable) {
      element.dispatchEvent(
        new InputEvent("beforeinput", {
          bubbles: true,
          inputType: "insertText",
          data: null
        })
      );
    }
  }
}
