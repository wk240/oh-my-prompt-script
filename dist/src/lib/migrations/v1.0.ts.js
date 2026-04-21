import { isLegacyFormat } from "/src/lib/migrations/index.ts.js";
export function migrateFromLegacy(oldData) {
  if (!isLegacyFormat(oldData)) {
    console.warn("[Oh My Prompt Script] Data is not in legacy format, returning empty structure");
    return {
      version: "1.0.0",
      userData: { prompts: [], categories: [] },
      settings: { showBuiltin: true, syncEnabled: false },
      _migrationComplete: false
    };
  }
  const legacy = oldData;
  const prompts = Array.isArray(legacy.prompts) ? legacy.prompts : [];
  const categories = Array.isArray(legacy.categories) ? legacy.categories : [];
  return {
    version: legacy.version || "1.0.0",
    userData: { prompts, categories },
    settings: { showBuiltin: true, syncEnabled: false },
    _migrationComplete: false
  };
}
export const v1_0Migration = {
  version: "1.0",
  handler: migrateFromLegacy
};
