---
phase: 05-provider-foundation
slug: provider-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-19
---

# Phase 05 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None detected — manual validation approach |
| **Config file** | none — Wave 0 installs Vitest recommended |
| **Quick run command** | N/A (manual) |
| **Full suite command** | N/A (manual) |
| **Estimated runtime** | N/A |

**Note:** nyquist_validation is enabled in config.json but no test infrastructure exists in the project. RESEARCH.md recommends Vitest for future setup. Phase 5 uses manual validation via Chrome DevTools.

---

## Sampling Rate

- **After every task commit:** Manual build + load check
- **After every plan wave:** Manual end-to-end test via DevTools
- **Before `/gsd-verify-work`:** Full manual checklist complete
- **Max feedback latency:** 60 seconds (manual testing)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | NET-05 | — | NetworkPrompt extends Prompt | grep | `grep -c "NetworkPrompt" src/shared/types.ts` | ❌ W0 | ⬜ pending |
| 05-01-02 | 01 | 1 | NET-05 | — | FETCH_NETWORK_PROMPTS enum | grep | `grep -c "FETCH_NETWORK_PROMPTS" src/shared/messages.ts` | ❌ W0 | ⬜ pending |
| 05-01-03 | 01 | 1 | NET-05 | — | NETWORK_TIMEOUT constant | grep | `grep -c "NETWORK_TIMEOUT" src/shared/constants.ts` | ❌ W0 | ⬜ pending |
| 05-01-04 | 01 | 1 | NET-05 | — | DataSourceProvider interface | grep | `grep -c "DataSourceProvider" src/lib/providers/base.ts` | ❌ W0 | ⬜ pending |
| 05-02-01 | 02 | 2 | NET-06 | — | NanoBananaProvider class | grep | `grep -c "NanoBananaProvider" src/lib/providers/nano-banana.ts` | ❌ W0 | ⬜ pending |
| 05-02-02 | 02 | 2 | NET-06 | — | parse() returns NetworkPrompt[] | grep | `grep -c "parse(rawData" src/lib/providers/nano-banana.ts` | ❌ W0 | ⬜ pending |
| 05-02-03 | 02 | 2 | NET-06 | — | getCategories() returns 17 | grep | `grep -c "getCategories()" src/lib/providers/nano-banana.ts` | ❌ W0 | ⬜ pending |
| 05-03-01 | 03 | 3 | NET-05 | T-05-07 | host_permissions for GitHub | grep | `grep -c "raw.githubusercontent.com" manifest.json` | ❌ W0 | ⬜ pending |
| 05-03-02 | 03 | 3 | NET-05 | — | FETCH_NETWORK_PROMPTS handler | grep | `grep -c "FETCH_NETWORK_PROMPTS" src/background/service-worker.ts` | ❌ W0 | ⬜ pending |
| 05-03-03 | 03 | 3 | NET-06 | T-05-06 | AbortController timeout 10s | grep | `grep -c "AbortController" src/background/service-worker.ts` | ❌ W0 | ⬜ pending |
| 05-04-01 | 04 | 4 | NET-05/06 | — | Build passes | build | `npm run build` | ✅ exists | ⬜ pending |
| 05-04-02 | 04 | 4 | NET-05/06 | — | Manual checkpoint | manual | DevTools console test | — | ⬜ pending |
| 05-04-03 | 04 | 4 | NET-05/06 | — | Test script created | grep | `grep -c "testNetworkFetch" scripts/test-network-fetch.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — Configure test framework (recommended for Vite projects)
- [ ] `src/lib/providers/__tests__/nano-banana.test.ts` — Unit tests for provider
- [ ] `src/background/__tests__/service-worker.test.ts` — Message handler tests
- [ ] Mock fetch for unit tests — `vi.fn()` for Vitest

**Alternative (current approach):** Manual validation via `npm run dev` + chrome://extensions testing + console inspection

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Network fetch to GitHub succeeds | NET-06 | Chrome Extension requires live runtime | Load extension, send test message via DevTools console, verify response |
| Parse returns ~900+ prompts | NET-06 | Large dataset validation | Check response.data.prompts.length in console output |
| Categories return 17 items | NET-06 | Data structure validation | Check response.data.categories.length in console output |
| Network request shows in DevTools | NET-06 | Browser-specific behavior | Network tab shows GitHub Raw URL request |
| Service Worker logs parse success | NET-05 | Runtime logging verification | Service Worker console shows "[Prompt-Script] parsed X prompts" |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify (NOTE: manual approach)
- [ ] Wave 0 covers all MISSING references (deferred to future milestone)
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s (manual testing)
- [ ] `nyquist_compliant: true` set in frontmatter (set after Wave 0 complete)

**Approval:** pending