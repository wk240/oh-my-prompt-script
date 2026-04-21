import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/components/CategorySelectDialog.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--39bcdc8e.js"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_reactDom from "/vendor/.vite-deps-react-dom.js__v--39bcdc8e.js"; const createPortal = __vite__cjsImport3_reactDom["createPortal"];
import __vite__cjsImport4_react from "/vendor/.vite-deps-react.js__v--39bcdc8e.js"; const useState = __vite__cjsImport4_react["useState"]; const useEffect = __vite__cjsImport4_react["useEffect"]; const useCallback = __vite__cjsImport4_react["useCallback"];
import { Check, Plus } from "/vendor/.vite-deps-lucide-react.js__v--9627703c.js";
const PORTAL_ID = "oh-my-prompt-script-dropdown-portal";
function getPortalContainer() {
  let container = document.getElementById(PORTAL_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = PORTAL_ID;
    document.body.appendChild(container);
  }
  return container;
}
export function CategorySelectDialog({
  categories,
  isOpen,
  onClose,
  onConfirm
}) {
  _s();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setSelectedCategoryId(null);
      setNewCategoryName("");
      setIsCreatingNew(false);
    }
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);
  const handleOverlayClick = useCallback((e) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);
  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setIsCreatingNew(false);
    setNewCategoryName("");
  };
  const handleNewCategoryChange = (value) => {
    setNewCategoryName(value);
    setIsCreatingNew(value.trim().length > 0);
    if (value.trim().length > 0) {
      setSelectedCategoryId(null);
    }
  };
  const handleConfirm = () => {
    if (isCreatingNew && newCategoryName.trim()) {
      onConfirm("", newCategoryName.trim());
    } else if (selectedCategoryId) {
      onConfirm(selectedCategoryId);
    }
  };
  const canConfirm = selectedCategoryId !== null || isCreatingNew && newCategoryName.trim().length > 0;
  if (!isOpen) return null;
  return createPortal(
    /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(
        "div",
        {
          onClick: handleOverlayClick,
          style: {
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 2147483647
          }
        },
        void 0,
        false,
        {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
          lineNumber: 117,
          columnNumber: 7
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "320px",
            // UI-SPEC
            maxHeight: "400px",
            // UI-SPEC
            background: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
            zIndex: 2147483647,
            display: "flex",
            flexDirection: "column"
          },
          children: [
            /* @__PURE__ */ jsxDEV("div", { style: {
              padding: "16px",
              // UI-SPEC
              borderBottom: "1px solid #E5E5E5"
              // UI-SPEC
            }, children: /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "14px", fontWeight: 600, color: "#171717" }, children: "选择收藏分类" }, void 0, false, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
              lineNumber: 149,
              columnNumber: 11
            }, this) }, void 0, false, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
              lineNumber: 145,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV("div", { style: {
              padding: "12px",
              maxHeight: "200px",
              // UI-SPEC
              overflow: "auto"
              // UI-SPEC
            }, children: categories.map(
              (cat) => /* @__PURE__ */ jsxDEV(
                "div",
                {
                  onClick: () => handleCategorySelect(cat.id),
                  role: "option",
                  "aria-selected": selectedCategoryId === cat.id,
                  style: {
                    padding: "12px",
                    // UI-SPEC
                    display: "flex",
                    alignItems: "center",
                    background: selectedCategoryId === cat.id ? "#f0f0f0" : "transparent",
                    // UI-SPEC
                    borderRadius: "6px",
                    // UI-SPEC
                    cursor: "pointer",
                    marginBottom: "4px"
                  },
                  children: [
                    selectedCategoryId === cat.id && /* @__PURE__ */ jsxDEV(Check, { style: { width: 14, height: 14, marginRight: 8, color: "#171717" } }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
                      lineNumber: 177,
                      columnNumber: 13
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "12px", color: "#171717" }, children: cat.name }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
                      lineNumber: 179,
                      columnNumber: 15
                    }, this)
                  ]
                },
                cat.id,
                true,
                {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
                  lineNumber: 161,
                  columnNumber: 11
                },
                this
              )
            ) }, void 0, false, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
              lineNumber: 155,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV("div", { style: {
              padding: "12px",
              borderTop: "1px solid #E5E5E5"
              // UI-SPEC
            }, children: /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", gap: "8px" }, children: [
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  value: newCategoryName,
                  onChange: (e) => handleNewCategoryChange(e.target.value),
                  placeholder: "新建分类...",
                  "aria-label": "新建分类",
                  style: {
                    flex: 1,
                    padding: "8px 12px",
                    // UI-SPEC
                    border: "1px solid #E5E5E5",
                    // UI-SPEC
                    borderRadius: "6px",
                    // UI-SPEC
                    fontSize: "12px",
                    outline: "none"
                  }
                },
                void 0,
                false,
                {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
                  lineNumber: 190,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => {
                    if (newCategoryName.trim()) {
                      handleNewCategoryChange(newCategoryName);
                      setIsCreatingNew(true);
                    }
                  },
                  disabled: !newCategoryName.trim(),
                  "aria-label": "创建",
                  style: {
                    padding: "8px 12px",
                    background: "#f8f8f8",
                    // UI-SPEC
                    border: "1px solid #E5E5E5",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: newCategoryName.trim() ? "pointer" : "not-allowed",
                    opacity: newCategoryName.trim() ? 1 : 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: /* @__PURE__ */ jsxDEV(Plus, { style: { width: 14, height: 14 } }, void 0, false, {
                    fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
                    lineNumber: 226,
                    columnNumber: 15
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
                  lineNumber: 204,
                  columnNumber: 13
                },
                this
              )
            ] }, void 0, true, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
              lineNumber: 189,
              columnNumber: 11
            }, this) }, void 0, false, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
              lineNumber: 185,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV("div", { style: {
              padding: "12px 16px",
              // UI-SPEC
              borderTop: "1px solid #E5E5E5",
              // UI-SPEC
              display: "flex",
              gap: "8px"
            }, children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: onClose,
                  "aria-label": "取消",
                  style: {
                    flex: 1,
                    // UI-SPEC
                    padding: "10px",
                    background: "#f8f8f8",
                    // UI-SPEC
                    border: "1px solid #E5E5E5",
                    borderRadius: "6px",
                    // UI-SPEC
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#171717",
                    cursor: "pointer"
                  },
                  children: "取消"
                },
                void 0,
                false,
                {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
                  lineNumber: 238,
                  columnNumber: 11
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: handleConfirm,
                  disabled: !canConfirm,
                  "aria-label": "确认收藏",
                  style: {
                    flex: 1,
                    // UI-SPEC
                    padding: "10px",
                    background: "#171717",
                    // UI-SPEC primary
                    border: "none",
                    borderRadius: "6px",
                    // UI-SPEC
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#fff",
                    cursor: canConfirm ? "pointer" : "not-allowed",
                    opacity: canConfirm ? 1 : 0.5
                  },
                  children: "确认收藏"
                },
                void 0,
                false,
                {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
                  lineNumber: 255,
                  columnNumber: 11
                },
                this
              )
            ] }, void 0, true, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
              lineNumber: 232,
              columnNumber: 9
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
          lineNumber: 127,
          columnNumber: 7
        },
        this
      )
    ] }, void 0, true, {
      fileName: "D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx",
      lineNumber: 115,
      columnNumber: 5
    }, this),
    getPortalContainer()
  );
}
_s(CategorySelectDialog, "6REV847HMreFKZ6SELpqX2ywzA0=");
_c = CategorySelectDialog;
var _c;
$RefreshReg$(_c, "CategorySelectDialog");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/workspace/projects/prompt-script/src/content/components/CategorySelectDialog.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
