# Phase 10: API Key Management - Context

**Gathered:** 2026-04-28
**Status:** Ready for planning

<domain>
## Phase Boundary

用户可安全配置和管理Vision AI API密钥。这是Phase 10，紧接Phase 9的Context Menu Foundation，为Phase 11的Vision API Integration准备API密钥配置能力。

**Success Criteria (from ROADMAP):**
1. User can configure API key in popup settings page
2. API key is stored securely in chrome.storage.local (not sync, not exposed in logs)
3. First-time use of "转提示词" triggers onboarding dialog to configure API key
4. User can select Vision AI provider (Claude Vision or OpenAI GPT-4V)
5. User can update or delete API key at any time

**In scope:**
- Settings UI design and implementation
- API key storage architecture
- Onboarding trigger mechanism
- API configuration fields (Base URL, API Key, Model Name)

**Out of scope:**
- Vision API actual calls (Phase 11)
- Prompt generation logic (Phase 11)
- Prompt insertion/preview (Phase 12)
- Context menu click handling (Phase 9)

</domain>

<decisions>
## Implementation Decisions

### Settings UI Location
- **D-01:** Settings UI采用新建`SettingsApp.tsx`作为popup入口。manifest.action.default_popup改为`settings.html`指向SettingsApp.tsx。备份设置作为Settings页的一个section或tab，API密钥配置作为主要入口。用户点击扩展图标首先看到Settings，可切换到Backup section。

### Onboarding Trigger
- **D-02:** Onboarding触发方式：Service worker在context menu click handler检测无API密钥配置时，使用`chrome.tabs.create`打开settings popup页面（通过extension URL如`chrome-extension://[id]/settings.html`）。用户看到完整settings UI进行配置。

### Storage Architecture
- **D-03:** API密钥存储架构：使用单独存储键存储API配置，与`StorageSchema`解耦。类似Phase 9的`captured_image_url`处理方式。存储键建议命名：`_visionApiConfig`（包含base URL、key、model）。

### Provider Selection
- **D-04:** 无预设provider选项（Claude/OpenAI），用户直接输入API配置。更灵活，支持任意Vision AI API provider。

### API Configuration Fields
- **D-05:** API配置字段结构：三个独立输入框
  - API Base URL（如 `https://api.openai.com/v1`）
  - API Key
  - Model Name（如 `gpt-4-vision-preview`, `claude-3-opus`）

### Claude's Discretion
- 存储键的具体命名（`_visionApiConfig`或其他）
- 存储数据结构的具体字段（是否包含`configuredAt`时间戳）
- Settings page的具体布局（tabs vs sections vs accordion）
- Backup section与API section的视觉分隔方式
- Input validation的具体规则（URL格式、key格式、model name格式）
- Save/Update/Delete按钮的具体行为和UI文案

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Chrome Extension Patterns
- `chrome.storage.local` - Key-value storage for extension data
  - `chrome.storage.local.get(key)` - Read API config
  - `chrome.storage.local.set({ key: value })` - Save API config
  - `chrome.storage.local.remove(key)` - Delete API config
- `chrome.tabs.create()` - Open settings page from service worker
- `chrome.runtime.getURL()` - Get extension internal URL for settings.html

### Project Context
- `.planning/PROJECT.md` — 项目愿景、v1.3.0里程碑目标
- `.planning/REQUIREMENTS.md` — AUTH-01~04需求定义
- `.planning/ROADMAP.md` — Phase 10目标、成功标准

### Prior Phase Context
- `.planning/phases/09-context-menu-foundation/09-CONTEXT.md` — Context menu click handler、单独存储键模式
- `.planning/phases/01-foundation-manifest-setup/01-CONTEXT.md` — Manifest结构、Lovart域名匹配决策

### Codebase Patterns
- `.planning/codebase/ARCHITECTURE.md` — Storage-First架构、Service Worker消息处理
- `.planning/codebase/CONVENTIONS.md` — Console log prefix、TypeScript strict mode
- `.planning/codebase/INTEGRATIONS.md` — chrome.storage.local使用模式

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `manifest.json`: 已有`activeTab, downloads, storage, tabs, alarms`权限，无需新增
- `src/background/service-worker.ts`: Message处理中心，context menu click handler（Phase 9添加）
- `src/popup/BackupApp.tsx`: 可参考的popup React架构、Tailwind styling
- `src/popup/components/ui/dialog.tsx`: Radix UI Dialog组件可复用
- `src/popup/components/ui/button.tsx`: Radix UI Button组件可复用
- `src/shared/messages.ts`: MessageType enum，可新增`GET_API_CONFIG`, `SET_API_CONFIG`, `DELETE_API_CONFIG`类型

### Established Patterns
- Message protocol: `chrome.runtime.sendMessage` for Content Script ↔ Service Worker communication
- Console log prefix: `[Oh My Prompt]`作为日志标识
- TypeScript strict mode: underscore前缀处理unused parameters
- Storage pattern: `chrome.storage.local` with separate keys for special data (Phase 9's `captured_image_url`)
- Popup styling: Tailwind CSS, Radix UI primitives, 480px width card layout

### Integration Points
- `manifest.json`:
  - Change `action.default_popup` from `popup/backup.html` to `popup/settings.html`
- `src/background/service-worker.ts`:
  - Add API config check in context menu click handler (Phase 11 integration)
  - Add `chrome.tabs.create({ url: chrome.runtime.getURL('popup/settings.html') })` for onboarding
  - Add new MessageType handlers: `GET_API_CONFIG`, `SET_API_CONFIG`, `DELETE_API_CONFIG`
- `src/popup/`:
  - Create `settings.html` (entry HTML)
  - Create `settings.tsx` (entry TypeScript)
  - Create `SettingsApp.tsx` (main component)
  - Optionally refactor `BackupApp.tsx` as a section within SettingsApp or keep separate
- `src/shared/messages.ts`:
  - Add `GET_API_CONFIG`, `SET_API_CONFIG`, `DELETE_API_CONFIG` to MessageType enum
- `src/shared/types.ts`:
  - Optional: Define `VisionApiConfig` interface for type safety

### Pitfalls to Avoid
- API key不应出现在console log中（安全要求）
- 存储键命名避免与`StorageSchema`字段冲突
- Service worker打开settings page需使用`chrome.runtime.getURL()`获取extension内部URL
- Settings popup宽度建议与BackupApp一致（480px），保持用户体验统一

</code_context>

<specifics>
## Specific Ideas

- 三字段输入简洁明了，用户根据自己选择的API provider填写对应参数
- Settings page作为popup主入口，API配置优先展示，符合v1.3.0里程碑"Image to Prompt"功能定位
- Onboarding通过打开完整settings page而非小dialog，让用户看到全部配置选项

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. Scope creep items noted:
- Vision API实际调用（Phase 11）
- Prompt生成逻辑（Phase 11）
- Prompt preview dialog（Phase 12）
- Clipboard copy on non-Lovart pages（Phase 12）

</deferred>

---

*Phase: 10-api-key-management*
*Context gathered: 2026-04-28*