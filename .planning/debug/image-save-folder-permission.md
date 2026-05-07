---
status: resolved
trigger: 图片保存失败，请检查文件夹权限
created: 2026-04-27
updated: 2026-04-27
---

# Debug: Image Save Folder Permission

## Symptoms

- **Expected behavior**: 图片成功保存到文件夹
- **Actual behavior**: 显示 "图片保存失败，请检查文件夹权限" 错误提示
- **Error message**: 图片保存失败，请检查文件夹权限
- **Timeline**: 刚开始出现
- **Reproduction**: 保存带图片的提示词时触发

## Current Focus

**hypothesis**: 未确定
**test**: 未确定
**expecting**: 未确定
**next_action**: gather initial evidence
**reasoning_checkpoint**: 未填充
**tdd_checkpoint**: 未填充

## Evidence

- timestamp: 2026-04-27T00:00:00Z | observation: 错误消息 "图片保存失败，请检查文件夹权限" 来自 PromptEditModal.tsx:43，映射到 `WRITE_FAILED` 错误码
- timestamp: 2026-04-27T00:00:00Z | observation: `saveImage` 函数在 image-sync.ts:68-108 中处理图片保存，调用 `getFolderHandle()` 获取文件夹句柄
- timestamp: 2026-04-27T00:00:00Z | observation: `saveImage` 只检查 handle 是否为 null（FOLDER_NOT_CONFIGURED），未检查 handle 的读写权限状态
- timestamp: 2026-04-27T00:00:00Z | observation: indexeddb.ts 提供了 `checkFolderPermission` 和 `requestFolderPermission` 函数，但未被 image-sync.ts 调用
- timestamp: 2026-04-27T00:00:00Z | observation: sync-manager.ts 正确处理权限检查：`getSyncStatus()` 调用 `checkFolderPermission`，`restorePermission()` 调用 `requestFolderPermission`
- timestamp: 2026-04-27T00:00:00Z | observation: File System Access API 的权限会在浏览器重启或一段时间后失效，即使 handle 仍存储在 IndexedDB 中

## Eliminated

- hypothesis: 文件夹未配置 | reason: 用户之前已配置文件夹，IndexedDB 中存在 handle，错误码是 WRITE_FAILED 而非 FOLDER_NOT_CONFIGURED
- hypothesis: 图片文件过大 | reason: 错误消息明确指向文件夹权限，而非 FILE_TOO_LARGE

## Resolution

**root_cause**: `image-sync.ts` 中的 `saveImage` 函数在写入图片前未检查文件夹句柄的权限状态。File System Access API 的读写权限在浏览器重启或一段时间后会失效（变为 "prompt" 或 "denied"），但 handle 仍存储在 IndexedDB 中。当用户尝试保存图片时，`getFolderHandle()` 返回有效 handle，但实际写入操作因权限不足而失败，返回 `WRITE_FAILED` 错误。

**fix**: 在 `saveImage` 函数中添加权限检查逻辑：1) 获取 handle 后调用 `checkFolderPermission` 检查权限状态；2) 如果权限为 "prompt"，调用 `requestFolderPermission` 尝试恢复权限（若用户之前已授权，这会静默恢复）；3) 只有权限为 "granted" 时才执行写入操作；4) 添加新错误码 `PERMISSION_DENIED` 用于权限被拒绝的情况。

**verification**: 修改后测试以下场景：1) 浏览器重启后尝试保存图片；2) 权限过期后首次保存图片；3) 用户主动拒绝权限后尝试保存图片

**files_changed**: src/lib/sync/image-sync.ts