import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/components/PromptPreviewModal.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--39bcdc8e.js"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_reactDom from "/vendor/.vite-deps-react-dom.js__v--39bcdc8e.js"; const createPortal = __vite__cjsImport3_reactDom["createPortal"];
import __vite__cjsImport4_react from "/vendor/.vite-deps-react.js__v--39bcdc8e.js"; const useEffect = __vite__cjsImport4_react["useEffect"]; const useCallback = __vite__cjsImport4_react["useCallback"];
import { X, Bookmark, ArrowUpRight } from "/vendor/.vite-deps-lucide-react.js__v--9627703c.js";
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
export function PromptPreviewModal({ prompt, isOpen, onClose, onCollect, onInject }) {
  _s();
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
  const handleInject = useCallback(() => {
    onInject?.();
    onClose();
  }, [onInject, onClose]);
  if (!isOpen) return null;
  return createPortal(
    /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(
        "div",
        {
          className: "modal-overlay",
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
          fileName: "D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx",
          lineNumber: 80,
          columnNumber: 7
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "div",
        {
          className: "modal-content",
          onClick: (e) => e.stopPropagation(),
          style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            maxHeight: "480px",
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
              borderBottom: "1px solid #E5E5E5",
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            }, children: [
              /* @__PURE__ */ jsxDEV("div", { style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px"
              }, children: [
                /* @__PURE__ */ jsxDEV("span", { style: {
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#171717",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: "1",
                  minWidth: "0"
                }, children: prompt.name }, void 0, false, {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx",
                  lineNumber: 123,
                  columnNumber: 13
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: onClose,
                    "aria-label": "关闭",
                    style: {
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#171717"
                    },
                    children: /* @__PURE__ */ jsxDEV(X, { style: { width: 16, height: 16 } }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx",
                      lineNumber: 150,
                      columnNumber: 15
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx",
                    lineNumber: 135,
                    columnNumber: 13
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx",
                lineNumber: 117,
                columnNumber: 11
              }, this),
              prompt.author && /* @__PURE__ */ jsxDEV(
                "a",
                {
                  href: prompt.authorUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  style: {
                    fontSize: "11px",
                    fontWeight: 400,
                    color: "#737373",
                    textDecoration: "none"
                  },
                  children: [
                    "来源: ",
                    prompt.author
                  ]
                },
                void 0,
                true,
                {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx",
                  lineNumber: 155,
                  columnNumber: 11
                },
                this
              )
            ] }, void 0, true, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx",
              lineNumber: 110,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV("div", { style: {
              padding: "16px",
              maxHeight: "320px",
              overflow: "auto",
              fontSize: "12px",
              color: "#171717",
              lineHeight: "1.4"
            }, children: prompt.content }, void 0, false, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx",
              lineNumber: 171,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDEV("div", { style: {
              padding: "12px 16px",
              borderTop: "1px solid #E5E5E5",
              display: "flex",
              gap: "12px"
            }, children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => onCollect?.(),
                  "aria-label": "收藏提示词",
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    padding: "8px 12px",
                    background: "#ffffff",
                    border: "1px solid #E5E5E5",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#171717",
                    cursor: "pointer",
                    flex: "1",
                    minWidth: "0"
                  },
                  children: [
                    /* @__PURE__ */ jsxDEV(Bookmark, { style: { width: 14, height: 14 } }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx",
                      lineNumber: 209,
                      columnNumber: 13
                    }, this),
                    "收藏"
                  ]
                },
                void 0,
                true,
                {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx",
                  lineNumber: 189,
                  columnNumber: 11
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: handleInject,
                  "aria-label": "插入提示词",
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    padding: "8px 12px",
                    background: "#171717",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#fff",
                    cursor: "pointer",
                    flex: "2",
                    minWidth: "0"
                  },
                  children: [
                    /* @__PURE__ */ jsxDEV(ArrowUpRight, { style: { width: 14, height: 14 } }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx",
                      lineNumber: 233,
                      columnNumber: 13
                    }, this),
                    "插入"
                  ]
                },
                void 0,
                true,
                {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx",
                  lineNumber: 213,
                  columnNumber: 11
                },
                this
              )
            ] }, void 0, true, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx",
              lineNumber: 182,
              columnNumber: 9
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx",
          lineNumber: 91,
          columnNumber: 7
        },
        this
      )
    ] }, void 0, true, {
      fileName: "D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx",
      lineNumber: 78,
      columnNumber: 5
    }, this),
    getPortalContainer()
  );
}
_s(PromptPreviewModal, "6o9xgoCC/Rk/Meen/KvCHG4WdqI=");
_c = PromptPreviewModal;
var _c;
$RefreshReg$(_c, "PromptPreviewModal");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/workspace/projects/prompt-script/src/content/components/PromptPreviewModal.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
