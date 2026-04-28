# Phase 9: Context Menu Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-28
**Phase:** 09-context-menu-foundation
**Areas discussed:** 菜单项文字语言, 菜单激活范围, 图片URL类型限制, 菜单图标使用, URL处理方式, 菜单创建时机, URL过滤方式, 存储位置

---

## 菜单项文字语言

| Option | Description | Selected |
|--------|-------------|----------|
| 转提示词（中文） | 与现有popup UI风格一致（全中文），用户群体主要为中文用户 | ✓ |
| Image to Prompt（英文） | 更通用，适用于国际用户，但与现有UI风格不一致 | |
| 转提示词 / Image to Prompt | 兼顾两种用户，但菜单项可能显得冗长 | |

**User's choice:** 转提示词（中文）
**Notes:** 保持UI一致性，用户群体主要为中文创作者

---

## 菜单激活范围

| Option | Description | Selected |
|--------|-------------|----------|
| 全站激活 | ROADMAP定义的目标行为。用户可在任意网站右键图片调用，非Lovart页面提示词复制到剪贴板 | ✓ |
| 仅Lovart页面 | 聚焦Lovart场景，简化流程，但不符合ROADMAP要求 | |

**User's choice:** 全站激活
**Notes:** 符合ROADMAP"任意网站图片"要求，Phase 12处理非Lovart页面的剪贴板复制

---

## 图片URL类型限制

| Option | Description | Selected |
|--------|-------------|----------|
| 仅http/https URL | Vision API通常需要可访问的HTTP URL，data URL需额外处理 | ✓ |
| 支持data URL和blob URL | 更全面覆盖，但需转换为API可接受格式 | |
| 支持所有图片类型 | 最全面，包括SVG矢量图，但Vision API对SVG支持可能不同 | |

**User's choice:** 仅http/https URL
**Notes:** 简化实现，避免data URL和blob URL的转换复杂性

---

## 菜单图标使用

| Option | Description | Selected |
|--------|-------------|----------|
| 使用图标 | 使用现有lightning bolt图标（assets/icon-16.png），与扩展品牌一致 | ✓ |
| 不使用图标 | 更简洁，但可能与其他菜单项不够区分 | |

**User's choice:** 使用图标
**Notes:** 保持品牌一致性，lightning bolt暗示"一键效率"价值

---

## 点击后URL处理方式

| Option | Description | Selected |
|--------|-------------|----------|
| 存储到 chrome.storage | URL发送到service worker并存储，等待Phase 11处理Vision API调用 | ✓ |
| 打开对话框确认 | 点击菜单后直接打开popup或对话框确认 | |
| 仅显示Toast提示 | 点击后显示"URL已捕获"提示 | |

**User's choice:** 存储到 chrome.storage
**Notes:** URL存储后等待Phase 11 Vision API处理

---

## 菜单创建时机

| Option | Description | Selected |
|--------|-------------|----------|
| 仅在 onInstalled 时创建 | Chrome context menu创建后是持久化的，只需创建一次 | ✓ |
| 每次 service worker 启动时检查并创建 | 防止菜单意外丢失，但实际Chrome已持久化 | |

**User's choice:** 仅在 onInstalled 时创建
**Notes:** Chrome context menu持久化特性，无需重复创建

---

## URL过滤方式

| Option | Description | Selected |
|--------|-------------|----------|
| 使用 targetUrlPatterns 过滤 | 仅http/https URL的图片显示菜单，data URL和blob URL不显示 | ✓ |
| 不过滤，运行时判断 | 菜单对所有图片显示，点击后在service worker中判断URL类型 | |

**User's choice:** 使用 targetUrlPatterns 过滤
**Notes:** 在Chrome层面过滤，用户体验更好（不支持的图片类型不会显示菜单）

---

## 存储位置

| Option | Description | Selected |
|--------|-------------|----------|
| 新增 _capturedImage 字段 | 在StorageSchema中新增临时状态字段 | |
| 在 settings 中存储 | 使用settings存储，但settings通常用于用户配置 | |
| 单独存储键 | 单独存储键（不在StorageSchema中），减少耦合 | ✓ |

**User's choice:** 单独存储键
**Notes:** 减少与现有StorageSchema的耦合，便于后续Phase扩展

---

## Claude's Discretion

- 存储键的具体命名（如`captured_image_url`或`_capturedImage`）
- 存储数据结构的具体字段（如是否包含`capturedAt`时间戳）
- Context menu click handler的代码组织（放在service-worker.ts或新建文件）
- 新增MessageType的定义（如`CAPTURE_IMAGE_URL`）
- Manifest permission添加`contextMenus`的具体方式

---

## Deferred Ideas

None — discussion stayed within phase scope.

---

*Discussion completed: 2026-04-28*