---
phase: 9
slug: context-menu-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-28
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.59.1 (E2E) |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `npx tsc --noEmit` (type check) |
| **Full suite command** | `npm run test` (when tests exist) |
| **Estimated runtime** | ~2 seconds (type check) |

**Note:** Playwright E2E testing for Chrome extensions requires special setup (loading unpacked extension). The `tests/` directory currently contains only backup JSON files - no automated test files exist.

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit` (type safety verification)
- **After every plan wave:** Manual E2E verification in Chrome browser
- **Before `/gsd-verify-work`:** TypeScript types green + manual E2E verified
- **Max feedback latency:** ~10 seconds (type check)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 1 | MENU-01 | T-9-01 | Context menu registered on install | type check | `npx tsc --noEmit` | ✅ | pending |
| 09-01-02 | 01 | 1 | MENU-02 | T-9-02 | contexts: ['image'] restricts visibility | type check | `npx tsc --noEmit` | ✅ | pending |
| 09-02-01 | 02 | 2 | MENU-03 | T-9-03 | targetUrlPatterns filters http/https only | type check | `npx tsc --noEmit` | ✅ | pending |
| 09-02-02 | 02 | 2 | MENU-03 | T-9-04 | URL stored as string (no execution) | type check | `npx tsc --noEmit` | ✅ | pending |
| 09-03-01 | 03 | 2 | MENU-01~03 | — | Manual E2E verification | E2E manual | — | ❌ W0 | pending |

*Status: pending = waiting | green = passed | red = failed | flaky = unstable*

---

## Wave 0 Requirements

- [ ] `tests/e2e/context-menu.spec.ts` — E2E test stub for MENU-01~03 (Playwright context menu support limited)
- [ ] Playwright extension loading setup — requires `--load-extension` or fixture
- [ ] Test fixture for context menu simulation — Playwright doesn't natively support context menu events

**Wave 0 approach:** Since Playwright has limited context menu support and no existing test infrastructure, Phase 9 will rely on:
1. TypeScript type checking (`npx tsc --noEmit`)
2. Manual E2E verification in Chrome browser
3. Service worker console log verification

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Context menu appears on image right-click | MENU-01 | Playwright lacks native context menu event support | 1. Load unpacked extension in Chrome 2. Right-click any http/https image 3. Verify "转提示词" menu item visible |
| Menu only on images (not text/links) | MENU-02 | Requires real browser context menu interaction | 1. Right-click text content 2. Verify menu item NOT visible 3. Right-click link 4. Verify menu item NOT visible |
| Click captures correct srcUrl | MENU-03 | Requires real service worker execution | 1. Click menu item 2. Check service worker console for `[Oh My Prompt] Captured image URL: <url>` 3. Verify storage contains `_capturedImageUrl` |

---

## Validation Sign-Off

- [x] All tasks have type check verification (automated) or manual E2E verification
- [x] Sampling continuity: type check after every commit
- [ ] Wave 0 covers test stubs (deferred - manual verification approach)
- [x] No watch-mode flags
- [x] Feedback latency < 10s (type check)
- [ ] `nyquist_compliant: true` set in frontmatter (after execution complete)

**Approval:** pending

---

*Phase: 09-context-menu-foundation*
*Validation strategy: 2026-04-28*