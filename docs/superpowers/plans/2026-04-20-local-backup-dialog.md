# Local Backup Dialog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace inline SyncSettingsPanel with BackupSettingsDialog, integrate backup into refresh button.

**Architecture:** Refresh button checks folder handle → backup+refresh if valid, else open dialog. Dialog provides folder selection, enable/disable, and manual backup controls.

**Tech Stack:** React, Radix UI Dialog, Tailwind CSS, sync-manager, file-sync

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/popup/components/BackupSettingsDialog.tsx` | Create | Dialog UI for backup settings |
| `src/popup/components/Header.tsx` | Modify | Refresh button logic change |
| `src/popup/App.tsx` | Modify | Remove SyncSettingsPanel, add dialog state |
| `src/popup/components/SyncSettingsPanel.tsx` | Delete | Inline panel no longer needed |
| `src/lib/sync/file-sync.ts` | Modify | Add backup function with custom filename |

---

### Task 1: Add backup function to file-sync.ts

**Files:**
- Modify: `src/lib/sync/file-sync.ts`

- [ ] **Step 1: Add BACKUP_FILE_NAME constant and backupToFolder function**

Add at line 4 (after SYNC_FILE_NAME):

```typescript
const BACKUP_FILE_NAME = 'oh-my-prompt-script-backup.json'

/**
 * Backup user data to local folder with fixed filename
 * Used by refresh button for quick backup before reload
 */
export async function backupToFolder(
  userData: UserData,
  handle: FileSystemDirectoryHandle
): Promise<void> {
  try {
    const fileHandle = await handle.getFileHandle(BACKUP_FILE_NAME, { create: true })
    const writable = await fileHandle.createWritable()

    const backupFile = {
      version: chrome.runtime.getManifest().version,
      userData: {
        prompts: userData.prompts,
        categories: userData.categories
      },
      backupTime: new Date().toISOString()
    }

    await writable.write(JSON.stringify(backupFile, null, 2))
    await writable.close()

    console.log('[Oh My Prompt Script] Backup saved:', BACKUP_FILE_NAME)
  } catch (error) {
    console.error('[Oh My Prompt Script] Failed to backup:', error)
    throw error
  }
}
```

- [ ] **Step 2: Manual test - verify function compiles**

Run: `npx tsc --noEmit`
Expected: No errors related to file-sync.ts

- [ ] **Step 3: Commit**

```bash
git add src/lib/sync/file-sync.ts
git commit -m "feat(sync): add backupToFolder function with fixed filename"
```

---

### Task 2: Create BackupSettingsDialog component

**Files:**
- Create: `src/popup/components/BackupSettingsDialog.tsx`

- [ ] **Step 1: Create BackupSettingsDialog.tsx**

```typescript
import { useState, useEffect } from 'react'
import { getSyncStatus, enableSync, disableSync, manualSync, changeSyncFolder } from '../../lib/sync/sync-manager'
import { backupToFolder } from '../../lib/sync/file-sync'
import { getFolderHandle } from '../../lib/sync/indexeddb'
import { StorageManager } from '../../lib/storage'
import type { SyncStatus } from '../../lib/sync/sync-manager'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog'
import { Button } from './ui/button'

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

interface BackupSettingsDialogProps {
  open: boolean
  onClose: () => void
  onBackupSuccess?: () => void
}

function BackupSettingsDialog({ open, onClose, onBackupSuccess }: BackupSettingsDialogProps) {
  const [status, setStatus] = useState<SyncStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      loadStatus()
    }
  }, [open])

  const loadStatus = async () => {
    const currentStatus = await getSyncStatus()
    setStatus(currentStatus)
    setError(null)
  }

  const handleSelectFolder = async () => {
    setLoading(true)
    setError(null)
    const result = await enableSync()
    setLoading(false)

    if (result.success) {
      await loadStatus()
    } else {
      setError(result.error || '选择文件夹失败')
    }
  }

  const handleEnable = async () => {
    setLoading(true)
    setError(null)
    const result = await enableSync()
    setLoading(false)

    if (result.success) {
      await loadStatus()
    } else {
      setError(result.error || '启用失败')
    }
  }

  const handleDisable = async () => {
    setLoading(true)
    await disableSync()
    setLoading(false)
    await loadStatus()
  }

  const handleBackupNow = async () => {
    setLoading(true)
    setError(null)

    const handle = await getFolderHandle()
    if (!handle) {
      setLoading(false)
      setError('文件夹权限已失效，请重新选择')
      return
    }

    try {
      const storageManager = StorageManager.getInstance()
      const data = await storageManager.getData()
      await backupToFolder(data.userData, handle)
      
      // Update lastSyncTime
      await storageManager.updateSettings({ lastSyncTime: Date.now() })
      await loadStatus()
      
      if (onBackupSuccess) {
        onBackupSuccess()
      }
    } catch (err) {
      setError('备份失败，请检查文件夹权限')
    } finally {
      setLoading(false)
    }
  }

  const handleChangeFolder = async () => {
    setLoading(true)
    setError(null)
    const result = await changeSyncFolder()
    setLoading(false)

    if (result.success) {
      await loadStatus()
    } else {
      setError(result.error || '更换文件夹失败')
    }
  }

  if (!status) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-[480px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>本地备份设置</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-muted-foreground">加载中...</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[480px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>本地备份设置</DialogTitle>
          {!status.hasFolder && (
            <DialogDescription>
              选择文件夹以启用备份，数据变更时自动同步
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Status row - only show if has folder */}
          {status.hasFolder && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">状态</span>
              <span className={`text-sm ${status.enabled ? 'text-green-600' : 'text-muted-foreground'}`}>
                {status.enabled ? '已启用' : '同步已禁用'}
              </span>
            </div>
          )}

          {/* Folder name - show if has folder */}
          {status.hasFolder && status.folderName && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">备份文件夹</span>
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                {status.folderName}
              </span>
            </div>
          )}

          {/* Last sync time - only show if enabled */}
          {status.enabled && status.lastSyncTime && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">上次备份</span>
              <span className="text-sm text-muted-foreground">
                {formatTimestamp(status.lastSyncTime)}
              </span>
            </div>
          )}

          {/* Description for disabled state with folder */}
          {status.hasFolder && !status.enabled && (
            <p className="text-sm text-muted-foreground">
              文件夹已保存，启用后将自动复用之前的文件夹。
            </p>
          )}

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* Buttons */}
          <div className="flex gap-2">
            {!status.hasFolder ? (
              <Button
                onClick={handleSelectFolder}
                disabled={loading}
              >
                {loading ? '处理中...' : '选择文件夹并启用'}
              </Button>
            ) : !status.enabled ? (
              <>
                <Button
                  onClick={handleEnable}
                  disabled={loading}
                >
                  {loading ? '处理中...' : '启用备份'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleChangeFolder}
                  disabled={loading}
                >
                  更换文件夹
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleBackupNow}
                  disabled={loading}
                >
                  {loading ? '备份中...' : '立即备份'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleChangeFolder}
                  disabled={loading}
                >
                  更换文件夹
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDisable}
                  disabled={loading}
                >
                  禁用
                </Button>
              </>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            提示：扩展卸载后数据仍可从此文件夹恢复
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BackupSettingsDialog
```

- [ ] **Step 2: TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/popup/components/BackupSettingsDialog.tsx
git commit -m "feat(popup): create BackupSettingsDialog component"
```

---

### Task 3: Modify Header.tsx refresh button logic

**Files:**
- Modify: `src/popup/components/Header.tsx`
- Modify: `src/popup/App.tsx`

- [ ] **Step 1: Update Header.tsx interface**

Modify line 3-6:

```typescript
interface HeaderProps {
  onRefresh: () => void
  onImport: () => void
  onExport: () => void
}
```

(Note: onRefresh now triggers backup+refresh logic in App.tsx, Header stays simple)

- [ ] **Step 2: Verify Header.tsx unchanged except props clarity**

Header component itself doesn't need changes - the logic moves to App.tsx.

- [ ] **Step 3: Commit Header props clarity**

```bash
git add src/popup/components/Header.tsx
git commit -m "refactor(header): clarify HeaderProps interface"
```

---

### Task 4: Modify App.tsx - remove SyncSettingsPanel, add BackupSettingsDialog

**Files:**
- Modify: `src/popup/App.tsx`

- [ ] **Step 1: Remove SyncSettingsPanel import, add BackupSettingsDialog**

Change imports (lines 1-13):

```typescript
import { useEffect, useState } from 'react'
import { usePromptStore } from '../lib/store'
import { exportData, readImportFile } from '../lib/import-export'
import type { Prompt, StorageSchema } from '../shared/types'
import { useToast } from '../hooks/use-toast'
import { backupToFolder } from '../lib/sync/file-sync'
import { getFolderHandle } from '../lib/sync/indexeddb'
import { StorageManager } from '../lib/storage'
import Header from './components/Header'
import CategorySidebar from './components/CategorySidebar'
import PromptList from './components/PromptList'
import PromptEditDialog from './components/PromptEditDialog'
import AddCategoryDialog from './components/AddCategoryDialog'
import DeleteConfirmDialog from './components/DeleteConfirmDialog'
import BackupSettingsDialog from './components/BackupSettingsDialog'
import { Toaster } from './components/ui/toaster'
```

- [ ] **Step 2: Add backupDialogOpen state**

Add after line 22 (after addCategoryDialogOpen state):

```typescript
  const [backupDialogOpen, setBackupDialogOpen] = useState(false)
```

- [ ] **Step 3: Rewrite handleRefresh to check folder handle and backup**

Replace handleRefresh (lines 37-40) with:

```typescript
  const handleRefresh = async () => {
    // Check if folder handle exists
    const handle = await getFolderHandle()
    
    if (handle) {
      // Backup then refresh
      try {
        const storageManager = StorageManager.getInstance()
        const data = await storageManager.getData()
        await backupToFolder(data.userData, handle)
        await storageManager.updateSettings({ lastSyncTime: Date.now() })
        
        // Now refresh from storage
        await loadFromStorage()
        toast({ title: '刷新成功', description: '数据已备份并重新加载' })
      } catch (error) {
        // Backup failed, but still refresh
        await loadFromStorage()
        toast({ title: '刷新成功', description: '数据已重新加载（备份失败，请检查文件夹权限）', variant: 'destructive' })
      }
    } else {
      // No folder handle - open backup settings dialog
      setBackupDialogOpen(true)
    }
  }
```

- [ ] **Step 4: Remove SyncSettingsPanel from JSX, add BackupSettingsDialog**

Remove line 163 (`<SyncSettingsPanel />`).

Add BackupSettingsDialog in the dialogs section (after DeleteConfirmDialog, before Toaster):

```typescript
      <BackupSettingsDialog
        open={backupDialogOpen}
        onClose={() => setBackupDialogOpen(false)}
      />
```

- [ ] **Step 5: TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add src/popup/App.tsx
git commit -m "feat(app): integrate BackupSettingsDialog into refresh flow"
```

---

### Task 5: Delete SyncSettingsPanel.tsx

**Files:**
- Delete: `src/popup/components/SyncSettingsPanel.tsx`

- [ ] **Step 1: Delete the file**

```bash
rm src/popup/components/SyncSettingsPanel.tsx
```

- [ ] **Step 2: Commit deletion**

```bash
git add -A
git commit -m "refactor: remove SyncSettingsPanel inline component"
```

---

### Task 6: Build and manual test

**Files:**
- N/A (testing)

- [ ] **Step 1: Build production bundle**

Run: `npm run build`
Expected: Build succeeds without errors

- [ ] **Step 2: Run dev server**

Run: `npm run dev`

- [ ] **Step 3: Load extension in Chrome**

1. Open `chrome://extensions`
2. Enable Developer Mode
3. Load unpacked from `dist/` folder

- [ ] **Step 4: Test refresh button without folder**

1. Open extension popup
2. Click refresh button
3. Expected: BackupSettingsDialog opens
4. Verify: Shows "选择文件夹并启用" button

- [ ] **Step 5: Test folder selection and enable**

1. Click "选择文件夹并启用"
2. Select a folder in picker
3. Expected: Dialog shows folder name, "已启用" status
4. Close dialog

- [ ] **Step 6: Test refresh button with folder**

1. Click refresh button again
2. Expected: Toast shows "刷新成功，数据已备份并重新加载"
3. Check backup file exists in selected folder: `oh-my-prompt-script-backup.json`

- [ ] **Step 7: Test backup file content**

1. Open `oh-my-prompt-script-backup.json` in selected folder
2. Verify: Contains version, userData with prompts/categories, backupTime

- [ ] **Step 8: Test disable and re-enable**

1. Open dialog via refresh button
2. Click "禁用"
3. Expected: Shows "同步已禁用" but folder still saved
4. Click "启用备份"
5. Expected: Re-enables without asking for new folder

- [ ] **Step 9: Commit final build assets**

```bash
git add dist/
git commit -m "build: update dist assets after backup dialog implementation"
```

---

### Task 7: Self-review and cleanup

**Files:**
- Review all modified files

- [ ] **Step 1: Verify no unused imports**

Check App.tsx and BackupSettingsDialog.tsx for unused imports.

- [ ] **Step 2: Verify console logs use correct prefix**

All logs should use `[Oh My Prompt Script]` prefix.

- [ ] **Step 3: Final commit if cleanup needed**

```bash
git status
# If any cleanup changes, commit them
git add -A
git commit -m "chore: cleanup after backup dialog implementation"
```