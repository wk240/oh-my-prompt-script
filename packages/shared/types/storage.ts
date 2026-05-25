import type { Category, Prompt, UserData } from './prompt'
import type { TeamPrompt, TeamSyncStatus } from './team'

// Sync settings for local folder backup
export interface SyncSettings {
  showBuiltin: boolean // Show resource library reference in UI
  syncEnabled: boolean // Auto-sync to local folder enabled
  lastSyncTime?: number // Timestamp of last successful sync
  hasUnsyncedChanges?: boolean // Flag to show backup reminder after reorder
  dismissedBackupWarning?: boolean // User dismissed the backup warning dialog
  resourceLanguage?: 'zh' | 'en' // Language preference for resource library, default 'zh'
  visionEnabled?: boolean // Vision modal (image-to-prompt) feature enabled, default true
  visionDefaultFormat?: 'natural' | 'json' // Vision default save format
}

export interface ImageAsset {
  id: string
  promptId: string
  localPath: string
  cloudUrl?: string
  cloudPath?: string
  sourceUrl?: string
  mimeType: 'image/webp'
  width: number
  height: number
  size: number
  hash: string
  status: 'local_only' | 'synced' | 'pending_upload' | 'upload_failed' | 'missing_local'
  updatedAt: number
  lastUploadAttemptAt?: number
  lastError?: string
}

export interface PendingImageDelete {
  imageId: string
  cloudPath: string
  attempts: number
  lastError?: string
  updatedAt: number
}

// New storage schema with nested structure
export interface StorageSchema {
  version: string // From manifest, dynamic read
  userData: UserData // User's prompts and categories
  settings: SyncSettings // Sync and display settings
  temporaryPrompts?: Prompt[] // Temporary library prompts (independent storage)
  teamPrompts?: TeamPrompt[] // Team library prompts (shared from teams)
  teamSyncStatus?: TeamSyncStatus // Team sync status
  imageAssets?: Record<string, ImageAsset>
  pendingImageDeletes?: PendingImageDelete[]
  _migrationComplete?: boolean // Prevents re-migration
}

// Legacy schema for migration detection
export interface LegacyStorageSchema {
  prompts: Prompt[]
  categories: Category[]
  version: string
}

// Update notification status
export interface UpdateStatus {
  hasUpdate: boolean
  currentVersion: string
  latestVersion: string
  downloadUrl: string
  releaseNotes?: string
  checkedAt: number
}
