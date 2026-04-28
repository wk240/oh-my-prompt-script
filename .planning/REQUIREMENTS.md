# Requirements — v1.3.0 Image to Prompt

**Milestone:** v1.3.0
**Created:** 2026-04-28
**Status:** Scoped

---

## Context Menu Integration (MENU)

- [ ] **MENU-01**: User sees "转提示词" option when right-clicking any image on any website
- [ ] **MENU-02**: Menu item only appears on image elements (not text, links, other elements)
- [ ] **MENU-03**: Click captures image URL (`srcUrl`) for processing

---

## API Key Management (AUTH)

- [ ] **AUTH-01**: User can configure API key in popup settings page
- [ ] **AUTH-02**: API key stored securely in chrome.storage.local (not sync, not exposed in logs)
- [ ] **AUTH-03**: First-time use of "转提示词" triggers onboarding dialog to configure API key
- [ ] **AUTH-04**: User can select Vision AI provider (Claude Vision or OpenAI GPT-4V)

---

## Vision API Integration (VISION)

- [ ] **VISION-01**: Service worker calls Vision API with captured image URL
- [ ] **VISION-02**: API returns prompt text suitable for Lovart image generation
- [ ] **VISION-03**: Loading indicator shown during API call (visual feedback for 2-10 sec latency)
- [ ] **VISION-04**: Clear error messages shown for API failures (rate limit, invalid key, network error, unsupported image)

---

## Prompt Insertion (INSERT)

- [ ] **INSERT-01**: Generated prompt inserted into Lovart input field when user is on Lovart page
- [ ] **INSERT-02**: When not on Lovart page, prompt copied to clipboard with notification toast
- [ ] **INSERT-03**: User sees prompt preview before insertion (preview dialog with confirm/cancel)

---

## Future Requirements (Deferred)

(None identified — all scoped requirements included in this milestone)

---

## Out of Scope

- **Free tier API calls** — User must provide own API key; no built-in free quota
- **Local image upload** — Only right-click on existing web images; no drag-drop or file picker
- **Multiple prompt templates** — Single output format; future may add style templates
- **Usage analytics** — No tracking of API calls; future may add usage log viewer
- **Batch processing** — Single image at a time; future may add multi-image queue

---

## Traceability

| REQ-ID | Phase | Plan |
|--------|-------|------|
| MENU-01 | — | — |
| MENU-02 | — | — |
| MENU-03 | — | — |
| AUTH-01 | — | — |
| AUTH-02 | — | — |
| AUTH-03 | — | — |
| AUTH-04 | — | — |
| VISION-01 | — | — |
| VISION-02 | — | — |
| VISION-03 | — | — |
| VISION-04 | — | — |
| INSERT-01 | — | — |
| INSERT-02 | — | — |
| INSERT-03 | — | — |

*Traceability will be filled by roadmap creation*

---

*Requirements defined: 2026-04-28*
