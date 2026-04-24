---
status: complete
quick_id: 20260425-backup-warning
date: 2026-04-25
---

# Summary: 备份警告提示

## Changes Made

1. **src/shared/types.ts**
   - 在 `SyncSettings` 中添加 `dismissedBackupWarning?: boolean` 字段

2. **src/popup/BackupApp.tsx**
   - 添加 `showBackupWarning`, `dontShowAgain`, `promptCount` 状态
   - 在 `loadStatus()` 中检测：用户有提示词且没有备份设置时显示警告
   - 添加醒目的橙色警告对话框：
     - 标题："数据安全提醒"（带 AlertTriangle 图标）
     - 显示提示词数量
     - 强调数据丢失风险
     - "选择备份文件夹" + "稍后" 按钮
   - 添加"不再提醒"复选框选项
   - 用户选择"不再提醒"后存储到 settings.dismissedBackupWarning

## User Flow

1. 用户打开备份 popup
2. 系统检测：`!hasFolder && prompts.length > 0 && !dismissedBackupWarning`
3. 显示警告对话框
4. 用户选择：
   - "选择备份文件夹" → 关闭对话框，触发文件夹选择
   - "稍后" → 关闭对话框（可选"不再提醒")

## Files Changed

- src/shared/types.ts
- src/popup/BackupApp.tsx

## Verification

- `npm run build` 成功
- UI 显示醒目的警告对话框（橙色背景）