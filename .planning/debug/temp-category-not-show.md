---
status: fixed
trigger: 临时分类初次创建时没有自动出现
created: 2026-04-29
updated: 2026-04-29
---

## Symptoms

**Expected behavior:** 创建临时分类后，下拉菜单应自动显示新分类，无需手动刷新

**Actual behavior:** 分类创建成功但不显示在下拉菜单中，需要手动刷新页面才能看到

**Reproduction:** 第一次创建临时分类时触发此问题

**Timeline:** 用户报告此为新发现的问题

**Error messages:** 无明显错误消息

## Current Focus

hypothesis: null
test: null
expecting: null
next_action: null
reasoning_checkpoint: null
tdd_checkpoint: null

## Evidence

- timestamp: 2026-04-29T01:40:00Z
  observation: |
    SAVE_TEMPORARY_PROMPT handler in service-worker.ts (lines 571-626):
    - Creates "临时" category if not exists
    - Saves prompt to storage
    - Returns { success: true }
    - Does NOT broadcast REFRESH_DATA to content scripts

- timestamp: 2026-04-29T01:41:00Z
  observation: |
    DropdownApp.tsx loads data only:
    1. On mount via useEffect -> loadFromStorage()
    2. When content script receives REFRESH_DATA message

- timestamp: 2026-04-29T01:42:00Z
  observation: |
    Content script (content-script.ts lines 63-75) handles REFRESH_DATA:
    - Calls usePromptStore.getState().loadFromStorage()
    - This updates Zustand store which triggers UI re-render

- timestamp: 2026-04-29T01:43:00Z
  observation: |
    SYNC_FAILED broadcast pattern in service-worker.ts (lines 83-89):
    chrome.tabs.query({ url: ['*://lovart.ai/*', '*://*.lovart.ai/*'] }, (tabs) => {
      tabs.forEach(tab => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, { type: MessageType.SYNC_FAILED })
        }
      })
    })

## Eliminated

- hypothesis: UI not re-rendering due to React state issue
  reason: Zustand store properly triggers re-render on state changes

- hypothesis: Category not saved to storage
  reason: Service worker logs show successful save

## Resolution

root_cause: |
  SAVE_TEMPORARY_PROMPT handler in service-worker.ts does not broadcast 
  REFRESH_DATA to content scripts after successfully creating the "临时" 
  category and saving the prompt. The dropdown UI only loads data on mount 
  or when explicitly told to refresh via REFRESH_DATA message.

fix: |
  Added REFRESH_DATA broadcast to all Lovart tabs after SAVE_TEMPORARY_PROMPT 
  completes successfully at lines 621-628:
  
  chrome.tabs.query({ url: ['*://lovart.ai/*', '*://*.lovart.ai/*'] }, (tabs) => {
    tabs.forEach(tab => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { type: MessageType.REFRESH_DATA })
      }
    })
  })

verification: |
  TypeScript check passed (npx tsc --noEmit)
  Manual testing required:
  1. Create first temporary category via VisionModal
  2. Verify dropdown shows the new "临时" category immediately
  3. Verify no page refresh required

files_changed: ['src/background/service-worker.ts']