import type { ImageAsset, PendingImageDelete, StorageSchema, SyncPayload } from '@oh-my-prompt/shared/types'

export function createImageMetadataContractFixture() {
  const asset: ImageAsset = {
    id: '11111111-1111-4111-8111-111111111111',
    promptId: 'prompt-1',
    localPath: 'images/11111111-1111-4111-8111-111111111111.webp',
    cloudUrl: 'https://blob.vercel-storage.com/u.webp',
    cloudPath: 'users/user-1/images/11111111-1111-4111-8111-111111111111.webp',
    sourceUrl: 'https://example.com/source.png',
    mimeType: 'image/webp',
    width: 800,
    height: 600,
    size: 12345,
    hash: 'abc123',
    status: 'synced',
    updatedAt: 1700000000000
  }
  const pendingDelete: PendingImageDelete = {
    imageId: asset.id,
    cloudPath: asset.cloudPath!,
    attempts: 1,
    updatedAt: 1700000000001
  }
  const storage: StorageSchema = {
    version: '1.0.0',
    userData: {
      prompts: [{
        id: 'prompt-1',
        name: 'Prompt',
        content: 'Text',
        categoryId: 'cat-1',
        order: 0,
        imageId: asset.id,
        localImage: asset.localPath,
        remoteImageUrl: asset.sourceUrl
      }],
      categories: [{ id: 'cat-1', name: 'Cat', order: 0 }]
    },
    settings: {
      showBuiltin: true,
      syncEnabled: true
    },
    temporaryPrompts: [],
    imageAssets: { [asset.id]: asset },
    pendingImageDeletes: [pendingDelete]
  }
  const payload: SyncPayload = {
    prompts: storage.userData.prompts,
    categories: storage.userData.categories,
    temporaryPrompts: [],
    imageAssets: storage.imageAssets,
    pendingImageDeletes: storage.pendingImageDeletes,
    timestamp: 1700000000002
  }

  return { asset, pendingDelete, storage, payload }
}
