import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/components/TriggerButton.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--39bcdc8e.js"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("D:/workspace/projects/prompt-script/src/content/components/TriggerButton.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
export function TriggerButton({ isOpen, onClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };
  return /* @__PURE__ */ jsxDEV(
    "button",
    {
      className: `trigger-button${isOpen ? " open" : ""}`,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      role: "button",
      tabIndex: 0,
      "aria-label": "选择预设提示词",
      "aria-expanded": isOpen,
      title: "Oh My Prompt Script",
      children: /* @__PURE__ */ jsxDEV(
        "svg",
        {
          className: "trigger-icon",
          width: "18",
          height: "18",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          children: /* @__PURE__ */ jsxDEV(
            "path",
            {
              d: "M13 3L4 14h7l-1 7 9-11h-7l1-7z",
              fill: "currentColor",
              fillOpacity: "0.9"
            },
            void 0,
            false,
            {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/TriggerButton.tsx",
              lineNumber: 63,
              columnNumber: 9
            },
            this
          )
        },
        void 0,
        false,
        {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/TriggerButton.tsx",
          lineNumber: 55,
          columnNumber: 7
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "D:/workspace/projects/prompt-script/src/content/components/TriggerButton.tsx",
      lineNumber: 45,
      columnNumber: 5
    },
    this
  );
}
_c = TriggerButton;
var _c;
$RefreshReg$(_c, "TriggerButton");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("D:/workspace/projects/prompt-script/src/content/components/TriggerButton.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/workspace/projects/prompt-script/src/content/components/TriggerButton.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
