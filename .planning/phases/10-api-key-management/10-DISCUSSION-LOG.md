# Phase 10: API Key Management - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-28
**Phase:** 10-api-key-management
**Areas discussed:** Settings UI Location, Onboarding Trigger, Storage Architecture, Provider Selection UX, API Configuration Fields

---

## Settings UI Location

| Option | Description | Selected |
|--------|-------------|----------|
| New Settings Page (Recommended) | 新建SettingsApp.tsx作为popup入口，manifest.action.default_popup改为settings。备份设置从Settings页跳转或tab切换。优点：API配置作为主要入口，用户体验清晰。缺点：需修改manifest入口 | ✓ |
| Extend BackupApp | 在BackupApp中增加API设置section，同一popup管理备份和API。优点：无需改动manifest。缺点：popup职责混合，UI可能拥挤 | |
| Separate Popup Entry | manifest添加第二个action或右键菜单入口打开settings popup。优点：备份和设置分离。缺点：Chrome extension action只有一个default_popup，需其他方式实现 | |

**User's choice:** New Settings Page (Recommended)
**Notes:** Settings作为popup主入口，API配置优先展示，备份设置作为section或tab

---

## Onboarding Trigger

| Option | Description | Selected |
|--------|-------------|----------|
| Open Settings Page (Recommended) | Service worker检测无API密钥，使用chrome.tabs.create打开settings popup页面。优点：可靠，用户看到完整settings UI。缺点：打开新标签页而非popup | ✓ |
| Content Script Dialog | Service worker发送消息给content script，在当前页面弹出类似CategorySelectDialog的portal dialog。优点：在Lovart页面原地操作。缺点：非Lovart页面无content script | |
| Toast + Manual Action | Service worker发送消息，content script显示toast提示用户点击扩展图标配置。优点：轻量。缺点：用户需手动操作 | |

**User's choice:** Open Settings Page (Recommended)
**Notes:** Service worker用`chrome.tabs.create`打开settings页面，用户看到完整UI

---

## Storage Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Extend StorageSchema.settings | 在StorageSchema.settings中增加apiProvider和apiKey字段。优点：统一管理，现有Zustand store和storage sync机制可直接用。缺点：API key与普通settings混在一起 | |
| Separate Storage Key | Phase 9的captured_image_url使用单独键，API密钥同样用单独键存储（如_visionApiKey）。优点：与现有数据结构解耦。缺点：需单独的读写逻辑 | ✓ |
| Hybrid: Key Separate + Provider in Settings | API密钥存在单独键，但settings中记录provider选择。密钥和配置分离存储。优点：密钥单独管理，provider可正常sync。缺点：两处存储需协调 | |

**User's choice:** Separate Storage Key
**Notes:** 类似Phase 9的`captured_image_url`处理方式，使用`_visionApiConfig`存储键

---

## Provider Selection UX

| Option | Description | Selected |
|--------|-------------|----------|
| Card Selection (Recommended) | 两个带图标和名称的卡片选项，点击选中高亮。优点：直观、美观，与settings page整体风格一致。Claude/OpenAI各有品牌特色 | |
| Dropdown Select | 标准HTML select下拉菜单。优点：简单实现。缺点：不够美观，选项信息展示有限 | |
| Radio Buttons | 两个radio button选项。优点：传统表单风格。缺点：视觉单调 | |
| Direct Input Fields | 用户直接输入API Base URL、API Key、Model Name三个字段。无预设provider选项，更灵活 | ✓ |

**User's choice:** Direct Input Fields (Other option)
**Notes:** 用户选择不预设provider，直接输入三字段，支持任意Vision AI API

---

## API Configuration Fields

| Option | Description | Selected |
|--------|-------------|----------|
| Three Separate Fields (Recommended) | 用户输入API Base URL（如https://api.openai.com/v1）、API Key、Model Name三个字段。最灵活，支持任意Vision API。用户需自行查找参数 | ✓ |
| Template + Custom Fields | 预设Claude/OpenAI模板，点击后自动填充base URL和推荐model，只需输入key。兼顾灵活与便捷。用户也可修改模板值 | |
| Dropdown Presets Only | 下拉选Claude/OpenAI，自动填充base URL和model，只输入key。最简单但限制为两选项 | |

**User's choice:** Three Separate Fields (Recommended)
**Notes:** 确认三字段输入：API Base URL、API Key、Model Name

---

## Claude's Discretion

- 存储键的具体命名（`_visionApiConfig`或其他）
- 存储数据结构的具体字段（是否包含`configuredAt`时间戳）
- Settings page的具体布局（tabs vs sections vs accordion）
- Backup section与API section的视觉分隔方式
- Input validation的具体规则（URL格式、key格式、model name格式）
- Save/Update/Delete按钮的具体行为和UI文案

---

## Deferred Ideas

None — discussion stayed within phase scope.

---

*Discussion completed: 2026-04-28*