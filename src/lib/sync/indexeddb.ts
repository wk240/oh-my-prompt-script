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
 * Returns null if not found
 *
 * Note: Handles restored from IndexedDB may have limited API availability.
 * Validation is deferred to actual file operations - if handle is invalid,
 * backupToFolder will throw and caller can handle the error.
 */
export async function getFolderHandle(): Promise<FileSystemDirectoryHandle | null> {
  const db = await openSyncDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_STORE_NAME, 'readonly')
    const store = transaction.objectStore(SYNC_STORE_NAME)
    const request = store.get(SYNC_HANDLE_KEY)

    request.onsuccess = () => {
      const handle = request.result as FileSystemDirectoryHandle | undefined
      console.log('[Oh My Prompt Script] IndexedDB handle result:', handle ? 'found' : 'not found')
      resolve(handle || null)
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