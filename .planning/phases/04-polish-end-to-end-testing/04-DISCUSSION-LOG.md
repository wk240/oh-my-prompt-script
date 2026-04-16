# Phase 4: Polish & End-to-End Testing - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-16
**Phase:** 04-polish-end-to-end-testing
**Areas discussed:** 测试方式选择, 错误呈现策略, README内容范围, SPA导航处理

---

## 测试方式选择

| Option | Description | Selected |
|--------|-------------|----------|
| 手动测试清单 | Puppeteer/Playwright模拟浏览器操作，还是手动测试清单？自动化可重复执行但需要额外配置 | ✓ |
| 自动化E2E测试 | 使用Puppeteer或Playwright控制Chromium浏览器模拟用户操作。需额外配置crx加载和特殊权限处理。更适合有持续迭代的团队。 | |
| 仅单元测试 | 编写单元测试覆盖StorageManager、ImportExport验证逻辑等核心模块。不涉及浏览器集成测试。 | |

**User's choice:** 手动测试清单 (Recommended)
**Notes:** 标准Chrome Extension测试方式，适合MVP阶段快速交付。覆盖核心流程：下拉菜单显示、提示词插入、Popup CRUD、导入导出。

---

## 错误呈现策略

| Option | Description | Selected |
|--------|-------------|----------|
| Toast轻提示 | 利用现有shadcn Toast组件显示错误信息，简洁直观，不中断用户操作。已建立的Toast系统可复用。 | ✓ |
| Dialog阻断提示 | 重要错误弹出Dialog阻断操作，要求用户确认。适合严重错误（如存储配额超限、导入数据完全失败）。 | |
| 静默处理 | 出现错误时记录日志，UI继续正常显示或使用fallback状态。不主动提示用户，调试时查看Console即可。 | |

**User's choice:** Toast轻提示 (Recommended)
**Notes:** 复用现有shadcn Toast组件系统，保持UI一致性。

---

## README内容范围

| Option | Description | Selected |
|--------|-------------|----------|
| 安装/开发指南 | 开发环境搭建、依赖安装、构建命令、Chrome加载步骤。面向开发者或想自行编译的用户。 | ✓ |
| 使用说明 | 功能截图、使用流程（从创建提示词到插入Lovart）、常见操作说明。面向最终用户。 | ✓ |
| 数据格式说明 | JSON格式示例、字段说明、导入导出流程。帮助用户理解数据结构以便迁移或批量编辑。 | ✓ |
| 已知限制/FAQ | Lovart平台域名、可能的问题（如输入框未识别）及解决方案。减少用户困惑。 | ✓ |

**User's choice:** 全选（四个部分都包含）
**Notes:** README同时面向开发者（安装/开发）和最终用户（使用），数据格式帮助高级用户迁移数据，FAQ减少支持负担。

---

## SPA导航处理

| Option | Description | Selected |
|--------|-------------|----------|
| 持续监听重注入 | 监听URL变化、DOM变化，当检测到新输入框时重新注入UI。MutationObserver已实现，只需确保SPA导航时持续监听。 | ✓ |
| 完全卸载再初始化 | 每次页面导航都重新加载Content Script。简单但可能短暂中断功能。 | |
| 不处理，手动刷新 | 用户需要手动刷新页面来激活扩展。不自动处理SPA导航。 | |

**User's choice:** 持续监听重注入 (Recommended)
**Notes:** 利用现有MutationObserver机制，确保Lovart页面导航（如切换项目、切换页面）后扩展仍正常工作。符合ROADMAP成功标准"页面刷新/导航后扩展仍正常工作"。

---

*Discussion log created: 2026-04-16*