import { STORAGE_KEY } from "/src/shared/constants.ts.js";
import { BUILT_IN_CATEGORIES, BUILT_IN_PROMPTS } from "/src/data/built-in-data.ts.js";
import { migrate, isLegacyFormat } from "/src/lib/migrations/index.ts.js";
import "/src/lib/migrations/register.ts.js";
export class StorageManager {
  static instance;
  /**
   * Get singleton instance of StorageManager
   */
  static getInstance() {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }
  /**
   * Get current extension version from manifest
   */
  getCurrentVersion() {
    return chrome.runtime.getManifest().version;
  }
  /**
   * Returns default user data structure for first-time users
   * Includes built-in prompts and categories for immediate use
   */
  getDefaultUserData() {
    return {
      prompts: [...BUILT_IN_PROMPTS],
      categories: [...BUILT_IN_CATEGORIES]
    };
  }
  /**
   * Returns default settings structure
   */
  getDefaultSettings() {
    return {
      showBuiltin: true,
      syncEnabled: false
    };
  }
  /**
   * Returns full default storage schema
   */
  getDefaultData() {
    return {
      version: this.getCurrentVersion(),
      userData: this.getDefaultUserData(),
      settings: this.getDefaultSettings(),
      _migrationComplete: true
    };
  }
  /**
   * Initialize storage with default data (first install)
   */
  async initializeStorage() {
    const defaultData = this.getDefaultData();
    await this.saveData(defaultData);
    console.log("[Oh My Prompt Script] Initialized storage with default data");
    return defaultData;
  }
  /**
   * Retrieves full storage data with migration handling
   * Handles: empty storage, legacy format, version mismatches
   *
   * Three mutually exclusive cases:
   * 1. No data → initialize (first install)
   * 2. Legacy format → migrate
   * 3. New format → validate and update version if needed
   */
  async getData() {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      const data = result[STORAGE_KEY];
      if (!data) {
        return await this.initializeStorage();
      }
      if (isLegacyFormat(data)) {
        console.log("[Oh My Prompt Script] Detected legacy format, migrating...");
        const migrated = await migrate(data, this.getCurrentVersion());
        await this.saveData(migrated);
        return migrated;
      }
      const schema = data;
      const currentVersion = this.getCurrentVersion();
      if (!schema.userData || !schema.settings) {
        console.warn("[Oh My Prompt Script] Malformed storage data (missing fields), reinitializing...");
        return await this.initializeStorage();
      }
      if (schema.version !== currentVersion) {
        console.log("[Oh My Prompt Script] Version mismatch, updating version...");
        schema.version = currentVersion;
        schema._migrationComplete = true;
        await this.saveData(schema);
      }
      return schema;
    } catch (error) {
      console.error("[Oh My Prompt Script] Failed to get storage data:", error);
      console.warn("[Oh My Prompt Script] Returning default data without persisting - potential data loss");
      return this.getDefaultData();
    }
  }
  /**
   * Saves full storage data
   */
  async saveData(data) {
    try {
      await chrome.storage.local.set({ [STORAGE_KEY]: data });
    } catch (error) {
      console.error("[Oh My Prompt Script] Failed to save storage data:", error);
      throw error;
    }
  }
  /**
   * Update settings with partial updates
   */
  async updateSettings(updates) {
    const data = await this.getData();
    data.settings = { ...data.settings, ...updates };
    await this.saveData(data);
  }
  /**
   * Update full userData (prompts and categories)
   */
  async updateUserData(userData) {
    const data = await this.getData();
    data.userData = userData;
    await this.saveData(data);
  }
  /**
   * Get user data (prompts and categories)
   */
  async getUserData() {
    const data = await this.getData();
    return data.userData;
  }
  /**
   * Get settings
   */
  async getSettings() {
    const data = await this.getData();
    return data.settings;
  }
}
export const storageManager = StorageManager.getInstance();
const STORAGE_QUOTA_BYTES = 10 * 1024 * 1024;
export async function checkStorageQuota() {
  try {
    const usedBytes = await chrome.storage.local.getBytesInUse(STORAGE_KEY);
    const percentage = Math.round(usedBytes / STORAGE_QUOTA_BYTES * 100);
    if (percentage > 80) {
      console.warn(`[Oh My Prompt Script] Storage usage warning: ${percentage}%`);
    }
    return {
      usedBytes,
      quotaBytes: STORAGE_QUOTA_BYTES,
      percentage
    };
  } catch (error) {
    console.error("[Oh My Prompt Script] Failed to check storage quota:", error);
    return {
      usedBytes: 0,
      quotaBytes: STORAGE_QUOTA_BYTES,
      percentage: 0
    };
  }
}
