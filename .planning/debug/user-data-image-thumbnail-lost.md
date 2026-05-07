---
status: resolved
trigger: 从用户数据切换到资源库再返回后，用户数据的图片缩略图消失/空白
created: 2026-04-27
updated: 2026-04-27
---

## Symptoms

**Expected behavior:** 正常显示缩略图，切换后图片应该保持可浏览状态
**Actual behavior:** 缩略图消失/空白
**Reproduction:** 100%必现 - 从用户数据 → 资源库 → 返回用户数据
**Scope:** 仅图片有问题，其他数据保持正常
**Error messages:** 未提供
**Timeline:** 新发现的bug

## Current Focus

hypothesis: null
test: null
expecting: null
next_action: null
reasoning_checkpoint: null
tdd_checkpoint: null

## Evidence

- timestamp: 2026-04-27
  type: code_analysis
  file: src/content/components/PromptThumbnail.tsx
  observation: Component has useEffect cleanup that revokes blob URLs on unmount (lines 86-93)
  relevance: Blob URLs revoked when component unmounts

- timestamp: 2026-04-27
  type: code_analysis
  file: src/lib/sync/image-sync.ts
  observation: imageUrlCache is a module-level Map that caches blob URLs centrally (line 343). getCachedImageUrl returns cached URLs without validity check (lines 348-360)
  relevance: Cache persists across component lifecycles but holds dead URLs after revocation

- timestamp: 2026-04-27
  type: code_analysis
  file: src/lib/sync/image-loader-queue.ts
  observation: queueImageLoad calls getCachedImageUrl which returns from cache if available
  relevance: Components receive cached URLs that may have been revoked

## Eliminated

## Resolution

root_cause: PromptThumbnail.tsx revoked blob URLs in its useEffect cleanup, but the centralized imageUrlCache in image-sync.ts still held references to those revoked URLs. When switching views (user data → resource library → back), components unmount and remount, but receive dead URLs from the cache that had been revoked during unmount.
fix: Removed the component-level URL revocation useEffect from PromptThumbnail.tsx (lines 86-93). The centralized cache management via clearImageUrlCache() handles URL lifecycle when the dropdown closes, preventing premature revocation while components are still active.
verification: TypeScript check passed with no errors
files_changed: [src/content/components/PromptThumbnail.tsx]