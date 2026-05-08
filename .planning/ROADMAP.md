# Roadmap: Lovart Prompt Injector

**Created:** 2026-04-16
**Granularity:** Standard

---

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-04-16)
- ✅ **v1.1.0 网络提示词数据源接入** — Phases 5-7 (shipped 2026-04-19)
- ⏸️ **v1.2.0 在线搜索功能** — Phase 8 (deferred)
- ✅ **v1.2.x 双语支持与图片功能** — Integrated into v1.2.1/v1.2.0 releases (shipped 2026-04-27)
- ✅ **v1.3.0 Image to Prompt** — Phases 9-12 (shipped 2026-04-28)
- ✅ **v1.3.1** — Stability & Polish (shipped 2026-04-29)
- ✅ **v1.3.2** — Permission Auto-Restore (shipped 2026-05-01)
- ✅ **v1.3.3** — Gesture-Preserving Permission (shipped 2026-05-06)
- ❌ **v2.0 Web + Team** — Phases 13-18 (cancelled 2026-05-08)

---

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-4) — SHIPPED 2026-04-16</summary>

- [x] Phase 1: Foundation & Manifest Setup (8/8 plans) — completed 2026-04-16
- [x] Phase 2: Lovart Integration & Content Script (4/4 plans) — completed 2026-04-16
- [x] Phase 3: Data Management & Popup UI (9/9 plans) — completed 2026-04-16
- [x] Phase 4: Polish & End-to-End Testing (6/6 plans) — completed 2026-04-16

**Total:** 4 phases, 27 plans, 54 tasks — 100% complete

</details>

<details>
<summary>✅ v1.1.0 网络提示词数据源接入 (Phases 5-7) — SHIPPED 2026-04-19</summary>

- [x] Phase 5: Provider Foundation (4/4 plans) — completed 2026-04-19
- [x] Phase 6: Network Cache Layer (4/4 plans) — completed 2026-04-19
- [x] Phase 7: Dropdown Online Library UI (5/5 plans) — completed 2026-04-19

**Total:** 3 phases, 13 plans — 100% complete

</details>

### ⏸️ v1.2.0 在线搜索功能 (Deferred)

**Milestone Goal:** 集成 prompts.chat API，用户可在线搜索、浏览、收藏网络提示词

**Status:** Deferred at milestone planning. Focus shifted to v1.3.0 Image to Prompt feature.

#### Phase 8: Search & Collect Features
**Goal**: 用户可搜索并收藏网络提示词到本地
**Depends on**: Phase 7
**Requirements**: NET-01, NET-03
**Success Criteria** (what must be TRUE):
  1. User can type search query and see matching network prompts in real-time
  2. Search matches both prompt title and content (substring match)
  3. User can click "收藏" button on any network prompt
  4. User can select target category when collecting (or create new category)
  5. Collected prompts appear in selected local category immediately
**UI hint**: yes
**Plans:** 5 plans

Plans:
- [ ] 08-01-PLAN.md — Implement search input with debounce (D-01-D-04) (Wave 1)
- [ ] 08-02-PLAN.md — Add search filter logic (title + content, D-05-D-08) (Wave 1)
- [ ] 08-03-PLAN.md — Activate "收藏" button in PromptPreviewModal (D-09) (Wave 2)
- [ ] 08-04-PLAN.md — Implement CategorySelectDialog for collect (D-11-D-15) (Wave 2)
- [ ] 08-05-PLAN.md — Integrate collect with store + Toast feedback (D-16-D-19) (Wave 2)

---

<details>
<summary>✅ v1.3.0 Image to Prompt (Phases 9-12) — SHIPPED 2026-04-28</summary>

- [x] Phase 9: Context Menu Foundation (2/2 plans) — completed 2026-04-28
- [x] Phase 10: API Key Management (3/3 plans) — completed 2026-04-28
- [x] Phase 11: Vision API Integration (4/4 plans) — completed 2026-04-28
- [x] Phase 12: Prompt Insertion (3/3 plans) — completed 2026-04-28

**Total:** 4 phases, 12 plans — 100% complete

</details>

### ❌ v2.0 Web + Team (Cancelled 2026-05-08)

**Milestone Goal:** 将Oh My Prompt从单一Chrome Extension扩展为Extension + Web App混合架构，提供团队共享提示词库、云端同步、订阅付费功能。

**Cancellation Reason:** 决定专注于现有功能的稳定性和用户体验优化，暂停大规模架构扩展。

**Cancelled Phases:**
- Phase 13: Authentication Foundation
- Phase 14: Cloud Sync
- Phase 15: Team Creation & Management
- Phase 16: Team Shared Library
- Phase 17: Subscription & Payments
- Phase 18: Web App Management

---

## Phase Details (Completed Only)

---

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation & Manifest Setup | v1.0 | 8/8 | Complete | 2026-04-16 |
| 2. Lovart Integration & Content Script | v1.0 | 4/4 | Complete | 2026-04-16 |
| 3. Data Management & Popup UI | v1.0 | 9/9 | Complete | 2026-04-16 |
| 4. Polish & End-to-End Testing | v1.0 | 6/6 | Complete | 2026-04-16 |
| 5. Provider Foundation | v1.1.0 | 4/4 | Complete | 2026-04-19 |
| 6. Network Cache Layer | v1.1.0 | 4/4 | Complete | 2026-04-19 |
| 7. Dropdown Online Library UI | v1.1.0 | 5/5 | Complete | 2026-04-19 |
| 8. Search & Collect Features | v1.2.0 | 0/5 | Deferred | - |
| 9. Context Menu Foundation | v1.3.0 | 2/2 | Complete | 2026-04-28 |
| 10. API Key Management | v1.3.0 | 3/3 | Complete | 2026-04-28 |
| 11. Vision API Integration | v1.3.0 | 4/4 | Complete | 2026-04-28 |
| 12. Prompt Insertion | v1.3.0 | 3/3 | Complete | 2026-04-28 |

---

*Roadmap updated: 2026-05-08 — v2.0 cancelled, project in maintenance mode*