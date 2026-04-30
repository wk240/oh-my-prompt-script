# Bilingual Prompt Editing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add bilingual (Chinese/English) tab-based editing support to PromptEditModal for prompt name, description, and content.

**Architecture:** Add 中/EN tab toggle in PromptEditModal with conditional field rendering. Update onConfirm callback interface to pass bilingual fields. Update handlers in DropdownContainer.tsx and SidePanelApp.tsx to save English fields.

**Tech Stack:** React, TypeScript, Zustand store

---

## File Structure

| File | Change Type | Responsibility |
|------|-------------|---------------|
| `src/content/components/PromptEditModal.tsx` | Modify | Add tab UI, English field state, conditional rendering |
| `src/content/components/DropdownContainer.tsx` | Modify | Update handleAddPrompt/handleUpdatePrompt to accept English fields |
| `src/sidepanel/SidePanelApp.tsx` | Modify | Update handleAddPrompt/handleUpdatePrompt to accept English fields |
| `src/shared/types.ts` | No change | Already supports bilingual fields |

---

### Task 1: Add Tab State and English Fields to PromptEditModal

**Files:**
- Modify: `src/content/components/PromptEditModal.tsx:77-160`

- [ ] **Step 1: Add activeTab state and English field states**

Add new state variables after the existing state declarations (around line 77-80):

```typescript
// Add after line 80 (after categoryId state)
const [activeTab, setActiveTab] = useState<'zh' | 'en'>('zh')
const [nameEn, setNameEn] = useState('')
const [descriptionEn, setDescriptionEn] = useState('')
const [contentEn, setContentEn] = useState('')
```

- [ ] **Step 2: Initialize English fields from existing prompt data**

Update the useEffect that resets state when modal opens (around line 113-159). Add English field initialization in the `if (prompt)` block:

```typescript
// Inside the useEffect at line 113-159, in the if (prompt) block:
// After line 120 (setContent(prompt.content)):
if (prompt) {
  setName(prompt.name)
  setDescription(prompt.description || '')
  setContent(prompt.content)
  setCategoryId(prompt.categoryId)
  // Add English field initialization:
  setNameEn(prompt.nameEn || '')
  setDescriptionEn(prompt.descriptionEn || '')
  setContentEn(prompt.contentEn || '')
  // ... existing image code
} else {
  setName('')
  setDescription('')
  setContent('')
  setCategoryId(defaultCategoryId || categories[0]?.id || '')
  // Reset English fields for add mode:
  setNameEn('')
  setDescriptionEn('')
  setContentEn('')
  // ... existing image reset code
}
```

- [ ] **Step 3: Add tab reset on modal close**

Add activeTab reset in the useEffect at line 113-159. Set activeTab to 'zh' when modal opens:

```typescript
// Add at the end of the useEffect cleanup section:
setActiveTab('zh')
```

---

### Task 2: Add Tab Button UI to PromptEditModal

**Files:**
- Modify: `src/content/components/PromptEditModal.tsx:401-430`

- [ ] **Step 4: Add tab buttons above form fields**

Add tab buttons in the modal content, before the "名称" field (around line 401-403):

```typescript
// Add after line 402 (after <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>):
{/* Tab buttons */}
<div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
  <button
    onClick={() => setActiveTab('zh')}
    style={{
      padding: '6px 12px',
      background: activeTab === 'zh' ? '#171717' : '#f8f8f8',
      border: '1px solid #E5E5E5',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 500,
      color: activeTab === 'zh' ? '#fff' : '#171717',
      cursor: 'pointer',
    }}
  >
    中
  </button>
  <button
    onClick={() => setActiveTab('en')}
    style={{
      padding: '6px 12px',
      background: activeTab === 'en' ? '#171717' : '#f8f8f8',
      border: '1px solid #E5E5E5',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 500,
      color: activeTab === 'en' ? '#fff' : '#171717',
      cursor: 'pointer',
    }}
  >
    EN
  </button>
</div>
```

---

### Task 3: Implement Conditional Field Rendering

**Files:**
- Modify: `src/content/components/PromptEditModal.tsx:404-484`

- [ ] **Step 5: Conditionally render name field based on activeTab**

Replace the name field section (lines 404-428) with conditional rendering:

```typescript
{/* Name */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
  <label
    style={{
      fontSize: '12px',
      color: '#64748B',
    }}
  >
    名称
  </label>
  <input
    value={activeTab === 'zh' ? name : nameEn}
    onChange={(e) => {
      if (activeTab === 'zh') {
        setName(e.target.value)
      } else {
        setNameEn(e.target.value)
      }
    }}
    placeholder={activeTab === 'zh' ? '提示词名称' : 'Prompt name (English)'}
    autoFocus={activeTab === 'zh'}
    style={{
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #E5E5E5',
      borderRadius: '6px',
      fontSize: '12px',
      outline: 'none',
      boxSizing: 'border-box',
    }}
  />
</div>
```

- [ ] **Step 6: Conditionally render description field based on activeTab**

Replace the description field section (lines 430-454) with conditional rendering:

```typescript
{/* Description */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
  <label
    style={{
      fontSize: '12px',
      color: '#64748B',
    }}
  >
    描述（选填）
  </label>
  <input
    value={activeTab === 'zh' ? description : descriptionEn}
    onChange={(e) => {
      if (activeTab === 'zh') {
        setDescription(e.target.value)
      } else {
        setDescriptionEn(e.target.value)
      }
    }}
    placeholder={activeTab === 'zh' ? '简短描述，用于列表展示' : 'Short description for display'}
    style={{
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #E5E5E5',
      borderRadius: '6px',
      fontSize: '12px',
      outline: 'none',
      boxSizing: 'border-box',
    }}
  />
</div>
```

- [ ] **Step 7: Conditionally render content textarea based on activeTab**

Replace the content textarea section (lines 456-484) with conditional rendering:

```typescript
{/* Content */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
  <label
    style={{
      fontSize: '12px',
      color: '#64748B',
    }}
  >
    内容
  </label>
  <textarea
    value={activeTab === 'zh' ? content : contentEn}
    onChange={(e) => {
      if (activeTab === 'zh') {
        setContent(e.target.value)
      } else {
        setContentEn(e.target.value)
      }
    }}
    placeholder={activeTab === 'zh' ? '提示词内容' : 'Prompt content (English)'}
    rows={8}
    style={{
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #E5E5E5',
      borderRadius: '6px',
      fontSize: '12px',
      outline: 'none',
      resize: 'vertical',
      minHeight: '120px',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
    }}
  />
</div>
```

---

### Task 4: Update onConfirm Callback Interface

**Files:**
- Modify: `src/content/components/PromptEditModal.tsx:31-46`
- Modify: `src/content/components/PromptEditModal.tsx:294-310`

- [ ] **Step 8: Update PromptEditModalProps interface to include English fields**

Update the interface at lines 31-46:

```typescript
interface PromptEditModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  prompt?: Prompt
  categories: Category[]
  defaultCategoryId?: string
  onConfirm: (data: {
    name: string
    nameEn?: string      // Add English name
    description?: string
    descriptionEn?: string // Add English description
    content: string
    contentEn?: string    // Add English content
    categoryId: string
    localImage?: string
    remoteImageUrl?: string
  }) => void
}
```

- [ ] **Step 9: Update handleConfirm to pass English fields**

Update the handleConfirm function at lines 294-310:

```typescript
const handleConfirm = () => {
  const trimmedName = name.trim()
  const trimmedContent = content.trim()
  if (!trimmedName || !trimmedContent || !categoryId) return

  const trimmedNameEn = nameEn.trim()
  const trimmedContentEn = contentEn.trim()
  const trimmedDescriptionEn = descriptionEn.trim()

  onConfirm({
    name: trimmedName,
    // Only include English fields if they have content
    nameEn: trimmedNameEn || undefined,
    description: description.trim() || undefined,
    descriptionEn: trimmedDescriptionEn || undefined,
    content: trimmedContent,
    contentEn: trimmedContentEn || undefined,
    categoryId,
    localImage,
    remoteImageUrl,
  })
  onClose()
}
```

---

### Task 5: Update DropdownContainer Handlers

**Files:**
- Modify: `src/content/components/DropdownContainer.tsx:882-907`

- [ ] **Step 10: Update handleAddPrompt to accept and save English fields**

Update the function at line 882:

```typescript
const handleAddPrompt = useCallback((data: {
  name: string
  nameEn?: string
  description?: string
  descriptionEn?: string
  content: string
  contentEn?: string
  categoryId: string
  localImage?: string
  remoteImageUrl?: string
}) => {
  usePromptStore.getState().addPrompt({
    name: data.name,
    nameEn: data.nameEn,
    description: data.description,
    descriptionEn: data.descriptionEn,
    content: data.content,
    contentEn: data.contentEn,
    categoryId: data.categoryId,
    order: localPrompts.filter(p => p.categoryId === data.categoryId).length,
    localImage: data.localImage,
    remoteImageUrl: data.remoteImageUrl,
  })
  showToast('提示词已添加')
}, [localPrompts])
```

- [ ] **Step 11: Update handleUpdatePrompt to accept and save English fields**

Update the function at line 895:

```typescript
const handleUpdatePrompt = useCallback((data: {
  name: string
  nameEn?: string
  description?: string
  descriptionEn?: string
  content: string
  contentEn?: string
  categoryId: string
  localImage?: string
  remoteImageUrl?: string
}) => {
  if (!editingStates.prompt) return
  usePromptStore.getState().updatePrompt(editingStates.prompt.id, {
    name: data.name,
    nameEn: data.nameEn,
    description: data.description,
    descriptionEn: data.descriptionEn,
    content: data.content,
    contentEn: data.contentEn,
    categoryId: data.categoryId,
    localImage: data.localImage,
    remoteImageUrl: data.remoteImageUrl,
  })
  clearEditingItem('prompt')
  showToast('提示词已更新')
}, [editingStates.prompt])
```

---

### Task 6: Update SidePanelApp Handlers

**Files:**
- Modify: `src/sidepanel/SidePanelApp.tsx:1233-1262`

- [ ] **Step 12: Update handleAddPrompt to accept and save English fields**

Update the function at line 1233:

```typescript
const handleAddPrompt = useCallback((data: {
  name: string
  nameEn?: string
  description?: string
  descriptionEn?: string
  content: string
  contentEn?: string
  categoryId: string
  localImage?: string
  remoteImageUrl?: string
}) => {
  usePromptStore.getState().addPrompt({
    name: data.name,
    nameEn: data.nameEn,
    description: data.description,
    descriptionEn: data.descriptionEn,
    content: data.content,
    contentEn: data.contentEn,
    categoryId: data.categoryId,
    localImage: data.localImage,
    remoteImageUrl: data.remoteImageUrl,
    order: prompts.filter(p => p.categoryId === data.categoryId).length,
  })
  closeModal('isPromptAdd')
  setToastMessage('提示词已添加')
  setTimeout(hideToast, 2000)
}, [prompts, closeModal, setToastMessage, hideToast])
```

- [ ] **Step 13: Update handleUpdatePrompt to accept and save English fields**

Update the function at line 1248:

```typescript
const handleUpdatePrompt = useCallback((data: {
  name: string
  nameEn?: string
  description?: string
  descriptionEn?: string
  content: string
  contentEn?: string
  categoryId: string
  localImage?: string
  remoteImageUrl?: string
}) => {
  if (!editingStates.prompt) return
  usePromptStore.getState().updatePrompt(editingStates.prompt.id, {
    name: data.name,
    nameEn: data.nameEn,
    description: data.description,
    descriptionEn: data.descriptionEn,
    content: data.content,
    contentEn: data.contentEn,
    categoryId: data.categoryId,
    localImage: data.localImage,
    remoteImageUrl: data.remoteImageUrl,
  })
  clearEditingItem('prompt')
  closeModal('isPromptEdit')
  setToastMessage('提示词已更新')
  setTimeout(hideToast, 2000)
}, [editingStates.prompt, clearEditingItem, closeModal, setToastMessage, hideToast])
```

---

### Task 7: Test the Implementation

**Files:**
- None (manual testing)

- [ ] **Step 14: Run dev server to test**

Run: `npm run dev`

Expected: Dev server starts, extension built to `dist/`

- [ ] **Step 15: Load extension and test bilingual editing**

1. Open Chrome, go to `chrome://extensions`
2. Load extension from `dist/` folder
3. Navigate to a supported platform (e.g., lovart.com)
4. Open dropdown, click "添加提示词"
5. Verify tab buttons show "中" and "EN"
6. Fill Chinese fields, switch to "EN" tab, fill English fields
7. Save prompt, reopen for edit
8. Verify both language versions are preserved

- [ ] **Step 16: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors

---

### Task 8: Commit Changes

**Files:**
- None (git commit)

- [ ] **Step 17: Create git commit**

```bash
git add src/content/components/PromptEditModal.tsx src/content/components/DropdownContainer.tsx src/sidepanel/SidePanelApp.tsx
git commit -m "feat: add bilingual (Chinese/English) editing support to PromptEditModal

- Add 中/EN tab toggle for prompt name, description, and content
- Update onConfirm interface to pass bilingual fields
- Update handlers in DropdownContainer and SidePanelApp to save English fields
- Chinese fields (name, content) remain required; English fields optional

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- [x] Tab toggle UI → Task 2
- [x] Bilingual field state → Task 1
- [x] Conditional rendering → Task 3
- [x] onConfirm interface update → Task 4
- [x] DropdownContainer handlers → Task 5
- [x] SidePanelApp handlers → Task 6
- [x] Chinese fields required, English optional → Task 9 (only pass English if non-empty)
- [x] Default tab is "中" → Task 1 Step 1 (activeTab initialized to 'zh')

**2. Placeholder scan:**
- No TBD, TODO, or placeholder patterns found
- All steps contain actual code

**3. Type consistency:**
- PromptEditModalProps interface updated with all 3 English fields
- handleConfirm passes all English fields with proper optional typing
- Handler interfaces in both DropdownContainer and SidePanelApp match the updated interface

**4. Edge cases covered:**
- Empty English fields are passed as `undefined` (not empty strings) → Step 9
- Modal reset clears English fields in add mode → Step 2
- Editing existing prompts loads both language versions → Step 2