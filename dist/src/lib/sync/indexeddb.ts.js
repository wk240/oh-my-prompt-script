import { SYNC_DB_NAME, SYNC_STORE_NAME, SYNC_HANDLE_KEY } from "/src/shared/constants.ts.js";
export async function openSyncDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(SYNC_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SYNC_STORE_NAME)) {
        db.createObjectStore(SYNC_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function saveFolderHandle(handle) {
  const db = await openSyncDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_STORE_NAME, "readwrite");
    const store = transaction.objectStore(SYNC_STORE_NAME);
    const request = store.put(handle, SYNC_HANDLE_KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}
export async function getFolderHandle() {
  const db = await openSyncDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_STORE_NAME, "readonly");
    const store = transaction.objectStore(SYNC_STORE_NAME);
    const request = store.get(SYNC_HANDLE_KEY);
    request.onsuccess = () => {
      const handle = request.result;
      console.log("[Oh My Prompt Script] IndexedDB handle result:", handle ? "found" : "not found");
      resolve(handle || null);
    };
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}
export async function removeFolderHandle() {
  const db = await openSyncDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_STORE_NAME, "readwrite");
    const store = transaction.objectStore(SYNC_STORE_NAME);
    const request = store.delete(SYNC_HANDLE_KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}
