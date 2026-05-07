---
status: resolved
trigger: 侧边栏中，资源库收藏功能，没有成功将资源库中的示例图也一起保存到本地中
created: 2026-04-29
updated: 2026-04-29
---

# Resource Library Favorite Image Not Saved

## Symptoms

**Expected behavior:** 收藏时示例图应自动保存到本地
**Actual behavior:** 收藏成功但示例图丢失
**Reproduction path:** 侧边栏资源库 → 收藏 → 查看收藏
**Error messages:** 未提供
**Timeline:** 未提供

## Current Focus

hypothesis: When collecting a resource library prompt, only `remoteImageUrl` is set but no image download/save happens
test: Verify `handleConfirmCollect` in SidePanelApp.tsx does not call image download/save functions
expecting: Missing image download logic
next_action: apply fix
reasoning_checkpoint: null
tdd_checkpoint: null

## Evidence

- timestamp: 2026-04-29T12:00:00Z
  observation: |
    Analyzed handleConfirmCollect in SidePanelApp.tsx - the function only adds the prompt with remoteImageUrl field set, but does not call downloadImageFromUrl or saveImage. In contrast, PromptEditModal.tsx handleUrlDownload (lines 209-246) demonstrates the correct pattern: check folder → download → save → update prompt.

## Eliminated

- hypothesis: null
  reason: null

## Resolution

root_cause: When collecting a resource library prompt, only `remoteImageUrl` is set but no image download/save happens, so `localImage` remains empty and the image is lost.
fix: Refactored `handleConfirmCollect` to use correct pattern: generate prompt ID upfront with `crypto.randomUUID()`, download image, save image, then create prompt with all fields (including `localImage`) in a single `addPrompt` call. This eliminates duplicate prompt creation bug and ensures image is saved before prompt creation.
verification: TypeScript check passed (npx tsc --noEmit)
files_changed: ["src/content/components/DropdownContainer.tsx"]

## Specialist Review

**TypeScript Expert Review:** LOOKS_GOOD

The fix direction matches the established pattern in `PromptEditModal.tsx`.

**Key considerations before applying:**

1. **Folder dependency**: `PromptEditModal` checks `isFolderConfigured()` first (line 166). If no folder configured, the fix should gracefully skip image save and just keep `remoteImageUrl` - don't block collection.

2. **ID generation**: `PromptEditModal` uses `prompt?.id || 'temp-${Date.now()}'` (line 189). For `handleConfirmCollect`, generate the prompt ID upfront with `crypto.randomUUID()` before `addPrompt`, then use it for `saveImage` - avoids needing to retrieve ID after add.

3. **Async flow**: Follow `handleUrlDownload` pattern (lines 209-246): check folder → download → save → update prompt. Keep the sequence non-blocking: user sees toast immediately, image save happens asynchronously.

4. **Graceful fallback**: If download or save fails, collection still succeeds with `remoteImageUrl`. Don't surface error unless critical.

5. **Imports to add**: `downloadImageFromUrl`, `saveImage`, `isFolderConfigured` from `'../lib/sync/image-sync'`.