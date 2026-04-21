import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/components/DropdownContainer.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--39bcdc8e.js"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$(), _s2 = $RefreshSig$(), _s3 = $RefreshSig$();
import __vite__cjsImport3_react from "/vendor/.vite-deps-react.js__v--39bcdc8e.js"; const useRef = __vite__cjsImport3_react["useRef"]; const useState = __vite__cjsImport3_react["useState"]; const useMemo = __vite__cjsImport3_react["useMemo"]; const useEffect = __vite__cjsImport3_react["useEffect"]; const useCallback = __vite__cjsImport3_react["useCallback"];
import __vite__cjsImport4_reactDom from "/vendor/.vite-deps-react-dom.js__v--39bcdc8e.js"; const createPortal = __vite__cjsImport4_reactDom["createPortal"];
import { truncateText, sortCategoriesByOrder, sortPromptsByOrder, sortProviderCategoriesByOrder } from "/src/shared/utils.ts.js";
import { Sparkles, Palette, Shapes, ArrowUpRight, X, Settings, FolderOpen, Layers, Sparkle, Brush, GripVertical, Database, ArrowLeft, Sun, Frame, Paintbrush, Image, RefreshCw, ArrowUpCircle } from "/vendor/.vite-deps-lucide-react.js__v--9627703c.js";
import { DndContext, closestCenter } from "/vendor/.vite-deps-@dnd-kit_core.js__v--32139f3d.js";
import { SortableContext, verticalListSortingStrategy, useSortable } from "/vendor/.vite-deps-@dnd-kit_sortable.js__v--b168a0c7.js";
import { CSS } from "/vendor/.vite-deps-@dnd-kit_utilities.js__v--dedadc92.js";
import { NetworkPromptCard } from "/src/content/components/NetworkPromptCard.tsx.js";
import { ProviderCategoryItem } from "/src/content/components/ProviderCategoryItem.tsx.js";
import { LoadMoreButton } from "/src/content/components/LoadMoreButton.tsx.js";
import { PromptPreviewModal } from "/src/content/components/PromptPreviewModal.tsx.js";
import { CategorySelectDialog } from "/src/content/components/CategorySelectDialog.tsx.js";
import { ToastNotification } from "/src/content/components/ToastNotification.tsx.js";
import { Tooltip } from "/src/content/components/Tooltip.tsx.js";
import { UpdateGuideModal } from "/src/content/components/UpdateGuideModal.tsx.js";
import { usePromptStore } from "/src/lib/store.ts.js";
import { getResourcePrompts, getResourceCategories } from "/src/lib/resource-library.ts.js";
import { MessageType } from "/src/shared/messages.ts.js";
const ICON_MAP = {
  design: Sparkles,
  style: Palette,
  default: Shapes
};
const DEFAULT_CATEGORIES = [
  { id: "all", name: "全部分类", order: 0 },
  { id: "design", name: "设计", order: 1 },
  { id: "style", name: "风格", order: 2 },
  { id: "other", name: "其他", order: 3 }
];
const PORTAL_ID = "oh-my-prompt-script-dropdown-portal";
function getPortalContainer() {
  let container = document.getElementById(PORTAL_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = PORTAL_ID;
    const style = document.createElement("style");
    style.id = "oh-my-prompt-script-dropdown-styles";
    style.textContent = getDropdownStyles();
    document.head.appendChild(style);
    document.body.appendChild(container);
  }
  return container;
}
function getDropdownStyles() {
  return `
    #${PORTAL_ID} .dropdown-container {
      position: fixed;
      width: 640px;
      max-height: 600px;
      background: #ffffff;
      border: 1px solid #E5E5E5;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      box-sizing: border-box;
      z-index: 2147483647;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
    }

    #${PORTAL_ID} .dropdown-sidebar {
      width: 160px;
      background: #f8f8f8;
      border-right: 1px solid #E5E5E5;
      display: flex;
      flex-direction: column;
      padding: 12px 0;
      border-radius: 12px 0 0 12px;
    }

    #${PORTAL_ID} .sidebar-categories {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow-y: auto;
    }

    #${PORTAL_ID} .sidebar-category-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: transparent;
      border: none;
      border-radius: 0;
      text-align: left;
      font-size: 12px;
      font-weight: 500;
      color: #171717;
      cursor: pointer;
      transition: background 0.15s ease;
      width: 100%;
      overflow: hidden;
    }

    #${PORTAL_ID} .sidebar-category-item span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      min-width: 0;
    }

    #${PORTAL_ID} .sidebar-category-item:hover {
      background: #f0f0f0;
    }

    #${PORTAL_ID} .sidebar-category-item.selected {
      background: #ffffff;
      color: #A16207;
      border-left: 2px solid #A16207;
    }

    #${PORTAL_ID} .sidebar-category-icon {
      width: 14px;
      height: 14px;
      color: #64748B;
    }

    #${PORTAL_ID} .sidebar-category-item.selected .sidebar-category-icon {
      color: #A16207;
    }

    #${PORTAL_ID} .dropdown-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-radius: 0 12px 12px 0;
    }

    #${PORTAL_ID} .dropdown-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #E5E5E5;
    }

    #${PORTAL_ID} .dropdown-header-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      color: #171717;
    }

    #${PORTAL_ID} .dropdown-header-logo {
      width: 16px;
      height: 16px;
    }

    #${PORTAL_ID} .dropdown-header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    #${PORTAL_ID} .dropdown-action-btn {
      width: 24px;
      height: 24px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: #ffffff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.15s ease;
      color: #171717;
      box-sizing: border-box;
    }

    #${PORTAL_ID} .dropdown-action-btn:hover {
      background: #f8f8f8;
    }

    #${PORTAL_ID} .dropdown-action-btn.refreshing {
      cursor: wait;
    }

    #${PORTAL_ID} .dropdown-action-btn.refreshing svg {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    #${PORTAL_ID} .dropdown-content {
      flex: 1;
      overflow-y: auto;
      padding: 12px 16px;
    }

    #${PORTAL_ID} .dropdown-items {
      display: flex;
      flex-direction: column;
    }

    #${PORTAL_ID} .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #E5E5E5;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    #${PORTAL_ID} .dropdown-item:hover {
      background: #f8f8f8;
    }

    #${PORTAL_ID} .dropdown-item.last {
      border-bottom: none;
    }

    #${PORTAL_ID} .dropdown-item.selected {
      background: #fef3e2;
    }

    #${PORTAL_ID} .dropdown-item-icon {
      width: 16px;
      height: 16px;
      color: #171717;
    }

    #${PORTAL_ID} .dropdown-item-text {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    #${PORTAL_ID} .dropdown-item-name {
      font-size: 12px;
      font-weight: 500;
      color: #171717;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    #${PORTAL_ID} .dropdown-item-preview {
      font-size: 10px;
      color: #64748B;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    #${PORTAL_ID} .dropdown-item-arrow {
      width: 12px;
      height: 12px;
      color: #171717;
    }

    #${PORTAL_ID} .empty-state {
      padding: 24px;
      text-align: center;
    }

    #${PORTAL_ID} .empty-message {
      font-size: 12px;
      color: #64748B;
    }

    #${PORTAL_ID} .dropdown-content::-webkit-scrollbar,
    #${PORTAL_ID} .sidebar-categories::-webkit-scrollbar {
      width: 6px;
    }

    #${PORTAL_ID} .dropdown-content::-webkit-scrollbar-track,
    #${PORTAL_ID} .sidebar-categories::-webkit-scrollbar-track {
      background: transparent;
    }

    #${PORTAL_ID} .dropdown-content::-webkit-scrollbar-thumb,
    #${PORTAL_ID} .sidebar-categories::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 3px;
    }

    #${PORTAL_ID} .dropdown-content::-webkit-scrollbar-thumb:hover,
    #${PORTAL_ID} .sidebar-categories::-webkit-scrollbar-thumb:hover {
      background: #ccc;
    }

    #${PORTAL_ID} .dropdown-item-drag-handle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify: center;
      cursor: grab;
      color: #64748B;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.15s ease, visibility 0.15s ease;
      z-index: 100;
      pointer-events: auto;
      background: #ffffff;
      border-radius: 3px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    #${PORTAL_ID} .dropdown-item:hover .dropdown-item-drag-handle,
    #${PORTAL_ID} .dropdown-item-drag-handle:hover {
      opacity: 1;
      visibility: visible;
    }

    #${PORTAL_ID} .dropdown-item-drag-handle:active {
      cursor: grabbing;
    }

    #${PORTAL_ID} .dropdown-item.dragging {
      opacity: 0.5;
      background: #f8f8f8;
    }

    #${PORTAL_ID} .dropdown-item-icon-wrapper {
      position: relative;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify: center;
      flex-shrink: 0;
    }

    #${PORTAL_ID} .dropdown-item-icon {
      width: 16px;
      height: 16px;
      color: #171717;
      transition: opacity 0.15s ease;
    }

    #${PORTAL_ID} .dropdown-item:hover .dropdown-item-icon {
      opacity: 0;
    }

    #${PORTAL_ID} .sidebar-category-drag-handle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 14px;
      height: 14px;
      display: flex;
      align-items: center;
      justify: center;
      cursor: grab;
      color: #64748B;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.15s ease, visibility 0.15s ease;
      z-index: 100;
      pointer-events: auto;
      background: #f8f8f8;
      border-radius: 3px;
    }

    #${PORTAL_ID} .sidebar-category-item:hover .sidebar-category-drag-handle,
    #${PORTAL_ID} .sidebar-category-drag-handle:hover {
      opacity: 1;
      visibility: visible;
    }

    #${PORTAL_ID} .sidebar-category-drag-handle:active {
      cursor: grabbing;
    }

    #${PORTAL_ID} .sidebar-category-icon-wrapper {
      position: relative;
      width: 14px;
      height: 14px;
      display: flex;
      align-items: center;
      justify: center;
      flex-shrink: 0;
    }

    #${PORTAL_ID} .sidebar-category-icon {
      width: 14px;
      height: 14px;
      color: #64748B;
      transition: opacity 0.15s ease;
    }

    #${PORTAL_ID} .sidebar-category-item.selected .sidebar-category-icon {
      color: #A16207;
    }

    #${PORTAL_ID} .sidebar-category-item:hover .sidebar-category-icon {
      opacity: 0;
    }

    /* Resource library styles */

    #${PORTAL_ID} .network-prompt-cards-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    #${PORTAL_ID} .network-prompt-card:hover {
      background: #f8f8f8;
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    }

    #${PORTAL_ID} .network-prompt-card:focus {
      outline: 2px solid #A16207;
      outline-offset: 2px;
    }

    /* Update notification banner styles */
    #${PORTAL_ID} .update-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #fff3cd;
      border-bottom: 1px solid #ffc107;
    }

    #${PORTAL_ID} .update-banner-text {
      font-size: 11px;
      color: #856404;
      flex: 1;
    }

    #${PORTAL_ID} .update-banner-link {
      font-size: 11px;
      color: #d97706;
      font-weight: 500;
      cursor: pointer;
      text-decoration: underline;
    }

    #${PORTAL_ID} .update-banner-link:hover {
      color: #b45309;
    }

    #${PORTAL_ID} .update-banner-close {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #856404;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
    }

    #${PORTAL_ID} .update-banner-close:hover {
      color: #533b04;
    }

    #${PORTAL_ID} .version-badge {
      font-size: 10px;
      color: #64748B;
      font-weight: 400;
      margin-left: 4px;
    }

    #${PORTAL_ID} .update-latest-tip {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 4px;
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 4px;
      padding: 4px 8px;
      white-space: nowrap;
      z-index: 10;
    }
  `;
}
const CATEGORY_ICON_MAP = {
  // Built-in categories
  "cat-quality": Sparkles,
  // 质量与细节
  "cat-style": Palette,
  // 艺术风格
  "cat-lighting": Sun,
  // 光影效果
  "cat-composition": Frame,
  // 构图视角
  "cat-color": Paintbrush,
  // 色彩配色
  "cat-theme": Image,
  // 主题场景
  "cat-medium": Layers,
  // 媒介材质
  // Resource library and special categories
  all: FolderOpen,
  design: Sparkle,
  style: Brush,
  other: Layers
};
function SortableCategoryItem({
  category,
  isSelected,
  onSelect,
  showDragHandle,
  IconComponent
}) {
  _s();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: category.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      ref: setNodeRef,
      style,
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
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "sidebar-category-icon-wrapper", children: [
          showDragHandle && /* @__PURE__ */ jsxDEV("div", { className: "sidebar-category-drag-handle", ...attributes, ...listeners, children: /* @__PURE__ */ jsxDEV(GripVertical, { style: { width: 12, height: 12 } }, void 0, false, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
            lineNumber: 615,
            columnNumber: 13
          }, this) }, void 0, false, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
            lineNumber: 614,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(IconComponent, { className: "sidebar-category-icon" }, void 0, false, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
            lineNumber: 618,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
          lineNumber: 612,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV(Tooltip, { content: category.name, children: /* @__PURE__ */ jsxDEV("span", { children: category.name }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
          lineNumber: 621,
          columnNumber: 9
        }, this) }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
          lineNumber: 620,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
      lineNumber: 598,
      columnNumber: 5
    },
    this
  );
}
_s(SortableCategoryItem, "V3M7/V83udwZW8GPiodMh2TFy/I=", false, function() {
  return [useSortable];
});
_c = SortableCategoryItem;
function SortableDropdownItem({
  prompt,
  isLast,
  isSelected,
  onSelect,
  showDragHandle
}) {
  _s2();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: prompt.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  const IconComponent = ICON_MAP[prompt.categoryId === "design" ? "design" : prompt.categoryId === "style" ? "style" : "default"];
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      ref: setNodeRef,
      style,
      className: `dropdown-item${isSelected ? " selected" : ""}${isLast ? " last" : ""}${isDragging ? " dragging" : ""}`,
      onMouseDown: (e) => e.preventDefault(),
      onClick: () => onSelect(prompt),
      role: "button",
      tabIndex: 0,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(prompt);
        }
      },
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "dropdown-item-icon-wrapper", children: [
          showDragHandle && /* @__PURE__ */ jsxDEV("div", { className: "dropdown-item-drag-handle", ...attributes, ...listeners, children: /* @__PURE__ */ jsxDEV(GripVertical, { style: { width: 12, height: 12 } }, void 0, false, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
            lineNumber: 677,
            columnNumber: 13
          }, this) }, void 0, false, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
            lineNumber: 676,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(IconComponent, { className: "dropdown-item-icon" }, void 0, false, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
            lineNumber: 680,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
          lineNumber: 674,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "dropdown-item-text", children: [
          /* @__PURE__ */ jsxDEV(Tooltip, { content: prompt.name, children: /* @__PURE__ */ jsxDEV("span", { className: "dropdown-item-name", children: prompt.name }, void 0, false, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
            lineNumber: 684,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
            lineNumber: 683,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(Tooltip, { content: prompt.description || prompt.content, children: /* @__PURE__ */ jsxDEV("span", { className: "dropdown-item-preview", children: truncateText(prompt.description || prompt.content, 40) }, void 0, false, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
            lineNumber: 687,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
            lineNumber: 686,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
          lineNumber: 682,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV(ArrowUpRight, { className: "dropdown-item-arrow" }, void 0, false, {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
          lineNumber: 690,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
      lineNumber: 659,
      columnNumber: 5
    },
    this
  );
}
_s2(SortableDropdownItem, "V3M7/V83udwZW8GPiodMh2TFy/I=", false, function() {
  return [useSortable];
});
_c2 = SortableDropdownItem;
export function DropdownContainer({
  prompts,
  categories: propCategories,
  onSelect,
  onInjectResource,
  onRefresh,
  isOpen,
  selectedPromptId,
  onClose,
  isLoading = false
}) {
  _s3();
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, right: 0, isStickyTop: false });
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [localPrompts, setLocalPrompts] = useState([]);
  const [localCategories, setLocalCategories] = useState([]);
  const [isResourceLibrary, setIsResourceLibrary] = useState(false);
  const [resourcePrompts] = useState(getResourcePrompts());
  const [resourceCategories] = useState(getResourceCategories());
  const [selectedResourceCategoryId, setSelectedResourceCategoryId] = useState("all");
  const [loadedCount, setLoadedCount] = useState(50);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResourcePrompt, setSelectedResourcePrompt] = useState(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [showLatestTip, setShowLatestTip] = useState(false);
  const [isUpdateGuideOpen, setIsUpdateGuideOpen] = useState(false);
  useEffect(() => {
    if (!isOpen) return;
    chrome.runtime.sendMessage({ type: MessageType.GET_UPDATE_STATUS }, (response) => {
      if (response?.success && response.data) {
        setUpdateStatus(response.data);
      }
    });
  }, [isOpen]);
  const handleCheckUpdate = useCallback(() => {
    chrome.runtime.sendMessage({ type: MessageType.CHECK_UPDATE }, (response) => {
      if (response?.success && response.data) {
        const status = response.data;
        setUpdateStatus(status);
        if (!status.hasUpdate) {
          setShowLatestTip(true);
          setTimeout(() => setShowLatestTip(false), 3e3);
        }
      }
    });
  }, []);
  const handleDismissUpdate = useCallback(() => {
    chrome.runtime.sendMessage({ type: MessageType.CLEAR_UPDATE_STATUS }, () => {
      setUpdateStatus(null);
    });
  }, []);
  const handleRefreshClick = useCallback(async () => {
    if (isRefreshing || !onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, onRefresh]);
  const isPromptCollected = useCallback((resourcePrompt) => {
    return localPrompts.some((p) => p.content === resourcePrompt.content);
  }, [localPrompts]);
  const handleQuickCollect = useCallback((resourcePrompt) => {
    setSelectedResourcePrompt(resourcePrompt);
    setIsCategoryDialogOpen(true);
  }, []);
  const handleInjectFromCard = useCallback((resourcePrompt) => {
    if (onInjectResource) {
      onInjectResource(resourcePrompt);
      setToastMessage("已注入提示词");
      setTimeout(() => setToastMessage(null), 2e3);
    }
  }, [onInjectResource]);
  const handleConfirmCollect = useCallback((categoryId, newCategoryName) => {
    if (!selectedResourcePrompt) return;
    let targetCategoryId = categoryId;
    if (newCategoryName && newCategoryName.trim()) {
      usePromptStore.getState().addCategory(newCategoryName.trim());
      const storeCategories = usePromptStore.getState().categories;
      const newCategory = storeCategories.find((c) => c.name === newCategoryName.trim());
      if (newCategory) {
        targetCategoryId = newCategory.id;
      }
    }
    if (!targetCategoryId) {
      console.error("[Oh My Prompt Script] No target category for collect");
      return;
    }
    const localPrompt = {
      name: selectedResourcePrompt.name,
      content: selectedResourcePrompt.content,
      categoryId: targetCategoryId,
      description: selectedResourcePrompt.description,
      order: 0
    };
    usePromptStore.getState().addPrompt(localPrompt);
    const categoryName = usePromptStore.getState().categories.find((c) => c.id === targetCategoryId)?.name || "未知分类";
    setToastMessage(`已收藏到 ${categoryName}`);
    setIsCategoryDialogOpen(false);
    setIsModalOpen(false);
    setSelectedResourcePrompt(null);
  }, [selectedResourcePrompt]);
  const dropdownGap = 8;
  const dropdownMaxHeight = 600;
  useEffect(() => {
    setLocalPrompts(prompts);
  }, [prompts]);
  useEffect(() => {
    setLocalCategories(propCategories);
  }, [propCategories]);
  useEffect(() => {
    if (!isOpen) return;
    const calculatePosition = () => {
      const hostElement = document.querySelector('[data-testid="oh-my-prompt-script-trigger"]');
      if (!hostElement) return;
      const rect = hostElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const rightPos = viewportWidth - rect.left;
      const preferredTopPos = rect.top - dropdownGap;
      const dropdownBottom = preferredTopPos;
      const dropdownTop = dropdownBottom - dropdownMaxHeight;
      const isStickyTop = dropdownTop < 0;
      setPosition({
        top: isStickyTop ? 0 : preferredTopPos,
        right: rightPos,
        isStickyTop
      });
    };
    calculatePosition();
    const handleReposition = () => calculatePosition();
    window.addEventListener("scroll", handleReposition, { passive: true });
    window.addEventListener("resize", handleReposition);
    return () => {
      window.removeEventListener("scroll", handleReposition);
      window.removeEventListener("resize", handleReposition);
    };
  }, [isOpen, dropdownGap, dropdownMaxHeight]);
  const categories = useMemo(() => {
    const allCategory = { id: "all", name: "全部分类", order: 0 };
    if (localCategories.length > 0) {
      return [allCategory, ...sortCategoriesByOrder(localCategories)];
    }
    const uniqueCategoryIds = [...new Set(prompts.map((p) => p.categoryId))];
    const cats = [allCategory];
    uniqueCategoryIds.forEach((catId) => {
      const existing = DEFAULT_CATEGORIES.find((c) => c.id === catId);
      cats.push(existing || { id: catId, name: catId, order: 999 });
    });
    return cats;
  }, [localCategories, prompts]);
  const sortableCategories = useMemo(() => {
    return categories.filter((c) => c.id !== "all");
  }, [categories]);
  const showCategoryDragHandles = sortableCategories.length >= 2;
  const filteredPrompts = useMemo(() => {
    let result;
    if (selectedCategoryId === "all") {
      result = localPrompts;
    } else {
      result = localPrompts.filter((p) => p.categoryId === selectedCategoryId);
    }
    return sortPromptsByOrder(result);
  }, [localPrompts, selectedCategoryId]);
  const showDragHandles = filteredPrompts.length >= 2;
  const filteredResourcePrompts = useMemo(() => {
    return selectedResourceCategoryId === "all" ? resourcePrompts : resourcePrompts.filter((p) => p.categoryId === selectedResourceCategoryId || p.sourceCategory === selectedResourceCategoryId);
  }, [resourcePrompts, selectedResourceCategoryId]);
  const paginatedResourcePrompts = useMemo(() => {
    return filteredResourcePrompts.slice(0, loadedCount);
  }, [filteredResourcePrompts, loadedCount]);
  useEffect(() => {
    if (isResourceLibrary) {
      setLoadedCount(50);
    }
  }, [selectedResourceCategoryId, isResourceLibrary]);
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = filteredPrompts.findIndex((p) => p.id === active.id);
      const newIndex = filteredPrompts.findIndex((p) => p.id === over.id);
      const newOrder = [...filteredPrompts];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, filteredPrompts[oldIndex]);
      const updatedPrompts = localPrompts.map((prompt) => {
        const newIndexInOrder = newOrder.map((p) => p.id).indexOf(prompt.id);
        if (newIndexInOrder !== -1) {
          return {
            ...prompt,
            order: newIndexInOrder
          };
        }
        return prompt;
      });
      setLocalPrompts(updatedPrompts);
      try {
        await chrome.runtime.sendMessage({
          type: "SET_STORAGE",
          payload: {
            version: "1.0.0",
            userData: { prompts: updatedPrompts, categories: localCategories },
            settings: { showBuiltin: true, syncEnabled: false }
          }
        });
      } catch (error) {
        console.error("[Oh My Prompt Script] Failed to reorder prompts:", error);
      }
    }
  };
  const handleCategoryDragEnd = async (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const sortedCategories = sortCategoriesByOrder(localCategories);
      const oldIndex = sortedCategories.findIndex((c) => c.id === active.id);
      const newIndex = sortedCategories.findIndex((c) => c.id === over.id);
      const newOrder = [...sortedCategories];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, sortedCategories[oldIndex]);
      const updatedCategories = localCategories.map((category) => {
        return {
          ...category,
          order: newOrder.map((c) => c.id).indexOf(category.id)
        };
      });
      setLocalCategories(updatedCategories);
      try {
        await chrome.runtime.sendMessage({
          type: "SET_STORAGE",
          payload: {
            version: "1.0.0",
            userData: { prompts: localPrompts, categories: updatedCategories },
            settings: { showBuiltin: true, syncEnabled: false }
          }
        });
      } catch (error) {
        console.error("[Oh My Prompt Script] Failed to reorder categories:", error);
      }
    }
  };
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      const portalContainer = document.getElementById(PORTAL_ID);
      if (portalContainer && portalContainer.contains(e.target)) {
        return;
      }
      const hostElement = document.querySelector('[data-testid="oh-my-prompt-script-trigger"]');
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && hostElement && !hostElement.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const dropdownStyle = {
    top: position.top,
    right: position.right,
    transform: position.isStickyTop ? "none" : "translateY(-100%)"
  };
  const handleOpenSettings = () => {
    chrome.runtime.sendMessage({ type: "OPEN_SETTINGS" });
    onClose?.();
  };
  const getCategoryIcon = (categoryId) => {
    return CATEGORY_ICON_MAP[categoryId] || Layers;
  };
  return createPortal(
    /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(
        "div",
        {
          ref: dropdownRef,
          className: "dropdown-container",
          style: dropdownStyle,
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "dropdown-sidebar", children: /* @__PURE__ */ jsxDEV("div", { className: "sidebar-categories", children: isResourceLibrary ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  className: "sidebar-category-item",
                  onClick: () => setIsResourceLibrary(false),
                  "aria-label": "返回本地分类",
                  children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "sidebar-category-icon-wrapper", children: /* @__PURE__ */ jsxDEV(ArrowLeft, { className: "sidebar-category-icon" }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1072,
                      columnNumber: 19
                    }, this) }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1071,
                      columnNumber: 17
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { children: "返回" }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1074,
                      columnNumber: 17
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                  lineNumber: 1066,
                  columnNumber: 15
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  className: `sidebar-category-item ${selectedResourceCategoryId === "all" ? "selected" : ""}`,
                  onClick: () => setSelectedResourceCategoryId("all"),
                  "aria-label": "全部资源提示词",
                  children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "sidebar-category-icon-wrapper", children: /* @__PURE__ */ jsxDEV(Database, { className: "sidebar-category-icon" }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1083,
                      columnNumber: 19
                    }, this) }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1082,
                      columnNumber: 17
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { children: "全部" }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1085,
                      columnNumber: 17
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                  lineNumber: 1077,
                  columnNumber: 15
                },
                this
              ),
              sortProviderCategoriesByOrder(resourceCategories).map(
                (category) => /* @__PURE__ */ jsxDEV(
                  ProviderCategoryItem,
                  {
                    category,
                    isSelected: selectedResourceCategoryId === category.id,
                    onSelect: setSelectedResourceCategoryId
                  },
                  category.id,
                  false,
                  {
                    fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                    lineNumber: 1089,
                    columnNumber: 15
                  },
                  this
                )
              )
            ] }, void 0, true, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
              lineNumber: 1064,
              columnNumber: 13
            }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  className: `sidebar-category-item ${selectedCategoryId === "all" ? "selected" : ""}`,
                  onClick: () => {
                    setSelectedCategoryId("all");
                  },
                  "aria-label": "全部分类",
                  children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "sidebar-category-icon-wrapper", children: /* @__PURE__ */ jsxDEV(FolderOpen, { className: "sidebar-category-icon" }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1108,
                      columnNumber: 19
                    }, this) }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1107,
                      columnNumber: 17
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { children: "全部分类" }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1110,
                      columnNumber: 17
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                  lineNumber: 1100,
                  columnNumber: 15
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  className: `sidebar-category-item ${isResourceLibrary ? "selected" : ""}`,
                  onClick: () => setIsResourceLibrary(true),
                  "aria-label": "资源库",
                  children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "sidebar-category-icon-wrapper", children: /* @__PURE__ */ jsxDEV(Database, { className: "sidebar-category-icon" }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1120,
                      columnNumber: 19
                    }, this) }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1119,
                      columnNumber: 17
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { children: "资源库" }, void 0, false, {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1122,
                      columnNumber: 17
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                  lineNumber: 1114,
                  columnNumber: 15
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(DndContext, { collisionDetection: closestCenter, onDragEnd: handleCategoryDragEnd, children: /* @__PURE__ */ jsxDEV(
                SortableContext,
                {
                  items: sortableCategories.map((c) => c.id),
                  strategy: verticalListSortingStrategy,
                  children: sortableCategories.map((category) => {
                    const IconComponent = getCategoryIcon(category.id);
                    return /* @__PURE__ */ jsxDEV(
                      SortableCategoryItem,
                      {
                        category,
                        isSelected: selectedCategoryId === category.id,
                        onSelect: (id) => {
                          setSelectedCategoryId(id);
                        },
                        showDragHandle: showCategoryDragHandles,
                        IconComponent
                      },
                      category.id,
                      false,
                      {
                        fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                        lineNumber: 1134,
                        columnNumber: 23
                      },
                      this
                    );
                  })
                },
                void 0,
                false,
                {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                  lineNumber: 1127,
                  columnNumber: 17
                },
                this
              ) }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                lineNumber: 1126,
                columnNumber: 15
              }, this)
            ] }, void 0, true, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
              lineNumber: 1098,
              columnNumber: 13
            }, this) }, void 0, false, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
              lineNumber: 1062,
              columnNumber: 9
            }, this) }, void 0, false, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
              lineNumber: 1061,
              columnNumber: 7
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "dropdown-main", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "dropdown-header", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "dropdown-header-title", children: [
                  /* @__PURE__ */ jsxDEV("img", { className: "dropdown-header-logo", src: chrome.runtime.getURL("assets/icon-128.png"), alt: "Oh My Prompt Script" }, void 0, false, {
                    fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                    lineNumber: 1156,
                    columnNumber: 13
                  }, this),
                  "Oh My Prompt Script",
                  /* @__PURE__ */ jsxDEV("span", { className: "version-badge", children: [
                    "v",
                    chrome.runtime.getManifest().version
                  ] }, void 0, true, {
                    fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                    lineNumber: 1158,
                    columnNumber: 13
                  }, this)
                ] }, void 0, true, {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                  lineNumber: 1155,
                  columnNumber: 11
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "dropdown-header-actions", children: [
                  /* @__PURE__ */ jsxDEV(Tooltip, { content: updateStatus?.hasUpdate ? `新版本 ${updateStatus.latestVersion} 可用` : "检查更新", placement: "bottom", children: /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      className: "dropdown-action-btn",
                      style: updateStatus?.hasUpdate ? { color: "#FF5722" } : {},
                      onClick: updateStatus?.hasUpdate ? () => setIsUpdateGuideOpen(true) : handleCheckUpdate,
                      "aria-label": updateStatus?.hasUpdate ? "查看更新引导" : "检查更新",
                      children: /* @__PURE__ */ jsxDEV(ArrowUpCircle, { style: { width: 14, height: 14 } }, void 0, false, {
                        fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                        lineNumber: 1168,
                        columnNumber: 17
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1162,
                      columnNumber: 15
                    },
                    this
                  ) }, void 0, false, {
                    fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                    lineNumber: 1161,
                    columnNumber: 13
                  }, this),
                  showLatestTip && /* @__PURE__ */ jsxDEV("div", { className: "update-latest-tip", children: /* @__PURE__ */ jsxDEV("span", { style: { fontSize: 11, color: "#16a34a" }, children: "已是最新版本" }, void 0, false, {
                    fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                    lineNumber: 1174,
                    columnNumber: 17
                  }, this) }, void 0, false, {
                    fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                    lineNumber: 1173,
                    columnNumber: 15
                  }, this),
                  /* @__PURE__ */ jsxDEV(Tooltip, { content: "备份数据", placement: "bottom", children: /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      className: `dropdown-action-btn ${isRefreshing ? "refreshing" : ""}`,
                      onClick: handleRefreshClick,
                      "aria-label": "备份数据",
                      disabled: isRefreshing,
                      children: /* @__PURE__ */ jsxDEV(RefreshCw, { style: { width: 14, height: 14 } }, void 0, false, {
                        fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                        lineNumber: 1184,
                        columnNumber: 17
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1178,
                      columnNumber: 15
                    },
                    this
                  ) }, void 0, false, {
                    fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                    lineNumber: 1177,
                    columnNumber: 13
                  }, this),
                  /* @__PURE__ */ jsxDEV(Tooltip, { content: "打开设置", placement: "bottom", children: /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      className: "dropdown-action-btn",
                      onClick: handleOpenSettings,
                      "aria-label": "设置",
                      children: /* @__PURE__ */ jsxDEV(Settings, { style: { width: 14, height: 14 } }, void 0, false, {
                        fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                        lineNumber: 1193,
                        columnNumber: 17
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1188,
                      columnNumber: 15
                    },
                    this
                  ) }, void 0, false, {
                    fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                    lineNumber: 1187,
                    columnNumber: 13
                  }, this),
                  /* @__PURE__ */ jsxDEV(Tooltip, { content: "关闭", placement: "bottom", children: /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      className: "dropdown-action-btn",
                      onClick: onClose,
                      "aria-label": "关闭",
                      children: /* @__PURE__ */ jsxDEV(X, { style: { width: 14, height: 14 } }, void 0, false, {
                        fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                        lineNumber: 1202,
                        columnNumber: 17
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1197,
                      columnNumber: 15
                    },
                    this
                  ) }, void 0, false, {
                    fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                    lineNumber: 1196,
                    columnNumber: 13
                  }, this)
                ] }, void 0, true, {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                  lineNumber: 1160,
                  columnNumber: 11
                }, this)
              ] }, void 0, true, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                lineNumber: 1154,
                columnNumber: 9
              }, this),
              updateStatus?.hasUpdate && /* @__PURE__ */ jsxDEV("div", { className: "update-banner", children: [
                /* @__PURE__ */ jsxDEV(ArrowUpCircle, { style: { width: 14, height: 14, color: "#856404" } }, void 0, false, {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                  lineNumber: 1211,
                  columnNumber: 13
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "update-banner-text", children: [
                  "新版本 ",
                  updateStatus.latestVersion,
                  " 可用"
                ] }, void 0, true, {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                  lineNumber: 1212,
                  columnNumber: 13
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "span",
                  {
                    className: "update-banner-link",
                    onClick: () => setIsUpdateGuideOpen(true),
                    children: "查看更新引导"
                  },
                  void 0,
                  false,
                  {
                    fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                    lineNumber: 1213,
                    columnNumber: 13
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("span", { className: "update-banner-close", onClick: handleDismissUpdate, children: "×" }, void 0, false, {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                  lineNumber: 1219,
                  columnNumber: 13
                }, this)
              ] }, void 0, true, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                lineNumber: 1210,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "dropdown-content", children: isLoading ? /* @__PURE__ */ jsxDEV("div", { className: "empty-state", children: /* @__PURE__ */ jsxDEV("div", { className: "empty-message", children: "加载中..." }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                lineNumber: 1226,
                columnNumber: 15
              }, this) }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                lineNumber: 1225,
                columnNumber: 13
              }, this) : isResourceLibrary ? paginatedResourcePrompts.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "empty-state", children: /* @__PURE__ */ jsxDEV("div", { className: "empty-message", children: resourcePrompts.length === 0 ? "资源库数据加载失败" : "该分类暂无提示词" }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                lineNumber: 1231,
                columnNumber: 17
              }, this) }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                lineNumber: 1230,
                columnNumber: 13
              }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
                /* @__PURE__ */ jsxDEV("div", { className: "network-prompt-cards-grid", children: paginatedResourcePrompts.map(
                  (prompt) => /* @__PURE__ */ jsxDEV(
                    NetworkPromptCard,
                    {
                      prompt,
                      onClick: () => {
                        setSelectedResourcePrompt(prompt);
                        setIsModalOpen(true);
                      },
                      onInject: () => handleInjectFromCard(prompt),
                      onCollect: () => handleQuickCollect(prompt),
                      isCollected: isPromptCollected(prompt)
                    },
                    prompt.id,
                    false,
                    {
                      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                      lineNumber: 1241,
                      columnNumber: 17
                    },
                    this
                  )
                ) }, void 0, false, {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                  lineNumber: 1239,
                  columnNumber: 17
                }, this),
                filteredResourcePrompts.length > 50 && /* @__PURE__ */ jsxDEV(
                  LoadMoreButton,
                  {
                    loadedCount,
                    totalCount: filteredResourcePrompts.length,
                    onLoadMore: () => setLoadedCount((prev) => prev + 50),
                    isLoading: false
                  },
                  void 0,
                  false,
                  {
                    fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                    lineNumber: 1255,
                    columnNumber: 15
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                lineNumber: 1238,
                columnNumber: 13
              }, this) : filteredPrompts.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "empty-state", children: /* @__PURE__ */ jsxDEV("div", { className: "empty-message", children: selectedCategoryId === "all" ? "暂无提示词，请点击设置添加" : "该分类暂无提示词" }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                lineNumber: 1266,
                columnNumber: 15
              }, this) }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                lineNumber: 1265,
                columnNumber: 13
              }, this) : /* @__PURE__ */ jsxDEV("div", { className: "dropdown-items", children: /* @__PURE__ */ jsxDEV(DndContext, { collisionDetection: closestCenter, onDragEnd: handleDragEnd, children: /* @__PURE__ */ jsxDEV(
                SortableContext,
                {
                  items: filteredPrompts.map((p) => p.id),
                  strategy: verticalListSortingStrategy,
                  children: filteredPrompts.map(
                    (prompt, index) => /* @__PURE__ */ jsxDEV(
                      SortableDropdownItem,
                      {
                        prompt,
                        isLast: index === filteredPrompts.length - 1,
                        isSelected: selectedPromptId === prompt.id,
                        onSelect,
                        showDragHandle: showDragHandles
                      },
                      prompt.id,
                      false,
                      {
                        fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                        lineNumber: 1278,
                        columnNumber: 19
                      },
                      this
                    )
                  )
                },
                void 0,
                false,
                {
                  fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                  lineNumber: 1273,
                  columnNumber: 17
                },
                this
              ) }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                lineNumber: 1272,
                columnNumber: 15
              }, this) }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                lineNumber: 1271,
                columnNumber: 13
              }, this) }, void 0, false, {
                fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
                lineNumber: 1223,
                columnNumber: 9
              }, this)
            ] }, void 0, true, {
              fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
              lineNumber: 1153,
              columnNumber: 7
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
          lineNumber: 1056,
          columnNumber: 7
        },
        this
      ),
      selectedResourcePrompt && /* @__PURE__ */ jsxDEV(
        PromptPreviewModal,
        {
          prompt: selectedResourcePrompt,
          isOpen: isModalOpen,
          onClose: () => {
            setIsModalOpen(false);
            setSelectedResourcePrompt(null);
          },
          onCollect: () => setIsCategoryDialogOpen(true),
          onInject: () => {
            if (onInjectResource) {
              onInjectResource(selectedResourcePrompt);
              setToastMessage("已注入提示词");
              setTimeout(() => setToastMessage(null), 2e3);
            }
          }
        },
        void 0,
        false,
        {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
          lineNumber: 1296,
          columnNumber: 7
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        CategorySelectDialog,
        {
          categories: sortableCategories,
          isOpen: isCategoryDialogOpen,
          onClose: () => setIsCategoryDialogOpen(false),
          onConfirm: handleConfirmCollect
        },
        void 0,
        false,
        {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
          lineNumber: 1314,
          columnNumber: 5
        },
        this
      ),
      toastMessage && /* @__PURE__ */ jsxDEV(
        ToastNotification,
        {
          message: toastMessage,
          onClose: () => setToastMessage(null)
        },
        void 0,
        false,
        {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
          lineNumber: 1322,
          columnNumber: 7
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        UpdateGuideModal,
        {
          status: updateStatus,
          isOpen: isUpdateGuideOpen,
          onClose: () => setIsUpdateGuideOpen(false)
        },
        void 0,
        false,
        {
          fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
          lineNumber: 1328,
          columnNumber: 5
        },
        this
      )
    ] }, void 0, true, {
      fileName: "D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx",
      lineNumber: 1055,
      columnNumber: 5
    }, this),
    getPortalContainer()
  );
}
_s3(DropdownContainer, "xh+iU44TXFKG/OAz8oJ6VHRvwak=");
_c3 = DropdownContainer;
var _c, _c2, _c3;
$RefreshReg$(_c, "SortableCategoryItem");
$RefreshReg$(_c2, "SortableDropdownItem");
$RefreshReg$(_c3, "DropdownContainer");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/workspace/projects/prompt-script/src/content/components/DropdownContainer.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
