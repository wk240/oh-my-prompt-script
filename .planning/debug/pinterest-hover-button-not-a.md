---
status: investigating
trigger: Pinterest hover button not appearing despite prepareImageForHover returning prepared:true
created: 2026-04-30
updated: 2026-04-30
---

## Symptoms

**Expected behavior:**
Hover button icon should appear visually when hovering over images on Pinterest.

**Actual behavior:**
No hover button icon appears. Logs show `prepareImageForHover` returning `prepared: true` for many images, indicating preparation logic runs successfully.

**Error messages:**
None. Console shows only preparation logs like:
```
[Oh My Prompt] prepareImageForHover: {src: 'https://i.pinimg.com/236x/...', hoverTarget: 'parent', prepared: true}
```

**Timeline:**
Unknown - unclear if this feature ever worked on Pinterest before.

**Reproduction:**
1. Navigate to https://www.pinterest.com/pin/901845894166512443/
2. Hover mouse over images
3. Observe logs in console but no visible hover button

## Current Focus

hypothesis: Overlay is being covered by Pinterest's overlay elements despite max z-index
test: Run diagnoseOverlay() to check elementsFromPoint() stack at button position
expecting: diagnoseOverlay will show coveringElements array with Pinterest overlay elements
next_action: await user test with new diagnoseOverlay diagnostic
reasoning_checkpoint:
tdd_checkpoint:

## Evidence

- timestamp: 2026-04-30T12:00:00Z | observation: Reviewed ImageHoverButtonManager code flow. prepareImageForHover attaches mouseenter/mouseleave to hoverTarget (parent element on Pinterest). The log shows hoverTarget: 'parent', meaning events are attached to the parent container, not the image itself. | source: src/content/image-hover-button-manager.tsx lines 225-244
- timestamp: 2026-04-30T12:05:00Z | observation: Pinterest is NOT in registered platforms list - ImageHoverButtonManager runs on all pages via coordinator.ts line 62-64. This is expected behavior. | source: src/content/core/coordinator.ts
- timestamp: 2026-04-30T12:10:00Z | observation: findBestHoverTarget returns parent if it wraps image nicely (lines 250-288). On Pinterest, images are in complex nested structures with overlays and action buttons. | source: src/content/image-hover-button-manager.tsx
- timestamp: 2026-04-30T12:15:00Z | observation: No logging in handleImageMouseEnter or showButton methods - cannot trace if events are firing. | source: src/content/image-hover-button-manager.tsx lines 302-323, 368-506
- timestamp: 2026-04-30T12:20:00Z | observation: showButton creates overlay with position:fixed, z-index:2147483647, pointer-events:none. The button container has pointer-events:auto. Overlay positioned at image's getBoundingClientRect(). | source: src/content/image-hover-button-manager.tsx lines 385-398
- timestamp: 2026-04-30T12:30:00Z | observation: Added DEBUG_HOVER_BUTTON flag with comprehensive logging in handleImageMouseEnter, handleImageMouseLeave, showButton, and findBestHoverTarget. Also logs hoverTarget element details including pointer-events CSS. | source: src/content/image-hover-button-manager.tsx
- timestamp: 2026-04-30T12:35:00Z | observation: Verified DEBUG_HOVER_BUTTON logs are present in built dist/assets/coordinator.ts-CiY-UAX5.js - confirmed with grep finding 'handleImageMouseEnter triggered' and 'showButton called'. | source: dist/assets/coordinator.ts-CiY-UAX5.js
- timestamp: 2026-04-30T12:40:00Z | observation: User confirmed diagnostic logging works - sees 'showButton: button mounted successfully' log. But some images with complex nested divs/overlays still don't show hover button. | source: user feedback
- timestamp: 2026-04-30T12:45:00Z | observation: Added diagnoseOverlay() function that uses document.elementsFromPoint() to check what elements are at the button position. Will reveal if overlay is being covered by other elements. Logs coveringElements array with tag, class, id, and zIndex. | source: src/content/image-hover-button-manager.tsx lines 412-463

## Eliminated

<!-- Entries: - hypothesis: ... | reason: ... | timestamp: ... -->

## Resolution

root_cause:
fix:
verification:
files_changed: