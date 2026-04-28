---
phase: 11
slug: vision-api-integration
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-28
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright |
| **Config file** | playwright.config.ts |
| **Quick run command** | `npm run test` |
| **Full suite command** | `npm run test:headed` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test`
- **After every plan wave:** Run `npm run test:headed`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 1 | VISION-01 | T-11-01 | Provider detection returns correct format | unit | `npm run test` | ❌ W0 | ⬜ pending |
| 11-01-02 | 01 | 1 | VISION-01 | T-11-02 | API key never logged | unit | `npm run test` | ❌ W0 | ⬜ pending |
| 11-02-01 | 02 | 1 | VISION-02 | — | Prompt generation instruction included | unit | `npm run test` | ❌ W0 | ⬜ pending |
| 11-03-01 | 03 | 2 | VISION-03 | — | Loading spinner visible during API call | UI | `npm run test:headed` | ❌ W0 | ⬜ pending |
| 11-04-01 | 04 | 2 | VISION-04 | T-11-03 | Error classification maps to correct action | unit | `npm run test` | ❌ W0 | ⬜ pending |
| 11-04-02 | 04 | 2 | VISION-04 | — | Error message displayed in UI | UI | `npm run test:headed` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/vision-api.test.ts` — Mock API call tests (VISION-01, VISION-02)
- [ ] `tests/loading-ui.test.ts` — Loading page UI tests (VISION-03, VISION-04)
- [ ] `tests/fixtures/mock-vision-api.ts` — Mock Vision API responses for testing

*Existing Playwright infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Real Vision API call with actual image | VISION-01, VISION-02 | Requires real API key and network access | 1. Configure valid API key in settings 2. Right-click image on external site 3. Verify prompt generated |
| Loading state transition timing | VISION-03 | Timing-sensitive visual verification | 1. Use slow network throttle 2. Verify spinner shows for >2s 3. Verify smooth transition to result |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending