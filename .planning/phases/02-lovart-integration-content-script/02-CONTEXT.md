# Phase 2: Lovart Integration & Content Script - Context

**Gathered:** 2026-04-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Content Script检测Lovart输入框，显示Shadow DOM隔离的下拉菜单，实现提示词一键插入。这是核心功能实现阶段，不涉及提示词管理（Phase 3）或错误处理完善（Phase 4）。

</domain>

<decisions>
## Implementation Decisions

### Dropdown Trigger Style
- **D-01:** 触发按钮位置在输入框左侧，与Lovart UI明确分离，支持移动设备
- **D-02:** 触发按钮样式为Minimal icon button（简洁图标按钮）
- **D-03:** 图标使用闪电图标（lightning bolt），暗示"快速/一键"效率价值
- **D-04:** 图标配色与Lovart按钮同色，融合视觉风格减少突兀感

### Prompt Display
- **D-05:** 下拉菜单显示名称 + 内容预览（不仅名称）
- **D-06:** 预览长度约50字符，平衡信息量与空间占用
- **D-07:** 提示词按分类分组展示（如"风格"、"技术参数"），便于查找

### UI Visual Style
- **D-08:** 下拉菜单整体风格为Lovart-native（圆角、阴影、配色），视觉融合度高
- **D-09:** 在Shadow DOM内手动复制Lovart CSS属性实现风格协调，保持完全隔离

### Insert Behavior
- **D-10:** 提示词插入到光标当前位置（非追加或替换），保留前后文本
- **D-11:** 插入后下拉菜单保持打开，用户可连续插入多个提示词组合
- **D-12:** 下拉菜单关闭方式为点击触发按钮（toggle行为）

### Claude's Discretion
- 输入框检测的MutationObserver配置细节
- 下拉菜单的最大高度和滚动行为
- Lovart CSS属性的具体提取（圆角大小、阴影参数、配色值）
- 触发按钮的hover/active状态样式
- 选择提示词后的视觉反馈（如选中高亮）
- 预览文本截断后的省略号处理

</decisions>

<specifics>
## Specific Ideas

- "输入框左侧，与UI明确分离，支持移动" — 用户明确要求位置和移动设备兼容
- 闪电图标传递效率价值感 — 一键插入的语义明确
- 按分类分组符合用户心智模型，便于查找特定类型提示词

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Chrome Extension Patterns
- No external specs — requirements fully captured in decisions above

### Project Context
- `.planning/PROJECT.md` — 项目愿景、约束、核心价值
- `.planning/REQUIREMENTS.md` — CORE-01~04, EXT-02~03需求定义
- `.planning/ROADMAP.md` — Phase 2目标、交付物、成功标准、Pitfall避坑指南

### Prior Phase Context
- `.planning/phases/01-foundation-manifest-setup/01-CONTEXT.md` — Lovart域名匹配决策（*.lovart.ai/*）

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/shared/messages.ts`: MessageType enum已定义INSERT_PROMPT，可直接使用
- `src/shared/types.ts`: Prompt interface已定义（id, name, content, categoryId），Phase 2可使用
- `manifest.json`: Content Script已配置注入`*.lovart.ai/*`，run_at: document_idle

### Established Patterns
- Message protocol: chrome.runtime.sendMessage用于Content Script与Service Worker通信
- TypeScript strict mode: 使用underscore前缀处理unused parameters
- Console log prefix: `[Lovart Injector]`作为日志标识

### Integration Points
- Content Script (`src/content/content-script.ts`)将从骨架扩展为完整实现
- Service Worker (`src/background/service-worker.ts`)需新增INSERT_PROMPT消息处理
- Types (`src/shared/types.ts`)已定义Prompt/Category结构，Phase 3将使用StorageSchema

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. Scope creep items noted:
- 提示词搜索/过滤功能 — 属于v2 UX-01，不在Phase 2范围
- 键盘快捷键触发 — 属于v2 UX-03，不在Phase 2范围

</deferred>

---

*Phase: 02-lovart-integration-content-script*
*Context gathered: 2026-04-16*