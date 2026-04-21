import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/components/ProviderCategoryItem.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--39bcdc8e.js"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("D:/workspace/projects/prompt-script/src/content/components/ProviderCategoryItem.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
import { Database } from "/vendor/.vite-deps-lucide-react.js__v--9627703c.js";
import { Tooltip } from "/src/content/components/Tooltip.tsx.js";
export function ProviderCategoryItem({ category, isSelected, onSelect }) {
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: `sidebar-category-item ${isSelected ? "selected" : ""}`,
      onClick: () => onSelect(category.id),
      role: "button",
      tabIndex: 0,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(category.id);
        }
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 12px",
        background: isSelected ? "#ffffff" : "transparent",
        borderLeft: isSelected ? "2px solid #A16207" : "none",
        cursor: "pointer",
        transition: "background 0.15s ease"
      },
      children: [
        /* @__PURE__ */ jsxDEV(Database, { style: { width: 14, height: 14, color: isSelected ? "#A16207" : "#64748B" } }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/ProviderCategoryItem.tsx",
          lineNumber: 60,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV(Tooltip, { content: category.name, children: /* @__PURE__ */ jsxDEV("span", { style: { display: "block", fontSize: "12px", fontWeight: 500, color: "#171717", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: category.name }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/ProviderCategoryItem.tsx",
          lineNumber: 63,
          columnNumber: 9
        }, this) }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/ProviderCategoryItem.tsx",
          lineNumber: 62,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "D:/workspace/projects/prompt-script/src/content/components/ProviderCategoryItem.tsx",
      lineNumber: 37,
      columnNumber: 5
    },
    this
  );
}
_c = ProviderCategoryItem;
var _c;
$RefreshReg$(_c, "ProviderCategoryItem");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("D:/workspace/projects/prompt-script/src/content/components/ProviderCategoryItem.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/workspace/projects/prompt-script/src/content/components/ProviderCategoryItem.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
