/**
 * Type augmentation for File System Access API
 * TypeScript DOM lib doesn't include queryPermission/requestPermission
 */
declare global {
  interface FileSystemHandle {
    queryPermission(options?: { mode?: 'read' | 'readwrite' }): Promise<PermissionState>
    requestPermission(options?: { mode?: 'read' | 'readwrite' }): Promise<PermissionState>
  }
}

import { SYNC_DB_NAME, SYNC_STORE_NAME, SYNC_HANDLE_KEY } from '@/shared/constants'

/**
 * Open IndexedDB for storing FileSystemDirectoryHandle
 * chrome.storage cannot store handles, so we use IndexedDB
 */
export async function openSyncDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(SYNC_DB_NAME, 1)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(SYNC_STORE_NAME)) {
        db.createObjectStore(SYNC_STORE_NAME)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Save folder handle to IndexedDB
 */
export async function saveFolderHandle(handle: FileSystemDirectoryHandle): Promise<void> {
  const db = await openSyncDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_STORE_NAME, 'readwrite')
    const store = transaction.objectStore(SYNC_STORE_NAME)
    const request = store.put(handle, SYNC_HANDLE_KEY)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)

    transaction.oncomplete = () => db.close()
  })
}

/**
 * Get folder handle from IndexedDB
 * Returns null if not found or permission not granted
 *
 * Chrome's File System Access API caches permission states, so a handle
 * can have 'granted' permission even when the underlying folder is invalid.
 * We verify handle validity by attempting a lightweight directory operation.
 */
export async function getFolderHandle(): Promise<FileSystemDirectoryHandle | null> {
  const db = await openSyncDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_STORE_NAME, 'readonly')
    const store = transaction.objectStore(SYNC_STORE_NAME)
    const request = store.get(SYNC_HANDLE_KEY)

    request.onsuccess = async () => {
      const handle = request.result as FileSystemDirectoryHandle | undefined

      if (!handle) {
        resolve(null)
        return
      }

      // Check permission status
      const permission = await handle.queryPermission({ mode: 'readwrite' })

      if (permission === 'granted') {
        resolve(handle)
        return
      }

      // Permission not granted - request new permission
      try {
        const requested = await handle.requestPermission({ mode: 'readwrite' })
        if (requested === 'granted') {
          resolve(handle)
          return
        }
      } catch {
        // Permission request failed - remove invalid handle
        await removeFolderHandle()
      }

      resolve(null)
    }

    request.onerror = () => reject(request.error)

    transaction.oncomplete = () => db.close()
  })
}

/**
 * Remove folder handle from IndexedDB
 */
export async function removeFolderHandle(): Promise<void> {
  const db = await openSyncDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_STORE_NAME, 'readwrite')
    const store = transaction.objectStore(SYNC_STORE_NAME)
    const request = store.delete(SYNC_HANDLE_KEY)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)

    transaction.oncomplete = () => db.close()
  })
}