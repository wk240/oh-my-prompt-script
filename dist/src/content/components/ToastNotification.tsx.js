import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/components/ToastNotification.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--39bcdc8e.js"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("D:/workspace/projects/prompt-script/src/content/components/ToastNotification.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_reactDom from "/vendor/.vite-deps-react-dom.js__v--39bcdc8e.js"; const createPortal = __vite__cjsImport3_reactDom["createPortal"];
import __vite__cjsImport4_react from "/vendor/.vite-deps-react.js__v--39bcdc8e.js"; const useEffect = __vite__cjsImport4_react["useEffect"];
const PORTAL_ID = "prompt-script-dropdown-portal";
function getPortalContainer() {
  let container = document.getElementById(PORTAL_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = PORTAL_ID;
    document.body.appendChild(container);
  }
  return container;
}
export function ToastNotification({ message, onClose }) {
  _s();
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2e3);
    return () => clearTimeout(timer);
  }, [onClose]);
  return createPortal(
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        style: {
          position: "fixed",
          top: "16px",
          // UI-SPEC
          right: "16px",
          // UI-SPEC
          background: "#171717",
          // UI-SPEC
          color: "#ffffff",
          // UI-SPEC
          padding: "12px 16px",
          // UI-SPEC
          borderRadius: "8px",
          // UI-SPEC
          fontSize: "12px",
          // UI-SPEC
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          // UI-SPEC
          zIndex: 2147483647
          // UI-SPEC
        },
        children: message
      },
      void 0,
      false,
      {
        fileName: "D:/workspace/projects/prompt-script/src/content/components/ToastNotification.tsx",
        lineNumber: 55,
        columnNumber: 5
      },
      this
    ),
    getPortalContainer()
  );
}
_s(ToastNotification, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ToastNotification;
var _c;
$RefreshReg$(_c, "ToastNotification");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("D:/workspace/projects/prompt-script/src/content/components/ToastNotification.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/workspace/projects/prompt-script/src/content/components/ToastNotification.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
