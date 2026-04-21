import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/components/Tooltip.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--39bcdc8e.js"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("D:/workspace/projects/prompt-script/src/content/components/Tooltip.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_react from "/vendor/.vite-deps-react.js__v--39bcdc8e.js"; const useState = __vite__cjsImport3_react["useState"]; const useRef = __vite__cjsImport3_react["useRef"]; const useEffect = __vite__cjsImport3_react["useEffect"]; const useCallback = __vite__cjsImport3_react["useCallback"];
import __vite__cjsImport4_reactDom from "/vendor/.vite-deps-react-dom.js__v--39bcdc8e.js"; const createPortal = __vite__cjsImport4_reactDom["createPortal"];
const TOOLTIP_ID = "oh-my-prompt-script-tooltip-container";
function getTooltipContainer() {
  let container = document.getElementById(TOOLTIP_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = TOOLTIP_ID;
    document.body.appendChild(container);
  }
  return container;
}
export function Tooltip({
  content,
  children,
  placement = "top",
  delay = 300,
  maxWidth = 480
}) {
  _s();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipOffset = 8;
    if (placement === "top") {
      setPosition({
        top: rect.top - tooltipOffset,
        left: rect.left + rect.width / 2
      });
    } else {
      setPosition({
        top: rect.bottom + tooltipOffset,
        left: rect.left + rect.width / 2
      });
    }
  }, [placement]);
  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = window.setTimeout(() => {
      calculatePosition();
      setIsVisible(true);
    }, delay);
  }, [delay, calculatePosition]);
  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  }, []);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        ref: triggerRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        style: { display: "block", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
        children
      },
      void 0,
      false,
      {
        fileName: "D:/workspace/projects/prompt-script/src/content/components/Tooltip.tsx",
        lineNumber: 105,
        columnNumber: 7
      },
      this
    ),
    isVisible && createPortal(
      /* @__PURE__ */ jsxDEV(
        "div",
        {
          style: {
            position: "fixed",
            top: placement === "top" ? position.top : position.top,
            left: position.left,
            transform: placement === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0)",
            padding: "8px 12px",
            background: "#171717",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: 500,
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            maxWidth: `${maxWidth}px`,
            wordWrap: "break-word",
            lineHeight: "1.5",
            zIndex: 2147483647,
            pointerEvents: "none"
          },
          children: content
        },
        void 0,
        false,
        {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/Tooltip.tsx",
          lineNumber: 114,
          columnNumber: 9
        },
        this
      ),
      getTooltipContainer()
    )
  ] }, void 0, true, {
    fileName: "D:/workspace/projects/prompt-script/src/content/components/Tooltip.tsx",
    lineNumber: 104,
    columnNumber: 5
  }, this);
}
_s(Tooltip, "GKlpEUqu9ZqfvGTqS3dxb9vYc0o=");
_c = Tooltip;
var _c;
$RefreshReg$(_c, "Tooltip");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("D:/workspace/projects/prompt-script/src/content/components/Tooltip.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/workspace/projects/prompt-script/src/content/components/Tooltip.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
