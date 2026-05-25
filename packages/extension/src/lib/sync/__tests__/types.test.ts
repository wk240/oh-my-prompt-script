import { describe, it, expect } from 'vitest'
import { createImageMetadataContractFixture } from '../image-metadata-contract'
import { SyncResultError, StrategyStatus, UnifiedSyncStatus } from '../types'

describe('Sync types', () => {
  it('should have all error types defined', () => {
    const errors: SyncResultError[] = [
      'NOT_LOGGED_IN',
      'SUBSCRIPTION_REQUIRED',
      'NETWORK_ERROR',
      'PERMISSION_DENIED',
      'SYNC_FAILED',
      'INVALID_DATA'
    ]
    expect(errors).toHaveLength(6)
  })

  it('should create valid StrategyStatus', () => {
    const status: StrategyStatus = {
      enabled: true,
      lastSyncTime: Date.now(),
      error: undefined
    }
    expect(status.enabled).toBe(true)
    expect(status.lastSyncTime).toBeDefined()
  })

  it('should create valid UnifiedSyncStatus', () => {
    const status: UnifiedSyncStatus = {
      cloudEnabled: true,
      cloudLoggedIn: true,
      lastCloudSyncTime: Date.now(),
      localEnabled: true,
      lastLocalSyncTime: Date.now(),
      hasUnsyncedChanges: false,
      pendingCloudSync: false,
      pendingUpload: false,
      localOnlyItems: {
        promptIds: [],
        categoryIds: [],
        temporaryPromptIds: []
      }
    }
    expect(status.cloudEnabled).toBe(true)
    expect(status.localOnlyItems.promptIds).toEqual([])
  })
})

describe('image metadata shared contracts', () => {
  it('allows image metadata in storage and sync payloads', () => {
    const { asset, payload } = createImageMetadataContractFixture()

    expect(payload.imageAssets?.[asset.id].cloudPath).toBe(asset.cloudPath)
    expect(payload.pendingImageDeletes?.[0].attempts).toBe(1)
  })
})
