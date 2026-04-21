import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/components/NetworkPromptCard.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--39bcdc8e.js"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("D:/workspace/projects/prompt-script/src/content/components/NetworkPromptCard.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
import { ArrowUpRight, Bookmark } from "/vendor/.vite-deps-lucide-react.js__v--9627703c.js";
import { truncateText } from "/src/shared/utils.ts.js";
import { Tooltip } from "/src/content/components/Tooltip.tsx.js";
const FALLBACK_IMAGE_SVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80"%3E%3Crect fill="%23f0f0f0" width="120" height="80"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="10" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
export function NetworkPromptCard({ prompt, onClick, onInject, onCollect, isCollected = false }) {
  const handleInjectClick = (e) => {
    e.stopPropagation();
    onInject?.();
  };
  const handleCollectClick = (e) => {
    e.stopPropagation();
    onCollect?.();
  };
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: "network-prompt-card",
      onClick,
      role: "button",
      tabIndex: 0,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      },
      style: {
        width: "calc(50% - 6px)",
        // D-04: 2-column with 12px gap
        padding: "12px",
        background: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "background 0.15s, box-shadow 0.15s",
        boxSizing: "border-box",
        position: "relative"
        // For absolute positioned buttons
      },
      children: [
        /* @__PURE__ */ jsxDEV(Tooltip, { content: "一键注入", children: /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleInjectClick,
            "aria-label": "一键注入",
            style: {
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              border: "1px solid #E5E5E5",
              borderRadius: "4px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              zIndex: 10
            },
            children: /* @__PURE__ */ jsxDEV(ArrowUpRight, { style: { width: 12, height: 12, color: "#171717" } }, void 0, false, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/NetworkPromptCard.tsx",
              lineNumber: 100,
              columnNumber: 11
            }, this)
          },
          void 0,
          false,
          {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/NetworkPromptCard.tsx",
            lineNumber: 80,
            columnNumber: 9
          },
          this
        ) }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/NetworkPromptCard.tsx",
          lineNumber: 79,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV(Tooltip, { content: isCollected ? "已收藏" : "收藏", children: /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleCollectClick,
            "aria-label": isCollected ? "已收藏" : "收藏",
            style: {
              position: "absolute",
              top: "8px",
              left: "8px",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isCollected ? "#171717" : "#ffffff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              zIndex: 10
            },
            children: /* @__PURE__ */ jsxDEV(Bookmark, { style: { width: 12, height: 12, color: isCollected ? "#ffffff" : "#171717", fill: isCollected ? "#171717" : "none" } }, void 0, false, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/NetworkPromptCard.tsx",
              lineNumber: 126,
              columnNumber: 11
            }, this)
          },
          void 0,
          false,
          {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/NetworkPromptCard.tsx",
            lineNumber: 106,
            columnNumber: 9
          },
          this
        ) }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/NetworkPromptCard.tsx",
          lineNumber: 105,
          columnNumber: 7
        }, this),
        prompt.previewImage && /* @__PURE__ */ jsxDEV(
          "img",
          {
            src: prompt.previewImage,
            alt: prompt.name,
            style: {
              width: "100%",
              height: "80px",
              objectFit: "cover",
              borderRadius: "6px"
            },
            onError: (e) => {
              e.currentTarget.src = FALLBACK_IMAGE_SVG;
            }
          },
          void 0,
          false,
          {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/NetworkPromptCard.tsx",
            lineNumber: 132,
            columnNumber: 7
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(Tooltip, { content: prompt.name, children: /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "12px", fontWeight: 500, color: "#171717", marginTop: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: truncateText(prompt.name, 30) }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/NetworkPromptCard.tsx",
          lineNumber: 149,
          columnNumber: 9
        }, this) }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/NetworkPromptCard.tsx",
          lineNumber: 148,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV(Tooltip, { content: prompt.description || prompt.content, children: /* @__PURE__ */ jsxDEV(
          "div",
          {
            style: {
              fontSize: "10px",
              fontWeight: 500,
              color: "#64748B",
              marginTop: "4px",
              padding: "4px 8px",
              background: "#f0f0f0",
              borderRadius: "4px",
              display: "inline-block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%"
            },
            children: prompt.sourceCategory || "Unknown"
          },
          void 0,
          false,
          {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/NetworkPromptCard.tsx",
            lineNumber: 155,
            columnNumber: 9
          },
          this
        ) }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/NetworkPromptCard.tsx",
          lineNumber: 154,
          columnNumber: 7
        }, this),
        prompt.author && /* @__PURE__ */ jsxDEV(
          "a",
          {
            href: prompt.authorUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            onClick: (e) => e.stopPropagation(),
            style: {
              fontSize: "10px",
              fontWeight: 400,
              color: "#737373",
              marginTop: "4px",
              display: "block",
              textDecoration: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            },
            children: [
              "by ",
              prompt.author
            ]
          },
          void 0,
          true,
          {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/NetworkPromptCard.tsx",
            lineNumber: 176,
            columnNumber: 7
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "D:/workspace/projects/prompt-script/src/content/components/NetworkPromptCard.tsx",
      lineNumber: 55,
      columnNumber: 5
    },
    this
  );
}
_c = NetworkPromptCard;
var _c;
$RefreshReg$(_c, "NetworkPromptCard");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("D:/workspace/projects/prompt-script/src/content/components/NetworkPromptCard.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/workspace/projects/prompt-script/src/content/components/NetworkPromptCard.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
