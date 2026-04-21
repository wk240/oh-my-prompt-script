import { StorageManager } from "/src/lib/storage.ts.js";
import { getFolderHandle, saveFolderHandle } from "/src/lib/sync/indexeddb.ts.js";
import { syncToLocalFolder, readFromLocalFolder, selectSyncFolder, listBackupVersions, readBackupFile } from "/src/lib/sync/file-sync.ts.js";
export async function triggerSync(userData) {
  const storageManager = StorageManager.getInstance();
  const settings = await storageManager.getSettings();
  if (!settings.syncEnabled) {
    return;
  }
  const handle = await getFolderHandle();
  if (!handle) {
    await storageManager.updateSettings({ syncEnabled: false });
    console.warn("[Oh My Prompt Script] Sync folder handle lost, disabled sync");
    return;
  }
  try {
    await syncToLocalFolder(userData, handle);
    await storageManager.updateSettings({ lastSyncTime: Date.now() });
    console.log("[Oh My Prompt Script] Auto-sync completed");
  } catch (error) {
    console.error("[Oh My Prompt Script] Auto-sync failed:", error);
  }
}
export async function initialSync() {
  const handle = await getFolderHandle();
  if (!handle) return;
  const storageManager = StorageManager.getInstance();
  const storageData = await storageManager.getData();
  const localData = await readFromLocalFolder(handle);
  if (localData && storageData.userData.prompts.length === 0) {
    await storageManager.updateUserData(localData);
    console.log("[Oh My Prompt Script] Restored from local folder backup");
    return;
  }
  if (localData && storageData.userData.prompts.length > 0) {
    const settings = await storageManager.getSettings();
    if (settings.syncEnabled) {
      try {
        await syncToLocalFolder(storageData.userData, handle);
        await storageManager.updateSettings({ lastSyncTime: Date.now() });
      } catch (error) {
        console.error("[Oh My Prompt Script] Initial sync failed:", error);
      }
    }
  }
}
export async function enableSync() {
  const existingHandle = await getFolderHandle();
  if (existingHandle) {
    try {
      const storageManager = StorageManager.getInstance();
      const data = await storageManager.getData();
      await syncToLocalFolder(data.userData, existingHandle);
      await storageManager.updateSettings({
        syncEnabled: true,
        lastSyncTime: Date.now()
      });
      return { success: true };
    } catch (error) {
      console.error("[Oh My Prompt Script] Reuse existing folder failed:", error);
      return { success: false, error: "同步失败，请检查文件夹权限或更换文件夹" };
    }
  }
  const handle = await selectSyncFolder();
  if (!handle) {
    return { success: false, error: "请选择一个文件夹" };
  }
  try {
    await saveFolderHandle(handle);
    const storageManager = StorageManager.getInstance();
    const data = await storageManager.getData();
    await syncToLocalFolder(data.userData, handle);
    await storageManager.updateSettings({
      syncEnabled: true,
      lastSyncTime: Date.now()
    });
    return { success: true };
  } catch (error) {
    console.error("[Oh My Prompt Script] Enable sync failed:", error);
    return { success: false, error: "同步失败，请检查文件夹权限" };
  }
}
export async function disableSync() {
  const storageManager = StorageManager.getInstance();
  await storageManager.updateSettings({
    syncEnabled: false
  });
}
export async function changeSyncFolder() {
  const handle = await selectSyncFolder();
  if (!handle) {
    return { success: false, error: "请选择一个文件夹" };
  }
  try {
    await saveFolderHandle(handle);
    const storageManager = StorageManager.getInstance();
    const data = await storageManager.getData();
    await syncToLocalFolder(data.userData, handle);
    await storageManager.updateSettings({
      lastSyncTime: Date.now()
    });
    return { success: true };
  } catch (error) {
    console.error("[Oh My Prompt Script] Change folder failed:", error);
    return { success: false, error: "更换文件夹失败，请检查权限" };
  }
}
export async function manualSync() {
  const handle = await getFolderHandle();
  if (!handle) {
    return { success: false, error: "文件夹权限已失效，请重新选择" };
  }
  try {
    const storageManager = StorageManager.getInstance();
    const data = await storageManager.getData();
    await syncToLocalFolder(data.userData, handle);
    await storageManager.updateSettings({ lastSyncTime: Date.now() });
    return { success: true };
  } catch (error) {
    return { success: false, error: "同步失败，请检查文件夹权限" };
  }
}
export async function getSyncStatus() {
  const storageManager = StorageManager.getInstance();
  const settings = await storageManager.getSettings();
  const handle = await getFolderHandle();
  return {
    enabled: settings.syncEnabled,
    hasFolder: handle !== null,
    lastSyncTime: settings.lastSyncTime,
    folderName: handle?.name
  };
}
export async function getBackupVersions() {
  const handle = await getFolderHandle();
  if (!handle) {
    return { versions: [], error: "文件夹权限已失效，请重新选择" };
  }
  try {
    const versions = await listBackupVersions(handle);
    return { versions };
  } catch (error) {
    return { versions: [], error: "读取版本列表失败" };
  }
}
export async function restoreFromBackup(filename, backupFirst = true) {
  const handle = await getFolderHandle();
  if (!handle) {
    return { success: false, error: "文件夹权限已失效，请重新选择" };
  }
  try {
    const userData = await readBackupFile(handle, filename);
    if (!userData) {
      return { success: false, error: "备份文件无效或已损坏" };
    }
    if (backupFirst) {
      const storageManager2 = StorageManager.getInstance();
      const currentData = await storageManager2.getUserData();
      await syncToLocalFolder(currentData, handle);
    }
    const storageManager = StorageManager.getInstance();
    await storageManager.updateUserData(userData);
    await storageManager.updateSettings({ lastSyncTime: Date.now() });
    return { success: true };
  } catch (error) {
    console.error("[Oh My Prompt Script] Restore failed:", error);
    return { success: false, error: "恢复失败，请检查文件权限" };
  }
}
