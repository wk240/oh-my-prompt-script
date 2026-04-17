# Codebase Concerns

**Analysis Date:** 2026-04-17

## Tech Debt

**Unused Sample Data Module:**
- Issue: `src/content/sample-data.ts` contains test data with comment "Phase 3 will replace with storage-backed data" but file appears unused in current architecture
- Files: `src/content/sample-data.ts`
- Impact: Dead code cluttering repository, misleading comments
- Fix approach: Remove file entirely or update documentation to reflect current state

**Unused Style Extractor:**
- Issue: `src/content/style-extractor.ts` exports functions for extracting Lovart button styles but is never imported or used in any component
- Files: `src/content/style-extractor.ts`
- Impact: Dead code, unused exports
- Fix approach: Either integrate for dynamic style matching or remove

**Inline CSS in UIInjector:**
- Issue: `src/content/ui-injector.tsx` contains 667 lines of inline CSS in `getStyles()` method - makes maintenance difficult, no CSS reuse
- Files: `src/content/ui-injector.tsx` (lines 84-750)
- Impact: Hard to modify styles, no IDE support for CSS syntax, potential duplication
- Fix approach: Extract CSS to separate stylesheet file or use CSS-in-JS library with proper tooling

**Duplicate Style Definitions:**
- Issue: Dropdown styles defined twice - once in `ui-injector.tsx` and again in `DropdownContainer.tsx` portal styles (lines 66-300)
- Files: `src/content/ui-injector.tsx`, `src/content/components/DropdownContainer.tsx`
- Impact: Maintenance burden, potential style inconsistency, ~300 lines duplicated
- Fix approach: Create shared CSS module or single style source

## Console Logging

**Extensive Development Logging:**
- Issue: 38+ console.log/warn/error statements throughout production code with `[Prompt-Script]` prefix
- Files: Multiple files across `src/content/`, `src/background/`, `src/lib/`
- Impact: Performance overhead in production, potential information leakage, log noise
- Fix approach: Remove or replace with conditional logging (development-only) or proper logging library

**Silent ErrorBoundary:**
- Issue: Content script ErrorBoundary returns `null` on error, no user feedback
- Files: `src/content/components/ErrorBoundary.tsx`
- Impact: User sees nothing when error occurs, no guidance to reload extension
- Fix approach: Add minimal error UI with reload instructions or visual indicator

## Platform Dependency

**Lovart Selector Fragility:**
- Issue: Content script depends on specific Lovart DOM selectors that could change without notice
- Files: `src/content/input-detector.ts` (lines 13-25), `src/content/ui-injector.tsx` (line 20)
- Impact: Extension could break silently if Lovart updates their UI
- Fix approach: Add telemetry/fallback detection, document selector update process

**Single Target Selector:**
- Issue: UI injection targets `[data-testid="agent-input-bottom-more-button"]` with only one fallback pattern
- Files: `src/content/ui-injector.tsx` (lines 20-44)
- Impact: Extension may not inject if Lovart changes button location
- Fix approach: Add multiple fallback selectors, graceful degradation messaging

## Known Bugs

**Extension Context Invalidated Handling:**
- Symptoms: When extension updates/reloads, content script continues running but `chrome.runtime` calls fail
- Files: `src/content/components/DropdownApp.tsx` (lines 26-54)
- Trigger: Extension update while tab is open
- Workaround: Checks for `chrome.runtime?.id` exist but silently fails without user notification

**React 19 Lexical Editor Insertion:**
- Symptoms: `execCommand('insertText')` may fail on certain Lexical editor versions
- Files: `src/content/insert-handler.ts` (lines 66-93)
- Trigger: Lovart platform Lexical editor version changes
- Workaround: Fallback method exists but may not trigger proper React state updates

## Security Considerations

**Import Validation:**
- Risk: JSON import allows arbitrary data structure; validation only checks field presence/types
- Files: `src/lib/import-export.ts` (lines 47-95)
- Current mitigation: Type checking for required fields, description optional field validation
- Recommendations: Add max length validation for strings, max array size limits, sanitize prompt content

**No XSS Risk:**
- Risk: None detected - user prompt content rendered as plain text, not HTML
- Files: All components use text rendering, no `innerHTML` or dangerous rendering
- Current mitigation: React's default text rendering
- Recommendations: Maintain this pattern, never introduce HTML rendering for prompt content

**Storage Access:**
- Risk: All storage operations through service worker, no direct storage manipulation
- Files: `src/lib/store.ts`, `src/lib/storage.ts`, `src/background/service-worker.ts`
- Current mitigation: Singleton StorageManager, message-based architecture
- Recommendations: Consider adding data versioning for migration scenarios

## Performance Bottlenecks

**MutationObserver Overhead:**
- Problem: Two MutationObservers running simultaneously (`input-detector.ts` main observer + navObserver) with subtree observation
- Files: `src/content/input-detector.ts` (lines 53-61, 198-211)
- Cause: Both observe `document.body` with `subtree: true` - high mutation count triggers
- Improvement path: Debounce already implemented (100ms), but consider throttling or more specific observation targets

**Storage Quota Not Enforced:**
- Problem: No proactive limit enforcement - user can add prompts until quota exceeded
- Files: `src/lib/storage.ts` (lines 97-130)
- Cause: Warning logged at 80% but no user-facing notification or restriction
- Improvement path: Add UI notification when approaching limit, implement prompt count limits

**Portal Style Injection:**
- Problem: Styles injected to `document.head` on every dropdown open via portal container
- Files: `src/content/components/DropdownContainer.tsx` (lines 49-64)
- Cause: Style element created lazily but could be created multiple times
- Improvement path: Check for existing style element before creating, single initialization

## Fragile Areas

**History API Interception:**
- Files: `src/content/input-detector.ts` (lines 174-211)
- Why fragile: Replaces global `history.pushState`/`replaceState` - could conflict with other extensions or Lovart's own SPA navigation
- Safe modification: Use proper cleanup in `stop()` method, consider event-based approach instead of method replacement
- Test coverage: None - no tests for navigation handling

**Shadow DOM + Portal Hybrid:**
- Files: `src/content/ui-injector.tsx`, `src/content/components/DropdownContainer.tsx`
- Why fragile: Trigger button in Shadow DOM, dropdown in Portal outside Shadow DOM - complex coordination
- Safe modification: Ensure Portal styles don't leak, maintain separation
- Test coverage: None - visual rendering not tested

**Zustand Store Initialization:**
- Files: `src/lib/store.ts` (lines 86-124)
- Why fragile: Async `loadFromStorage` called on mount, loading state managed separately
- Safe modification: Initialize with defaults, sync loading where possible
- Test coverage: None

## Scaling Limits

**Storage Capacity:**
- Current capacity: 10MB chrome.storage.local quota
- Limit: Large prompt datasets (>500 prompts) trigger warning but continue
- Scaling path: Implement prompt count limits, add export/purge recommendations at 80%

**Category Display:**
- Current capacity: Sidebar shows all categories without pagination
- Limit: UI becomes unwieldy with >20 categories
- Scaling path: Add category search/filter, pagination, or max category limit

**Prompt List Grid:**
- Current capacity: 4-column grid in popup
- Limit: Large prompt counts make scrolling cumbersome
- Scaling path: Add pagination, search, or virtualized list for 100+ prompts

## Dependencies at Risk

**@crxjs/vite-plugin:**
- Risk: CRXJS plugin for Vite is relatively niche, potential maintenance issues
- Impact: Build system could break if plugin abandoned
- Migration plan: Monitor plugin updates, have fallback to manual manifest bundling

**Lovart Platform API:**
- Risk: Extension targets specific Lovart selectors, platform could change UI structure
- Impact: Extension could silently fail on Lovart updates
- Migration plan: Monitor Lovart UI changes, maintain selector update process

## Missing Critical Features

**No Test Infrastructure:**
- Problem: Zero test files for project code, no jest/vitest configuration
- Blocks: Confidence in refactoring, regression prevention, CI/CD integration

**No Error Recovery UI:**
- Problem: Content script errors silently handled, no user-facing error states
- Blocks: Users cannot understand why extension stopped working

**No Version Migration:**
- Problem: Storage schema version field exists but no migration logic
- Blocks: Future schema changes will break existing user data

## Test Coverage Gaps

**Content Script Behavior:**
- What's not tested: Input detection, UI injection, prompt insertion, navigation handling
- Files: `src/content/content-script.ts`, `src/content/input-detector.ts`, `src/content/insert-handler.ts`
- Risk: Extension could fail silently on Lovart platform changes
- Priority: High - core functionality

**Storage Operations:**
- What's not tested: CRUD operations, storage sync, quota checking
- Files: `src/lib/store.ts`, `src/lib/storage.ts`
- Risk: Data corruption, quota overflow, race conditions
- Priority: High - user data

**Popup UI:**
- What's not tested: Dialog interactions, form validation, import/export
- Files: `src/popup/App.tsx`, `src/popup/components/*.tsx`
- Risk: User workflow failures, form submission issues
- Priority: Medium - user management

**Service Worker Messaging:**
- What's not tested: Message routing, async response handling
- Files: `src/background/service-worker.ts`
- Risk: Message failures, extension context errors
- Priority: Medium - cross-context communication

## Duplicate Constants

**ALL_CATEGORY_ID:**
- Issue: `'all'` constant defined separately in 3 files
- Files: `src/popup/App.tsx` (line 14), `src/popup/components/PromptList.tsx` (line 8), `src/content/components/DropdownContainer.tsx` (line 38)
- Impact: Maintenance risk if value changes, inconsistent usage
- Fix approach: Move to `src/shared/constants.ts` with single export

**Default Categories in DropdownContainer:**
- Issue: Hardcoded DEFAULT_CATEGORIES duplicate logic from built-in-data
- Files: `src/content/components/DropdownContainer.tsx` (lines 38-43)
- Impact: If built-in categories change, dropdown defaults won't match
- Fix approach: Import from built-in-data or remove default logic

---

*Concerns audit: 2026-04-17*