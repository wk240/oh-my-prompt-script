# Oh My Prompt 商业化架构设计

**日期**: 2026-05-08
**状态**: 已批准
**目标**: 将开源 Chrome Extension 转型为混合商业模式（开源 Extension + 闭源 Web 服务）

---

## 核心架构决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 仓库组织 | Monorepo (npm workspaces) | 统一开发，类型共享，单一 PR 可跨模块 |
| Web 技术栈 | Next.js 全栈 | 前端后端统一，部署简单，API Routes 内置 |
| 数据库 | Supabase | Auth + Database + Realtime 一体化，快速上线 |
| 认证 | Supabase Auth + OAuth | 无缝集成，用户体验好，Extension 直接调用 |
| 同步模式 | 手动同步 | 本地优先，云端可选备份，无冲突问题 |
| 开源范围 | Extension + Shared | Web-app 闭源，保护商业核心 |

---

## Monorepo 结构

```
oh-my-prompt/
├── packages/
│   ├── extension/          # 开源（MIT License）
│   │   ├── src/
│   │   │   ├── content/        # 平台适配（现有）
│   │   │   ├── background/     # Service Worker（现有）
│   │   │   ├── popup/          # 管理界面（现有）
│   │   │   ├── lib/            # 工具函数（现有）
│   │   │   ├── sync/           # 新增：云端同步模块
│   │   │   │   ├── supabase-client.ts    # Supabase 初始化
│   │   │   │   ├── sync-service.ts       # 同步逻辑
│   │   │   │   ├── auth-modal.tsx        # 登录弹窗
│   │   │   │   └── sync-ui.tsx           # 同步按钮 UI
│   │   │   └── shared/         # 内部引用 @oh-my-prompt/shared
│   │   ├── manifest.json
│   │   ├── vite.config.ts
│   │   └── package.json        # dependencies: @oh-my-prompt/shared
│   │
│   ├── web-app/            # 闭源（私有代码）
│   │   ├── app/
│   │   │   ├── (marketing)/        # 落地页（首页、定价、文档）
│   │   │   ├── dashboard/          # 用户 Dashboard
│   │   │   │   ├── prompts/        # 提示词管理
│   │   │   │   ├── teams/          # 团队协作
│   │   │   │   └── settings/       # 用户设置
│   │   │   ├── api/                # REST API
│   │   │   │   ├── prompts/        # CRUD
│   │   │   │   ├── sync/           # 同步接口
│   │   │   │   ├── teams/          # 团队管理
│   │   │   │   └── billing/        # 订阅支付
│   │   │   └── admin/              # 管理后台
│   │   ├── components/
│   │   ├── lib/
│   │   │   ├── supabase/           # Supabase Server Client
│   │   │   ├── auth/               # Auth Helper
│   │   │   └── stripe/             # 支付集成
│   │   ├── supabase/
│   │   │   ├── migrations/         # Database Schema（不提交到开源仓库）
│   │   │   └── seed.sql
│   │   └── package.json        # dependencies: @oh-my-prompt/shared
│   │
│   └── shared/             # 开源（MIT License）
│   │   ├── types/
│   │   │   ├── prompt.ts           # Prompt、Category 类型
│   │   │   ├── user.ts             # User、Team 类型
│   │   │   ├── sync.ts             # SyncStatus、SyncPayload
│   │   │   └── api.ts              # API Request/Response 类型
│   │   ├── constants/
│   │   │   ├── platforms.ts        # 平台列表
│   │   │   └── sync.ts             # 同步常量
│   │   └── package.json
│   │
├── package.json            # Root workspaces 配置
│   "workspaces": ["packages/*"]
│
├── docs/
│   ├── architecture.md
│   ├── extension-guide.md
│   └── api-spec.md         # 公开 API 规范
│
├── LICENSE                 # MIT License（Extension + Shared）
├── README.md
└── .gitignore
```

---

## Extension → Web-app 交互流程

### 用户同步流程

1. **用户点击 Extension "同步到云端" 按钮**
2. **检查登录状态**
   - 未登录 → 弹出登录弹窗（OAuth）
   - 已登录 → 继续
3. **读取本地数据**（`chrome.storage.local`）
4. **调用 Web-app API 上传数据**
5. **显示同步结果**

### Extension 同步模块代码结构

```typescript
// packages/extension/src/sync/sync-service.ts

import { createSupabaseClient } from './supabase-client'
import type { SyncPayload } from '@oh-my-prompt/shared'

export async function syncToCloud(): Promise<{ success: boolean; error?: string }> {
  const supabase = createSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: 'NOT_LOGGED_IN' }
  }

  const localData = await chrome.storage.local.get('prompt_script_data')

  const payload: SyncPayload = {
    prompts: localData.prompts || [],
    categories: localData.categories || [],
    timestamp: Date.now()
  }

  const response = await fetch('https://ohmyprompt.com/api/sync/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    return { success: false, error: 'SYNC_FAILED' }
  }

  return { success: true }
}
```

---

## Web-app API 设计

### 核心接口

| API | 功能 | 权限 | 备注 |
|-----|------|------|------|
| `POST /api/sync/upload` | 上传本地数据到云端 | 需登录 | Extension 调用 |
| `GET /api/sync/download` | 下载云端数据 | 需登录 | Extension 调用 |
| `GET /api/sync/status` | 获取同步状态 | 需登录 | Extension 调用 |
| `GET /api/prompts` | 获取用户提示词列表 | 需登录 | Web Dashboard |
| `POST /api/prompts` | 创建新提示词 | 需登录 | Web Dashboard |
| `PUT /api/prompts/:id` | 更新提示词 | 需登录 | Web Dashboard |
| `DELETE /api/prompts/:id` | 删除提示词 | 需登录 | Web Dashboard |
| `POST /api/prompts/:id/optimize` | AI 优化提示词 | 需付费订阅 | 商业功能 |
| `POST /api/teams` | 创建团队 | 需付费订阅 | 商业功能 |
| `GET /api/teams/:id/prompts` | 获取团队共享提示词 | 需团队权限 | 商业功能 |
| `POST /api/teams/:id/members` | 添加团队成员 | 需管理员权限 | 商业功能 |
| `POST /api/billing/subscribe` | 创建订阅 | 需登录 | Stripe 集成 |

---

## Database Schema（Supabase）

### 核心表结构

```sql
-- 提示词表
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  category_id UUID REFERENCES categories,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  platform TEXT,
  is_public BOOLEAN DEFAULT false,
  order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 分类表
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 团队表
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  subscription_status TEXT DEFAULT 'active',
  max_members INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 团队成员表
CREATE TABLE team_members (
  team_id UUID REFERENCES teams ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);

-- 团队共享提示词表
CREATE TABLE team_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams ON DELETE CASCADE,
  prompt_id UUID REFERENCES prompts ON DELETE CASCADE,
  shared_by UUID REFERENCES auth.users,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, prompt_id)
);

-- 同步记录表
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  sync_type TEXT CHECK (sync_type IN ('upload', 'download')),
  prompts_count INTEGER DEFAULT 0,
  categories_count INTEGER DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户订阅表
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  plan_type TEXT CHECK (plan_type IN ('free', 'pro', 'team')),
  status TEXT DEFAULT 'active',
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### RLS（Row Level Security）策略

```sql
-- 提示词表：用户只能访问自己的提示词
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prompts"
  ON prompts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prompts"
  ON prompts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts"
  ON prompts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts"
  ON prompts FOR DELETE
  USING (auth.uid() = user_id);

-- 团队提示词：团队成员可访问
ALTER TABLE team_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view team prompts"
  ON team_prompts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = team_prompts.team_id
      AND user_id = auth.uid()
    )
  );
```

---

## 商业化功能分层

### 功能矩阵

| 功能 | 免费用户（Extension 本地） | Pro 用户（个人付费） | Team 用户（团队付费） |
|------|---------------------------|---------------------|---------------------|
| 提示词插入 | ✅ 完整功能 | ✅ 完整功能 | ✅ 完整功能 |
| 本地管理 | ✅ Popup 管理 | ✅ Popup 管理 | ✅ Popup 管理 |
| 云端备份 | ❌ 无 | ✅ 手动同步 | ✅ 手动同步 |
| 多设备同步 | ❌ 无 | ✅ 手动同步 | ✅ 手动同步 |
| 云端 Dashboard | ❌ 无 | ✅ Web 管理界面 | ✅ Web 管理界面 |
| AI 提示词优化 | ❌ 无 | ✅ 每月 50 次 | ✅ 每月 200 次 |
| 团队协作 | ❌ 无 | ❌ 无 | ✅ 团队共享库 |
| 团队权限管理 | ❌ 无 | ❌ 无 | ✅ 管理员控制 |

### 定价建议

| Plan | 月付 | 年付 | 功能 |
|------|------|------|------|
| Free | $0 | $0 | Extension 本地完整功能 |
| Pro | $9/月 | $79/年（省 $29） | 云端同步 + AI 优化（50次/月） |
| Team | $29/月 | $249/年（省 $99） | 团队协作（5人） + AI 优化（200次/月） |

---

## 开源 vs 闭源边界

### 代码包 License

| 代码包 | License | 提交策略 |
|--------|---------|----------|
| `packages/extension/` | MIT | 完全开源，提交到公开仓库 |
| `packages/shared/` | MIT | 完全开源，提交到公开仓库 |
| `packages/web-app/` | 私有 | **不提交到公开仓库**，使用私有 Git 或本地管理 |
| `supabase/migrations/` | 不提交 | Database Schema 不提交到公开仓库 |
| `docs/` | MIT | 开源文档，提交到公开仓库 |

### .gitignore 配置

```gitignore
# 闭源代码不提交
packages/web-app/

# Supabase 配置不提交
packages/web-app/supabase/

# 环境变量
.env
.env.local
.env.production

# Stripe 密钥
stripe-keys.txt
```

### 开发工作流

**公开仓库（GitHub）**:
- Extension 源码
- Shared 类型定义
- 开源文档

**私有管理**:
- Web-app 源码 → 本地开发或私有 Git 仓库
- Supabase migrations → Supabase Dashboard 管理
- 环境变量 → `.env.local` 本地管理

---

## 迁移路径

### Phase 1: Monorepo 重构（优先级：高）

1. 创建 Monorepo 结构
2. 将现有 `src/` 迁移到 `packages/extension/src/`
3. 创建 `packages/shared/` 并抽取类型定义
4. 配置 npm workspaces
5. 确保 Extension 构建正常

### Phase 2: Web-app 基础搭建（优先级：高）

1. 创建 `packages/web-app/`（Next.js）
2. 配置 Supabase 项目
3. 实现 Database Schema
4. 实现基础 API（`/api/sync/*`）
5. 实现落地页（首页、定价）

### Phase 3: Extension 云端同步（优先级：中）

1. 在 Extension 中集成 Supabase Client
2. 实现登录弹窗（OAuth）
3. 实现同步 UI（按钮 + 进度提示）
4. 实现同步逻辑

### Phase 4: 商业功能（优先级：中）

1. Stripe 集成
2. 订阅系统
3. 用户 Dashboard
4. AI 提示词优化服务

### Phase 5: 团队协作（优先级：低）

1. 团队创建/管理
2. 团队共享提示词库
3. 权限管理

---

## 技术依赖清单

### Extension 新增依赖

```json
{
  "dependencies": {
    "@oh-my-prompt/shared": "workspace:*",
    "@supabase/supabase-js": "^2.x"
  }
}
```

### Web-app 依赖

```json
{
  "dependencies": {
    "@oh-my-prompt/shared": "workspace:*",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "stripe": "^14.x",
    "next": "^14.x",
    "react": "^19.x"
  }
}
```

---

## 风险与缓解

| 风险 | 影响 | 缓解策略 |
|------|------|----------|
| 闭源代码泄露 | 商业逻辑暴露 | Web-app 使用私有仓库，不提交到 GitHub |
| Supabase 成本随用户增长 | 费用超预算 | 监控使用量，设置 Rate Limit，考虑自建 PostgreSQL |
| Extension 用户不接受登录 | 用户流失 | 保持本地功能完整，云端作为可选增值服务 |
| AI 服务成本不可控 | 利润率低 | 按调用次数收费，设置月度上限 |
| OAuth Provider 配置失败 | 用户无法登录 | 提供多个 OAuth 选项（Google、GitHub、微信） |

---

## 后续行动

1. 用户审核本设计文档
2. 创建 Monorepo 结构实施计划
3. 按 Phase 顺序执行迁移