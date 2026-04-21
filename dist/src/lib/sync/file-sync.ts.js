import { BACKUP_FILE_NAME, BACKUP_HISTORY_PREFIX, BACKUP_HISTORY_PATTERN, MAX_BACKUP_HISTORY } from "/src/shared/constants.ts.js";
export async function backupToFolder(userData, handle) {
  try {
    const fileHandle = await handle.getFileHandle(BACKUP_FILE_NAME, { create: true });
    const writable = await fileHandle.createWritable();
    const backupFile = {
      version: chrome.runtime.getManifest().version,
      userData: {
        prompts: userData.prompts,
        categories: userData.categories
      },
      backupTime: (/* @__PURE__ */ new Date()).toISOString()
    };
    await writable.write(JSON.stringify(backupFile, null, 2));
    await writable.close();
    console.log("[Oh My Prompt Script] Backup saved:", BACKUP_FILE_NAME);
  } catch (error) {
    console.error("[Oh My Prompt Script] Failed to backup:", error);
    throw error;
  }
}
export async function syncToLocalFolder(userData, handle) {
  try {
    const fileHandle = await handle.getFileHandle(BACKUP_FILE_NAME, { create: true });
    const writable = await fileHandle.createWritable();
    const backupFile = {
      version: chrome.runtime.getManifest().version,
      userData: {
        prompts: userData.prompts,
        categories: userData.categories
      },
      backupTime: (/* @__PURE__ */ new Date()).toISOString()
    };
    await writable.write(JSON.stringify(backupFile, null, 2));
    await writable.close();
    console.log("[Oh My Prompt Script] Synced to local folder:", BACKUP_FILE_NAME);
    await createHistoryBackup(handle);
    await cleanupOldBackups(handle);
  } catch (error) {
    console.error("[Oh My Prompt Script] Failed to sync to local folder:", error);
    throw error;
  }
}
export async function readFromLocalFolder(handle) {
  try {
    const fileHandle = await handle.getFileHandle(BACKUP_FILE_NAME);
    const file = await fileHandle.getFile();
    const content = await file.text();
    const parsed = JSON.parse(content);
    if (parsed.userData && typeof parsed.userData === "object") {
      const userData = parsed.userData;
      if (!Array.isArray(userData.prompts) || !Array.isArray(userData.categories)) {
        console.warn("[Oh My Prompt Script] Invalid userData format");
        return null;
      }
      return {
        prompts: userData.prompts,
        categories: userData.categories
      };
    }
    if (!Array.isArray(parsed.prompts) || !Array.isArray(parsed.categories)) {
      console.warn("[Oh My Prompt Script] Invalid local file format");
      return null;
    }
    return {
      prompts: parsed.prompts,
      categories: parsed.categories
    };
  } catch (error) {
    console.warn("[Oh My Prompt Script] Failed to read local file:", error);
    return null;
  }
}
export async function selectSyncFolder() {
  try {
    const handle = await window.showDirectoryPicker({
      mode: "readwrite",
      startIn: "documents"
    });
    const permission = await handle.requestPermission({ mode: "readwrite" });
    if (permission !== "granted") {
      console.warn("[Oh My Prompt Script] Folder permission denied");
      return null;
    }
    return handle;
  } catch (error) {
    console.log("[Oh My Prompt Script] Folder selection cancelled:", error);
    return null;
  }
}
async function createHistoryBackup(handle) {
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  const historyFilename = `${BACKUP_HISTORY_PREFIX}${year}${month}${day}-${hour}${minute}${second}.json`;
  try {
    const latestHandle = await handle.getFileHandle(BACKUP_FILE_NAME);
    const latestFile = await latestHandle.getFile();
    const content = await latestFile.text();
    const historyHandle = await handle.getFileHandle(historyFilename, { create: true });
    const writable = await historyHandle.createWritable();
    await writable.write(content);
    await writable.close();
    console.log("[Oh My Prompt Script] History backup created:", historyFilename);
  } catch (error) {
    console.warn("[Oh My Prompt Script] Failed to create history backup:", error);
  }
}
async function cleanupOldBackups(handle) {
  try {
    const historyFiles = [];
    const dirHandle = handle;
    for await (const name of dirHandle.keys()) {
      if (BACKUP_HISTORY_PATTERN.test(name)) {
        const timestampStr = name.match(/\d{8}\d{6}/)?.[0];
        if (timestampStr) {
          historyFiles.push({
            name,
            time: parseInt(timestampStr, 10)
          });
        }
      }
    }
    historyFiles.sort((a, b) => b.time - a.time);
    if (historyFiles.length > MAX_BACKUP_HISTORY) {
      const toRemove = historyFiles.slice(MAX_BACKUP_HISTORY);
      for (const file of toRemove) {
        await handle.removeEntry(file.name);
        console.log("[Oh My Prompt Script] Removed old backup:", file.name);
      }
    }
  } catch (error) {
    console.warn("[Oh My Prompt Script] Failed to cleanup old backups:", error);
  }
}
export async function listBackupVersions(handle) {
  const versions = [];
  try {
    try {
      const latestHandle = await handle.getFileHandle(BACKUP_FILE_NAME);
      const latestFile = await latestHandle.getFile();
      const content = await latestFile.text();
      const parsed = JSON.parse(content);
      versions.push({
        filename: BACKUP_FILE_NAME,
        backupTime: parsed.backupTime || "",
        promptCount: parsed.userData?.prompts?.length || 0,
        categoryCount: parsed.userData?.categories?.length || 0,
        isLatest: true
      });
    } catch {
    }
    const dirHandle = handle;
    for await (const name of dirHandle.keys()) {
      if (BACKUP_HISTORY_PATTERN.test(name)) {
        try {
          const fileHandle = await handle.getFileHandle(name);
          const file = await fileHandle.getFile();
          const content = await file.text();
          const parsed = JSON.parse(content);
          versions.push({
            filename: name,
            backupTime: parsed.backupTime || "",
            promptCount: parsed.userData?.prompts?.length || 0,
            categoryCount: parsed.userData?.categories?.length || 0,
            isLatest: false
          });
        } catch {
        }
      }
    }
    versions.sort((a, b) => new Date(b.backupTime).getTime() - new Date(a.backupTime).getTime());
  } catch (error) {
    console.warn("[Oh My Prompt Script] Failed to list backup versions:", error);
  }
  return versions;
}
export async function readBackupFile(handle, filename) {
  try {
    const fileHandle = await handle.getFileHandle(filename);
    const file = await fileHandle.getFile();
    const content = await file.text();
    const parsed = JSON.parse(content);
    if (parsed.userData && typeof parsed.userData === "object") {
      const userData = parsed.userData;
      if (!Array.isArray(userData.prompts) || !Array.isArray(userData.categories)) {
        return null;
      }
      return {
        prompts: userData.prompts,
        categories: userData.categories
      };
    }
    if (!Array.isArray(parsed.prompts) || !Array.isArray(parsed.categories)) {
      return null;
    }
    return {
      prompts: parsed.prompts,
      categories: parsed.categories
    };
  } catch (error) {
    console.warn("[Oh My Prompt Script] Failed to read backup file:", error);
    return null;
  }
}
