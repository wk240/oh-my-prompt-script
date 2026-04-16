# Lovart Prompt Injector

## What This Is

一个Chrome浏览器插件，用于在Lovart AI设计/绘图平台的输入框中一键插入预设的提示词模板。用户通过输入框旁的下拉菜单选择提示词，提示词按用途分类管理，支持内置编辑和数据导入导出。

## Core Value

一键插入预设提示词，提升Lovart平台创作效率。

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 用户可在Lovart输入框旁看到下拉菜单按钮
- [ ] 用户可通过下拉菜单选择并插入预设提示词
- [ ] 用户可按用途分类管理提示词模板
- [ ] 用户可在插件内新增、编辑、删除提示词
- [ ] 用户可导出提示词数据为JSON文件
- [ ] 用户可导入JSON文件恢复提示词数据
- [ ] 插件数据本地持久化存储

### Out of Scope

- 云端自动同步 — 用户选择手动导入导出即可满足跨设备需求
- Firefox支持 — 初期专注Chrome系浏览器，后续可扩展
- 多人/团队协作 — 个人使用场景
- 使用历史/统计功能 — 基础功能优先
- 实时协作编辑 — 个人本地使用

## Context

**平台背景：** Lovart是一个AI设计/绘图平台，用户通过输入提示词来生成图像。提示词的质量和结构直接影响生成效果。

**用户痛点：** 设计师/创作者经常需要使用固定的风格模板、技术参数等提示词，每次手动输入重复内容效率低。现有方案可能是复制粘贴外部文档，不够便捷。

**目标用户：** 个人创作者，在多台设备上使用Lovart平台。

**提示词内容类型：** 风格描述、主题设定、技术参数（光照、角度、构图）、质量/尺寸设定等模板化内容。

## Constraints

- **Tech stack:** Chrome Extension (Manifest V3) — 现代Chrome插件标准
- **平台依赖:** 需适配Lovart平台的页面结构和输入框元素
- **数据存储:** chrome.storage.local 本地存储，容量有限制
- **浏览器支持:** Chrome/Edge/Brave等Chromium系浏览器

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 下拉菜单触发方式 | 输入框旁直接显示，操作路径最短 | — Pending |
| 内置编辑而非外部文件 | 降低用户操作门槛，无需额外工具 | — Pending |
| 手动导入导出同步 | 无需后端开发，MVP最快实现 | — Pending |
| 按用途分类管理 | 符合用户心智模型，便于查找 | — Pending |

---
*Last updated: 2026-04-16 after initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state