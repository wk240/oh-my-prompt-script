---
status: resolved
trigger: 打包扩展中，选择备份文件夹后关闭备份页面，重新打开侧边栏出现权限丢失现象，需要重新授权
created: 2026-05-06
updated: 2026-05-06
---

# Debug: Backup Folder Permission Lost

## Symptoms

- **Expected behavior**: 选择备份文件夹后，权限应保持有效，不需要重新授权
- **Actual behavior**: 关闭backup popup再打开侧边栏后，需要重新授权文件夹
- **Error message**: 无明确错误消息，表现为权限丢失状态
- **Timeline**: 打包后才出现，开发版本正常运行
- **Reproduction**: 每次关闭backup popup再打开侧边栏都会发生

## Current Focus

**hypothesis**: File System Access API permissions don't persist across Chrome extension context switches
**test**: Check handleCheckPermission() behavior when offscreen document is recreated
**expecting**: queryPermission() returns 'prompt' instead of 'granted' after context switch
**next_action**: implement auto-request fix
**reasoning_checkpoint**: Confirmed - offscreen document recreation loses permission context
**tdd_checkpoint**: Not applicable (bug fix)

## Evidence

- timestamp: 2026-05-06T00:00:00Z
  type: code_analysis
  file: src/offscreen/offscreen.ts
  finding: |
    handleCheckPermission() (line 271-279) only queries permission status without auto-requesting.
    When offscreen document is recreated, queryPermission() returns 'prompt' because the
    permission grant was tied to the original popup context with user gesture.

- timestamp: 2026-05-06T00:00:00Z
  type: code_analysis
  file: src/offscreen/offscreen.ts
  finding: |
    handleSync() and handleBackup() already implement permission restoration pattern:
    check permission -> if not granted, request permission -> proceed.
    This pattern should be applied to handleCheckPermission() as well.

- timestamp: 2026-05-06T00:00:00Z
  type: specialist_review
  reviewer: typescript-expert
  verdict: LOOKS_GOOD
  notes: |
    Fix direction is correct. Chrome associates permission with the handle itself.
    Additional guardrails recommended:
    1. Wrap in try/catch for revoked handles
    2. Handle 'denied' case explicitly
    3. Add [Oh My Prompt] logging for debugging

## Eliminated

- Chrome storage API issue: IndexedDB persistence is working correctly (handle is retrieved)
- Manifest V3 permissions: File System Access API doesn't require manifest permissions

## Resolution

**root_cause**: File System Access API permissions don't persist across Chrome extension context switches. When the backup popup (where permission was granted) closes and the side panel opens with a new/recreated offscreen document, `queryPermission()` returns `'prompt'` instead of `'granted'` because the permission grant was tied to user activation in the popup tab context.

**fix**: Modify `handleCheckPermission()` in `src/offscreen/offscreen.ts` to auto-request permission when status is `'prompt'`:

```typescript
async function handleCheckPermission(): Promise<MessageResponse> {
  const handle = await getFolderHandle()
  if (!handle) {
    return { success: true, data: { hasFolder: false, permission: null } }
  }

  const permission = await checkFolderPermission(handle, 'readwrite')
  
  // Auto-request permission if 'prompt' (permission was previously granted in another context)
  if (permission === 'prompt') {
    try {
      const requestedPermission = await requestFolderPermission(handle, 'readwrite')
      console.log('[Oh My Prompt] Re-requested permission:', requestedPermission)
      return { success: true, data: { hasFolder: true, permission: requestedPermission, folderName: handle.name } }
    } catch (e) {
      console.warn('[Oh My Prompt] Permission re-request failed:', e)
      return { success: true, data: { hasFolder: true, permission: 'denied', folderName: handle.name } }
    }
  }
  
  return { success: true, data: { hasFolder: true, permission, folderName: handle.name } }
}
```

**specialist_review**: typescript-expert confirmed LOOKS_GOOD with guardrails for try/catch and denied case handling.