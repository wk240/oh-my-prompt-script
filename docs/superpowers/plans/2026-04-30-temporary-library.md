# Temporary Library Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "临时库" (Temporary Library) entry in sidebar below "资源库" to display prompts saved from VisionModal, with list view, edit, and delete support in both Dropdown and SidePanel UIs.

**Architecture:** Two parallel modifications to DropdownContainer.tsx and SidePanelApp.tsx - add `isTemporaryLibrary` state, filter prompts by "临时" category name, modify sidebar conditional rendering to show temporary library entry, modify content area to display temporary prompts in list format.

**Tech Stack:** React, TypeScript, lucide-react icons, @dnd-kit/sortable for drag reorder

---

## Files to Modify

| File | Responsibility |
|------|----------------|
| `src/content/components/DropdownContainer.tsx` | Dropdown UI sidebar + content area for temporary library |
| `src/sidepanel/SidePanelApp.tsx` | SidePanel UI sidebar + content area for temporary library |

---

## Task 1: Add Clock Icon Import to DropdownContainer

**Files:**
- Modify: `src/content/components/DropdownContainer.tsx:12` (import line)

- [ ] **Step 1: Add Clock to lucide-react imports**

Current import at line 12:
```typescript
import { Sparkles, Palette, Shapes, ArrowUpRight, FolderOpen, Layers, Sparkle, Brush, GripVertical, Database, ArrowLeft, Sun, Frame, Paintbrush, Image, ArrowUpCircle, Plus, Pencil, Trash2, ExternalLink, AlertTriangle, Settings } from 'lucide-react'
```

Change to:
```typescript
import { Sparkles, Palette, Shapes, ArrowUpRight, FolderOpen, Layers, Sparkle, Brush, GripVertical, Database, ArrowLeft, Sun, Frame, Paintbrush, Image, ArrowUpCircle, Plus, Pencil, Trash2, ExternalLink, AlertTriangle, Settings, Clock } from 'lucide-react'
```

- [ ] **Step 2: Commit icon import change**

```bash
git add src/content/components/DropdownContainer.tsx
git commit -m "feat: add Clock icon import for temporary library"
```

---

## Task 2: Add isTemporaryLibrary State to DropdownContainer

**Files:**
- Modify: `src/content/components/DropdownContainer.tsx:334` (after isResourceLibrary state)

- [ ] **Step 1: Add isTemporaryLibrary state**

Find existing state at approximately line 334:
```typescript
const [isResourceLibrary, setIsResourceLibrary] = useState(false)
```

Add new state after it:
```typescript
const [isResourceLibrary, setIsResourceLibrary] = useState(false)
  // Temporary library state
  const [isTemporaryLibrary, setIsTemporaryLibrary] = useState(false)
```

- [ ] **Step 2: Commit state addition**

```bash
git add src/content/components/DropdownContainer.tsx
git commit -m "feat: add isTemporaryLibrary state to DropdownContainer"
```

---

## Task 3: Add Temporary Prompts Filter Logic to DropdownContainer

**Files:**
- Modify: `src/content/components/DropdownContainer.tsx:370` (after resourcePrompts useEffect)

- [ ] **Step 1: Add temporaryPrompts and displayTemporaryPrompts useMemo**

Add after the resourcePrompts useEffect (approximately line 374):
```typescript
  // Filter prompts by language preference
  useEffect(() => {
    setResourcePrompts(rawResourcePrompts.map(p => ({
      ...p,
      name: resourceLanguage === 'en' && p.nameEn ? p.nameEn : p.name,
      content: resourceLanguage === 'en' && p.contentEn ? p.contentEn : p.content,
    })))
  }, [rawResourcePrompts, resourceLanguage])

  // Temporary prompts filter (prompts in '临时' category)
  const temporaryPrompts = useMemo(() => {
    const tempCategory = localCategories.find(c => c.name === '临时')
    if (!tempCategory) return []
    return localPrompts.filter(p => p.categoryId === tempCategory.id)
  }, [localPrompts, localCategories])

  // Display temporary prompts with language transformation
  const displayTemporaryPrompts = useMemo(() => {
    return temporaryPrompts.map(p => ({
      ...p,
      name: resourceLanguage === 'en' && p.nameEn ? p.nameEn : p.name,
      content: resourceLanguage === 'en' && p.contentEn ? p.contentEn : p.content,
      description: resourceLanguage === 'en' && p.descriptionEn ? p.descriptionEn : p.description,
    }))
  }, [temporaryPrompts, resourceLanguage])
```

- [ ] **Step 2: Commit filter logic**

```bash
git add src/content/components/DropdownContainer.tsx
git commit -m "feat: add temporary prompts filter logic to DropdownContainer"
```

---

## Task 4: Modify Sidebar Conditional Rendering in DropdownContainer

**Files:**
- Modify: `src/content/components/DropdownContainer.tsx:1101-1134` (sidebar categories section)

- [ ] **Step 1: Replace isResourceLibrary condition with combined condition**

Find the sidebar categories section starting at approximately line 1101:
```tsx
        <div className="sidebar-categories">
          {isResourceLibrary ? (
            <>
              {/* Back to local categories */}
              <button
                className="sidebar-category-item"
                onClick={() => setIsResourceLibrary(false)}
                aria-label="返回本地分类"
              >
```

Replace entire section with:
```tsx
        <div className="sidebar-categories">
          {isResourceLibrary || isTemporaryLibrary ? (
            <>
              {/* Back to local categories */}
              <button
                className="sidebar-category-item"
                onClick={() => {
                  setIsResourceLibrary(false)
                  setIsTemporaryLibrary(false)
                }}
                aria-label="返回本地分类"
              >
                <div className="sidebar-category-icon-wrapper">
                  <ArrowLeft className="sidebar-category-icon" />
                </div>
                <span>返回</span>
              </button>
              {/* Temporary library mode: show title */}
              {isTemporaryLibrary && (
                <button className="sidebar-category-item selected">
                  <div className="sidebar-category-icon-wrapper">
                    <Clock className="sidebar-category-icon" />
                  </div>
                  <span>临时提示词</span>
                </button>
              )}
              {/* Resource library mode: show categories */}
              {isResourceLibrary && (
                <>
                  {/* "全部" ResourceCategory entry */}
                  <button
                    className={`sidebar-category-item ${selectedResourceCategoryId === 'all' ? 'selected' : ''}`}
                    onClick={() => setSelectedResourceCategoryId('all')}
                    aria-label="全部资源提示词"
                  >
                    <div className="sidebar-category-icon-wrapper">
                      <Database className="sidebar-category-icon" />
                    </div>
                    <span>全部</span>
                  </button>
                  {/* ResourceCategory list */}
                  {sortProviderCategoriesByOrder(resourceCategories).map((category) => (
                    <ProviderCategoryItem
                      key={category.id}
                      category={category}
                      isSelected={selectedResourceCategoryId === category.id}
                      onSelect={setSelectedResourceCategoryId}
                    />
                  ))}
                </>
              )}
            </>
          ) : (
```

- [ ] **Step 2: Commit sidebar conditional change**

```bash
git add src/content/components/DropdownContainer.tsx
git commit -m "feat: modify sidebar to support temporary library mode in DropdownContainer"
```

---

## Task 5: Add Temporary Library Entry Button in DropdownContainer Sidebar

**Files:**
- Modify: `src/content/components/DropdownContainer.tsx:1152-1162` (after 资源库 button in local categories)

- [ ] **Step 1: Add temporary library entry button**

Find the 资源库 button at approximately line 1151:
```tsx
              {/* "资源库" entry */}
              <button
                className={`sidebar-category-item ${isResourceLibrary ? 'selected' : ''}`}
                onClick={() => setIsResourceLibrary(true)}
                aria-label="资源库"
              >
                <div className="sidebar-category-icon-wrapper">
                  <Database className="sidebar-category-icon" />
                </div>
                <span>资源库</span>
              </button>
```

Add temporary library entry button after it:
```tsx
              {/* "资源库" entry */}
              <button
                className={`sidebar-category-item ${isResourceLibrary ? 'selected' : ''}`}
                onClick={() => setIsResourceLibrary(true)}
                aria-label="资源库"
              >
                <div className="sidebar-category-icon-wrapper">
                  <Database className="sidebar-category-icon" />
                </div>
                <span>资源库</span>
              </button>

              {/* "临时库" entry */}
              <button
                className={`sidebar-category-item ${isTemporaryLibrary ? 'selected' : ''}`}
                onClick={() => setIsTemporaryLibrary(true)}
                aria-label="临时库"
              >
                <div className="sidebar-category-icon-wrapper">
                  <Clock className="sidebar-category-icon" />
                </div>
                <span>临时库</span>
              </button>
```

- [ ] **Step 2: Commit temporary library entry button**

```bash
git add src/content/components/DropdownContainer.tsx
git commit -m "feat: add temporary library entry button in DropdownContainer sidebar"
```

---

## Task 6: Add Temporary Library Content View in DropdownContainer

**Files:**
- Modify: `src/content/components/DropdownContainer.tsx:1337-1365` (content area conditional)

- [ ] **Step 1: Add isTemporaryLibrary branch before isResourceLibrary branch**

Find the content area starting at approximately line 1332:
```tsx
          {isLoading ? (
            <div className="empty-state">
              <div className="empty-message">加载中...</div>
            </div>
          ) : isResourceLibrary ? (
```

Insert temporary library branch before isResourceLibrary:
```tsx
          {isLoading ? (
            <div className="empty-state">
              <div className="empty-message">加载中...</div>
            </div>
          ) : isTemporaryLibrary ? (
            // Temporary library view - list format
            displayTemporaryPrompts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-message">暂无临时提示词</div>
              </div>
            ) : (
              <div className="dropdown-items">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={displayTemporaryPrompts.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {displayTemporaryPrompts.map((prompt, index) => (
                      <SortableDropdownItem
                        key={prompt.id}
                        prompt={prompt}
                        isLast={index === displayTemporaryPrompts.length - 1}
                        isSelected={selectedPromptId === prompt.id}
                        onSelect={onSelect}
                        showDragHandle={displayTemporaryPrompts.length >= 2}
                        onThumbnailClick={(p) => {
                          setEditingItem('userPrompt', p)
                          openModal('isUserPreview')
                        }}
                        onEdit={(p) => {
                          setEditingItem('prompt', p)
                          openModal('isPromptEdit')
                        }}
                        onDelete={(p) => {
                          setEditingItem('deletingPrompt', p)
                          openModal('isPromptDelete')
                        }}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            )
          ) : isResourceLibrary ? (
```

- [ ] **Step 2: Commit temporary library content view**

```bash
git add src/content/components/DropdownContainer.tsx
git commit -m "feat: add temporary library content view in DropdownContainer"
```

---

## Task 7: Hide FAB Button in Temporary Library Mode (DropdownContainer)

**Files:**
- Modify: `src/content/components/DropdownContainer.tsx:1407-1415` (FAB add button)

- [ ] **Step 1: Add isTemporaryLibrary condition to FAB button visibility**

Find FAB button at approximately line 1407:
```tsx
            {!isResourceLibrary && (
              <button
                className="fab-add-prompt"
                onClick={() => openModal('isPromptAdd')}
                aria-label="添加提示词"
              >
                <Plus style={{ width: 18, height: 18 }} />
              </button>
            )}
```

Change to:
```tsx
            {!isResourceLibrary && !isTemporaryLibrary && (
              <button
                className="fab-add-prompt"
                onClick={() => openModal('isPromptAdd')}
                aria-label="添加提示词"
              >
                <Plus style={{ width: 18, height: 18 }} />
              </button>
            )}
```

- [ ] **Step 2: Commit FAB button visibility change**

```bash
git add src/content/components/DropdownContainer.tsx
git commit -m "feat: hide FAB button in temporary library mode in DropdownContainer"
```

---

## Task 8: Add Clock Icon Import to SidePanelApp

**Files:**
- Modify: `src/sidepanel/SidePanelApp.tsx:9` (import line)

- [ ] **Step 1: Add Clock to lucide-react imports**

Current import at line 9:
```typescript
import { Sparkles, Palette, Shapes, FolderOpen, Layers, Sparkle, Brush, GripVertical, Database, ArrowLeft, Sun, Frame, Paintbrush, Image, ArrowUpCircle, Plus, Pencil, Trash2, ExternalLink, ArrowUpRight, Bookmark, AlertTriangle, Settings, Loader2 } from 'lucide-react'
```

Change to:
```typescript
import { Sparkles, Palette, Shapes, FolderOpen, Layers, Sparkle, Brush, GripVertical, Database, ArrowLeft, Sun, Frame, Paintbrush, Image, ArrowUpCircle, Plus, Pencil, Trash2, ExternalLink, ArrowUpRight, Bookmark, AlertTriangle, Settings, Loader2, Clock } from 'lucide-react'
```

- [ ] **Step 2: Commit icon import change**

```bash
git add src/sidepanel/SidePanelApp.tsx
git commit -m "feat: add Clock icon import for temporary library in SidePanelApp"
```

---

## Task 9: Add isTemporaryLibrary State to SidePanelApp

**Files:**
- Modify: `src/sidepanel/SidePanelApp.tsx:564` (after isResourceLibrary state)

- [ ] **Step 1: Add isTemporaryLibrary state**

Find existing state at approximately line 564:
```typescript
const [isResourceLibrary, setIsResourceLibrary] = useState(false)
```

Add new state after it:
```typescript
const [isResourceLibrary, setIsResourceLibrary] = useState(false)
  const [isTemporaryLibrary, setIsTemporaryLibrary] = useState(false)
```

- [ ] **Step 2: Commit state addition**

```bash
git add src/sidepanel/SidePanelApp.tsx
git commit -m "feat: add isTemporaryLibrary state to SidePanelApp"
```

---

## Task 10: Add Temporary Prompts Filter Logic to SidePanelApp

**Files:**
- Modify: `src/sidepanel/SidePanelApp.tsx:945` (after displayPrompts useMemo)

- [ ] **Step 1: Add temporaryPrompts and displayTemporaryPrompts useMemo**

Add after displayPrompts useMemo (approximately line 945):
```typescript
  // Display prompts with language transformation
  const displayPrompts = useMemo(() => {
    return filteredPrompts.map(p => ({
      ...p,
      name: resourceLanguage === 'en' && p.nameEn ? p.nameEn : p.name,
      content: resourceLanguage === 'en' && p.contentEn ? p.contentEn : p.content,
      description: resourceLanguage === 'en' && p.descriptionEn ? p.descriptionEn : p.description,
    }))
  }, [filteredPrompts, resourceLanguage])

  // Temporary prompts filter (prompts in '临时' category)
  const temporaryPrompts = useMemo(() => {
    const tempCategory = categories.find(c => c.name === '临时')
    if (!tempCategory) return []
    return prompts.filter(p => p.categoryId === tempCategory.id)
  }, [prompts, categories])

  // Display temporary prompts with language transformation
  const displayTemporaryPrompts = useMemo(() => {
    return temporaryPrompts.map(p => ({
      ...p,
      name: resourceLanguage === 'en' && p.nameEn ? p.nameEn : p.name,
      content: resourceLanguage === 'en' && p.contentEn ? p.contentEn : p.content,
      description: resourceLanguage === 'en' && p.descriptionEn ? p.descriptionEn : p.description,
    }))
  }, [temporaryPrompts, resourceLanguage])
```

- [ ] **Step 2: Commit filter logic**

```bash
git add src/sidepanel/SidePanelApp.tsx
git commit -m "feat: add temporary prompts filter logic to SidePanelApp"
```

---

## Task 11: Modify Sidebar Conditional Rendering in SidePanelApp

**Files:**
- Modify: `src/sidepanel/SidePanelApp.tsx:1397-1432` (sidebar categories section)

- [ ] **Step 1: Replace isResourceLibrary condition with combined condition**

Find the sidebar categories section starting at approximately line 1396:
```tsx
          <div className="sidebar-categories scrollbar-thin">
          {isResourceLibrary ? (
            <>
              <button
                className="sidebar-category-item"
                onClick={() => setIsResourceLibrary(false)}
              >
```

Replace entire section with:
```tsx
          <div className="sidebar-categories scrollbar-thin">
          {isResourceLibrary || isTemporaryLibrary ? (
            <>
              <button
                className="sidebar-category-item"
                onClick={() => {
                  setIsResourceLibrary(false)
                  setIsTemporaryLibrary(false)
                }}
              >
                <div className="sidebar-category-icon-wrapper">
                  <ArrowLeft className="sidebar-category-icon" />
                </div>
                <span>返回</span>
              </button>
              {/* Temporary library mode: show title */}
              {isTemporaryLibrary && (
                <button className="sidebar-category-item selected">
                  <div className="sidebar-category-icon-wrapper">
                    <Clock className="sidebar-category-icon" />
                  </div>
                  <span>临时提示词</span>
                </button>
              )}
              {/* Resource library mode: show categories */}
              {isResourceLibrary && (
                <>
                  <button
                    className={`sidebar-category-item ${selectedResourceCategoryId === 'all' ? 'selected' : ''}`}
                    onClick={() => setSelectedResourceCategoryId('all')}
                  >
                    <div className="sidebar-category-icon-wrapper">
                      <Database className="sidebar-category-icon" />
                    </div>
                    <span>全部</span>
                  </button>
                  {sortProviderCategoriesByOrder(resourceCategories).map(category => (
                    <button
                      key={category.id}
                      className={`sidebar-category-item ${selectedResourceCategoryId === category.id ? 'selected' : ''}`}
                      onClick={() => setSelectedResourceCategoryId(category.id)}
                    >
                      <div className="sidebar-category-icon-wrapper">
                        <Layers className="sidebar-category-icon" />
                      </div>
                      <Tooltip content={category.name}>
                        <span>{category.name}</span>
                      </Tooltip>
                    </button>
                  ))}
                </>
              )}
            </>
          ) : (
```

- [ ] **Step 2: Commit sidebar conditional change**

```bash
git add src/sidepanel/SidePanelApp.tsx
git commit -m "feat: modify sidebar to support temporary library mode in SidePanelApp"
```

---

## Task 12: Add Temporary Library Entry Button in SidePanelApp Sidebar

**Files:**
- Modify: `src/sidepanel/SidePanelApp.tsx:1445-1453` (after 资源库 button)

- [ ] **Step 1: Add temporary library entry button**

Find the 资源库 button:
```tsx
              <button
                className={`sidebar-category-item ${isResourceLibrary ? 'selected' : ''}`}
                onClick={() => setIsResourceLibrary(true)}
              >
                <div className="sidebar-category-icon-wrapper">
                  <Database className="sidebar-category-icon" />
                </div>
                <span>资源库</span>
              </button>
```

Add temporary library entry button after it:
```tsx
              <button
                className={`sidebar-category-item ${isResourceLibrary ? 'selected' : ''}`}
                onClick={() => setIsResourceLibrary(true)}
              >
                <div className="sidebar-category-icon-wrapper">
                  <Database className="sidebar-category-icon" />
                </div>
                <span>资源库</span>
              </button>

              {/* "临时库" entry */}
              <button
                className={`sidebar-category-item ${isTemporaryLibrary ? 'selected' : ''}`}
                onClick={() => setIsTemporaryLibrary(true)}
              >
                <div className="sidebar-category-icon-wrapper">
                  <Clock className="sidebar-category-icon" />
                </div>
                <span>临时库</span>
              </button>
```

- [ ] **Step 2: Commit temporary library entry button**

```bash
git add src/sidepanel/SidePanelApp.tsx
git commit -m "feat: add temporary library entry button in SidePanelApp sidebar"
```

---

## Task 13: Add Temporary Library Content View in SidePanelApp

**Files:**
- Modify: `src/sidepanel/SidePanelApp.tsx:1584-1608` (content area conditional)

- [ ] **Step 1: Add isTemporaryLibrary branch before isResourceLibrary branch**

Find the content area:
```tsx
          {isLoading ? (
            <div className="empty-state">
              <div className="empty-message">加载中...</div>
            </div>
          ) : isResourceLibrary ? (
```

Insert temporary library branch before isResourceLibrary:
```tsx
          {isLoading ? (
            <div className="empty-state">
              <div className="empty-message">加载中...</div>
            </div>
          ) : isTemporaryLibrary ? (
            // Temporary library view - list format
            displayTemporaryPrompts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-message">暂无临时提示词</div>
              </div>
            ) : (
              <DndContext collisionDetection={closestCenter} onDragEnd={handlePromptDragEnd}>
                <SortableContext
                  items={displayTemporaryPrompts.map(p => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {displayTemporaryPrompts.map(prompt => (
                    <SortablePromptItem
                      key={prompt.id}
                      prompt={prompt}
                      isSelected={selectedPromptId === prompt.id}
                      onSelect={handleSelectPrompt}
                      showDragHandle={displayTemporaryPrompts.length >= 2}
                      onEdit={(p) => {
                        setEditingItem('prompt', p)
                        openModal('isPromptEdit')
                      }}
                      onDelete={(p) => {
                        setEditingItem('deletingPrompt', p)
                        openModal('isPromptDelete')
                      }}
                      canInject={inputStatus === 'available'}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )
          ) : isResourceLibrary ? (
```

- [ ] **Step 2: Commit temporary library content view**

```bash
git add src/sidepanel/SidePanelApp.tsx
git commit -m "feat: add temporary library content view in SidePanelApp"
```

---

## Task 14: Hide FAB Button in Temporary Library Mode (SidePanelApp)

**Files:**
- Modify: `src/sidepanel/SidePanelApp.tsx:1645-1653` (FAB add button)

- [ ] **Step 1: Add isTemporaryLibrary condition to FAB button visibility**

Find FAB button:
```tsx
        {!isResourceLibrary && (
          <button
            className="fab-add-btn"
            onClick={() => openModal('isPromptAdd')}
            aria-label="添加提示词"
          >
            <Plus style={{ width: 18, height: 18 }} />
          </button>
        )}
```

Change to:
```tsx
        {!isResourceLibrary && !isTemporaryLibrary && (
          <button
            className="fab-add-btn"
            onClick={() => openModal('isPromptAdd')}
            aria-label="添加提示词"
          >
            <Plus style={{ width: 18, height: 18 }} />
          </button>
        )}
```

- [ ] **Step 2: Commit FAB button visibility change**

```bash
git add src/sidepanel/SidePanelApp.tsx
git commit -m "feat: hide FAB button in temporary library mode in SidePanelApp"
```

---

## Verification

### Manual Testing Checklist

1. **Dropdown UI:**
   - [ ] Open dropdown on Lovart page
   - [ ] Verify "临时库" entry appears below "资源库" in sidebar
   - [ ] Click "临时库" - sidebar shows "返回" + "临时提示词"
   - [ ] Content area shows temporary prompts in list format
   - [ ] Click prompt to inject into Lovart input
   - [ ] Edit button opens PromptEditModal
   - [ ] Delete button opens DeleteConfirmModal
   - [ ] Click "返回" - returns to normal category view
   - [ ] FAB add button is hidden in temporary library mode

2. **SidePanel UI:**
   - [ ] Open side panel
   - [ ] Verify "临时库" entry appears below "资源库" in sidebar
   - [ ] Click "临时库" - sidebar shows "返回" + "临时提示词"
   - [ ] Content area shows temporary prompts in list format
   - [ ] Click prompt to inject (if page has input)
   - [ ] Edit button opens PromptEditModal
   - [ ] Delete button opens DeleteConfirmModal
   - [ ] Click "返回" - returns to normal category view
   - [ ] FAB add button is hidden in temporary library mode

3. **VisionModal Integration:**
   - [ ] Use VisionModal to convert image to prompt
   - [ ] Click "暂存到OMP" to save
   - [ ] Open dropdown/side panel
   - [ ] Verify prompt appears in "临时库"

---

## Self-Review Checklist

- [x] **Spec coverage:** All requirements implemented - sidebar entry, list view, edit/delete support, both UIs
- [x] **Placeholder scan:** No TBD, TODO, or vague steps - all code shown
- [x] **Type consistency:** `isTemporaryLibrary` state used consistently, `displayTemporaryPrompts` naming consistent