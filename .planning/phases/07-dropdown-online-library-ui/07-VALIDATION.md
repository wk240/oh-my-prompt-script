---
phase: 7
slug: dropdown-online-library-ui
status: draft
created: "2026-04-19"
---

# Phase 7 — Validation Strategy

> Wave 0 test specifications for automated verification coverage.

---

## Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright 1.59.1 |
| Config file | playwright.config.ts |
| Quick run | `npm run test -- --grep "Phase 7"` |
| Full suite | `npm run test` |

**Note:** Phase 7 uses E2E testing via Playwright. Component-level tests optional (Vitest not configured).

---

## Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Status |
|--------|----------|-----------|-------------------|--------|
| NET-02 | "在线库" sidebar entry visible | E2E | `npm run test -- --grep "online library"` | Wave 0 |
| NET-02 | Click "在线库" shows ProviderCategory sidebar | E2E | `npm run test -- --grep "provider category"` | Wave 0 |
| NET-02 | NetworkPromptCard displays thumbnail + name + tag | E2E | `npm run test -- --grep "network card"` | Wave 0 |
| NET-02 | Click card opens Modal with full content | E2E | `npm run test -- --grep "modal preview"` | Wave 0 |
| NET-02 | Modal closes on escape/overlay click | E2E | `npm run test -- --grep "modal close"` | Wave 0 |
| NET-02 | "加载更多" loads 50 more prompts | E2E | `npm run test -- --grep "load more"` | Wave 0 |
| NET-02 | CacheStatusHeader shows timestamp + expiry | E2E | `npm run test -- --grep "cache status"` | Wave 0 |
| NET-02 | Category filter shows correct prompts | E2E | `npm run test -- --grep "category filter"` | Wave 0 |

---

## Wave 0 Gaps

- [ ] `tests/phase-7.spec.ts` — E2E tests for online library UI
- [ ] `tests/fixtures/extension.ts` — Playwright fixture for loading extension
- [ ] Mock GET_NETWORK_CACHE response — Test fixture with sample data
- [ ] Component tests (optional) — Vitest setup for unit tests

---

## Manual Validation Checklist

1. Load extension in Chrome developer mode (`npm run dev` → load from `dist/`)
2. Open Lovart page, click trigger button to open dropdown
3. Verify "在线库" entry visible in sidebar below "全部分类"
4. Click "在线库", verify sidebar switches to ProviderCategory list (17 categories)
5. Verify main content shows NetworkPromptCard grid (2 columns)
6. Click a card, verify Modal opens with full prompt content + source info
7. Press Escape, verify Modal closes
8. Click overlay outside Modal, verify Modal closes
9. Click "加载更多", verify 50 more cards appear
10. Check CacheStatusHeader shows timestamp (from GET_NETWORK_CACHE response)
11. Set cache with expired timestamp (>24h), verify "数据已过期" warning appears
12. Switch between ProviderCategories, verify prompt list updates
13. Switch back to local category, verify sidebar and content restore to local prompts

---

## Test Fixtures Required

### Mock NetworkPrompt Data

```typescript
// tests/fixtures/network-prompts.ts
export const mockNetworkPrompts: NetworkPrompt[] = [
  {
    id: 'test-1',
    name: 'Test Prompt 1',
    content: 'This is a test prompt content for validation',
    categoryId: '3d-miniatures',
    sourceProvider: 'NanoBanana',
    sourceCategory: '3D Miniatures',
    previewImage: 'https://example.com/test-thumb.jpg',
  },
  // ... 50+ mock prompts for pagination testing
]

export const mockProviderCategories: ProviderCategory[] = [
  { id: 'all', name: '全部', count: 100 },
  { id: '3d-miniatures', name: '3D Miniatures', count: 52 },
  // ... 17 categories
]

export const mockCacheData: CacheDataResponse = {
  prompts: mockNetworkPrompts,
  categories: mockProviderCategories,
  isFromCache: true,
  isExpired: false,
  fetchTimestamp: new Date().toISOString(),
}
```

### Playwright Extension Fixture

```typescript
// tests/fixtures/extension.ts
import { test as base } from '@playwright/test'

export const test = base.extend({
  extensionPage: async ({ page }, use) => {
    // Load extension from dist/ directory
    // Navigate to Lovart test page
    // Inject extension context
    await use(page)
  },
})
```

---

## Acceptance Criteria Verification

| Criterion | Verify Method |
|-----------|---------------|
| SC-1: Dropdown shows "在线库" tab | grep for `在线库` text in dropdown-sidebar |
| SC-2: Browse by source categories | grep for ProviderCategory items in sidebar |
| SC-3: Card preview in card view | grep for `network-prompt-card` class + thumbnail img |
| SC-4: Click to expand full content | grep for Modal `prompt-preview-modal` + full text |
| SC-5: Pagination 50/page | grep for `load-more-button` + `loadedCount` state |

---

*Phase: 07-dropdown-online-library-ui*
*Validation strategy created: 2026-04-19*