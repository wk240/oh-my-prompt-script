---
phase: 10
slug: api-key-management
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-28
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.59.1 |
| **Config file** | playwright.config.ts |
| **Quick run command** | `npm run test` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Manual UI verification (popup is user-facing)
- **After every plan wave:** E2E test pass for settings UI flow
- **Before `/gsd-verify-work`:** All AUTH tests green
- **Max feedback latency:** Manual verification with visual check

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 10-01-01 | 01 | 1 | AUTH-01 | T-10-01 | Settings UI renders with input fields | E2E | `playwright test tests/settings.spec.ts -x` | ❌ W0 | ⬜ pending |
| 10-01-02 | 01 | 1 | AUTH-04 | — | Three input fields for API config | E2E | `playwright test tests/settings.spec.ts -x` | ❌ W0 | ⬜ pending |
| 10-02-01 | 02 | 1 | AUTH-02 | T-10-02 | API key not in console logs | unit | `playwright test tests/security.spec.ts -x` | ❌ W0 | ⬜ pending |
| 10-03-01 | 03 | 2 | AUTH-03 | — | Context menu triggers settings page | E2E | `playwright test tests/onboarding.spec.ts -x` | ❌ W0 | ⬜ pending |
| 10-03-02 | 03 | 2 | AUTH-03 | — | Settings page opens when no config | E2E | `playwright test tests/onboarding.spec.ts -x` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/settings.spec.ts` — stubs for AUTH-01, AUTH-04
- [ ] `tests/onboarding.spec.ts` — stubs for AUTH-03
- [ ] `tests/security.spec.ts` — stubs for AUTH-02 (log sanitization)
- [ ] `playwright.config.ts` — may need update for popup testing

*Existing infrastructure: Playwright configured in package.json, tests/ directory currently empty*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| API key masked in dev tools console | AUTH-02 | Console output not easily testable in Playwright | Open popup, enter API key, save, check browser console for absence of key value |
| Settings popup visual layout | AUTH-01 | UI aesthetics/alignment | Open popup, verify 480px width, proper spacing, button positions |
| Onboarding opens new tab | AUTH-03 | Tab creation requires full extension context | Right-click image, verify settings page opens in new tab |

---

## Threat Model

| Threat ID | Category | Description | Standard Mitigation |
|-----------|----------|-------------|---------------------|
| T-10-01 | Information Disclosure | API key exposure in logs | Sanitize logs, mask apiKey in all console.log |
| T-10-02 | Information Disclosure | API key sync to other devices | Use chrome.storage.local (not sync) |
| T-10-03 | Tampering | Malicious extension access | Chrome's per-extension isolation (automatic) |
| T-10-04 | Tampering | XSS in popup UI | React's JSX escapes, CSP restrictions |
| T-10-05 | Spoofing | Phishing/fake settings page | Extension internal URL only (chrome.runtime.getURL) |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < manual verification
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending