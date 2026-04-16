# Phase 4: Polish & End-to-End Testing - Context

**Gathered:** 2026-04-16
**Status:** Ready for planning

<domain>
## Phase Boundary

完善错误处理、边界情况处理，进行全面功能验证和文档编写。这是最终完善阶段，确保扩展稳定可用。不涉及新功能开发（已在Phase 1-3完成）。

</domain>

<decisions>
## Implementation Decisions

### 测试方式
- **D-01:** 使用手动测试清单验证扩展功能，不引入自动化E2E框架
- **D-02:** 测试清单覆盖核心流程：下拉菜单显示、提示词插入、Popup CRUD、导入导出
- **D-03:** 测试结果手动记录，适合MVP阶段快速交付

### 错误呈现策略
- **D-04:** 使用Toast轻提示显示错误信息，不阻断用户操作
- **D-05:** 复用现有shadcn Toast组件系统，保持UI一致性
- **D-06:** 错误信息简洁直观，用户可快速理解问题所在

### README内容
- **D-07:** README包含四个核心部分：安装/开发指南、使用说明、数据格式说明、已知限制/FAQ
- **D-08:** 安装指南面向开发者：环境搭建、依赖安装、构建命令、Chrome加载步骤
- **D-09:** 使用说明面向最终用户：功能截图、操作流程、常见场景示例
- **D-10:** 数据格式说明：JSON结构示例、字段含义、导入导出流程
- **D-11:** 已知限制/FAQ：Lovart域名限制、常见问题解答

### SPA导航处理
- **D-12:** Content Script持续监听DOM变化，SPA导航时自动重注入UI
- **D-13:** 利用现有MutationObserver机制，检测到新输入框时重新触发UI注入
- **D-14:** 确保Lovart页面导航（如切换项目、切换页面）后扩展仍正常工作

### Claude's Discretion

以下方面使用标准Chrome Extension最佳实践，无需用户决策：
- **性能阈值定义:** "大量数据"定义为500+提示词，测试时使用此阈值验证响应速度
- **边界情况细节:** 删除最后提示词、空分类切换、无效JSON各字段缺失场景等具体处理逻辑
- **Toast持续时间:** 标准3-4秒自动消失
- **错误日志记录:** Console日志使用`[Lovart Injector]`前缀，便于调试

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Chrome Extension Patterns
- No external specs — requirements fully captured in decisions above

### Project Context
- `.planning/PROJECT.md` — 项目愿景、约束、核心价值
- `.planning/REQUIREMENTS.md` — 全部18个v1需求定义，Phase 4验证覆盖率
- `.planning/ROADMAP.md` — Phase 4目标、交付物、成功标准

### Prior Phase Context
- `.planning/phases/01-foundation-manifest-setup/01-CONTEXT.md` — Lovart域名匹配、消息架构
- `.planning/phases/02-lovart-integration-content-script/02-CONTEXT.md` — Shadow DOM隔离、闪电图标、MutationObserver机制
- `.planning/phases/03-data-management-popup-ui/03-CONTEXT.md` — Popup布局、Toast系统、导入导出验证

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/hooks/use-toast.ts` — Toast hook已实现，Phase 4扩展错误提示覆盖范围
- `src/lib/storage.ts` — StorageManager已有错误处理基础，Phase 4完善边界情况
- `src/lib/import-export.ts` — Import/Export已有JSON验证，Phase 4补充各字段缺失场景处理
- `src/content/input-detector.ts` — MutationObserver已实现，Phase 4确保SPA导航时持续监听

### Established Patterns
- Toast notification: 使用shadcn/ui Toast组件，已有`useToast` hook
- Error logging: Console日志使用`[Lovart Injector]`前缀
- TypeScript strict mode: 使用underscore前缀处理unused parameters
- Singleton pattern: StorageManager使用单例模式

### Integration Points
- Content Script (`src/content/content-script.ts`)需确保SPA导航时MutationObserver持续监听
- Service Worker (`src/background/service-worker.ts`)需补充错误响应消息
- Popup (`src/popup/App.tsx`)需补充更多Toast错误提示场景
- README.md需创建完整用户文档

</code_context>

<specifics>
## Specific Ideas

- 手动测试清单适合MVP快速交付，后续迭代可考虑自动化测试
- Toast复用现有组件，保持UI一致性
- README同时面向开发者（安装）和最终用户（使用），两部分都重要

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. Scope creep items noted:
- 自动化E2E测试 — 适合有持续迭代的团队，当前MVP阶段使用手动测试
- 持续集成CI流程 — 后续迭代可配置

</deferred>

---

*Phase: 04-polish-end-to-end-testing*
*Context gathered: 2026-04-16*