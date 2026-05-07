---
status: resolved
trigger: 侧边栏的资源库收藏功能，无法保存图片到本地
created: 2026-04-29
updated: 2026-04-29
---

# Debug: Resource Library Collection Image Save

## Symptoms

- **Expected behavior**: 收藏资源库提示词时，图片下载并保存到本地文件夹，支持离线查看
- **Actual behavior**: 没有图片显示
- **Error message**: 无错误消息
- **Timeline**: 功能从一开始就缺失
- **Reproduction**: 所有带预览图的资源库提示词

## Current Focus

**hypothesis**: 已确认 - handleConfirmCollect 缺少图片下载保存逻辑
**test**: 已验证 - 查看源代码确认函数行为
**expecting**: 已确认 - 需要添加图片下载和保存逻辑
**next_action**: apply fix
**reasoning_checkpoint**: 根因已定位，准备实施修复
**tdd_checkpoint**: 未填充

## Evidence

- timestamp: 2026-04-29T00:00:00Z | observation: `handleConfirmCollect` 函数在 SidePanelApp.tsx:782-789 创建 localPrompt 时，只设置 `remoteImageUrl`，没有设置 `localImage` 字段
- timestamp: 2026-04-29T00:00:00Z | observation: `handleConfirmCollect` 没有调用 `downloadImageFromUrl` 或 `saveImage` 函数来下载和保存图片
- timestamp: 2026-04-29T00:00:00Z | observation: `image-sync.ts` 提供了 `downloadImageFromUrl` 和 `saveImage` 函数，可用于下载远程图片并保存到本地文件夹
- timestamp: 2026-04-29T00:00:00Z | observation: `Prompt` 类型有两个图片字段：`localImage`（本地相对路径）和 `remoteImageUrl`（远程URL），但 `localPrompt` 对象只设置了后者
- timestamp: 2026-04-29T00:00:00Z | observation: ResourcePrompt 类型有 `previewImage` 字段包含远程图片URL，需要下载并保存
- timestamp: 2026-04-29T00:00:00Z | observation: SidePanelApp 运行在 extension context (chrome-extension://)，所以 saveImage 会使用 saveImageDirect 直接访问文件夹

## Eliminated

## Resolution

**root_cause**: `handleConfirmCollect` 在 SidePanelApp.tsx:853-860 创建 localPrompt 时只设置了 `remoteImageUrl`，从未调用 `downloadImageFromUrl()` 下载图片，也从未调用 `saveImage()` 保存到本地文件夹，导致 `localImage` 字段始终为空，无法在离线时显示图片。

**fix**: 修改 `handleConfirmCollect` 函数，在 addPrompt 后：
1. 获取新添加的 prompt（通过匹配 content 和 categoryId）
2. 如果存在 previewImage，调用 `downloadImageFromUrl` 下载图片 blob
3. 下载成功后调用 `saveImage(promptId, blob)` 保存到本地文件夹
4. 使用 `updatePrompt` 更新 `localImage` 字段为返回的 relativePath
5. 添加 import: `downloadImageFromUrl, saveImage` from `image-sync.ts`

**verification**: TypeScript check passed, build succeeded. 需要手动测试：收藏带预览图的资源库提示词，检查本地文件夹是否有图片文件，且 Prompt 的 localImage 字段有值

**files_changed**:
- src/sidepanel/SidePanelApp.tsx - 添加 import 和图片下载保存逻辑到 handleConfirmCollect