import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/components/UpdateGuideModal.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--39bcdc8e.js"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_react from "/vendor/.vite-deps-react.js__v--39bcdc8e.js"; const useState = __vite__cjsImport3_react["useState"];
import __vite__cjsImport4_reactDom from "/vendor/.vite-deps-react-dom.js__v--39bcdc8e.js"; const createPortal = __vite__cjsImport4_reactDom["createPortal"];
import { Download, FolderOpen, RefreshCw, Check, ExternalLink, ChevronRight, ChevronLeft, X } from "/vendor/.vite-deps-lucide-react.js__v--9627703c.js";
const STEPS = [
  {
    id: 1,
    title: "下载新版本",
    description: "从 GitHub Releases 页面下载最新的插件文件",
    icon: Download
  },
  {
    id: 2,
    title: "解压文件",
    description: "如果下载的是 .zip 文件，解压到本地文件夹",
    icon: FolderOpen
  },
  {
    id: 3,
    title: "更新插件",
    description: "在浏览器扩展管理页面重新加载插件",
    icon: RefreshCw
  }
];
const MODAL_ID = "oh-my-prompt-script-update-guide-modal";
function getModalContainer() {
  const dropdownPortal = document.getElementById("oh-my-prompt-script-dropdown-portal");
  if (dropdownPortal) {
    let container2 = dropdownPortal.querySelector(`#${MODAL_ID}`);
    if (!container2) {
      container2 = document.createElement("div");
      container2.id = MODAL_ID;
      dropdownPortal.appendChild(container2);
    }
    return container2;
  }
  let container = document.getElementById(MODAL_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = MODAL_ID;
    document.body.appendChild(container);
  }
  return container;
}
const modalStyles = `
  #${MODAL_ID} .update-guide-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #${MODAL_ID} .update-guide-modal {
    width: 520px;
    max-width: 90vw;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.25);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  #${MODAL_ID} .update-guide-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 20px;
    border-bottom: 1px solid #E5E5E5;
  }

  #${MODAL_ID} .update-guide-title {
    font-size: 16px;
    font-weight: 600;
    color: #171717;
  }

  #${MODAL_ID} .update-guide-close {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: #64748B;
    margin-left: auto;
  }

  #${MODAL_ID} .update-guide-close:hover {
    background: #f8f8f8;
    color: #171717;
  }

  #${MODAL_ID} .update-guide-content {
    padding: 20px;
  }

  #${MODAL_ID} .version-compare {
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 16px;
  }

  #${MODAL_ID} .version-compare-label {
    font-size: 12px;
    color: #856404;
    margin-bottom: 4px;
  }

  #${MODAL_ID} .version-compare-values {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  #${MODAL_ID} .version-current {
    font-size: 14px;
    color: #64748B;
  }

  #${MODAL_ID} .version-arrow {
    color: #d97706;
  }

  #${MODAL_ID} .version-latest {
    font-size: 14px;
    color: #d97706;
    font-weight: 600;
  }

  #${MODAL_ID} .release-notes {
    background: #f8f8f8;
    border: 1px solid #E5E5E5;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 16px;
    max-height: 100px;
    overflow-y: auto;
  }

  #${MODAL_ID} .release-notes-label {
    font-size: 12px;
    color: #64748B;
    margin-bottom: 4px;
  }

  #${MODAL_ID} .release-notes-content {
    font-size: 12px;
    color: #171717;
    white-space: pre-wrap;
  }

  #${MODAL_ID} .step-progress {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  #${MODAL_ID} .step-dot {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 500;
    transition: background 0.2s, color 0.2s;
  }

  #${MODAL_ID} .step-dot.completed {
    background: #16a34a;
    color: #ffffff;
  }

  #${MODAL_ID} .step-dot.active {
    background: #d97706;
    color: #ffffff;
  }

  #${MODAL_ID} .step-dot.pending {
    background: #E5E5E5;
    color: #64748B;
  }

  #${MODAL_ID} .step-card {
    border: 1px solid #E5E5E5;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
  }

  #${MODAL_ID} .step-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  #${MODAL_ID} .step-icon-wrapper {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #fff3cd;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #${MODAL_ID} .step-icon {
    width: 18px;
    height: 18px;
    color: #d97706;
  }

  #${MODAL_ID} .step-title {
    font-size: 14px;
    font-weight: 600;
    color: #171717;
  }

  #${MODAL_ID} .step-desc {
    font-size: 12px;
    color: #64748B;
  }

  #${MODAL_ID} .step-actions {
    padding-left: 48px;
  }

  #${MODAL_ID} .step-text {
    font-size: 12px;
    color: #171717;
    margin-bottom: 8px;
  }

  #${MODAL_ID} .step-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #171717;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }

  #${MODAL_ID} .step-btn:hover {
    background: #404040;
  }

  #${MODAL_ID} .step-btn-outline {
    background: #ffffff;
    color: #171717;
    border: 1px solid #E5E5E5;
  }

  #${MODAL_ID} .step-btn-outline:hover {
    background: #f8f8f8;
  }

  #${MODAL_ID} .step-note {
    font-size: 11px;
    color: #64748B;
    margin-top: 8px;
  }

  #${MODAL_ID} .update-guide-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-top: 1px solid #E5E5E5;
  }

  #${MODAL_ID} .nav-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    background: transparent;
    color: #64748B;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  #${MODAL_ID} .nav-btn:hover:not(:disabled) {
    background: #f8f8f8;
    color: #171717;
  }

  #${MODAL_ID} .nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  #${MODAL_ID} .nav-btn-primary {
    background: #171717;
    color: #ffffff;
  }

  #${MODAL_ID} .nav-btn-primary:hover {
    background: #404040;
  }
`;
let stylesInjected = false;
function injectStyles() {
  if (!stylesInjected) {
    const style = document.createElement("style");
    style.id = "oh-my-prompt-script-update-guide-styles";
    style.textContent = modalStyles;
    document.head.appendChild(style);
    stylesInjected = true;
  }
}
export function UpdateGuideModal({ status, isOpen, onClose }) {
  _s();
  const [currentStep, setCurrentStep] = useState(0);
  if (!isOpen || !status) return null;
  injectStyles();
  const handleDownload = () => {
    if (status?.downloadUrl) {
      window.open(status.downloadUrl, "_blank");
    }
  };
  const handleOpenExtensions = () => {
    window.open("chrome://extensions", "_blank");
  };
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };
  const step = STEPS[currentStep];
  const StepIcon = step.icon;
  return createPortal(
    /* @__PURE__ */ jsxDEV("div", { className: "update-guide-overlay", onClick: handleClose, children: /* @__PURE__ */ jsxDEV("div", { className: "update-guide-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxDEV("div", { className: "update-guide-header", children: [
        /* @__PURE__ */ jsxDEV(Download, { style: { width: 18, height: 18, color: "#d97706" } }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
          lineNumber: 416,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "update-guide-title", children: "更新引导" }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
          lineNumber: 417,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: "update-guide-close", onClick: handleClose, children: /* @__PURE__ */ jsxDEV(X, { style: { width: 14, height: 14 } }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
          lineNumber: 419,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
          lineNumber: 418,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
        lineNumber: 415,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "update-guide-content", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "version-compare", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "version-compare-label", children: "版本对比" }, void 0, false, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
            lineNumber: 426,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "version-compare-values", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "version-current", children: [
              "当前: v",
              status.currentVersion
            ] }, void 0, true, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
              lineNumber: 428,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(ChevronRight, { className: "version-arrow", style: { width: 14, height: 14 } }, void 0, false, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
              lineNumber: 429,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "version-latest", children: [
              "最新: v",
              status.latestVersion
            ] }, void 0, true, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
              lineNumber: 430,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
            lineNumber: 427,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
          lineNumber: 425,
          columnNumber: 11
        }, this),
        status.releaseNotes && /* @__PURE__ */ jsxDEV("div", { className: "release-notes", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "release-notes-label", children: "更新说明" }, void 0, false, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
            lineNumber: 437,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "release-notes-content", children: [
            status.releaseNotes.slice(0, 500),
            status.releaseNotes.length > 500 && "..."
          ] }, void 0, true, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
            lineNumber: 438,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
          lineNumber: 436,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "step-progress", children: STEPS.map(
          (s, idx) => /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: `step-dot ${idx < currentStep ? "completed" : idx === currentStep ? "active" : "pending"}`,
              children: idx < currentStep ? /* @__PURE__ */ jsxDEV(Check, { style: { width: 14, height: 14 } }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
                lineNumber: 453,
                columnNumber: 15
              }, this) : s.id
            },
            s.id,
            false,
            {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
              lineNumber: 448,
              columnNumber: 13
            },
            this
          )
        ) }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
          lineNumber: 446,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "step-card", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "step-header", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "step-icon-wrapper", children: /* @__PURE__ */ jsxDEV(StepIcon, { className: "step-icon" }, void 0, false, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
              lineNumber: 465,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
              lineNumber: 464,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("div", { className: "step-title", children: [
                "步骤 ",
                step.id,
                ": ",
                step.title
              ] }, void 0, true, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
                lineNumber: 468,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "step-desc", children: step.description }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
                lineNumber: 469,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
              lineNumber: 467,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
            lineNumber: 463,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "step-actions", children: [
            currentStep === 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
              /* @__PURE__ */ jsxDEV("p", { className: "step-text", children: "点击下方按钮打开 GitHub Releases 页面，下载最新的 .crx 或 .zip 文件" }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
                lineNumber: 476,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("button", { className: "step-btn", onClick: handleDownload, children: [
                /* @__PURE__ */ jsxDEV(ExternalLink, { style: { width: 12, height: 12 } }, void 0, false, {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
                  lineNumber: 478,
                  columnNumber: 21
                }, this),
                "打开下载页面"
              ] }, void 0, true, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
                lineNumber: 477,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
              lineNumber: 475,
              columnNumber: 15
            }, this),
            currentStep === 1 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
              /* @__PURE__ */ jsxDEV("p", { className: "step-text", children: '下载完成后，找到下载的 .zip 文件，右键选择"解压到当前文件夹"或使用解压软件解压' }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
                lineNumber: 486,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "step-note", children: "如果下载的是 .crx 文件，可以直接跳到下一步" }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
                lineNumber: 487,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
              lineNumber: 485,
              columnNumber: 15
            }, this),
            currentStep === 2 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
              /* @__PURE__ */ jsxDEV("p", { className: "step-text", children: '打开浏览器扩展管理页面，找到本插件，点击"重新加载"按钮（刷新图标）' }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
                lineNumber: 493,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("button", { className: "step-btn step-btn-outline", onClick: handleOpenExtensions, children: [
                /* @__PURE__ */ jsxDEV(ExternalLink, { style: { width: 12, height: 12 } }, void 0, false, {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
                  lineNumber: 495,
                  columnNumber: 21
                }, this),
                "打开扩展管理"
              ] }, void 0, true, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
                lineNumber: 494,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "step-note", children: '如果是开发者模式加载的解压扩展，点击"重新加载"即可' }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
                lineNumber: 498,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
              lineNumber: 492,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
            lineNumber: 473,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
          lineNumber: 462,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
        lineNumber: 423,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "update-guide-footer", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            className: "nav-btn",
            onClick: handlePrev,
            disabled: currentStep === 0,
            children: [
              /* @__PURE__ */ jsxDEV(ChevronLeft, { style: { width: 14, height: 14 } }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
                lineNumber: 511,
                columnNumber: 13
              }, this),
              "上一步"
            ]
          },
          void 0,
          true,
          {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
            lineNumber: 506,
            columnNumber: 11
          },
          this
        ),
        currentStep === STEPS.length - 1 ? /* @__PURE__ */ jsxDEV("button", { className: "nav-btn nav-btn-primary", onClick: handleClose, children: "完成" }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
          lineNumber: 516,
          columnNumber: 11
        }, this) : /* @__PURE__ */ jsxDEV("button", { className: "nav-btn nav-btn-primary", onClick: handleNext, children: [
          "下一步",
          /* @__PURE__ */ jsxDEV(ChevronRight, { style: { width: 14, height: 14 } }, void 0, false, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
            lineNumber: 522,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
          lineNumber: 520,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
        lineNumber: 505,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
      lineNumber: 414,
      columnNumber: 7
    }, this) }, void 0, false, {
      fileName: "D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx",
      lineNumber: 413,
      columnNumber: 5
    }, this),
    getModalContainer()
  );
}
_s(UpdateGuideModal, "1sJm2lQ2mRX7Y0EEARB7TDldOEM=");
_c = UpdateGuideModal;
var _c;
$RefreshReg$(_c, "UpdateGuideModal");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/workspace/projects/prompt-script/src/content/components/UpdateGuideModal.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
