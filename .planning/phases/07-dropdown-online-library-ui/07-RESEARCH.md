# Phase 7: Dropdown Online Library UI - Research

**Researched:** 2026-04-19
**Domain:** Chrome Extension (Manifest V3) / Content Script UI / React Portal / Shadow DOM
**Confidence:** HIGH

## Summary

Phase 7 extends the existing DropdownContainer to add an "在线库" (Online Library) tab in the sidebar, allowing users to browse network prompts from the Nano Banana data source (900+ prompts across 17 ProviderCategories). The implementation builds on established patterns: Portal rendering to document.body with inline CSS, sidebar category switching, and chrome.runtime.sendMessage for data fetching. Key additions include NetworkPromptCard components with previewImage thumbnails, ProviderCategory sidebar items, a Modal overlay for full prompt preview, pagination with "加载更多" button, and CacheStatusHeader showing fetchTimestamp and expiry status.

**Primary recommendation:** Extend DropdownContainer with isOnlineLibrary state toggle. Reuse existing Portal pattern and getDropdownStyles() CSS injection. Implement NetworkPromptCard as 2-column grid cards, PromptPreviewModal as fixed-center overlay with escape/dismiss handlers, LoadMoreButton with 50-item pagination, and CacheStatusHeader with timestamp formatting. Fetch network data via GET_NETWORK_CACHE message on sidebar toggle.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Tab Structure:**
- D-01: Sidebar增加虚拟"在线库"分类入口，位于"全部分类"下方
- D-02: 点击"在线库"后，主内容区切换显示网络提示词，侧边栏分类列表替换为ProviderCategory
- D-03: 切换回本地分类时，恢复原有本地分类列表和本地提示词显示

**Card Layout:**
- D-04: NetworkPromptCard组件使用卡片布局，显示previewImage缩略图（左/上方）+ 名称 + ProviderCategory标签
- D-05: 卡片尺寸适中（约120x80px缩略图），支持hover效果
- D-06: previewImage加载失败时显示fallback占位图

**Preview Expand:**
- D-07: 点击卡片弹出Modal overlay，显示完整提示词内容 + 来源信息（sourceProvider、sourceCategory）
- D-08: Modal包含关闭按钮，点击外部区域可关闭
- D-09: Modal预留"收藏"按钮位置（Phase 8实现功能）

**Pagination UX:**
- D-10: 使用"加载更多"按钮分页，位于主内容区底部
- D-11: 每页50条提示词，点击按钮加载下一页，已加载内容保留
- D-12: 显示已加载条数和总数（如"已加载 50/900 条")

**Category Filter:**
- D-13: 切换到"在线库"时，侧边栏分类列表替换为ProviderCategory列表（17个分类）
- D-14: ProviderCategory显示分类名称 + 条数（如"3D Miniatures · 52条")
- D-15: 点击ProviderCategory后，主内容区过滤显示该分类下的网络提示词

**Cache Status Display:**
- D-16: 主内容区Header显示缓存状态（如"上次更新: 2026-04-19 12:00")
- D-17: isExpired=true时显示"数据已过期"提示，建议用户稍后刷新
- D-18: isFromCache=true时可选显示"离线模式"标识

### Claude's Discretion

- NetworkPromptCard具体样式细节（border-radius、阴影、间距）
- Modal overlay尺寸和动画效果
- "加载更多"按钮样式和loading状态
- Header状态栏布局和样式

### Deferred Ideas (OUT OF SCOPE)

- 搜索功能（Phase 8: NET-01）
- 收藏功能（Phase 8: NET-03）
- 刷新缓存按钮（Phase 7+ UI增强）
- 图片预览详细实现（previewImage URL加载失败fallback占位图延后）
- 无限滚动替代"加载更多"（未来增强）

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| NET-02 | 用户可预览网络提示词完整内容 | NetworkPromptCard component for preview, PromptPreviewModal for full content display, ProviderCategory sidebar for navigation, GET_NETWORK_CACHE message for data fetch, CacheDataResponse with isExpired/isFromCache flags for status display |

</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Online Library toggle state | Content Script (DropdownContainer) | — | UI state management belongs to dropdown component, follows existing selectedCategoryId pattern |
| Network data fetch | Content Script → Service Worker | — | GET_NETWORK_CACHE message pattern from Phase 6, service worker returns CacheDataResponse |
| ProviderCategory sidebar | Content Script (Portal) | — | Reuses existing sidebar-categories structure, replaces content based on isOnlineLibrary flag |
| NetworkPromptCard grid | Content Script (Portal) | — | New component in dropdown-main content area, 2-column grid layout |
| Modal overlay | Content Script (Portal) | — | Fixed-position overlay rendered via Portal, escapes dropdown container clipping |
| Pagination state | Content Script (DropdownApp/Container) | — | Local state for loadedCount, increment on "加载更多" click |
| Timestamp display | Content Script (CacheStatusHeader) | — | Formatting of fetchTimestamp from CacheDataResponse, human-readable locale format |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.0.0 [VERIFIED: package.json] | UI framework | Existing project standard, Portal rendering, state management |
| lucide-react | 1.8.0 [VERIFIED: package.json] | Icon library | Already used for Globe, AlertCircle, WifiOff icons, consistent styling |
| createPortal | React DOM (native) | Modal rendering | Escapes overflow:hidden, positions relative to viewport |
| chrome.runtime.sendMessage | Native | Data fetch | GET_NETWORK_CACHE pattern from Phase 6 [VERIFIED: service-worker.ts] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @dnd-kit/core | 6.3.1 [VERIFIED: package.json] | Drag-and-drop | Existing sidebar category reorder, NOT used for online library (ProviderCategory not reorderable) |
| truncateText | utils.ts [VERIFIED: file read] | Text truncation | Card name preview, modal content preview |
| Date.toLocaleString() | Native | Timestamp format | CacheStatusHeader display format |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Portal Modal | Shadow DOM Modal | Shadow DOM would require CSS re-injection, Portal already established in DropdownContainer |
| "加载更多" button | Infinite scroll | Infinite scroll requires IntersectionObserver, more complex; button is simpler and explicit per D-10 |
| Inline CSS styles | Tailwind classes | Tailwind not configured for Portal context (popup only); inline CSS follows getDropdownStyles() pattern |
| useState for pagination | Zustand store | Pagination is UI-only state, not persisted; local state sufficient |

**No installation required** — all dependencies are existing project libraries or native React/JS APIs.

## Architecture Patterns

### System Architecture Diagram

```
Lovart Page (Shadow DOM host)
    │
    │ React mount in Shadow DOM root
    │
    ▼
DropdownApp (content script)
    │
    ├─► TriggerButton (existing)
    │
    ├─► DropdownContainer (Portal to document.body)
    │       │
    │       ├─► dropdown-sidebar
    │       │       ├─► "全部分类" (existing)
    │       │       ├─► "在线库" (NEW - virtual entry)
    │       │       │       │
    │       │       │       ▼ isOnlineLibrary=true
    │       │       │
    │       │       ├─► Local Category items (existing) OR
    │       │       ├─► ProviderCategory items (NEW - 17 items)
    │       │       │
    │       │
    │       ├─► dropdown-main
    │       │       ├─► dropdown-header
    │       │       │       ├─► Title + Settings + Close (existing)
    │       │       │       └─► CacheStatusHeader (NEW - timestamp + expiry)
    │       │       │
    │       │       ├─► dropdown-content
    │       │       │       ├─► PromptItem list (existing) OR
    │       │       │       ├─► NetworkPromptCard grid (NEW - 2 columns)
    │       │       │       │       ├─► previewImage thumbnail
    │       │       │       │       ├─► name text
    │       │       │       │       └─► ProviderCategory tag
    │       │       │       │
    │       │       │       └─► LoadMoreButton (NEW - pagination)
    │       │       │
    │       │
    │       └─► PromptPreviewModal (NEW - overlay)
    │               ├─► Modal header: title + close button
    │               ├─► Modal content: full prompt text
    │               ├─► Modal footer: source info + "收藏" placeholder
    │               │
    │
    ▼ chrome.runtime.sendMessage({ type: GET_NETWORK_CACHE })
    │
    ▼
Service Worker (background)
    │
    ├─► NetworkCacheManager.getCache()
    │       │
    │       ▼
    │   Return CacheDataResponse {
    │     prompts: NetworkPrompt[],
    │     categories: ProviderCategory[],
    │     isFromCache: true,
    │     isExpired?: boolean,
    │     fetchTimestamp?: string
    │   }
    │
    ▼
DropdownContainer receives data, renders UI
```

### Recommended Project Structure

```
src/content/components/
├── DropdownContainer.tsx    # MODIFY: Add isOnlineLibrary state, ProviderCategory sidebar
├── DropdownApp.tsx          # MODIFY: Add network data fetch on mount/toggle
├── PromptItem.tsx           # EXISTING: Local prompt list item (reference)
├── TriggerButton.tsx        # EXISTING: No changes
├── EmptyState.tsx           # EXISTING: Reuse for "该分类暂无提示词" message
├── NetworkPromptCard.tsx    # NEW: Card with thumbnail, name, category tag
├── ProviderCategoryItem.tsx # NEW: Sidebar item for ProviderCategory (not sortable)
├── PromptPreviewModal.tsx   # NEW: Modal overlay for full prompt content
├── LoadMoreButton.tsx       # NEW: Pagination button with loading state
├── CacheStatusHeader.tsx    # NEW: Timestamp + expiry warning + offline indicator
└── network-library.css.ts   # NEW (optional): Extracted CSS for new components
```

### Pattern 1: Portal Modal Overlay

**What:** Fixed-position modal centered on viewport, rendered via Portal
**When to use:** Full prompt preview when user clicks NetworkPromptCard
**Example:**

```typescript
// Source: [existing DropdownContainer pattern + CONTEXT.md D-07, D-08]
// PromptPreviewModal.tsx

import { createPortal } from 'react-dom'
import { useEffect, useCallback } from 'react'
import { X, Bookmark } from 'lucide-react'
import type { NetworkPrompt } from '@/shared/types'

interface PromptPreviewModalProps {
  prompt: NetworkPrompt
  isOpen: boolean
  onClose: () => void
}

export function PromptPreviewModal({ prompt, isOpen, onClose }: PromptPreviewModalProps) {
  // D-08: Escape key closes modal
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // D-08: Click overlay closes modal
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  if (!isOpen) return null

  // Render to same Portal container as dropdown (PORTAL_ID)
  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="modal-overlay"
        onClick={handleOverlayClick}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 2147483647,
        }}
      />
      {/* Modal */}
      <div
        className="modal-content"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          maxHeight: '480px',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
          zIndex: 2147483647,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{prompt.name}</span>
          <button onClick={onClose} aria-label="关闭">
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>
        {/* Content */}
        <div style={{ padding: '16px', maxHeight: '320px', overflow: 'auto' }}>
          {prompt.content}
        </div>
        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #E5E5E5' }}>
          <div style={{ fontSize: '10px', color: '#64748B' }}>
            来源: {prompt.sourceProvider} / {prompt.sourceCategory}
          </div>
          {/* D-09: Placeholder for Phase 8 */}
          <button disabled style={{ opacity: 0.5 }}>
            <Bookmark style={{ width: 14, height: 14 }} />
            收藏
          </button>
        </div>
      </div>
    </>,
    document.getElementById('prompt-script-dropdown-portal')!
  )
}
```

### Pattern 2: NetworkPromptCard Component

**What:** 2-column grid card with thumbnail, name, and category tag
**When to use:** Displaying network prompts in main content area
**Example:**

```typescript
// Source: [UI-SPEC.md visual specs + CONTEXT.md D-04, D-05]
// NetworkPromptCard.tsx

import type { NetworkPrompt } from '@/shared/types'
import { truncateText } from '@/shared/utils'

interface NetworkPromptCardProps {
  prompt: NetworkPrompt
  onClick: () => void
}

export function NetworkPromptCard({ prompt, onClick }: NetworkPromptCardProps) {
  return (
    <div
      className="network-prompt-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      style={{
        width: 'calc(50% - 6px)', // 2-column with 12px gap
        padding: '12px',
        background: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'background 0.15s, box-shadow 0.15s',
      }}
    >
      {/* D-04: Thumbnail */}
      {prompt.previewImage && (
        <img
          src={prompt.previewImage}
          alt={prompt.name}
          style={{
            width: '100%',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '6px',
          }}
          onError={(e) => {
            // D-06: Fallback placeholder
            e.currentTarget.src = 'data:image/svg+xml,...' // placeholder SVG
          }}
        />
      )}
      {/* Name */}
      <div style={{ fontSize: '12px', fontWeight: 500, marginTop: '8px' }}>
        {truncateText(prompt.name, 30)}
      </div>
      {/* D-04: ProviderCategory tag */}
      <div
        style={{
          fontSize: '10px',
          fontWeight: 500,
          color: '#64748B',
          marginTop: '4px',
          padding: '4px 8px',
          background: '#f0f0f0',
          borderRadius: '4px',
        }}
      >
        {prompt.sourceCategory}
      </div>
    </div>
  )
}
```

### Pattern 3: LoadMoreButton with Pagination State

**What:** Pagination button showing loaded count and loading state
**When to use:** Bottom of dropdown-main when displaying network prompts
**Example:**

```typescript
// Source: [CONTEXT.md D-10, D-11, D-12 + UI-SPEC.md]
// LoadMoreButton.tsx

interface LoadMoreButtonProps {
  loadedCount: number
  totalCount: number
  onLoadMore: () => void
  isLoading: boolean
}

export function LoadMoreButton({ loadedCount, totalCount, onLoadMore, isLoading }: LoadMoreButtonProps) {
  const isAllLoaded = loadedCount >= totalCount

  return (
    <div style={{ padding: '12px 16px', borderTop: '1px solid #E5E5E5' }}>
      {/* D-12: Count indicator */}
      <div style={{ fontSize: '10px', color: '#64748B', textAlign: 'center', marginBottom: '8px' }}>
        已加载 {loadedCount}/{totalCount} 条
      </div>
      {/* Button */}
      <button
        onClick={onLoadMore}
        disabled={isLoading || isAllLoaded}
        style={{
          width: '100%',
          height: '40px',
          background: isAllLoaded ? '#f0f0f0' : '#f8f8f8',
          border: '1px solid #E5E5E5',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 500,
          cursor: isAllLoaded ? 'not-allowed' : 'pointer',
          opacity: isAllLoaded ? 0.5 : 1,
        }}
      >
        {isLoading ? '加载中...' : isAllLoaded ? '已全部加载' : '加载更多'}
      </button>
    </div>
  )
}
```

### Pattern 4: CacheStatusHeader Component

**What:** Header bar showing cache timestamp, expiry warning, offline indicator
**When to use:** Below main header in dropdown-main when in online library mode
**Example:**

```typescript
// Source: [CONTEXT.md D-16, D-17, D-18 + UI-SPEC.md]
// CacheStatusHeader.tsx

import { AlertCircle, WifiOff } from 'lucide-react'

interface CacheStatusHeaderProps {
  fetchTimestamp?: string
  isExpired?: boolean
  isFromCache?: boolean
}

export function CacheStatusHeader({ fetchTimestamp, isExpired, isFromCache }: CacheStatusHeaderProps) {
  if (!fetchTimestamp) return null

  const formattedTime = new Date(fetchTimestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      style={{
        padding: '4px 16px',
        fontSize: '10px',
        fontWeight: 400,
        color: isExpired ? '#A16207' : '#64748B',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid #E5E5E5',
      }}
    >
      {/* D-16: Timestamp */}
      <span>上次更新: {formattedTime}</span>
      
      {/* D-17: Expired warning */}
      {isExpired && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#A16207' }}>
          <AlertCircle style={{ width: 12, height: 12 }} />
          数据已过期，建议稍后刷新
        </span>
      )}
      
      {/* D-18: Offline indicator (optional) */}
      {isFromCache && !isExpired && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <WifiOff style={{ width: 12, height: 12 }} />
          离线模式
        </span>
      )}
    </div>
  )
}
```

### Pattern 5: ProviderCategory Sidebar Integration

**What:** Replace local Category sidebar with ProviderCategory list when in online mode
**When to use:** DropdownContainer sidebar when isOnlineLibrary=true
**Example:**

```typescript
// Source: [CONTEXT.md D-13, D-14, D-15 + existing SortableCategoryItem pattern]
// ProviderCategoryItem.tsx

import type { ProviderCategory } from '@/shared/types'
import { Globe } from 'lucide-react'

interface ProviderCategoryItemProps {
  category: ProviderCategory
  isSelected: boolean
  onSelect: (categoryId: string) => void
}

export function ProviderCategoryItem({ category, isSelected, onSelect }: ProviderCategoryItemProps) {
  return (
    <div
      className={`sidebar-category-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(category.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(category.id)
        }
      }}
    >
      {/* Globe icon for online categories */}
      <Globe className="sidebar-category-icon" style={{ width: 14, height: 14 }} />
      {/* D-14: Name + count */}
      <span>{category.name} · {category.count}条</span>
    </div>
  )
}
```

### Pattern 6: Extended getDropdownStyles()

**What:** Add CSS classes for new Phase 7 components
**When to use:** Inline CSS injection in DropdownContainer
**Example:**

```typescript
// Source: [existing getDropdownStyles() + UI-SPEC.md visual specs]
// Extend in DropdownContainer.tsx

function getDropdownStyles(): string {
  return `
    ${existingStyles}
    
    /* Phase 7: Network Library styles */
    
    #${PORTAL_ID} .sidebar-online-library-entry {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: transparent;
      border: none;
      font-size: 12px;
      font-weight: 500;
      color: #171717;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    
    #${PORTAL_ID} .sidebar-online-library-entry:hover {
      background: #f0f0f0;
    }
    
    #${PORTAL_ID} .sidebar-online-library-entry.selected {
      background: #ffffff;
      color: #A16207;
      border-left: 2px solid #A16207;
    }
    
    #${PORTAL_ID} .network-prompt-card {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
    
    #${PORTAL_ID} .network-prompt-card:hover {
      background: #f8f8f8;
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    }
    
    #${PORTAL_ID} .network-prompt-cards-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    #${PORTAL_ID} .modal-overlay {
      animation: fadeIn 150ms ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    #${PORTAL_ID} .modal-content {
      animation: slideIn 150ms ease-out;
    }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
      to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
  `
}
```

### Anti-Patterns to Avoid

- **Shadow DOM for Modal:** Modal should use Portal (same as DropdownContainer), not Shadow DOM. Shadow DOM requires separate CSS injection and doesn't escape overflow properly.
- **DndContext for ProviderCategory sidebar:** ProviderCategories are not user-sortable. Use simple div elements, not SortableCategoryItem pattern.
- **Zustand for pagination state:** Pagination is ephemeral UI state, not persisted. Local useState in DropdownContainer is sufficient.
- **Fetch on every sidebar toggle:** Cache is long-lived (24h TTL). Fetch once on first toggle, reuse cached data for subsequent toggles within session.
- **Inline styles in every component:** Use getDropdownStyles() CSS classes for consistency with existing pattern. Inline styles only for dynamic values.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal overlay positioning | Fixed CSS with transform translate(-50%, -50%) | Portal pattern from DropdownContainer | Portal escapes overflow, consistent positioning |
| Timestamp formatting | Manual date string parsing | Date.toLocaleString('zh-CN', options) | Locale-aware, handles timezone correctly |
| Pagination logic | Manual array slicing with counters | useState(loadedCount) + slice(0, loadedCount) | Simple state pattern, React re-renders on increment |
| Category count display | Manual prompt array filtering | ProviderCategory.count from metadata | NanoBananaProvider.getCategories() returns count field |
| Image fallback | onError handler with placeholder SVG | onError → src replacement | Simple event handler, inline fallback |

**Key insight:** All core patterns already exist in DropdownContainer (Portal, sidebar toggle, message handling). Phase 7 is primarily extension, not new architecture.

## Runtime State Inventory

> Phase is UI extension (no rename/refactor required).

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | NetworkCacheData in chrome.storage.local (Phase 6) | Read via GET_NETWORK_CACHE, no migration needed |
| Live service config | None — UI only | None |
| OS-registered state | None — UI only | None |
| Secrets/env vars | None — GitHub Raw URL requires no auth | None |
| Build artifacts | None — new React components bundled by Vite | None |

## Common Pitfalls

### Pitfall 1: Modal Focus Trap Missing

**What goes wrong:** User tabs through Lovart page elements while Modal is open
**Why it happens:** Modal overlay doesn't trap focus, browser focus can escape to host page
**How to avoid:** Implement focus trap: query all focusable elements in Modal, loop focus on Tab/Shift+Tab at boundaries. Or use Radix UI Dialog (already installed) for focus trap.
**Warning signs:** Tab key moves focus outside Modal, confusing navigation

### Pitfall 2: Network Data Fetch on Every Sidebar Toggle

**What goes wrong:** Unnecessary network requests when user toggles between local and online multiple times
**Why it happens:** isOnlineLibrary toggle triggers fetch each time
**How to avoid:** Cache network data in DropdownContainer state. Fetch only on first toggle (networkPrompts === null). Use cached data for subsequent toggles.
**Warning signs:** Console logs show multiple GET_NETWORK_CACHE requests in rapid succession

### Pitfall 3: Pagination State Reset on Category Change

**What goes wrong:** User loads 50 prompts, changes category, sees only 50 of new category (loadedCount not reset)
**Why it happens:** loadedCount state persists across category changes
**How to avoid:** Reset loadedCount to PAGE_SIZE (50) when selectedProviderCategoryId changes.
**Warning signs:** Category with 100 prompts shows only 50 after switching from category with 50

### Pitfall 4: PreviewImage URL Blocked by CORS

**What goes wrong:** Image thumbnails fail to load due to CORS restrictions on GitHub raw URLs
**Why it happens:** Extension CSP may block external image URLs; GitHub raw has permissive CORS but some URLs may redirect
**How to avoid:** D-06: Implement onError fallback with placeholder SVG. Consider caching images locally in Phase 7+ enhancement.
**Warning signs:** All cards show placeholder image, console shows CORS errors

### Pitfall 5: Modal Close Doesn't Restore Focus

**What goes wrong:** After closing Modal, focus is on body instead of the clicked card
**Why it happens:** Modal unmounts without returning focus to trigger element
**How to avoid:** Store lastClickedCardId, use useRef to focus card element after Modal close. Or track activeElement before Modal open.
**Warning signs:** Tab navigation starts from top of page after Modal close

## Code Examples

### DropdownContainer Extension with isOnlineLibrary State

```typescript
// Source: [existing DropdownContainer.tsx + CONTEXT.md D-01, D-02, D-03]
// Key modifications in DropdownContainer.tsx

interface DropdownContainerProps {
  prompts: Prompt[]
  categories: Category[]
  onSelect: (prompt: Prompt) => void
  isOpen: boolean
  selectedPromptId: string | null
  onClose?: () => void
  isLoading?: boolean
}

// NEW: Add state for online library
const [isOnlineLibrary, setIsOnlineLibrary] = useState(false)
const [networkPrompts, setNetworkPrompts] = useState<NetworkPrompt[]>([])
const [providerCategories, setProviderCategories] = useState<ProviderCategory[]>([])
const [cacheMetadata, setCacheMetadata] = useState<{
  isFromCache?: boolean
  isExpired?: boolean
  fetchTimestamp?: string
}>({})
const [selectedProviderCategoryId, setSelectedProviderCategoryId] = useState<string>('all')
const [loadedCount, setLoadedCount] = useState(50) // D-11: 50 per page
const [isModalOpen, setIsModalOpen] = useState(false)
const [selectedNetworkPrompt, setSelectedNetworkPrompt] = useState<NetworkPrompt | null>(null)
const [isNetworkLoading, setIsNetworkLoading] = useState(false)

// NEW: Fetch network data on first online library toggle
useEffect(() => {
  if (isOnlineLibrary && networkPrompts.length === 0) {
    setIsNetworkLoading(true)
    chrome.runtime.sendMessage(
      { type: MessageType.GET_NETWORK_CACHE },
      (response) => {
        if (response?.success && response.data) {
          setNetworkPrompts(response.data.prompts)
          setProviderCategories(response.data.categories)
          setCacheMetadata({
            isFromCache: response.data.isFromCache,
            isExpired: response.data.isExpired,
            fetchTimestamp: response.data.fetchTimestamp,
          })
        }
        setIsNetworkLoading(false)
      }
    )
  }
}, [isOnlineLibrary, networkPrompts.length])

// NEW: Reset loadedCount on ProviderCategory change
useEffect(() => {
  setLoadedCount(50) // D-11: reset to page size
}, [selectedProviderCategoryId])

// NEW: Sidebar content based on isOnlineLibrary
const sidebarContent = isOnlineLibrary
  ? (
    <>
      {/* D-13: ProviderCategory list */}
      <button className="sidebar-category-item selected" onClick={() => setSelectedProviderCategoryId('all')}>
        <Globe style={{ width: 14, height: 14 }} />
        <span>全部 · {networkPrompts.length}条</span>
      </button>
      {providerCategories.map(cat => (
        <ProviderCategoryItem
          key={cat.id}
          category={cat}
          isSelected={selectedProviderCategoryId === cat.id}
          onSelect={setSelectedProviderCategoryId}
        />
      ))}
    </>
  )
  : (
    <>
      {/* D-01: "在线库" entry below "全部分类" */}
      <button className="sidebar-category-item" onClick={() => setIsOnlineLibrary(true)}>
        <Globe style={{ width: 14, height: 14 }} />
        <span>在线库</span>
      </button>
      {/* Existing local categories */}
      {/* ... */}
    </>
  )

// NEW: Main content based on isOnlineLibrary
const filteredNetworkPrompts = selectedProviderCategoryId === 'all'
  ? networkPrompts
  : networkPrompts.filter(p => p.categoryId === selectedProviderCategoryId)

const paginatedPrompts = filteredNetworkPrompts.slice(0, loadedCount)

const mainContent = isOnlineLibrary
  ? (
    <>
      {/* D-16: CacheStatusHeader */}
      <CacheStatusHeader {...cacheMetadata} />
      
      {/* D-04: NetworkPromptCard grid */}
      <div className="network-prompt-cards-grid">
        {paginatedPrompts.map(prompt => (
          <NetworkPromptCard
            key={prompt.id}
            prompt={prompt}
            onClick={() => {
              setSelectedNetworkPrompt(prompt)
              setIsModalOpen(true)
            }}
          />
        ))}
      </div>
      
      {/* D-10: LoadMoreButton */}
      {filteredNetworkPrompts.length > 50 && (
        <LoadMoreButton
          loadedCount={loadedCount}
          totalCount={filteredNetworkPrompts.length}
          onLoadMore={() => setLoadedCount(prev => prev + 50)}
          isLoading={false}
        />
      )}
    </>
  )
  : (
    {/* Existing local prompt list */}
  )

// NEW: Modal overlay
{selectedNetworkPrompt && (
  <PromptPreviewModal
    prompt={selectedNetworkPrompt}
    isOpen={isModalOpen}
    onClose={() => {
      setIsModalOpen(false)
      setSelectedNetworkPrompt(null)
    }}
  />
)}
```

### Timestamp Formatting Utility

```typescript
// Source: [Phase 6 CacheDataResponse.fetchTimestamp + D-16]
// Utility for CacheStatusHeader

function formatCacheTimestamp(isoString: string | undefined): string {
  if (!isoString) return ''
  
  const date = new Date(isoString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

// Example: '2026-04-19T12:00:00.000Z' → '2026-04-19 12:00'
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Shadow DOM for all content script UI | Portal for Dropdown, Shadow DOM for trigger | Phase 2 | Portal escapes overflow clipping, Shadow DOM isolates trigger styles |
| List-based prompt display | Card grid with thumbnails | Phase 7 (D-04) | Visual preview, better for image generation prompts |
| Simple category sidebar | Mode-aware sidebar (local/network toggle) | Phase 7 (D-01, D-02) | Single entry point for both data sources |
| Full list on load | Pagination with "加载更多" | Phase 7 (D-10, D-11) | Handle large datasets (900+ prompts), progressive loading |

**Deprecated/outdated:**
- Direct DOM insertion for Modal: Use Portal (React createPortal) for proper layer management
- Loading all 900 prompts at once: Pagination prevents memory/performance issues
- Separate "Online Library" button outside dropdown: D-01 specifies sidebar virtual entry

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | PreviewImage URLs from GitHub Raw will load in extension context | NetworkPromptCard | CORS may block images; D-06 fallback handles this |
| A2 | NetworkPrompt.categoryId matches ProviderCategory.id | ProviderCategory filtering | If mismatch, category filter shows empty; verify NanoBananaProvider.parse() |
| A3 | 400px Modal width fits all prompt content without horizontal scroll | PromptPreviewModal | Long prompts may need wider Modal or better wrapping |
| A4 | 50-item pagination performs well on initial load | Pagination | 900 prompts with thumbnails may cause initial lag; consider lazy image loading |

**Note:** All critical decisions (D-01 through D-18) are locked by user — no user confirmation needed. Assumptions A1-A4 should be validated during implementation testing.

## Open Questions

1. **Focus trap implementation for Modal**
   - What we know: Modal needs focus trap for accessibility (WCAG AA)
   - What's unclear: Should we use Radix UI Dialog (already installed) or implement manual focus trap?
   - Recommendation: Radix UI Dialog provides focus trap, escape key handling, and overlay click dismiss. Consider wrapping Modal with Radix Dialog for accessibility compliance. However, Radix styles may conflict with inline CSS pattern — verify compatibility.

2. **Image thumbnail lazy loading**
   - What we know: 50 cards per page, each may have thumbnail URL
   - What's unclear: Should images load lazily (IntersectionObserver) or all on render?
   - Recommendation: Lazy loading improves performance but adds complexity. Phase 7 scope says "图片预览详细实现延后" — defer lazy loading to Phase 7+ enhancement. All images load on page render for simplicity.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| React createPortal | Modal rendering | ✓ | 19.0.0 [VERIFIED: package.json] | — |
| lucide-react | Globe, AlertCircle, WifiOff icons | ✓ | 1.8.0 [VERIFIED: package.json] | — |
| @radix-ui/react-dialog | Focus trap (optional) | ✓ | 1.1.15 [VERIFIED: package.json] | Manual focus trap |
| chrome.runtime.sendMessage | GET_NETWORK_CACHE | ✓ | Native (Chrome) | — |
| Date.toLocaleString | Timestamp format | ✓ | Native (JavaScript) | — |

**Missing dependencies with no fallback:** None — all dependencies are existing project libraries or native APIs.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright 1.59.1 [VERIFIED: package.json] |
| Config file | playwright.config.ts [VERIFIED: file read] |
| Quick run command | `npm run test -- --grep "Phase 7"` |
| Full suite command | `npm run test` |

**Note:** Playwright is E2E testing framework. Component-level testing requires Vitest setup (not currently configured). Phase 7 UI components can be validated via Playwright extension testing or manual validation.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NET-02 | "在线库" sidebar entry visible in dropdown | E2E | `npm run test -- --grep "online library"` | ❌ Wave 0 |
| NET-02 | Clicking "在线库" shows ProviderCategory sidebar | E2E | `npm run test -- --grep "provider category"` | ❌ Wave 0 |
| NET-02 | NetworkPromptCard displays thumbnail + name + tag | E2E | `npm run test -- --grep "network card"` | ❌ Wave 0 |
| NET-02 | Clicking card opens Modal with full content | E2E | `npm run test -- --grep "modal preview"` | ❌ Wave 0 |
| NET-02 | Modal closes on escape key / overlay click | E2E | `npm run test -- --grep "modal close"` | ❌ Wave 0 |
| NET-02 | "加载更多" button loads 50 more prompts | E2E | `npm run test -- --grep "load more"` | ❌ Wave 0 |
| NET-02 | CacheStatusHeader shows timestamp + expiry warning | E2E | `npm run test -- --grep "cache status"` | ❌ Wave 0 |
| NET-02 | Category filter shows correct prompts per ProviderCategory | E2E | `npm run test -- --grep "category filter"` | ❌ Wave 0 |

### Wave 0 Gaps

- [ ] `tests/phase-7.spec.ts` — E2E tests for online library UI
- [ ] `tests/fixtures/extension.ts` — Playwright fixture for loading extension in test context
- [ ] Mock GET_NETWORK_CACHE response — Test fixture with sample NetworkPrompt data
- [ ] Component tests (optional) — Vitest setup for NetworkPromptCard, PromptPreviewModal unit tests

**Alternative:** Manual validation via `npm run dev` + chrome://extensions testing + Lovart page inspection

### Manual Validation Checklist

1. Load extension in Chrome developer mode (`npm run dev` → load from `dist/`)
2. Open Lovart page, click trigger button to open dropdown
3. Verify "在线库" entry visible in sidebar below "全部分类"
4. Click "在线库", verify sidebar switches to ProviderCategory list (17 categories)
5. Verify main content shows NetworkPromptCard grid (2 columns)
6. Click a card, verify Modal opens with full prompt content + source info
7. Press Escape, verify Modal closes
8. Click overlay outside Modal, verify Modal closes
9. Click "加载更多", verify 50 more cards appear
10. Check CacheStatusHeader shows timestamp (from GET_NETWORK_CACHE response)
11. Set cache with expired timestamp (>24h), verify "数据已过期" warning appears
12. Switch between ProviderCategories, verify prompt list updates
13. Switch back to local category, verify sidebar and content restore to local prompts

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth required, public data source |
| V3 Session Management | no | Stateless UI, no session tracking |
| V4 Access Control | no | Public cached data, no user-specific access |
| V5 Input Validation | yes | TypeScript validation on NetworkPrompt, ProviderCategory types [VERIFIED: types.ts] |
| V6 Cryptography | no | HTTPS transport for GitHub URLs, no encryption needed |

### Known Threat Patterns for Chrome Extension + Content Script UI

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via prompt content | Tampering | NetworkPrompt content is plain text, no HTML rendering. React text interpolation escapes HTML. |
| Image URL injection | Tampering | previewImage URLs from trusted GitHub source. onError fallback prevents broken image exploits. |
| Modal overlay phishing | Spoofing | Modal clearly branded with Prompt Script logo, source attribution visible |
| Focus trap bypass | Information Disclosure | Focus trap prevents tab escape to host page, limiting information exposure |

**Key security consideration:** All network data comes from trusted GitHub Raw URL (NanoBananaProvider). No user input affects prompt content. Modal rendering is sandboxed via Portal, isolated from host page DOM.

## Sources

### Primary (HIGH confidence)

- DropdownContainer.tsx — Portal pattern, sidebar structure, CSS styles [VERIFIED: file read]
- DropdownApp.tsx — State management pattern, message handling [VERIFIED: file read]
- types.ts — NetworkPrompt, ProviderCategory type definitions [VERIFIED: file read]
- messages.ts — GET_NETWORK_CACHE, CacheDataResponse interface [VERIFIED: file read]
- service-worker.ts — GET_NETWORK_CACHE handler implementation [VERIFIED: file read]
- CONTEXT.md — D-01 through D-18 locked decisions [VERIFIED: file read]
- UI-SPEC.md — Visual specifications, spacing scale, color tokens [VERIFIED: file read]

### Secondary (MEDIUM confidence)

- Phase 6 RESEARCH.md — NetworkCacheManager pattern, CacheDataResponse structure [VERIFIED: file read]
- NanoBananaProvider.ts — ProviderCategory metadata, getCategories() method [VERIFIED: file read]

### Tertiary (LOW confidence)

- Radix UI Dialog focus trap behavior — Need to verify compatibility with inline CSS [ASSUMED: needs testing]
- PreviewImage CORS behavior — May need fallback handling [ASSUMED: D-06 covers this]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — All dependencies are existing project libraries (React, lucide-react, Radix UI)
- Architecture: HIGH — Portal pattern proven in DropdownContainer, extension follows established patterns
- Pitfalls: MEDIUM — Focus trap and image loading need implementation validation

**Research date:** 2026-04-19
**Valid until:** 30 days (stable React patterns, Chrome Extension APIs well-established)