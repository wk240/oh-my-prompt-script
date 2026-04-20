import { useState, useEffect } from 'react'
import { getSyncStatus, enableSync, disableSync, changeSyncFolder } from '../../lib/sync/sync-manager'
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