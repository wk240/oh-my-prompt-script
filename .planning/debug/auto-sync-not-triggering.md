---
status: resolved
trigger: "修改prompt和分类后，数据没有自动同步到文件中"
created: 2026-04-23
updated: 2026-04-23
---

## Symptoms

- **Expected:** 修改 prompt 或分类后立即自动同步到文件夹
- **Actual:** 没有任何反应，备份文件夹无变化
- **Errors:** 没有明显错误
- **Timeline:** 从未正常工作过
- **Reproduction:** 在 popup 中修改 prompt 或分类，观察备份文件夹

## Current Focus

hypothesis: ""
test: ""
expecting: ""
next_action: ""
reasoning_checkpoint: ""
tdd_checkpoint: ""

## Evidence

- timestamp: 2026-04-23T00:00:00
  source: code analysis
  finding: Found critical bug in `DropdownContainer.tsx` lines 1211-1218 and 1245-1254
  details: |
    The drag handlers for prompt and category reorder explicitly set `syncEnabled: false` in the SET_STORAGE payload:
    
    ```javascript
    // handleDragEnd for prompts (line 1217)
    settings: { showBuiltin: true, syncEnabled: false }
    
    // handleCategoryDragEnd for categories (line 1251)
    settings: { showBuiltin: true, syncEnabled: false }
    ```
    
    When the service worker merges settings, `syncEnabled: false` overwrites any existing `syncEnabled: true`, effectively disabling sync every time the user drags a prompt or category.

- timestamp: 2026-04-23T00:00:00
  source: service-worker.ts analysis
  finding: Service worker merges payload settings with existing settings (lines 75-78)
  details: |
    The merge logic allows payload settings to overwrite existing settings:
    ```javascript
    const mergedSettings: SyncSettings = {
      ...existingData.settings,
      ...payload.settings  // syncEnabled: false overwrites syncEnabled: true
    }
    ```

- timestamp: 2026-04-23T00:00:00
  source: store.ts analysis
  finding: Zustand store correctly preserves settings by not including them in payload
  details: |
    The store.ts `saveToStorage()` correctly omits settings from the payload (line 185 comment):
    `// Don't send settings - service worker preserves existing syncEnabled state`
    
    But the drag handlers in DropdownContainer bypass the store and send directly to service worker with `syncEnabled: false`.

## Eliminated

- syncEnabled not being set correctly during enable: Confirmed that `enableSync()` properly sets `syncEnabled: true`
- IndexedDB permission issues: Not the root cause; the actual issue is sync being disabled by drag handlers
- Race condition between save and sync: Not applicable; the issue is sync being explicitly disabled

## Resolution

root_cause: "In `DropdownContainer.tsx`, the drag handlers (`handleDragEnd` and `handleCategoryDragEnd`) explicitly set `syncEnabled: false` in the SET_STORAGE payload. When the service worker merges settings, this overwrites the user's enabled sync setting, causing sync to be disabled whenever the user reorders prompts or categories via drag-and-drop."
fix: "Remove `syncEnabled: false` from the settings payload in both drag handlers. Either omit the settings object entirely (let service worker preserve existing settings like store.ts does), or pass an empty/partial settings object without syncEnabled."
verification: "Test by: 1) Enable sync in backup settings, 2) Drag a prompt to reorder, 3) Check if sync status remains enabled and backup folder is updated"
files_changed: ["src/content/components/DropdownContainer.tsx"]