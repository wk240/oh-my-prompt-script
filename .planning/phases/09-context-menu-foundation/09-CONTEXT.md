# Phase 9: Context Menu Foundation - Context

**Gathered:** 2026-04-28
**Status:** Ready for planning

<domain>
## Phase Boundary

用户右键点击任意网站图片时看到"转提示词"菜单项，点击后捕获图片URL供后续Phase处理。这是Context Menu基础阶段，不涉及：
- API密钥管理（Phase 10）
- Vision API调用（Phase 11）
- 提示词生成和插入（Phase 12）

**Success Criteria (from ROADMAP):**
1. User sees "转提示词" option when right-clicking any image on any website
2. Menu item only appears on image elements (not on text, links, or other elements)
3. Clicking the menu item captures the image URL for processing
4. Menu item appears immediately after extension install without page reload

</domain>

<decisions>
## Implementation Decisions

### Menu Item Appearance
- **D-01:** 菜单项文字为"转提示词"（中文），与现有popup UI风格一致
- **D-04:** 菜单项使用lightning bolt图标（`assets/icon-16.png`），与扩展品牌一致

### Activation Scope
- **D-02:** 菜单在所有网站激活（`<all_urls>`），与ROADMAP定义一致。非Lovart页面生成提示词后复制到剪贴板（Phase 12处理）

### URL Type Handling
- **D-03:** 仅支持标准http/https URL。Vision API需要可访问的HTTP URL
- **D-07:** 使用`targetUrlPatterns: ["http://*/*", "https://*/*"]`过滤，确保菜单仅出现在http/https图片上

### Menu Creation Timing
- **D-06:** Context menu在`chrome.runtime.onInstalled`事件时创建一次。Chrome扩展的context menu是持久化的，无需每次service worker启动时重新创建

### URL Capture Handling
- **D-05:** 点击菜单后，图片URL存储到`chrome.storage.local`，等待Phase 11的Vision API处理
- **D-08:** 使用单独存储键存储捕获的图片URL（如`captured_image_url`），不放在`StorageSchema`中。减少与现有数据结构的耦合

### Claude's Discretion
- 存储键的具体命名（如`captured_image_url`或`_capturedImage`）
- 存储数据结构的具体字段（如是否包含`capturedAt`时间戳）
- Context menu click handler的代码组织（放在service-worker.ts或新建文件）
- 新增MessageType的定义（如`CAPTURE_IMAGE_URL`）
- Manifest permission添加`contextMenus`的具体方式

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Chrome Extension Patterns
- Chrome Context Menus API: https://developer.chrome.com/docs/extensions/reference/api/contextMenus
  - `chrome.contextMenus.create()` for menu creation
  - `contexts: ["image"]` to restrict to image elements only
  - `targetUrlPatterns` for URL filtering
  - `onclick` callback for handling clicks

### Project Context
- `.planning/PROJECT.md` — 项目愿景、v1.3.0里程碑目标
- `.planning/REQUIREMENTS.md` — MENU-01~03需求定义
- `.planning/ROADMAP.md` — Phase 9目标、成功标准

### Prior Phase Context
- `.planning/phases/01-foundation-manifest-setup/01-CONTEXT.md` — Manifest结构、Lovart域名匹配决策
- `.planning/phases/02-lovart-integration-content-script/02-CONTEXT.md` — Message架构、Console log prefix

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `manifest.json`: 已有`activeTab, downloads, storage, tabs, alarms`权限，需新增`contextMenus`
- `src/background/service-worker.ts`: Message处理中心，可扩展context menu click handler
- `src/shared/messages.ts`: MessageType enum，可新增`CAPTURE_IMAGE_URL`类型
- `assets/icon-16.png`: 现有lightning bolt图标，可用于context menu

### Established Patterns
- Message protocol: `chrome.runtime.sendMessage` for Content Script ↔ Service Worker communication
- Console log prefix: `[Oh My Prompt]`作为日志标识
- TypeScript strict mode: underscore前缀处理unused parameters
- Storage pattern: `chrome.storage.local` with `StorageManager` singleton

### Integration Points
- `manifest.json`:
  - 添加`"contextMenus"` to `permissions` array
- `src/background/service-worker.ts`:
  - Add `chrome.runtime.onInstalled` listener to create context menu
  - Add `chrome.contextMenus.onClicked` listener to handle URL capture
  - Store captured URL to `chrome.storage.local` with separate key
- `src/shared/messages.ts`:
  - Add `CAPTURE_IMAGE_URL` to MessageType enum (optional, for notification)

### Pitfalls to Avoid (from prior phases)
- Context menu创建时机：必须在`onInstalled`中创建，否则service worker重启后菜单可能丢失
- URL类型限制：data URL和blob URL无法直接传给Vision API，需通过`targetUrlPatterns`过滤
- 存储键命名：使用下划线前缀或特殊命名避免与`StorageSchema`字段冲突

</code_context>

<specifics>
## Specific Ideas

- "转提示词"文字简洁明了，暗示从图片生成可用于Lovart的提示词
- Lightning bolt图标与扩展核心价值"一键效率"呼应
- 全站激活扩大使用场景，用户可在任何网站收集灵感图片

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. Scope creep items noted:
- 提示词生成和插入（Phase 12）
- API密钥配置（Phase 10）
- Vision API调用（Phase 11）

</deferred>

---

*Phase: 09-context-menu-foundation*
*Context gathered: 2026-04-28*