import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/components/DropdownApp.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--39bcdc8e.js"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import * as RefreshRuntime from "/vendor/react-refresh.js";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
let prevRefreshReg;
let prevRefreshSig;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("D:/workspace/projects/prompt-script/src/content/components/DropdownApp.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_react from "/vendor/.vite-deps-react.js__v--39bcdc8e.js"; const useState = __vite__cjsImport3_react["useState"]; const useCallback = __vite__cjsImport3_react["useCallback"]; const useRef = __vite__cjsImport3_react["useRef"]; const useEffect = __vite__cjsImport3_react["useEffect"];
import { TriggerButton } from "/src/content/components/TriggerButton.tsx.js";
import { DropdownContainer } from "/src/content/components/DropdownContainer.tsx.js";
import { InsertHandler } from "/src/content/insert-handler.ts.js";
import { usePromptStore } from "/src/lib/store.ts.js";
import { MessageType } from "/src/shared/messages.ts.js";
export function DropdownApp({ inputElement }) {
  _s();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const insertHandlerRef = useRef(new InsertHandler());
  const prompts = usePromptStore((state) => state.prompts);
  const categories = usePromptStore((state) => state.categories);
  const isLoading = usePromptStore((state) => state.isLoading);
  const loadFromStorage = usePromptStore((state) => state.loadFromStorage);
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  const handleSelect = useCallback((prompt) => {
    insertHandlerRef.current.insertPrompt(inputElement, prompt.content);
    setSelectedPromptId(prompt.id);
    setTimeout(() => {
      setSelectedPromptId(null);
    }, 2e3);
  }, [inputElement]);
  const handleRefresh = useCallback(async () => {
    console.log("[Oh My Prompt Script] Refresh clicked, opening backup page...");
    await chrome.runtime.sendMessage({ type: MessageType.OPEN_BACKUP_PAGE });
    return { success: true, backupSuccess: false };
  }, []);
  const handleInjectResource = useCallback((resourcePrompt) => {
    insertHandlerRef.current.insertPrompt(inputElement, resourcePrompt.content);
    setIsOpen(false);
  }, [inputElement]);
  return /* @__PURE__ */ jsxDEV("div", { className: "dropdown-app", children: [
    /* @__PURE__ */ jsxDEV(
      TriggerButton,
      {
        isOpen,
        onClick: handleToggle
      },
      void 0,
      false,
      {
        fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownApp.tsx",
        lineNumber: 85,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      DropdownContainer,
      {
        prompts,
        categories,
        onSelect: handleSelect,
        onInjectResource: handleInjectResource,
        onRefresh: handleRefresh,
        isOpen,
        selectedPromptId,
        onClose: handleClose,
        isLoading
      },
      void 0,
      false,
      {
        fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownApp.tsx",
        lineNumber: 90,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownApp.tsx",
    lineNumber: 84,
    columnNumber: 5
  }, this);
}
_s(DropdownApp, "KOI/4bpv1Wc0P7Y7CDIVHZw2Ceo=", false, function() {
  return [usePromptStore, usePromptStore, usePromptStore, usePromptStore];
});
_c = DropdownApp;
var _c;
$RefreshReg$(_c, "DropdownApp");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("D:/workspace/projects/prompt-script/src/content/components/DropdownApp.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/workspace/projects/prompt-script/src/content/components/DropdownApp.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
