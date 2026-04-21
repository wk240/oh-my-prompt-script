import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/components/LoadMoreButton.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--39bcdc8e.js"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("D:/workspace/projects/prompt-script/src/content/components/LoadMoreButton.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
export function LoadMoreButton({ loadedCount, totalCount, onLoadMore, isLoading = false }) {
  const isAllLoaded = loadedCount >= totalCount;
  return /* @__PURE__ */ jsxDEV("div", { style: { padding: "12px 16px", borderTop: "1px solid #E5E5E5" }, children: [
    /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "10px", color: "#64748B", textAlign: "center", marginBottom: "8px" }, children: [
      "已加载 ",
      loadedCount,
      "/",
      totalCount,
      " 条"
    ] }, void 0, true, {
      fileName: "D:/workspace/projects/prompt-script/src/content/components/LoadMoreButton.tsx",
      lineNumber: 38,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: onLoadMore,
        disabled: isLoading || isAllLoaded,
        style: {
          width: "100%",
          height: "40px",
          background: isAllLoaded ? "#f0f0f0" : "#f8f8f8",
          border: "1px solid #E5E5E5",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: 500,
          color: "#171717",
          cursor: isAllLoaded ? "not-allowed" : "pointer",
          opacity: isAllLoaded ? 0.5 : 1,
          transition: "background 0.15s, border-color 0.15s"
        },
        children: isLoading ? "加载中..." : isAllLoaded ? "已全部加载" : "加载更多"
      },
      void 0,
      false,
      {
        fileName: "D:/workspace/projects/prompt-script/src/content/components/LoadMoreButton.tsx",
        lineNumber: 42,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "D:/workspace/projects/prompt-script/src/content/components/LoadMoreButton.tsx",
    lineNumber: 36,
    columnNumber: 5
  }, this);
}
_c = LoadMoreButton;
var _c;
$RefreshReg$(_c, "LoadMoreButton");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("D:/workspace/projects/prompt-script/src/content/components/LoadMoreButton.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/workspace/projects/prompt-script/src/content/components/LoadMoreButton.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
